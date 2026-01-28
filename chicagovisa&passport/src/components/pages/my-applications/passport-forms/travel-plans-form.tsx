import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FieldTooltip from "./field-tooltip";
import { debounce } from "lodash";
import { usePassportApplicationStore } from "@/store/use-passport-application-store";
import { addDays } from "date-fns";
import { getCurrentDateInDC, parseMDYDate } from "@/lib/date";
import CustomDateInput from "@/components/globals/date-text-input";

const TravelPlansSchema = z
  .object({
    travelDate: z.string().optional().nullable(),
    returnDate: z.string().optional().nullable(),
    travelDestination: z.string().max(70, "Maximum 70 characters").optional(),
  })
  .refine(
    (data) => {
      if (!data.travelDate) return true;
      return !!parseMDYDate(data.travelDate);
    },
    {
      message: "Invalid travel date provided",
      path: ["travelDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.returnDate) return true;
      return !!parseMDYDate(data.returnDate);
    },
    {
      message: "Invalid return date provided",
      path: ["returnDate"],
    }
  )

  .refine(
    //check if travelDate is less than or equal to return date and both are atleast starting from tomorrow
    (data) => {
      const travelDate = parseMDYDate(data.travelDate ?? "");
      const returnDate = parseMDYDate(data.returnDate ?? "");
      if (travelDate && returnDate) {
        return travelDate <= returnDate;
      }
      return true;
    },
    {
      message: "Invalid travel date : should be before or on return date.",
      path: ["travelDate"],
    }
  )
  .refine(
    (data) => {
      if (data.travelDate) {
        const travelDate = parseMDYDate(data.travelDate);
        if (!travelDate) return false;
        const today = getCurrentDateInDC();
        today.setHours(0, 0, 0, 0);
        return travelDate >= today;
      }
      return true;
    },
    {
      message:
        "Travel date must be on or after " +
        addDays(getCurrentDateInDC(), 1).toLocaleDateString(),
      path: ["travelDate"],
    }
  )
  .refine(
    (data) => {
      if (data.returnDate && !data.travelDate) {
        const returnDate = parseMDYDate(data.returnDate);
        if (!returnDate) return false;
        const today = getCurrentDateInDC();
        today.setHours(0, 0, 0, 0);
        return returnDate! >= today;
      }
      return true;
    },
    {
      message:
        "Return date must be on or after " +
        addDays(getCurrentDateInDC(), 1).toLocaleDateString(),
      path: ["returnDate"],
    }
  );

type TravelPlansFormData = z.infer<typeof TravelPlansSchema>;

type TravelPlansFormProps = {
  goBack: () => void;
  onSubmit: (values: TravelPlansFormData) => void;
  defaultValues?: TravelPlansFormData; // Optional defaultValues prop
  isLoading?: boolean;
};

export function TravelPlansForm({
  goBack,
  onSubmit,
  defaultValues,
  isLoading,
}: TravelPlansFormProps) {
  const form = useForm<TravelPlansFormData>({
    resolver: zodResolver(TravelPlansSchema),
    defaultValues: {
      // Use provided defaultValues or empty object
      travelDate: "",
      returnDate: "",
      travelDestination: "",
      ...defaultValues,
    },
  });
  const [initiallyFilled, setInitiallyFilled] = useState(false);

  const {
    travelPlans: persistedTravelPlans,
    setTravelPlans: setPersistedTravelPlans,
  } = usePassportApplicationStore((state) => state);
  const watchedFields = form.watch();

  // Debounced store update
  const updateStore = useCallback(
    debounce((data: TravelPlansFormData) => {
      setPersistedTravelPlans({
        ...data,
        returnDate: data.returnDate ?? "",
        travelDate: data.travelDate ?? "",
      });
    }, 300),
    [setPersistedTravelPlans]
  ); // Adjust debounce time as needed

  // Sync with Zustand store in real time
  useEffect(() => {
    updateStore(watchedFields);
  }, [JSON.stringify(watchedFields)]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      updateStore.cancel();
    };
  }, []);
  useEffect(() => {
    if (
      (!defaultValues || Object.keys(defaultValues).length <= 1) &&
      persistedTravelPlans &&
      !initiallyFilled
    ) {
      form.reset(persistedTravelPlans);
    }
    setInitiallyFilled(true);
  }, [defaultValues, form]);

  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (!value) return;
        form.setValue(key as keyof TravelPlansFormData, value);
      });
    }
  }, [defaultValues, form]);

  const { control, handleSubmit } = form;

  return (
    <div className="w-full md:w-3/4 md:min-h-[80vh] flex flex-col justify-center items-center">
      <h2 className="font-semibold text-xl mb-10">
        What are your travel plans?
      </h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="travelDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Date of your trip
                    <FieldTooltip message="Please enter the date (MM/DD/YYYY) you expect to travel to a foreign country." />
                  </FormLabel>
                  <FormControl>
                    <CustomDateInput
                      defaultValue={""}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="returnDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Date of your return{" "}
                    <FieldTooltip
                      message="Please enter the date (MM/DD/YYYY) you expect to return from
                    a foreign country."
                    />
                  </FormLabel>
                  <FormControl>
                    <CustomDateInput
                      defaultValue={""}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="travelDestination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Countries to be visited?
                    <FieldTooltip message="Please enter the countries that you plan to visit on your trip." />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      placeholder="Destinations"
                      maxLength={70}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between mt-4">
            {!isLoading && (
              <Button
                className="mr-auto text-primary"
                variant={"outline"}
                size={"sm"}
                onClick={goBack}
              >
                <ArrowLeft />
              </Button>
            )}
            <Button className="ml-auto" disabled={isLoading} type="submit">
              {isLoading ? (
                <Loader2 className=" h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
