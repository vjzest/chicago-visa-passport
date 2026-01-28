import { FormsSectionsModel } from "../../models/forms.model";
import { ServiceResponse } from "../../types/service-response.type";
import { IDynamicFormField, IForm } from "../../typings";

export default class FormsService {
  private readonly model = FormsSectionsModel;

  async createForm(formsSectionId: string, formData: any): ServiceResponse {
    try {
      const formsSection = await this.model.findById(formsSectionId);
      if (!formsSection) {
        return {
          status: 404,
          success: false,
          message: "FormsSection not found",
        };
      }

      const newForm: IForm = {
        name: formData?.name,
        id: formData?.id,
        sortOrder: formData?.sortOrder,
        fields: formData?.fields,
        type: formData?.type,
        destinationCountry: formData?.destinationCountry,
        originCountry: formData?.originCountry,
      };

      formsSection.forms.push(newForm);
      const data = await formsSection.save();
      const latestForm = data?.forms?.find(
        (form) => form!.id?.toString() === newForm.id
      );

      return {
        status: 201,
        success: true,
        message: "Form created successfully",
        data: latestForm,
      };
    } catch (error) {
      console.log({ error });
      return {
        status: 500,
        success: false,
        message: "Internal Server error",
      };
    }
  }

  async addField(
    formsSectionId: string,
    formId: string,
    fieldData: any
  ): ServiceResponse {
    try {
      const formsSection = await this.model.findById(formsSectionId);
      if (!formsSection) {
        return {
          status: 404,
          success: false,
          message: "FormsSection not found",
        };
      }

      const form = formsSection?.forms?.find(
        (form) => form!._id?.toString() === formId
      );
      if (!form) {
        return {
          status: 404,
          success: false,
          message: "Form not found",
        };
      }

      form.fields.push(fieldData);
      const newForms = await formsSection.save();
      const latestFormData = newForms?.forms
        ?.find((form) => form!._id?.toString() === formId)
        ?.fields.pop();

      return {
        status: 201,
        success: true,
        message: "Field added successfully",
        data: latestFormData,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAllFormSections(): ServiceResponse<any> {
    try {
      const formSections = await this.model.find();
      return {
        status: 200,
        success: true,
        message: "FormSections fetched successfully",
        data: formSections,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findFormsOfASection(sectionId: string): ServiceResponse<any> {
    try {
      const formSection = await this.model.findOne({ id: sectionId });
      return {
        status: 200,
        success: true,
        message: "Forms fetched successfully",
        data: formSection?.forms,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteField(
    formsSectionId: string,
    formId: string,
    fieldId: string
  ): ServiceResponse {
    try {
      const formsSection = await this.model.findById(formsSectionId);
      if (!formsSection) {
        return {
          status: 404,
          success: false,
          message: "FormsSection not found",
        };
      }

      const form = formsSection.forms.find(
        (form) => form?._id?.toString() === formId
      );
      if (!form) {
        return {
          status: 404,
          success: false,
          message: "Form not found",
        };
      }

      const fieldIndex = form.fields.findIndex(
        (field) => field._id.toString() === fieldId
      );
      if (fieldIndex === -1) {
        return {
          status: 404,
          success: false,
          message: "Field not found",
        };
      }
      if (!form.fields[fieldIndex].writable) {
        return {
          status: 400,
          success: false,
          message: "Field is not writable",
        };
      }

      form.fields.splice(fieldIndex, 1);
      await formsSection.save();

      return {
        status: 200,
        success: true,
        data: form,
        message: "Field deleted successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async editField(
    formsSectionId: string,
    formId: string,
    fieldId: string,
    fieldData: any
  ): ServiceResponse {
    try {
      const formsSection = await this.model.findById(formsSectionId);
      if (!formsSection) {
        return {
          status: 404,
          success: false,
          message: "FormsSection not found",
        };
      }

      const form = formsSection.forms.find(
        (form) => form?._id?.toString() === formId
      );
      if (!form) {
        return {
          status: 404,
          success: false,
          message: "Form not found",
        };
      }

      const field = form.fields.find(
        (field) => field._id.toString() === fieldId
      );
      if (!field) {
        return {
          status: 404,
          success: false,
          message: "Field not found",
        };
      }
      if (!field.writable) {
        return {
          status: 400,
          success: false,
          message: "Field is not writable",
        };
      }

      Object.assign(field, fieldData);
      await formsSection.save();

      return {
        status: 200,
        success: true,
        message: "Field updated successfully",
        data: field,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteForm(formsSectionId: string, formId: string): ServiceResponse {
    try {
      const formsSection = await this.model.findById(formsSectionId);
      if (!formsSection) {
        return {
          status: 404,
          success: false,
          message: "FormsSection not found",
        };
      }

      const formIndex = formsSection.forms.findIndex(
        (form) => form?._id?.toString() === formId
      );
      if (formIndex === -1) {
        return {
          status: 404,
          success: false,
          message: "Form not found",
        };
      }

      formsSection.forms.splice(formIndex, 1);
      await formsSection.save();

      return {
        status: 200,
        success: true,
        message: "Form deleted successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async reorderFields(
    formId: string,
    data: IDynamicFormField[]
  ): ServiceResponse {
    try {
      const formSection = await FormsSectionsModel.findOne({
        "forms._id": formId,
      });
      if (!formSection) {
        throw new Error("Form not found");
      }

      const form = formSection.forms.find(
        (form) => form?._id?.toString() === formId
      );

      if (!form) {
        throw new Error("Form not found");
      }

      form.fields = data;

      await formSection.save();
      return {
        status: 200,
        success: true,
        message: "Fields reordered successfully",
        // data: formSection.forms[formIndex],
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async reorderForms(formsSectionId: string, data: IForm[]): ServiceResponse {
    try {
      const formsSection = await this.model.findById(formsSectionId);
      if (!formsSection) {
        return {
          status: 404,
          success: false,
          message: "FormsSection not found",
        };
      }

      formsSection.forms = data.map((form, index) => ({
        ...form,
        sortOrder: index + 1,
      }));

      const updatedFormsSection = await formsSection.save();

      return {
        status: 200,
        success: true,
        message: "Forms reordered successfully",
        data: updatedFormsSection.forms,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
