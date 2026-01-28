"use client";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { generateFormSchema } from "@/lib/form-schema";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDnd from "@/components/globals/dnd/use-dnd";
import SortableField from "./sortable-field";
import { formsAPI } from "@/services/end-points/end-point";
import { useEffect } from "react";

const DisplayDynamicFormDND = ({
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
  // deleteForm = () => {},
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
  const onDragEnd = async (items: IDynamicFormField[]) => {
    try {
      formsAPI.reorderFields(items, formInfo?._id!);
    } catch (error) {}
  };
  const { handleDragEnd, items, setItems, sensors } = useDnd(
    fieldsData,
    onDragEnd
  );
  const dynamicFormSchema = generateFormSchema(fieldsData);
  type formSchemaType = z.infer<typeof dynamicFormSchema>;

  const form = useForm<formSchemaType>({
    resolver: zodResolver(dynamicFormSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (fieldsData) setItems(fieldsData);
  }, [fieldsData]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-4"
      >
        {formInfo?.name && (
          <div className="mb-3 flex w-full items-center justify-between">
            <h2 className=" whitespace-nowrap text-xl font-bold">
              {formInfo?.name}
            </h2>
            {/* <div className="flex justify-between gap-2">
              {formInfo?.id !== "applicantInfoT" && allowEdit && (
                <CustomAlert
                  alertMessage="This action cannot be undone. This will permanently delete the form"
                  TriggerComponent={
                    <Trash2
                      className="shrink-0 cursor-pointer text-red-500"
                      size={"1rem"}
                    />
                  }
                  onConfirm={() => deleteForm(formInfo?._id!)}
                />
              )}
            </div> */}
          </div>
        )}
        <ScrollArea
          className={cn(scrollAreaClass, "h-80 px-5 rounded bg-slate-50")}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableField
                  form={form}
                  item={item}
                  key={item.key}
                  setOpenModal={setOpenModal}
                  setEditingField={setEditingField}
                  setAddOrEdit={setAddOrEdit}
                  setFieldId={setFieldId}
                  deleteField={deleteField}
                  fieldsData={fieldsData}
                  isFieldsDisabled={isFieldsDisabled}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ScrollArea>
        {buttonText && <Button type="submit">{buttonText}</Button>}
      </form>
    </Form>
  );
};

export default DisplayDynamicFormDND;
