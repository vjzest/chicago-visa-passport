"use client";
import { DynamicFormModal } from "@/components/passport/globals/dynamic-form/dynamic-form-modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { createRandomId } from "@/lib/utils";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import DisplayDynamicFormDND from "@/components/passport/globals/dynamic-form/ddf-dnd";

const formInitialState: IDynamicFormField = {
  id: "",
  _id: "",
  sortOrder: 0,
  title: "",
  placeholder: "",
  writable: false,
  key: "",
  type: "text",
  options: [],
};

const DynamicFormLayout = ({
  formsSectionId,
  // deleteForm,
  formInfo,
}: {
  formsSectionId: string;
  formInfo: IForm;
  // deleteForm: (formId: string) => void;
}) => {
  const [applicantFields, setApplicantFields] = useState(formInfo?.fields);
  const [addOrEdit, setAddOrEdit] = useState("add");
  const [defaultFieldData, setDefaultFieldData] =
    useState<IDynamicFormField>(formInitialState);
  const [openModal, setOpenModal] = useState(false);
  const [fieldId, setFieldId] = useState("");

  const addField = async (field: Omit<IDynamicFormField, "id">) => {
    const newField = { ...field, id: createRandomId() };
    const { _id, ...restOfNewField } = newField;
    const formData = {
      formsSectionId,
      formId: formInfo?._id,
      fieldData: restOfNewField,
    };

    try {
      const { data } = await axiosInstance.put("/admin/forms/field", formData);
      setApplicantFields(() => [...applicantFields, data.data]);
      setOpenModal(false);
      toast.success("Field added successfully");
    } catch (error) {
      console.log("Create Form Error", error);
    }
  };

  const deleteField = async (_id: string) => {
    const filteredFields = applicantFields.filter((field) => field._id !== _id);
    try {
      await axiosInstance.delete(
        `/admin/forms/field/${formsSectionId}/${formInfo?._id}/${_id}`
      );
      toast.success("Field deleted successfully");
      setApplicantFields(filteredFields);
    } catch (error) {
      toast.error("Something went wrong! Please try again!");
      console.log({ error });
    }
  };

  const editField = async (updatedField: Omit<IDynamicFormField, "id">) => {
    const { _id, ...fieldsWithoutId } = updatedField;
    try {
      const { data } = await axiosInstance.put(
        `/admin/forms/field/${formsSectionId}/${formInfo?._id}/${fieldId}`,
        fieldsWithoutId
      );

      if (data?.data) {
        const updatedFields = applicantFields.map((field) =>
          field._id === fieldId ? data.data : field
        );

        setApplicantFields(updatedFields);
        toast.success("Field Edited successfully");
      }
    } catch (error) {}

    setDefaultFieldData(formInitialState);
  };

  return (
    <section className="w-full rounded-md bg-white p-5 shadow-lg md:w-5/12">
      <DisplayDynamicFormDND
        formInfo={formInfo}
        fieldsData={applicantFields}
        deleteField={deleteField}
        isFieldsDisabled={true}
        setEditingField={setDefaultFieldData}
        setOpenModal={setOpenModal}
        setAddOrEdit={setAddOrEdit}
        // deleteForm={deleteForm}
        setFieldId={setFieldId}
      />

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger asChild>
          <Button
            className="my-3 w-full"
            onClick={() => {
              setOpenModal(true);
              setDefaultFieldData(formInitialState);
              setAddOrEdit("add");
            }}
          >
            Add Field
          </Button>
        </DialogTrigger>
        {openModal && (
          <DynamicFormModal
            setOpen={setOpenModal}
            defaultFieldData={defaultFieldData}
            handleAddOrEdit={addOrEdit === "add" ? addField : editField}
          />
        )}
      </Dialog>
    </section>
  );
};

export default DynamicFormLayout;
