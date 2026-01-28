import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCaseStore } from "@/store/use-case-store";

type DynamicFormProps = {
  fields: IDynamicFormField[];
  personIndex?: number;
  form: IForm;
};

export function DynamicForm3({ fields, personIndex, form }: DynamicFormProps) {
  const { formData: tempFormData, setFormData: setTempFormData } = useCaseStore(
    (state) => state
  );

  useEffect(() => {
    let initializedData = { ...tempFormData };

    if (form?.type === "individual" && typeof personIndex === "number") {
      if (!initializedData?.persons) {
        initializedData.persons = [];
      }
      if (!initializedData?.persons[personIndex]) {
        initializedData.persons[personIndex] = {};
      }
      if (!initializedData?.persons[personIndex][form?.id]) {
        initializedData.persons[personIndex][form?.id] = {};
      }
      fields.forEach((field) => {
        if (
          initializedData.persons[personIndex][form?.id][field.key] ===
          undefined
        ) {
          initializedData.persons[personIndex][form?.id][field.key] =
            field.type === "checkbox" ? false : "";
        }
      });
    } else if (form?.type === "common") {
      if (!initializedData[form?.id]) {
        initializedData[form?.id] = {};
      }
      fields.forEach((field) => {
        if (initializedData[form?.id][field.key] === undefined) {
          initializedData[form?.id][field.key] =
            field.type === "checkbox" ? false : "";
        }
      });
    }

    setTempFormData(initializedData);
  }, [fields]);

  const handleChange = (key: string, value: any) => {
    let updatedTempFormData = { ...tempFormData };

    if (form?.type === "individual" && typeof personIndex === "number") {
      if (!updatedTempFormData?.persons) {
        updatedTempFormData.persons = [];
      }
      if (!updatedTempFormData?.persons[personIndex]) {
        updatedTempFormData.persons[personIndex] = {};
      }
      if (!updatedTempFormData?.persons[personIndex][form?.id]) {
        updatedTempFormData.persons[personIndex][form?.id] = {};
      }
      updatedTempFormData.persons[personIndex][form?.id][key] = value;
    } else if (form?.type === "common") {
      if (!updatedTempFormData[form?.id]) {
        updatedTempFormData[form?.id] = {};
      }
      updatedTempFormData[form?.id][key] = value;
    }

    setTempFormData(updatedTempFormData);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded bg-slate-100 p-3">
      <h2 className=" mb-3 text-xl font-semibold capitalize">{form.name}</h2>
      {fields
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((field) => {
          const value =
            form?.type === "individual" && typeof personIndex === "number"
              ? tempFormData?.persons?.[personIndex]?.[form?.id]?.[field.key] ||
                ""
              : tempFormData?.[form?.id]?.[field.key] || "";
          switch (field.type) {
            case "text":
            case "number":
            case "email":
            case "tel":
            case "date":
              return (
                <div key={field?._id} className="mb-4">
                  <Label htmlFor={field?.key}>{field?.title}</Label>
                  <Input
                    id={field?.key}
                    type={field?.type}
                    placeholder={field?.placeholder}
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              );
            case "textarea":
              return (
                <div key={field?._id} className="mb-4">
                  <Label htmlFor={field?.key}>{field?.title}</Label>
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={value}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </div>
              );
            case "checkbox":
              return (
                <div
                  key={field?._id}
                  className="mb-4 flex items-center space-x-2"
                >
                  <Checkbox
                    id={field.key}
                    checked={!!value}
                    onCheckedChange={(checked: boolean) => {
                      handleChange(field?.key, checked);
                    }}
                  />
                  <Label htmlFor={field?.key}>{field?.title}</Label>
                </div>
              );
            case "select":
              return (
                <div key={field._id} className="mb-4">
                  <Label htmlFor={field.key}>{field.title}</Label>
                  <Select
                    value={value}
                    onValueChange={(val) => handleChange(field.key, val)}
                  >
                    <SelectTrigger id={field.key} className="w-full">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{field.title}</SelectLabel>
                        {field.options?.map((option) => (
                          <SelectItem key={option?.value} value={option?.value}>
                            {option?.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              );
            default:
              return null;
          }
        })}
      <button type="submit">Submit</button>
    </form>
  );
}
