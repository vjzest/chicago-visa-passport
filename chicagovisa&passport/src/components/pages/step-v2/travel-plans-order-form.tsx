import React from "react";
import { UseFormReturn } from "react-hook-form";
import { format, addDays, addYears } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { TravelPlansFormData } from "./application-form-section";
import { formatName } from "@/lib/utils";
import { useCaseStore } from "@/store/use-case-store";

const tomorrow = addDays(new Date(), 1);
const maxDate = addYears(new Date(), 1);

const TravelPlansOrderForm = ({
  form,
}: {
  form: UseFormReturn<
    {
      hasPlans: boolean;
      destination?: string;
      travelPurpose?: string;
      travelDate?: string;
    },
    any,
    undefined
  >;
}) => {
  const setTravelPlansOrderFormData = useCaseStore(
    (state) => state.setTravelPlansOrderFormData
  );
  const showFields = form.watch("hasPlans") === true;

  const onSubmit = (data: TravelPlansFormData) => {
    // console.log(data);
  };

  return (
    <Form {...form}>
      <form
        id="travelPlansForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 p-2 md:px-4"
      >
        <h2 className="mb-2 text-xl font-semibold text-primary">
          Travel plans
        </h2>

        <div>
          <p className="text-base text-gray-600 font-medium mb-4">
            Do you have plans to travel some time soon?
          </p>

          <FormField
            control={form.control}
            name="hasPlans"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={(str: "yes" | "no") => {
                      field.onChange(str === "yes" ? true : false);
                      if (str === "no") {
                        form.setValue("destination", "");
                        form.setValue("travelPurpose", "");
                        form.setValue("travelDate", "");
                        setTravelPlansOrderFormData({
                          hasPlans: false,
                        });
                      }
                    }}
                    defaultValue={field.value === true ? "yes" : "no"}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem className="size-6" value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        className="size-6"
                        value="no"
                        id="no-option"
                      />
                      <Label htmlFor="no-option">No</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-3/4">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <Label
                    htmlFor="destination"
                    className="flex items-center gap-1"
                  >
                    Destination
                    <span className="text-lg text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="Enter destination"
                      className="w-full mt-1"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const specialChars = ["-", ",", "."];

                        // Check for consecutive special characters
                        let hasConsecutiveSpecialChars = false;
                        for (let i = 0; i < value.length - 1; i++) {
                          if (
                            specialChars.includes(value[i]) &&
                            specialChars.includes(value[i + 1])
                          ) {
                            hasConsecutiveSpecialChars = true;
                            break;
                          }
                        }

                        if (!hasConsecutiveSpecialChars) {
                          const formatted = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                            allowUppercaseInBetween: true,
                            makeLettersAfterSpaceCapital: false,
                            specialCharacters: ["-", ",", "."],
                          });
                          field.onChange(formatted);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelPurpose"
              render={({ field }) => (
                <FormItem>
                  <Label
                    htmlFor="travel-purpose"
                    className="flex items-center gap-1"
                  >
                    Travel Purpose{" "}
                    <span className="text-lg text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <select
                      className="styled-select w-full text-base rounded-none"
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value}
                    >
                      <option value="">Select Travel Purpose</option>
                      <option value="business">Business</option>
                      <option value="leisure">Leisure</option>
                      <option value="education">Education</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelDate"
              render={({ field }) => (
                <FormItem>
                  <Label className="flex items-center gap-1">
                    Travel Date
                    <span className="text-lg text-red-500">*</span>{" "}
                  </Label>
                  <FormControl>
                    <Input
                      type="date"
                      className="w-full mt-1"
                      min={format(tomorrow, "yyyy-MM-dd")}
                      max={format(maxDate, "yyyy-MM-dd")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </form>
    </Form>
  );
};

export default TravelPlansOrderForm;
