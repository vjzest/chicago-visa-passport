"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { generateFormSchema } from "@/lib/form-schema";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
const renderField = (
  item: IDynamicFormField,
  field: any,
  isFieldsDisabled: boolean = false
) => {
  const commonProps = { placeholder: item.placeholder, ...field };

  switch (item.type) {
    case "textarea":
      return <Textarea {...commonProps} />;
    case "checkbox":
      return (
        <div className="flex gap-3">
          <Button
            type="button"
            variant={field.value === "on" ? "primary" : "outline"}
            onClick={() => field.onChange("on")}
            className="w-fit"
            disabled={isFieldsDisabled}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={
              ["off", "", undefined].includes(field.value)
                ? "primary"
                : "outline"
            }
            onClick={() => field.onChange("off")}
            className="w-fit"
            disabled={isFieldsDisabled}
          >
            No
          </Button>
        </div>
      );
    case "select":
      return (
        <select
          onChange={(e) => field.onChange(e.target.value)}
          value={field.value}
          defaultValue={field.value}
          className="styled-select"
        >
          <option value="" disabled>
            Select an option
          </option>
          {item?.options?.map((option) => (
            <option key={option?.value} value={option?.value}>
              {option?.title}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <Input disabled={isFieldsDisabled} type={item?.type} {...commonProps} />
      );
  }
};

const DynamicForm2 = ({
  title,
  fieldsData,
  isFieldsDisabled = false,
  scrollAreaClass = "",
  buttonText = "",
  handleSubmit = () => {},
}: {
  title: string;
  fieldsData: IDynamicFormField[];
  isFieldsDisabled?: boolean;
  scrollAreaClass?: string;
  buttonText?: string;
  handleSubmit?: (data: any) => void;
}) => {
  const dynamicFormSchema = generateFormSchema(fieldsData);
  type formSchemaType = z.infer<typeof dynamicFormSchema>;

  const form = useForm<formSchemaType>({
    resolver: zodResolver(dynamicFormSchema),
    mode: "onSubmit",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-4"
      >
        {title && <h2 className="mb-3 text-xl font-bold">{title}</h2>}
        <ScrollArea className={cn(scrollAreaClass)}>
          {fieldsData.map((item) => (
            <FormField
              key={item?.key}
              control={form?.control}
              name={item?.key}
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormLabel className="flex justify-between">
                    <span>{item?.title}</span>
                  </FormLabel>
                  <FormControl>
                    {renderField(item, field, isFieldsDisabled)}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </ScrollArea>
        {buttonText && <Button type="submit">{buttonText}</Button>}
      </form>
    </Form>
  );
};

export default DynamicForm2;
