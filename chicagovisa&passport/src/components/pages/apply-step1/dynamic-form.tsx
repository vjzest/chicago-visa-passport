"use client";
import { z } from "zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateFormSchema } from "@/lib/form-schema";
import { useCaseStore } from "@/store/use-case-store";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { formatName } from "@/lib/utils";
import Callout from "@/components/globals/callout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";
import CustomDateInput from "@/components/globals/date-text-input";

const HELPER_MESSAGES: Record<string, string> = {
  firstName:
    "Please type the applicant's first name as you want it to be printed on the U.S. Passport",
  lastName:
    "Please type the applicant's last name as you want it to be printed on the U.S. Passport",
  middleName: "Enter your middle name",
  email1:
    "Your best and correct email address to ensure smooth communication with our office.",
};

const RenderField = (
  item: IDynamicFormField,
  field: ControllerRenderProps<{ [x: string]: any }, string>,
  formInfo: IForm,
  isFieldsDisabled: boolean,
  showSpecificContent?: (str: string) => void
) => {
  const { formData: storeFormData, setFormData: setStoreFormData } =
    useCaseStore((state) => state);
  const commonProps = { placeholder: item.placeholder, ...field };

  const handleChange = (key: string, value: any) => {
    let updatedTempFormData = { ...storeFormData };

    if (!updatedTempFormData[formInfo?.id]) {
      updatedTempFormData[formInfo?.id] = {};
    }
    updatedTempFormData[formInfo?.id][key] = value;

    setStoreFormData(updatedTempFormData);
    field.onChange(value); // Update React Hook Form state
  };

  switch (item?.type) {
    case "textarea":
      return (
        <Textarea
          {...commonProps}
          onChange={(e) => handleChange(item.key, e.target.value)}
        />
      );
    case "tel":
      return (
        <Input
          disabled={isFieldsDisabled}
          type={item?.type}
          {...commonProps}
          // onChange={(e) => handleChange(item?.key, e.target.value)}
          value={(field.value || "").replace(
            /(\d{3})(\d{3})(\d{4})/,
            "($1) $2-$3"
          )}
          onChange={(e) => {
            const value = e.target.value;
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 10) {
              field.onChange(e);
              // form.setValue("phoneNumber", numericValue);
              handleChange(item?.key, numericValue);
            }
          }}
          onBlur={field.onBlur}
        />
      );
    case "checkbox":
      return (
        <div className="flex gap-3">
          <div className="mb-4 flex items-center space-x-2">
            <Checkbox
              className="size-6"
              checked={field.value}
              onCheckedChange={(checked: boolean) => {
                handleChange(item.key, checked);
              }}
            />
            <FormLabel htmlFor={item.key}>{item.title}</FormLabel>
          </div>
        </div>
      );
    case "select":
      return (
        <select
          onChange={(e) => handleChange(item.key, e.target.value)}
          value={field?.value}
          defaultValue={field?.value}
          className="styled-select"
        >
          <option value="">Select an option</option>
          {item?.options?.map((option) => (
            <option key={option?.value} value={option?.value}>
              {option?.title}
            </option>
          ))}
        </select>
      );
    case "year":
      const currentYear = new Date().getFullYear();
      const minYear = item.validations?.minLength?.value || currentYear;
      const maxYear = item.validations?.maxLength?.value || currentYear + 10;
      return (
        <Select
          onValueChange={(value) => handleChange(item?.key, value)}
          defaultValue={field?.value}
        >
          <SelectTrigger>
            <SelectValue placeholder={item?.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
              const year = minYear + i;
              return (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    case "month":
      return (
        <Select
          onValueChange={(value) => handleChange(item.key, value)}
          defaultValue={field.value}
        >
          <SelectTrigger>
            <SelectValue placeholder={item.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "date":
      const today = new Date();
      const minDate = item.validations?.restrictPastDates?.value
        ? today.toISOString().split("T")[0]
        : "1900-01-01";
      const maxDate = item.validations?.restrictFutureDates?.value
        ? today.toISOString().split("T")[0]
        : undefined;

      return (
        <CustomDateInput
          disabled={isFieldsDisabled}
          {...commonProps}
          onChange={(e) => handleChange(item?.key, e.target.value)}
          onBlur={field.onBlur}
          min={minDate}
          max={maxDate}
        />
      );
    default:
      const maxVal = item.validations?.maxLength?.value;
      return (
        <Input
          disabled={isFieldsDisabled}
          type={item?.type}
          onFocus={
            showSpecificContent
              ? () => showSpecificContent(item.key)
              : undefined
          }
          {...commonProps}
          onChange={(e) => {
            let val;
            if (maxVal && e.target.value.length > maxVal) return;
            if (["firstName", "middleName", "lastName"]?.includes(item?.key)) {
              val = formatName(e.target.value, {
                allowNonConsecutiveSpaces: true,
              });
            } else val = e.target.value;
            handleChange(item?.key, val);
          }}
          onBlur={(e) => {
            field.onBlur();
            if (showSpecificContent) showSpecificContent("");
          }}
        />
      );
  }
};

type DynamicFormProps = {
  formInfo: IForm;
  tabIndex: number;
  triggerSubmit: number | null;
  onSubmit: (data: any) => void;
  setFormError: Dispatch<SetStateAction<boolean>>;
  setTriggerSubmit: Dispatch<SetStateAction<number | null>>;
  fieldsPerRowArray?: number[];
  showEmailLoginPrompt?: boolean;
};

const DynamicForm = forwardRef<HTMLFormElement, DynamicFormProps>(
  (
    {
      formInfo,
      onSubmit,
      triggerSubmit,
      setTriggerSubmit,
      setFormError,
      tabIndex,
      // fieldsPerRow = 1,
      fieldsPerRowArray = [],
      showEmailLoginPrompt = false,
    },
    ref
  ) => {
    const { formData: storeFormData } = useCaseStore((state) => state);
    const dynamicFormSchema = generateFormSchema(formInfo?.fields);
    const [showHelperMessage, setShowHelperMessage] = useState("");
    type formSchemaType = z.infer<typeof dynamicFormSchema>;
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => formRef.current!, []);

    const form = useForm<formSchemaType>({
      resolver: zodResolver(dynamicFormSchema),
      defaultValues: storeFormData?.[formInfo.id],
      mode: "onChange",
    });

    const handleSubmit = (data: formSchemaType) => {
      onSubmit(data);
    };

    useEffect(() => {
      form.reset(storeFormData?.[formInfo.id]);
    }, [storeFormData, form.reset]);

    useEffect(() => {
      if (tabIndex === triggerSubmit) {
        (async () => {
          const valid = await form.trigger();
          if (valid) setFormError(true);
          else setFormError(false);
        })();
        setTriggerSubmit(null);
      }
    }, [triggerSubmit]);

    // const formFieldsGrouped = formInfo?.fields.reduce((acc, field, index) => {
    //   if (index % fieldsPerRow === 0) acc.push([]);
    //   acc[acc.length - 1].push(field);
    //   return acc;
    // }, [] as IDynamicFormField[][]);
    const formFieldsGrouped = formInfo?.fields.reduce(
      (acc, field, index) => {
        const currentRow = acc.currentRow;
        const currentGroup = acc.groups;

        if (fieldsPerRowArray[currentRow] > 0) {
          if (!currentGroup[currentRow]) currentGroup[currentRow] = [];
          currentGroup[currentRow].push(field);

          if (
            currentGroup[currentRow].length === fieldsPerRowArray[currentRow]
          ) {
            acc.currentRow += 1; // Move to the next row
          }
        }

        return acc;
      },
      { currentRow: 0, groups: [] as IDynamicFormField[][] }
    ).groups;
    const setAfterAuthLink = useAuthStore((state) => state.setAfterAuthLink);
    const handleLoginClick = () => {
      setAfterAuthLink("/apply");
    };

    return (
      <Form {...form}>
        <form
          id={formInfo.id}
          ref={formRef}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col space-y-4 rounded  py-3"
        >
          {/* <h2 className=" text-xl font-semibold">{formInfo.name}</h2> */}
          {formFieldsGrouped.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-col gap-4 md:flex-row md:gap-0 md:space-x-4" // Flex container for each row
            >
              {row.map((item) => (
                <FormField
                  key={item?.key}
                  control={form.control}
                  name={item?.key}
                  render={({ field }) => (
                    <FormItem className={`flex-1`}>
                      {" "}
                      {/* Flex to allow even distribution */}
                      {item?.type !== "checkbox" && (
                        <FormLabel className="flex  items-center gap-2 ">
                          <span>{item?.title} </span>
                          {item?.validations?.required?.value ? (
                            <span className=" font-normal text-red-500">*</span>
                          ) : (
                            <></>
                          )}
                        </FormLabel>
                      )}
                      <FormControl>
                        <div className="relative">
                          {showHelperMessage === item.key &&
                            HELPER_MESSAGES[showHelperMessage] && (
                              <Callout
                                content={HELPER_MESSAGES[showHelperMessage]}
                              />
                            )}
                          {item.key === "email1" && showEmailLoginPrompt && (
                            <Callout
                              className="z-20 h-fit bg-red-400 border-primary  border-2"
                              content={
                                <div className="flex flex-col gap-3">
                                  <p className="text-center text-wrap text-white">
                                    Seems like an account with this email
                                    already exists. If you are an existing user,
                                    you can place multiple applications from
                                    your Client Portal after logging in.
                                  </p>
                                  <Button
                                    onClick={handleLoginClick}
                                    className="w-fit mx-auto"
                                  >
                                    <Link href="/login">Login</Link>
                                  </Button>
                                </div>
                              }
                            />
                          )}
                          {RenderField(
                            item,
                            field,
                            formInfo,
                            false,
                            setShowHelperMessage
                            // form,
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          ))}
        </form>
      </Form>
    );
  }
);

DynamicForm.displayName = "DynamicForm";
export default DynamicForm;
