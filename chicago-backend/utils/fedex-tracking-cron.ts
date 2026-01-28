import { FedexPackagesModel } from "../models/fedex-packages.model";
import FedExUtil from "./fedex";

export async function trackFedexShipments() {
  try {
    const fedexPackages = await FedexPackagesModel.find({
      isActive: true,
      isDelivered: false,
      expectedDate: { $lte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    const trackingNumberArray = fedexPackages.map(
      (fedexPackage) => fedexPackage.trackingNumber
    );

    // Split tracking numbers into chunks of 30
    const chunkSize = 30;
    const trackingNumberChunks = [];
    for (let i = 0; i < trackingNumberArray.length; i += chunkSize) {
      trackingNumberChunks.push(trackingNumberArray.slice(i, i + chunkSize));
    }

    // Make API calls for each chunk and combine results
    const trackingResultsFromFedex = [];
    for (const chunk of trackingNumberChunks) {
      const chunkResults = await new FedExUtil().trackShipment(chunk);
      trackingResultsFromFedex.push(...chunkResults);
    }

    trackingResultsFromFedex.forEach((trackingResult) => {
      const fedexPackage = fedexPackages.find(
        (fedexPackage) =>
          fedexPackage.trackingNumber === trackingResult.trackingNumber
      );
      if (!fedexPackage) return;
      const deliveredDate = trackingResult.trackResults[0].dateAndTimes.find(
        (dt) => dt.type === "ACTUAL_DELIVERY"
      )?.dateTime;
      if (deliveredDate) {
        fedexPackage.isDelivered = true;
        fedexPackage.deliveryDate = new Date(deliveredDate);
      }
    });
    await Promise.all(fedexPackages.map((fedexPackage) => fedexPackage.save()));
    console.log("Fedex packages status updated successfully");
  } catch (error) {
    console.log(error);
  }
}
