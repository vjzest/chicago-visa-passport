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
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";
import CustomAlert from "../custom-alert";
import { toast } from "sonner";
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

const DisplayDynamicForm = ({
  formInfo,
  fieldsData,
  deleteField,
  isFieldsDisabled = false,
  scrollAreaClass = "",
  buttonText = "",
  setFieldId = () => {},
  handleSubmit = () => {},
  setOpenModal = () => {},
  setEditingField = () => {},
  setAddOrEdit = () => {},
  deleteForm = () => {},
}: {
  formInfo: IForm;
  fieldsData: IDynamicFormField[];
  deleteField?: (key: string) => void;
  isFieldsDisabled?: boolean;
  scrollAreaClass?: string;
  buttonText?: string;
  setFieldId?: (id: string) => void;
  handleSubmit?: (data: any) => void;
  setOpenModal?: (bool: boolean) => void;
  setEditingField?: (field: IDynamicFormField) => void;
  setAddOrEdit?: (str: "add" | "edit") => void;
  deleteForm?: (formId: string) => void;
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
        {formInfo?.name && (
          <div className="flex justify-between">
            <h2 className="mb-3 text-xl font-bold">{formInfo?.name}</h2>
            {formInfo?.id !== "applicantInfo" && (
              <CustomAlert
                TriggerComponent={
                  <Trash2
                    className="shrink-0 cursor-pointer text-red-500"
                    size={"1rem"}
                  />
                }
                onConfirm={() => deleteForm(formInfo?._id!)}
              />
            )}
          </div>
        )}
        <ScrollArea
          className={cn(scrollAreaClass, "h-80 px-5 rounded bg-slate-50")}
        >
          {fieldsData.map((item) => (
            <FormField
              key={item?.key}
              control={form?.control}
              name={item?.key}
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormLabel className="flex justify-between">
                    <span>{item?.title}</span>
                    <div className="flex items-center gap-2 ">
                      <Edit
                        onClick={() => {
                          setOpenModal(true);
                          setEditingField(item);
                          setAddOrEdit("edit");
                          setFieldId(item?._id || "");
                        }}
                        className="shrink-0 cursor-pointer text-red-500"
                        size={"1rem"}
                      />

                      <CustomAlert
                        TriggerComponent={
                          <Trash2
                            className="shrink-0 cursor-pointer text-red-500"
                            size={"1rem"}
                          />
                        }
                        onConfirm={() => {
                          if (fieldsData.length <= 1) {
                            toast.warning(
                              `Only one field left, delete the form instead.`
                            );
                          }
                          if (deleteField) {
                            deleteField(item?._id || "");
                          }
                        }}
                      />
                    </div>
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

export default DisplayDynamicForm;
