"use client";
import React, { useEffect, useState } from "react";
import DynamicFormLayout from "@/components/passport/pages/forms/dynamic-form-layout";
import { DynamicFormModal } from "@/components/passport/globals/dynamic-form/dynamic-form-modal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { createRandomId, toCamelCase } from "@/lib/utils";
import { toast } from "sonner";
import axiosInstance from "@/services/axios/axios";
import BreadCrumbComponent from "@/components/passport/globals/breadcrumb";

const formInitialState: IDynamicFormField = {
  id: "",
  _id: "",
  sortOrder: 0,
  writable: false,
  title: "",
  placeholder: "",
  key: "",
  type: "text",
  options: [],
};

const FormsListPage = ({ params }: { params: { formSectionId: string } }) => {
  const customBreadcrumbs = [
    { label: "Forms", link: "/forms" },
    { label: "Passport Application Form", link: null },
  ];
  const formsSectionId = params.formSectionId;
  const [openModal, setOpenModal] = useState(false);
  const [forms, setForms] = useState<IForm[]>([]);
  const defaultFieldData: IDynamicFormField = formInitialState;

  const addForm = async (name: string, field: any) => {
    delete field._id;
    const newForm: any = {
      name,
      id: toCamelCase(name),
      sortOrder: forms.length,
      fields: [{ ...field, id: createRandomId(), sortOrder: 0 }],
    };

    const formData = {
      formsSectionId,
      formData: newForm,
    };
    try {
      const { data } = await axiosInstance.put("/admin/forms/form", formData);
      setForms([...forms, data?.data]);

      toast.success("Form created successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getForms = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/forms/passport-application-forms`
      );
      setForms(data?.data);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    getForms();
  }, []);

  return (
    <>
      <BreadCrumbComponent customBreadcrumbs={customBreadcrumbs} />

      <div className="flex justify-between py-4">
        <h2 className=" text-xl font-semibold">Forms</h2>
        <div className="flex gap-3">
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild></DialogTrigger>
            {openModal && (
              <DynamicFormModal
                setOpen={setOpenModal}
                defaultFieldData={defaultFieldData}
                handleAddForm={addForm}
                type="form"
              />
            )}
          </Dialog>
        </div>
      </div>
      <div>
        <div className="mt-5 flex flex-wrap gap-5 md:flex-row">
          {forms &&
            forms?.map((form: any) => {
              return (
                <React.Fragment key={form?.name}>
                  <DynamicFormLayout
                    formInfo={form}
                    formsSectionId={formsSectionId}
                  />
                </React.Fragment>
              );
            })}
          {(forms?.length == 0 || forms?.length === 0) && (
            <span className="mt-5 w-full text-center text-xl text-gray-300">
              No Forms added for the selected countries.
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default FormsListPage;
