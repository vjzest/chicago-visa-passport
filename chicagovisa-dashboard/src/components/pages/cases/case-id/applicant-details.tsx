import React, { Dispatch, SetStateAction, useState } from "react";
import { Check, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import { toRegularCase } from "@/lib/utils";

interface Application {
  _id: string;
  [key: string]: any;
}

interface FormDataEditorProps {
  formInstances: IForm[];
  application: Application;
  allowEdit: boolean;
  setNotes: Dispatch<SetStateAction<any[]>>;
}

const FormDataEditor: React.FC<FormDataEditorProps> = ({
  formInstances,
  application,
  allowEdit,
  setNotes,
}) => {
  const [editingField, setEditingField] = useState<{
    formId: string;
    fieldKey: string;
  } | null>(null);
  const [fieldValue, setFieldValue] = useState<string | boolean>("");
  const [updatedApplication, setUpdatedApplication] =
    useState<Application>(application);

  const individualForms = formInstances.filter(
    (form) => form.type === "individual"
  );

  const handleEdit = (
    formId: string,
    fieldKey: string,
    currentValue: string | boolean
  ) => {
    setEditingField({ formId, fieldKey });
    setFieldValue(currentValue);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setFieldValue("");
  };

  const handleSave = async (formKey: string, fieldKey: string) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/applications/form-value/${application._id}`,
        {
          formKey,
          fieldKey,
          value: fieldValue,
        }
      );

      setUpdatedApplication((prev) => ({
        ...prev,
        [formKey]: {
          ...prev[formKey],
          [fieldKey]: fieldValue,
        },
      }));

      interface INote {
        autoNote: string;
        manualNote: string;
        createdAt: string;
        _id: string;
        host: string;
      }

      if (response?.data?.data?.notes)
        setNotes(
          response?.data?.data?.notes?.sort(
            (a: INote, b: INote) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );

      toast.success("Saved changes.");
      setEditingField(null);
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("Failed to save changes.");
    }
  };

  const renderField = (field: IDynamicFormField, form: IForm) => {
    const currentValue = updatedApplication?.[form.id]?.[field.key] ?? "";
    const isEditing =
      editingField?.formId === form.id && editingField?.fieldKey === field.key;

    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      value: isEditing ? fieldValue : currentValue,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setFieldValue(e.target.value),
      className: "w-full",
    };

    // Convert date to YYYY-MM-DD format for input value
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Extracts the YYYY-MM-DD part
    };

    // Convert date to a more readable format for display
    const formatDateForDisplay = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-us", {
        month: "long",
        year: "numeric",
        day: "numeric",
      });
    };

    switch (field.type) {
      case "textarea":
        return isEditing ? (
          <Textarea {...commonProps} />
        ) : (
          <span>{currentValue}</span>
        );
      case "checkbox":
        return isEditing ? (
          <Checkbox
            checked={fieldValue as boolean}
            onCheckedChange={(checked) => setFieldValue(checked)}
          />
        ) : (
          <span>{currentValue ? "Yes" : "No"}</span>
        );
      case "select":
        return isEditing ? (
          <Select
            value={fieldValue as string}
            onValueChange={(value) => setFieldValue(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span>
            {field.options?.find((o) => o.value === currentValue)?.title ||
              currentValue}
          </span>
        );
      // Handle the date type
      case "date":
        return isEditing ? (
          <Input
            type="date"
            {...commonProps}
            value={formatDateForInput(fieldValue as string)}
          />
        ) : (
          <span>{formatDateForDisplay(currentValue)}</span>
        );

      default:
        return isEditing ? (
          <Input type={field.type} {...commonProps} />
        ) : (
          <span>
            {/* Default field value display with date formatting */}
            {!isNaN(new Date(currentValue).getTime())
              ? formatDateForDisplay(currentValue)
              : currentValue}
          </span>
        );
    }
  };

  return (
    <div className="pb-4 px-4">
      {individualForms.map((form) => (
        <div key={form._id} className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">{form.name}</h2>
          {form.fields.map((field) => (
            <div key={field._id} className="mb-4 flex items-center gap-3">
              <label className="block text-sm font-medium text-gray-700">
                {field.title}:
              </label>
              <div className="grow">{renderField(field, form)}</div>
              {allowEdit &&
                (editingField?.formId === form.id &&
                editingField?.fieldKey === field.key ? (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleSave(form.id, field.key)}
                      size="sm"
                      className="h-fit p-2"
                    >
                      <Check className="size-4" />
                    </Button>
                    <X
                      onClick={handleCancelEdit}
                      className="size-5 cursor-pointer text-red-500"
                    />
                  </div>
                ) : (
                  <Edit
                    onClick={() =>
                      handleEdit(
                        form.id,
                        field.key,
                        updatedApplication?.[form.id]?.[field.key] ?? ""
                      )
                    }
                    className="size-4 cursor-pointer"
                  />
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FormDataEditor;
