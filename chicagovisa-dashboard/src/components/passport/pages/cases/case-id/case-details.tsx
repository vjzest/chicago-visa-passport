import React, { Dispatch, SetStateAction, useState } from "react";
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
import { Check, EditIcon, X } from "lucide-react";
import axiosInstance from "@/services/axios/axios";
import { toast } from "sonner";
import { getCurrentDateInDC, toCamelCase, toRegularCase } from "@/lib/utils";
import { useAccess } from "@/hooks/use-access";
import CustomDateInput from "@/components/passport/globals/custom-date-input";

interface ShippingInformation {
  [key: string]: string | boolean | undefined;
}

interface CaseDetailsProps {
  data: any;
  allowEdit: boolean;
  setNotes: Dispatch<SetStateAction<any[]>>;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({
  data,
  setNotes,
  allowEdit,
}) => {
  const access = useAccess();
  const [editingField, setEditingField] = useState<{
    formId: string;
    fieldId: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldValue, setFieldValue] = useState<string | boolean>("");
  const [shippingInformation, setShippingInformation] =
    useState<ShippingInformation>(data.shippingInformation);

  const commonForms = data?.formInstance;

  // Function to check if a string is a valid date
  const isValidDate = (dateString: string): boolean => {
    // First check if the string matches a date-like pattern
    const datePattern =
      /^\d{4}-\d{2}-\d{2}|^\d{4}\/\d{2}\/\d{2}|^\d{2}-\d{2}-\d{4}|^\d{2}\/\d{2}\/\d{4}/;
    if (!datePattern.test(dateString)) {
      return false;
    }

    // Then verify it creates a valid date object
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Function to format date to "DD MMM YYYY" format
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Function to display field value with date formatting if applicable
  const displayValue = (value: any, ignoreDate?: boolean): string => {
    if (!value) return "N/A";
    if (typeof value === "string" && !ignoreDate && isValidDate(value)) {
      return formatDate(value);
    }
    return value.toString();
  };

  const handleEdit = (
    formId: string,
    fieldId: string,
    currentValue: string | boolean
  ) => {
    setEditingField({ formId, fieldId });
    setFieldValue(currentValue);
  };

  const handleSave = async (formKey: string, fieldKey: string) => {
    if (!editingField) return;
    setLoading(true);

    try {
      const response = await axiosInstance.patch(`/admin/cases/${data._id}`, {
        formKey,
        fieldKey,
        value: fieldValue,
      });

      setShippingInformation((prevInfo) => ({
        ...prevInfo,
        [fieldKey]: fieldValue,
      }));
      data[formKey][fieldKey] = fieldValue;

      const note = {
        host: "admin",
        note: `case field updated ${toRegularCase(fieldKey)} to ${fieldValue}`,
        _id: response?.data?.data?.notes?.length,
        createdAt: getCurrentDateInDC(),
      };

      if (response?.data?.data?.notes) {
        interface INote {
          note: string;
          createdAt: string;
          _id: string;
          host: string;
        }
        setNotes(
          response.data?.data?.notes?.sort(
            (a: INote, b: INote) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      }

      setLoading(false);
      toast.success("Changes saved.");
      setEditingField(null);
    } catch (error) {
      setLoading(false);
      console.error("Error updating field:", error);
      toast.error("Failed to save changes.");
    }
  };

  const renderField = (
    field: IDynamicFormField,
    form: IForm,
    allowEdit: boolean
  ) => {
    const currentValue = data[form?.id]?.[field.key];
    const isEditing =
      editingField?.formId === form._id && editingField?.fieldId === field._id;

    let maxLength = field?.validations?.maxLength?.value;
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder,
      value: isEditing ? fieldValue.toString() : (currentValue as string),
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        let value = e.target.value;
        if (!maxLength) {
          if (["firstName", "lastName", "middleName"].includes(field.key)) {
            maxLength = 75;
          } else if (["email1", "email2"].includes(field.key)) {
            maxLength = 100;
          } else if (["phone1", "phone2"].includes(field.key)) {
            maxLength = 10;
          }
        }
        if (value.length > maxLength!) {
          value = value.slice(0, maxLength);
        }
        setFieldValue(value);
      },
      className: "w-full",
    };

    switch (field.type) {
      case "textarea":
        return isEditing ? (
          <Textarea disabled={!allowEdit} {...commonProps} />
        ) : (
          <span>{displayValue(currentValue, field.key === "zip")}</span>
        );
      case "checkbox":
        return isEditing ? (
          <Checkbox
            disabled={!allowEdit}
            checked={fieldValue as boolean}
            onCheckedChange={(checked) => setFieldValue(checked)}
          />
        ) : (
          <span>{currentValue ? "Yes" : "No"}</span>
        );
      case "select":
        return isEditing ? (
          <Select
            disabled={!allowEdit}
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
              displayValue(currentValue, field.key === "zip")}
          </span>
        );
      default:
        return isEditing ? (
          field.type === "date" ? (
            <CustomDateInput
              disabled={!allowEdit}
              {...commonProps}
              value={
                commonProps.value && typeof commonProps.value === "string"
                  ? isValidDate(commonProps.value)
                    ? new Date(commonProps.value).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : commonProps.value
                  : commonProps.value
              }
            />
          ) : (
            <Input
              disabled={!allowEdit}
              type={field.type}
              {...commonProps}
              value={commonProps.value}
            />
          )
        ) : (
          <span className=" break-all ">
            {displayValue(currentValue, field.key === "zip")}
          </span>
        );
    }
  };

  return (
    <div className="  p-4 pl-0">
      {commonForms?.map((form: IForm) => {
        if (
          (form.id === "applicantInfo" &&
            !access?.viewCaseDetails.applicantInformation) ||
          (form.id === "shippingInformation" &&
            !access?.viewCaseDetails.shippingInformation)
        ) {
          return <></>;
        }
        let allowSectionEdit = false;
        switch (form.id) {
          case "shippingInformation":
            allowSectionEdit = !!access?.editCaseDetails.shippingInformation;
            break;
          case "contactInformation":
            allowSectionEdit = !!access?.editCaseDetails.contactInformation;
            break;
          case "applicantInfo":
            allowSectionEdit = true;
        }

        return (
          <div key={form._id} className="">
            <h2 className="mb-2 text-xl font-semibold">{form.name}</h2>
            {form.fields.map((field) => {
              let allowFieldEdit = allowSectionEdit;
              if (form.id === "applicantInfo") {
                if (field.key === "dateOfBirth") {
                  allowFieldEdit =
                    !!access?.editCaseDetails.applicantsDateOfBirth;
                } else if (
                  field.key === "firstName" ||
                  field.key === "middleName" ||
                  field.key === "lastName"
                ) {
                  allowFieldEdit = !!access?.editCaseDetails.applicantsName;
                }
              }

              return (
                <div key={field._id} className="mb-4 flex items-center gap-3 ">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.title}:
                  </label>
                  <div className="flex grow items-center justify-between gap-3">
                    {renderField(field, form, allowFieldEdit)}
                    {allowFieldEdit &&
                      allowEdit &&
                      (editingField?.formId === form._id &&
                      editingField?.fieldId === field._id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            disabled={
                              !allowFieldEdit ||
                              loading ||
                              fieldValue ===
                                (data[form?.id]?.[field?.key] || "")
                            }
                            size="sm"
                            onClick={() => handleSave(form.id, field.key)}
                            className="h-fit p-2"
                          >
                            <Check className="size-4 bg-primary" />
                          </Button>
                          <X
                            onClick={() => setEditingField(null)}
                            className="size-5 cursor-pointer text-red-500"
                          />
                        </div>
                      ) : (
                        <EditIcon
                          onClick={() =>
                            handleEdit(
                              form?._id!,
                              field?._id,
                              data[form?.id]?.[field?.key] || ""
                            )
                          }
                          className="size-4 shrink-0 cursor-pointer "
                        />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CaseDetails;
