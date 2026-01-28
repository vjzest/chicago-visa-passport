"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DynamicFieldFormInputs, dynamicFieldSchema } from "@/lib/form-schema";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, PlusCircle } from "lucide-react";
import {
  createRandomId,
  formatName,
  toCamelCase,
  toRegularCase,
} from "@/lib/utils";
import { useState } from "react";

function convertField(input: any) {
  const {
    title,
    key,
    placeholder,
    type,
    required,
    options,
    minLength,
    maxLength,
    restrictPastDates,
    restrictFutureDates,
  } = input;

  const field: Omit<IDynamicFormField, "id"> = {
    title,
    key: key,
    placeholder: placeholder,
    type: type,
    _id: createRandomId(),
    sortOrder: 0,
    validations: {
      required: {
        value: required,
        message: `${title} is required`,
      },
      minLength: {
        value: parseInt(minLength, 10),
        message: `The minimum length should be ${minLength}`,
      },
      maxLength: {
        value: parseInt(maxLength, 10),
        message: `The maximum length should be ${maxLength}`,
      },
      restrictPastDates: {
        value: restrictPastDates,
        message: `The date should not be in the past`,
      },
      restrictFutureDates: {
        value: restrictFutureDates,
        message: `The date should not be in the future`,
      },
    },
  };

  if (options && options.length > 0) {
    field.options = options;
  }

  return field;
}

export function DynamicFormModal({
  handleAddOrEdit,
  setOpen,
  defaultFieldData,
  handleAddForm,
  type = "field",
}: {
  handleAddOrEdit?: (field: Omit<IDynamicFormField, "id">) => void;
  setOpen: (bool: boolean) => void;
  defaultFieldData: IDynamicFormField;
  handleAddForm?: (name: string, field: Omit<IDynamicFormField, "id">) => void;
  type?: "field" | "form";
}) {
  const [formName, setFormName] = useState({ value: "", error: "" });
  const form = useForm<DynamicFieldFormInputs>({
    resolver: zodResolver(dynamicFieldSchema),
    defaultValues: {
      title: defaultFieldData.title,
      key: defaultFieldData?.key,
      placeholder: defaultFieldData?.placeholder,
      type: defaultFieldData?.type,
      required: defaultFieldData?.validations?.required?.value || false,
      restrictPastDates:
        defaultFieldData?.validations?.restrictPastDates?.value || false,
      restrictFutureDates:
        defaultFieldData?.validations?.restrictFutureDates?.value || false,

      minLength: String(defaultFieldData?.validations?.minLength?.value || "1"),
      maxLength: String(
        defaultFieldData?.validations?.maxLength?.value || "10"
      ),
      options: defaultFieldData?.options,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  return (
    <DialogContent className="">
      <DialogHeader>
        <DialogTitle className="capitalize">{`New ${type}`}</DialogTitle>
      </DialogHeader>
      {type === "form" && (
        <>
          <Input
            onChange={(e) =>
              setFormName({ value: toRegularCase(e.target.value), error: "" })
            }
            placeholder="Form Name"
          />
        </>
      )}
      <div className="py-4">
        <Form {...form}>
          <form className="space-y-4">
            <ScrollArea className="h-80 rounded-md  bg-slate-50 p-3 pb-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="py-3">
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="title"
                        placeholder="Enter title"
                        {...field}
                        // onChange={(e) => {
                        //   form.setValue("title", e.target.value);
                        //   form.setValue("key", toCamelCase(e.target.value));
                        // }}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("title", formattedName);
                          form.setValue("key", toCamelCase(formattedName));
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.title?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem className="py-3">
                    <FormLabel htmlFor="key">Key</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="key"
                        placeholder="Enter key"
                        {...field}
                        disabled
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.key?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem className="py-3">
                    <FormLabel htmlFor="placeholder">Placeholder</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="placeholder"
                        placeholder="Enter placeholder"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedName = formatName(value, {
                            allowNonConsecutiveSpaces: true,
                          });
                          field.onChange(formattedName);
                          form.setValue("placeholder", formattedName);
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.placeholder?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="py-3">
                    <FormLabel htmlFor="type">Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Field Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="tel">Telephone</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>
                      {form?.formState?.errors?.type?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {form.watch("type") === "select" && (
                <div>
                  <div className="pl-5 pt-3">
                    <Label>Options</Label>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="mt-2 flex items-center space-x-2"
                      >
                        <Input
                          {...form.register(`options.${index}.title`)}
                          placeholder="Option Title"
                        />
                        <Input
                          {...form.register(`options.${index}.value`)}
                          placeholder="Option Value"
                        />
                        <button
                          disabled={fields.length === 1}
                          onClick={() => remove(index)}
                          className="disabled:opacity-30"
                        >
                          <Minus
                            strokeWidth={3}
                            className="cursor-pointer text-red-500 transition-transform ease-in-out hover:scale-110"
                            size={"1.5rem"}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => append({ title: "", value: "" })}
                      className="mt-2"
                      size={"sm"}
                    >
                      <PlusCircle />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap justify-between py-3">
                <FormField
                  control={form.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <div className="flex items-center gap-3  py-3 ">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="required"
                          />
                          <FormLabel htmlFor="required">Required</FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.required?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                {form.watch("type") === "date" && (
                  <>
                    <FormField
                      control={form.control}
                      name="restrictPastDates"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormControl>
                            <div className="flex items-center gap-3  py-3 ">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="restrictPastDates"
                              />
                              <FormLabel htmlFor="restrictPastDates">
                                Disable Past Dates
                              </FormLabel>
                            </div>
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.restrictPastDates?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="restrictFutureDates"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormControl>
                            <div className="flex items-center gap-3  py-3 ">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="restrictFutureDates"
                              />
                              <FormLabel htmlFor="restrictFutureDates">
                                Disable Future Dates
                              </FormLabel>
                            </div>
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.restrictFutureDates?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              {["text", "number", "textarea"].includes(form.watch("type")) && (
                <div className="flex w-full justify-between gap-3 py-3">
                  <FormField
                    control={form.control}
                    name="minLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="minLength">Min Length</FormLabel>
                        <FormControl>
                          <input
                            type="number"
                            id="minLength"
                            placeholder="Enter min length"
                            {...field}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.minLength?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="maxLength">Max Length</FormLabel>
                        <FormControl>
                          <input
                            type="number"
                            id="maxLength"
                            placeholder="Enter max length"
                            {...field}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.maxLength?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </ScrollArea>
            <DialogTrigger asChild>
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  const isValid = await form.trigger([
                    "title",
                    "key",
                    "placeholder",
                    "maxLength",
                    "minLength",
                    "options",
                    "required",
                    "type",
                  ]);

                  if (type === "form") {
                    if (formName.value === "") {
                      setFormName({
                        value: "",
                        error: "Please enter a form name",
                      });
                      return;
                    }
                  }

                  if (isValid) {
                    if (type === "field") {
                      handleAddOrEdit &&
                        handleAddOrEdit(convertField(form.getValues()));
                    } else {
                      handleAddForm &&
                        handleAddForm(
                          formName.value,
                          convertField(form.getValues())
                        );
                    }
                    form.reset();
                    setOpen(false);
                  }
                }}
                type="submit"
                className="w-full"
                disabled={form?.formState?.isSubmitting}
              >
                Submit
              </Button>
            </DialogTrigger>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}
