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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {item?.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    default:
      return (
        <Input disabled={isFieldsDisabled} type={item.type} {...commonProps} />
      );
  }
};

const DynamicForm = ({
  title,
  fieldsData,
  isFieldsDisabled = false,
  scrollAreaClass = "",
  buttonText = "",
  handleSubmit = () => { },
  defaultValues,
}: {
  title: string;
  fieldsData: IDynamicFormField[];
  isFieldsDisabled?: boolean;
  scrollAreaClass?: string;
  buttonText?: string;
  handleSubmit?: (data: any) => void;
  defaultValues?: {};
}) => {
  const dynamicFormSchema = generateFormSchema(fieldsData);
  type formSchemaType = z.infer<typeof dynamicFormSchema>;

  const form = useForm<formSchemaType>({
    resolver: zodResolver(dynamicFormSchema),
    mode: "onSubmit",
    defaultValues: defaultValues || {},
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
              control={form.control}
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

export default DynamicForm;
