import { Types } from "mongoose";
import { ProcessorUsageModel } from "../../models/processor-usage.model";
// Import your existing models
import { ProcessorsModel } from "../../models/processor.model";
import { ConfigModel } from "../../models/config.model";
import { decrypt } from "./cryptography";

export async function selectPaymentProcessor(): Promise<{
  _id: string | Types.ObjectId;
  userName: string;
  password: string;
  processorName: string;
} | null> {
  try {
    // 1. Fetch the load balancer configuration
    const config = await ConfigModel.findOne({}).select("loadBalancer");

    if (!config || !config.loadBalancer || config.loadBalancer.length < 1) {
      throw new Error("No load balancer configuration found");
    }

    // 2. Get active processors with their weights
    const processorWeights = config.loadBalancer.filter((pw) => pw.weight > 0);

    if (processorWeights.length === 0) {
      throw new Error("No active processors with positive weights found");
    }

    // 3. Fetch full processor details
    const processorIds = processorWeights.map((pw) => pw.processor);
    const processors = await ProcessorsModel.find({
      _id: { $in: processorIds },
      isActive: true,
    });

    if (processors.length === 0) {
      throw new Error("No active processors found");
    }

    // 4. Fetch current usage counts from database
    let usageCounts = await ProcessorUsageModel.find({
      processor: { $in: processorIds },
    });

    // Ensure we have usage records for all processors
    for (const processor of processors) {
      const processorId = processor._id.toString();
      const existingUsage = usageCounts.find(
        (u) => u.processor.toString() === processorId
      );

      if (!existingUsage) {
        // Create a new usage record if none exists
        const newUsage = new ProcessorUsageModel({
          processor: processor._id,
          transactionCount: 0,
        });
        await newUsage.save();
        usageCounts.push(newUsage);
      }
    }

    // 5. Calculate total transactions
    const totalTransactions = usageCounts.reduce(
      (sum, usage) => sum + usage.transactionCount,
      0
    );

    // 6. Calculate current distribution percentages
    const currentDistribution: Record<string, number> = {};
    usageCounts.forEach((usage) => {
      const processorId = usage.processor.toString();
      currentDistribution[processorId] =
        totalTransactions > 0
          ? (usage.transactionCount / totalTransactions) * 100
          : 0;
    });

    // 7. Find the processor that is most underutilized relative to its target weight
    let selectedProcessor = null;
    let largestDeficit = -Infinity;

    for (const processorWeight of processorWeights) {
      const processorId = processorWeight.processor.toString();
      const processor = processors.find(
        (p) => p._id.toString() === processorId
      );

      if (!processor || !processor.isActive) continue;

      // Calculate deficit between target and current percentage
      const targetPercentage = processorWeight.weight;
      const currentPercentage = currentDistribution[processorId] || 0;
      const deficit = targetPercentage - currentPercentage;

      // Select processor with largest deficit
      if (deficit > largestDeficit) {
        largestDeficit = deficit;
        selectedProcessor = processor;
      }
    }

    // 8. If no processor selected, use default
    if (!selectedProcessor) {
      selectedProcessor = processors.find((p) => p.isDefault);
    }

    if (!selectedProcessor) {
      return null;
    }

    return {
      _id: selectedProcessor._id,
      userName: selectedProcessor.userName,
      password: decrypt(selectedProcessor.password),
      processorName: selectedProcessor.processorName,
    };
  } catch (error) {
    console.error("Error in selectPaymentProcessor:", error);
    throw error;
  }
}

export async function incrementProcessorUsage(
  processorId: string | Types.ObjectId
): Promise<void> {
  try {
    await ProcessorUsageModel.findOneAndUpdate(
      { processor: processorId },
      {
        $inc: { transactionCount: 1 },
        lastUpdated: new Date(),
      },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error in updateProcessorUsage:", error);
    throw error;
  }
}

// Optional: Add a function to reset counts periodically if needed
export async function resetProcessorCounts() {
  try {
    await ProcessorUsageModel.updateMany({}, { transactionCount: 0 });
    console.log("Processor usage counts reset successfully");
  } catch (error) {
    console.error("Error resetting processor counts:", error);
    throw error;
  }
}
