"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/services/axios/axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import LoadingPage from "@/components/passport/globals/LoadingPage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PaymentProcessor {
  id: string;
  name: string;
  weight: number;
  description: string;
}

// Define the schema for a single processor
const processorSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number().min(0).max(100),
});

// Define the schema for the entire form
const formSchema = z.object({
  processors: z.array(processorSchema).refine(
    (processors) => {
      // Use reduce to calculate the total sum of weights
      const totalWeight = processors.reduce((sum, p) => sum + p.weight, 0);
      return totalWeight === 100;
    },
    { message: "The percentages of all the processors should equal 100!" }
  ),
});

type FormData = z.infer<typeof formSchema>;

export default function PaymentProcessorsForm() {
  const [loading, setLoading] = useState(true);
  const [originalSetup, setOriginalSetup] = useState<PaymentProcessor[]>([]);
  const [processors, setProcessors] = useState<PaymentProcessor[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { processors: [] },
  });
  async function fetchProcessors() {
    try {
      const { data } = await axiosInstance("/admin/configs/load-balancer");
      if (!data.success) throw new Error(data.message);
      const processorData = data.data?.map(
        (setup: {
          processor: {
            _id: string;
            processorName: string;
            description: string;
          };
          weight: number;
        }) => {
          return {
            id: setup.processor._id,
            name: setup.processor.processorName,
            description: setup.processor.description,
            weight: Number(setup.weight.toFixed(0)), // Ensure it's a number
          };
        }
      );
      setOriginalSetup(processorData);
      setProcessors(processorData);
      setValue("processors", processorData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProcessors();
  }, []);

  const editSetup = async (formData: FormData) => {
    try {
      const { data } = await axiosInstance.put("/admin/configs/load-balancer", {
        processors: formData.processors.map((processor) => ({
          processor: processor.id,
          weight: processor.weight,
        })),
      });
      if (!data.success) throw new Error(data.message);
      fetchProcessors();
      toast.success("Load Balancer Updated Successfully");
    } catch (error: any) {
      console.log(error);
      toast.error("Error while updating load balancer", {
        description: error?.response?.data?.message || "",
      });
    }
  };

  const handlePercentageChange = (index: number, value: string) => {
    const newProcessors = [...processors];
    newProcessors[index] = {
      ...newProcessors[index],
      weight: value === "" ? 0 : Math.round(parseFloat(value)),
    };
    setProcessors(newProcessors);
    setValue("processors", newProcessors);
  };

  if (loading) return <LoadingPage />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <h1 className="text-xl md:text-2xl font-semibold">
        Configure load balancer
      </h1>
      <Card className="w-full max-w-2xl mx-auto mt-16">
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit(editSetup)} className="space-y-4">
            {processors.map((processor, index) => (
              <Accordion key={processor.name} type="single" collapsible>
                <AccordionItem value={`processor-${index}`}>
                  <AccordionTrigger className="flex items-center justify-between px-4">
                    <div className="flex items-center justify-between space-x-4 flex-1 mr-4">
                      <Label
                        htmlFor={`processors.${index}.weight`}
                        className="w-1/2 text-start"
                      >
                        {processor.name}
                      </Label>
                      <Input
                        onClick={(e) => e.stopPropagation()}
                        id={`processors.${index}.weight`}
                        value={processor.weight}
                        onChange={(e) => {
                          if (isNaN(Number(e.target.value))) return;
                          handlePercentageChange(index, e.target.value);
                        }}
                        max="100"
                        className="w-24"
                      />
                      {errors.processors?.[index]?.weight && (
                        <p className="text-red-500 text-sm">
                          {errors.processors[index]?.weight?.message}
                        </p>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2">
                    <p className="text-sm text-muted-foreground">
                      {processor.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
            {errors.processors && (
              <p className="text-red-500">{errors.processors?.message}</p>
            )}
            <div className="w-full flex justify-end gap-2">
              {JSON.stringify(originalSetup) !== JSON.stringify(processors) && (
                <Button
                  size={"sm"}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset({ processors: originalSetup });
                    setProcessors(originalSetup);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                size={"sm"}
                disabled={
                  isSubmitting ||
                  JSON.stringify(originalSetup) === JSON.stringify(processors)
                }
                type="submit"
                className="w-fit self-end"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
