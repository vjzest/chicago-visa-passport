"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatName } from "@/lib/utils";
import { US_STATES } from "@/data/countries";

const formSchema = z.object({
  _id: z.string(),
  locationName: z
    .string()
    .min(2, { message: "Location name must be at least 2 characters." }),
  company: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters." }),
  authorisedPerson: z.string().min(2, {
    message: "Authorised person name must be at least 2 characters.",
  }),
  address: z
    .string()
    .min(5, { message: "Address line must be at least 5 characters." }),
  address2: z
    .string()
    .min(5, { message: "Address line must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().length(2, { message: "State must be selected." }),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, { message: "Invalid zip code format." }),
  instruction: z.string().optional(),
  isDeleted: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

interface AddressFormProps {
  initialValues?: z.infer<typeof formSchema> | null;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
}

export function AddressForm({ initialValues, onSubmit }: AddressFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      _id: "",
      locationName: "",
      company: "",
      authorisedPerson: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      instruction: "",
      isActive: true,
      isDeleted: false,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-[40rem] max-h-[80vh] overflow-y-auto pr-4"
      >
        <div className="flex w-full justify-center">
          <h1 className="text-xl font-bold">
            {initialValues ? "Edit Address" : "Add Address"}
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter location name"
                    {...field}
                    maxLength={50}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowNumbers: true,
                        allowUppercaseInBetween: true,
                        allowSpecialCharacters: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("locationName", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter company name"
                    {...field}
                    maxLength={50}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowNumbers: true,
                        allowUppercaseInBetween: true,
                        allowSpecialCharacters: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("company", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorisedPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authorised Person</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter authorised person's name"
                    {...field}
                    maxLength={50}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowUppercaseInBetween: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("authorisedPerson", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address 1"
                    {...field}
                    maxLength={60}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowNumbers: true,
                        allowUppercaseInBetween: true,
                        allowSpecialCharacters: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("address", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter address 2"
                    {...field}
                    maxLength={60}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowNumbers: true,
                        allowUppercaseInBetween: true,
                        allowSpecialCharacters: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("address2", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter city"
                    {...field}
                    maxLength={50}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNonConsecutiveSpaces: true,
                        allowUppercaseInBetween: true,
                        allowSpecialCharacters: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("city", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter zip code"
                    {...field}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                      const zipValue = value.replace(/[^\d-]/g, "");
                      if (zipValue.includes("-")) {
                        const [first, second] = zipValue.split("-");
                        if (first?.length > 5 || second?.length > 4) return;
                        if (first?.length === 5 && second?.length === 4) {
                          field.onChange(`${first}-${second}`);
                        } else {
                          field.onChange(zipValue);
                        }
                      } else {
                        if (zipValue.length > 5) return;
                        field.onChange(zipValue);
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
            name="instruction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instruction</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter instructions (optional)"
                    {...field}
                    maxLength={200}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formattedName = formatName(value, {
                        allowNumbers: true,
                        allowNonConsecutiveSpaces: true,
                        makeLettersAfterSpaceCapital: false,
                        allowUppercaseInBetween: true,
                      });
                      field.onChange(formattedName);
                      form.setValue("instruction", formattedName);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full justify-center">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {initialValues ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
