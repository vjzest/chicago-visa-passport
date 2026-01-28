import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CustomAlert from "../custom-alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
              <SelectItem key={option?.value} value={option?.value}>
                {option?.title}
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

const SortableField = ({
  item,
  setOpenModal,
  setEditingField,
  setAddOrEdit,
  setFieldId,
  isFieldsDisabled,
  deleteField,
  fieldsData,
  form,
}: {
  form: UseFormReturn<
    {
      [x: string]: string;
    },
    any,
    undefined
  >;
  item: IDynamicFormField;
  setFieldId: (value: string) => void;
  deleteField?: (key: string) => void;
  fieldsData: IDynamicFormField[];
  isFieldsDisabled: boolean;
  setOpenModal: (bool: boolean) => void;
  setEditingField: (field: IDynamicFormField) => void;
  setAddOrEdit: (str: "add" | "edit") => void;
}) => {
  const uniqueId = item.id;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: uniqueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCursorGrabbing = attributes["aria-pressed"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      key={uniqueId}
      className="m-2 flex rounded-lg shadow-full"
    >
      <div className="group relative flex w-full justify-between gap-5 px-2">
        <div className="w-full justify-between">
          <FormField
            key={item?.key}
            control={form?.control}
            name={item?.key}
            render={({ field }) => (
              <FormItem className="my-4 w-full">
                <FormLabel className="flex justify-between">
                  <span>{item?.title}</span>
                  {item.writable && (
                    <div className="flex items-center gap-2 ">
                      <Edit
                        onClick={() => {
                          setOpenModal(true);
                          setEditingField(item);
                          setAddOrEdit("edit");
                          setFieldId(item._id || "");
                        }}
                        className="shrink-0 cursor-pointer text-red-500"
                        size={"1rem"}
                      />
                      <CustomAlert
                        alertMessage="This action cannot be undone.This will Permanently delete the field"
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
                  )}
                </FormLabel>
                <FormControl>
                  <>{renderField(item, field, isFieldsDisabled)}</>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-1/12 items-center justify-center gap-4 ">
          <button
            {...attributes}
            {...listeners}
            className={` ${isCursorGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
            aria-describedby={`DndContext-${uniqueId}`}
            type="button"
          >
            <svg viewBox="0 0 20 20" width="15">
              <path
                d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableField;
