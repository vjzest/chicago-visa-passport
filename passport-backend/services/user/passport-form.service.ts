import axios from "axios";
import { CasesModel } from "../../models/cases.model";
import { PassportFormsModel } from "../../models/passport.form.model";
import { ServiceResponse } from "../../types/service-response.type";
import { camelCaseToNormalCase } from "../../utils/text.utils";
import mongoose from "mongoose";
import ENV from "../../utils/lib/env.config";
import { FormFillProcessesModel } from "../../models/form-fill-process.model";
import { updateCaseStatus } from "../../utils/status";
import { ConfigModel } from "../../models/config.model";

interface PassportForm {
  userId?: string;
  caseId?: string;
  personalInfo?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    changingGenderMarker?: boolean;
    placeOfBirth?: string;
    socialSecurityNumber?: string;
    allPreviousNames?: string[];
    occupation?: string;
    employerOrSchool?: string;
  };
  contactInfo?: {
    emailAddress?: string;
    phoneNumber?: string;
    additionalPhoneNumber?: string;
    additionalPhoneNumberType?: string;
  };
  emergencyContact?: {
    emergencyContactName?: string;
    street?: string;
    apartmentOrUnit?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
  };
  physicalDescription?: {
    height?: {
      feet?: string;
      inches?: string;
    };
    weight?: number;
    eyeColor?: string;
    hairColor?: string;
  };
  marriageInfo?: {
    isMarried?: boolean;
    marriageDetails?: {
      spouseFirstName?: string;
      spouseLastName?: string;
      marriageDate?: string;
      spousePlaceOfBirth?: string;
      spouseIsUSCitizen?: boolean;
      isWidowedOrDivorced?: string;
      widowOrDivorceDate?: string;
    };
  };
  parentInfo?: {
    parent1?: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      placeOfBirth?: string;
      gender?: string;
      isUSCitizen?: boolean;
    };
    parent2?: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      placeOfBirth?: string;
      gender?: string;
      isUSCitizen?: boolean;
    };
  };
  addressInfo?: {
    mailingAddress?: string;
    mailingAddressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  permanentAddress?: {
    permanentAddress?: string;
    country?: string;
    street?: string;
    apartmentOrUnit?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  passportHistory?: {
    hasPassportCardOrBook?: string;
    passportCardDetails?: {
      printedName?: string;
      number?: string;
      issueDate?: string;
      status?: string;
    };
    passportBookDetails?: {
      printedName?: string;
      number?: string;
      issueDate?: string;
      status?: string;
    };
  };
  travelPlans?: {
    travelDate?: string;
    returnDate?: string;
    travelDestinations?: string;
  };
  [key: string]: any;
}

interface ChangeRecord {
  note: string;
  createdAt: Date;
}

export default class PassportFormService {
  private readonly model = PassportFormsModel;
  private readonly configModel = ConfigModel;
  private readonly casesModel = CasesModel;
  private readonly formFillProcessesModel = FormFillProcessesModel;

  async create(
    userId: string,
    sectionData: any,
    caseId: string
  ): Promise<ServiceResponse> {
    try {
      const sectionName = Object.keys(sectionData)?.[0];

      let passportForm = (await this.model.findOne({
        userId,
        caseId,
      })) as PassportForm | null;

      if (!passportForm) {
        passportForm = new this.model({ userId, caseId }) as PassportForm;
      }

      const existingData = passportForm[sectionName];

      // Check for changes and log them if there are updates
      const changesByField = this.findChanges(
        existingData,
        sectionData[sectionName],
        sectionName
      );

      passportForm[sectionName] = {
        ...existingData,
        ...sectionData[sectionName],
        isComplete: true,
      };
      const caseDoc = await this.casesModel.findById(caseId);
      if (!caseDoc) {
        return {
          success: false,
          status: 404,
          message: "Case not found",
        };
      }
      if (changesByField.length > 0) {
        //@ts-ignore
        caseDoc.passportFormLogs = [
          ...caseDoc.passportFormLogs,
          ...changesByField,
        ];
        await caseDoc.save();
      }
      // Save the document
      await passportForm.save();
      return {
        success: true,
        status: 201,
        data: passportForm,
        message: `${sectionName} updated successfully`,
      };
    } catch (error) {
      console.error(`Error storing/updating data:`, error);
      return { success: false, status: 500, message: `Error updating` };
    }
  }
  /**
   * Pass userId as second argument if its for user
   */
  async getPassportForm(
    caseId: string,
    userId?: string
  ): Promise<ServiceResponse> {
    try {
      const query: { caseId: string; userId?: string | undefined } = { caseId };
      if (userId) {
        query["userId"] = userId.toString();
      }
      const passportForm = (await this.model
        .findOne(query)
        .populate("caseId")) as PassportForm | null;
      if (!passportForm) {
        return {
          success: false,
          status: 404,
          message: "Passport form not found",
        };
      }

      return {
        success: true,
        status: 200,
        message: "Passport form retrieved successfully",
        data: passportForm,
      };
    } catch (error) {
      console.error("Error retrieving passport form:", error);
      return {
        success: false,
        status: 500,
        message: "Error retrieving passport form",
      };
    }
  }

  ///

  async getCompletionPercentage(
    userId: string,
    caseId: string
  ): Promise<ServiceResponse> {
    try {
      const passportForm = (await this.model.findOne({
        userId,
        caseId,
      })) as PassportForm | null;

      if (!passportForm) {
        return {
          success: false,
          status: 404,
          message: "Passport form not found",
        };
      }

      const sections = [
        "personalInfo",
        "contactInfo",
        "emergencyContact",
        // "parentAndMarriageInfo",
        "passportHistory",
        "travelPlans",
        "productInfo",
      ];

      let completedSections = 0;
      let totalSections = sections.length;

      sections.forEach((section) => {
        if (passportForm[section] && passportForm[section].isComplete) {
          completedSections++;
        }
      });

      const completionPercentage = (completedSections / totalSections) * 100;

      return {
        success: true,
        status: 200,
        message: "Completion percentage calculated successfully",
        data: {
          completionPercentage: Math.round(completionPercentage),
          completedSections,
          totalSections,
        },
      };
    } catch (error) {
      console.error("Error calculating completion percentage:", error);
      return {
        success: false,
        status: 500,
        message: "Error calculating completion percentage",
      };
    }
  }
  async findOne(userId: string, caseId: string): Promise<ServiceResponse> {
    try {
      const passportForm = (await this.model
        .findOne({
          userId,
          caseId,
        })
        .populate("caseId")) as PassportForm | null;
      return {
        success: true,
        status: 200,
        message: "fetched successfully",
        data: passportForm,
      };
    } catch (error) {
      console.error("Error calculating completion percentage:", error);
      return {
        success: false,
        status: 500,
        message: "Error calculating completion percentage",
      };
    }
  }

  async getFormFillStatus(userId: string, caseId: string): ServiceResponse {
    try {
      const passportForm = await this.model.findOne({ caseId });
      if (!passportForm) {
        return {
          success: false,
          status: 404,
          message: "Passport form not found",
        };
      }
      const formFillProcess = await this.formFillProcessesModel.findOne({
        case: caseId,
      });
      if (!formFillProcess) {
        return {
          success: false,
          status: 404,
          message: "Form fill process not found",
        };
      }
      return {
        success: true,
        status: 200,
        message: "Form fill process retrieved successfully",
        data: formFillProcess,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async fillGovForm(caseId: string): ServiceResponse {
    try {
      const passportForm = await this.model.findOne({ caseId });
      if (!passportForm) {
        return {
          success: false,
          status: 404,
          message: "Passport form not found",
        };
      }
      const transformedDoc = await this.convertMongooseToCustomFormat(
        passportForm
      );
      8;

      console.log("-------Fill request sent---------");
      const { data } = (await axios.post(ENV.FORM_FILLER_URL!, transformedDoc, {
        //increasse timeout
        timeout: 100000,
      })) as {
        data: { message: string; success: boolean };
      };
      console.log("-------Fill response---------");
      if (!data.success) throw new Error("Failed to fill form");
      const formFillProcess = await this.formFillProcessesModel.findOne({
        case: caseId,
      });
      if (!formFillProcess) {
        await this.formFillProcessesModel.create({
          case: caseId,
          formId: passportForm._id.toString(),
          status: "pending",
        });
      } else if (formFillProcess?.status === "pending") {
        return {
          success: false,
          status: 400,
          message:
            "Passport form generation is already pending. Check back later to view.",
        };
      }
      await this.formFillProcessesModel.updateOne(
        {
          case: caseId,
        },
        {
          $set: {
            status: "pending",
            errorMessage: "",
          },
        }
      );
      await updateCaseStatus(
        passportForm.caseId!,
        "passport-application-review",
        1
      );

      return {
        success: true,
        status: 200,
        message: "Passport form generation started successfully",
        data: data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async receiveFormSuccess(
    passportFormId: string,
    dataBody: {
      success: boolean;
      message: string;
      result: {
        document_id: string;
        s3_link: string;
      };
    }
  ): ServiceResponse {
    try {
      console.log("webhook fired");
      console.log(dataBody);
      const config = (await this.configModel.findOne({}))!;
      if (passportFormId === "test-application") {
        config.pptFormAvailable = dataBody.success ? true : false;
        await config?.save();
        return {
          success: true,
          status: 200,
          message: "Result received",
        };
      }
      const passportForm = await this.model.findOne({ _id: passportFormId });
      if (!passportForm) {
        return {
          success: false,
          status: 404,
          message: "Passport form not found",
        };
      }
      if (!dataBody.success) {
        console.log("set failure");
        await this.formFillProcessesModel.updateOne(
          {
            formId: passportFormId,
          },
          {
            $set: {
              status: "failed",
              errorMessage: dataBody.message,
            },
          }
        );
        await this.casesModel.updateOne(
          {
            _id: passportForm?.caseId,
          },
          {
            $set: {
              applicationReviewStatus: "upload",
            },
          }
        );
        return {
          success: true,
          status: 200,
          message: "Result received",
        };
      }
      if (!dataBody?.result?.s3_link) {
        await this.formFillProcessesModel.updateOne(
          {
            formId: passportFormId,
          },
          {
            $set: {
              status: "failed",
              errorMessage: "Failed due to server error",
            },
          }
        );
        await this.casesModel.updateOne(
          {
            _id: passportForm?.caseId,
          },
          {
            $set: {
              applicationReviewStatus: "upload",
            },
          }
        );
        return {
          success: true,
          status: 200,
          message: "Result received",
        };
      }
      await this.formFillProcessesModel.updateOne(
        {
          formId: passportFormId,
        },
        {
          $set: {
            status: "success",
            errorMessage: "",
          },
        }
      );

      await this.casesModel.updateOne(
        {
          _id: passportForm.caseId,
        },
        {
          $set: {
            passportFormUrl: dataBody?.result?.s3_link,
            applicationReviewStatus: "ongoing",
          },
        }
      );
      console.log("--------------------");
      console.log("                      ");
      console.log("Form recived for passportFormId: ", passportFormId);
      console.log("body: ", dataBody);
      console.log("                      ");
      console.log("--------------------");
      return {
        success: true,
        status: 200,
        message: "Form received successfully",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private convertMongooseToCustomFormat(document: mongoose.Document) {
    // Convert the Mongoose document to a plain JavaScript object
    let obj = document.toObject();

    // Function to recursively transform the object
    function transform(item: any) {
      if (item && typeof item === "object") {
        if (item instanceof mongoose.Types.ObjectId) {
          return { $oid: item.toString() };
        }
        if (item instanceof Date) {
          return { $date: item.toISOString() };
        }
        Object.keys(item).forEach((key) => {
          item[key] = transform(item[key]);
        });
      }
      return item;
    }

    // Apply the transformation
    return transform(obj);
  }

  // Function to find changes between old and new data
  private findChanges(
    oldData: any,
    newData: any,
    sectionName: string,
    parentPath: string = ""
  ): ChangeRecord[] {
    const changes: ChangeRecord[] = [];

    // Handle null/undefined cases for entire objects
    if (!oldData && !newData) return changes;
    // if (!oldData) {
    //   return [
    //     {
    //       note: `Added ${sectionName.toUpperCase()} with values ${JSON.stringify(
    //         newData
    //       )}`,
    //       createdAt: new Date(),
    //     },
    //   ];
    // }
    if (!newData) return changes;

    // Process each key in newData
    for (const key in newData) {
      const currentPath = parentPath ? `${parentPath} : ${key}` : key;
      const oldValue = oldData?.[key];
      const newValue = newData?.[key];

      // Skip if both values are null/undefined/empty string
      if (!oldValue && !newValue) continue;

      // Handle nested objects
      if (
        newValue &&
        typeof newValue === "object" &&
        !Array.isArray(newValue) &&
        !(newValue instanceof Date)
      ) {
        const nestedChanges = this.findChanges(
          oldValue,
          newValue,
          sectionName,
          currentPath
        );
        changes.push(...nestedChanges);
        continue;
      }

      // Handle arrays (comparing stringified versions to check value equality)
      if (Array.isArray(newValue)) {
        const oldStr = JSON.stringify(oldValue || []);
        const newStr = JSON.stringify(newValue);
        if (oldStr !== newStr) {
          changes.push({
            note: `${sectionName.toUpperCase()} : Changed field [${camelCaseToNormalCase(
              currentPath
            )}] from ${oldStr} to ${newStr}`,
            createdAt: new Date(),
          });
        }
        continue;
      }

      // Handle date fields
      const dateFields = new Set([
        "dateOfBirth",
        "issueDate",
        "travelDate",
        "returnDate",
      ]);

      if (dateFields.has(key)) {
        const oldDate = oldValue
          ? new Date(oldValue).toISOString().split("T")[0]
          : null;
        const newDate = newValue
          ? new Date(newValue).toISOString().split("T")[0]
          : null;

        if (oldDate !== newDate) {
          changes.push({
            note: oldDate
              ? `${sectionName.toUpperCase()} : Changed field [${camelCaseToNormalCase(
                  currentPath
                )}] from '${oldDate}' to '${newDate}'`
              : `${sectionName.toUpperCase()} : Added field [${camelCaseToNormalCase(
                  currentPath
                )}] as '${newDate}'`,
            createdAt: new Date(),
          });
        }
        continue;
      }

      // Handle regular value changes
      if (oldValue !== newValue) {
        changes.push({
          note:
            !oldValue || oldValue === "" || oldValue === null
              ? `${sectionName.toUpperCase()} : Added field [${camelCaseToNormalCase(
                  currentPath
                )}] as '${newValue}'`
              : `${sectionName.toUpperCase()} : Changed field [${camelCaseToNormalCase(
                  currentPath
                )}] from '${oldValue}' to '${newValue}'`,
          createdAt: new Date(),
        });
      }
    }

    return changes;
  }
}
