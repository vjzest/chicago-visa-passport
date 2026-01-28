"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Control } from "react-hook-form";

interface MerchantAccount {
  _id: string;
  processorName: string;
}

interface Step1BasicInfoProps {
  control: Control<any>;
  formatServiceLevelInput: (value: string) => string;
  formatTimeInput: (value: string) => string;
  merchantAccounts: MerchantAccount[];
  handleNext: () => void;
  isTransitioning: boolean;
  currentStep: number;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  control,
  formatServiceLevelInput,
  formatTimeInput,
  merchantAccounts,
  handleNext,
  isTransitioning,
  currentStep,
}) => {
  return (
    <div
      className={cn(
        "transition-all duration-150 ease-in-out",
        isTransitioning && "opacity-0",
        currentStep === 1 ? "block" : "hidden"
      )}
    >
      <div className="mb-4 text-center text-sm text-muted-foreground">
        Step 1: Basic Information
      </div>
      <div className="h-96 w-full overflow-y-auto px-2">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="serviceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Level</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      const formatted = formatServiceLevelInput(
                        e.target.value
                      );
                      field.onChange(formatted);
                    }}
                    aria-label="Service Level"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time (For Display)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      const formatted = formatTimeInput(e.target.value);
                      field.onChange(formatted);
                    }}
                    aria-label="Time"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="speedInWeeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speed in Weeks</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber)
                    }
                    aria-label="Speed in Weeks"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber)
                    }
                    aria-label="Price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="nonRefundableFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Non-Refundable Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber)
                    }
                    aria-label="Non-Refundable Fee"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="inboundFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inbound Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber)
                    }
                    aria-label="Inbound Fee"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="outboundFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outbound Fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber)
                    }
                    aria-label="Outbound Fee"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="paymentGateway"
            render={({ field }) => {
              const selectValue = typeof field.value === "object" && field.value?._id
                ? field.value._id
                : field.value;
              return (
              <FormItem>
                <FormLabel>Merchant Account</FormLabel>
                <FormControl>
                  <Select value={selectValue} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"none"}>
                        LOAD BALANCER
                      </SelectItem>
                      {merchantAccounts?.map((account) => (
                        <SelectItem
                          key={account._id}
                          value={account._id}
                        >
                          {account.processorName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );}}
          />

          <FormField
            control={control}
            name="authOnlyFrontend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Auth Only Frontend</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="authorize_nrf_capture_service">
                        AUTHORIZE (NRF) CAPTURE(SERVICE FEE)
                      </SelectItem>
                      <SelectItem value="capture_both">
                        CAPTURE BOTH (NRF & SERVICE FEE)
                      </SelectItem>
                      <SelectItem value="authorize_both">
                        AUTHORIZE BOTH (NRF & SERVICE FEE)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="doubleCharge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Double Charge</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="amex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AMEX</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Button
                      size={"xsm"}
                      type="button"
                      onClick={() => field.onChange(true)}
                      variant={field?.value ? "primary" : "outline"}
                    >
                      Yes
                    </Button>
                    <Button
                      size={"xsm"}
                      type="button"
                      onClick={() => field.onChange(false)}
                      variant={!field?.value ? "primary" : "outline"}
                    >
                      No
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Button type="button" onClick={handleNext}>
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
