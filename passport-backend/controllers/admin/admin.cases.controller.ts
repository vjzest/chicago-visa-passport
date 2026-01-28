import CasesQueryService from "../../services/admin/cases-query.service";
import CasesDuplicationService from "../../services/admin/cases-duplication.service";
import CasesUpdationService from "../../services/admin/cases-updation.service";
import CasesPPTDocService from "../../services/admin/cases-ppt-doc.service";
import { Response, NextFunction } from "express";
import PassportFormService from "../../services/user/passport-form.service";
import CustomError from "../../utils/classes/custom-error";
import { AuthenticatedAdminRequest } from "../../middlewares/auth.middleware";
import AdminCasesService from "../../services/admin/cases.service";
import CommonCasesService from "../../services/common/cases.service";

export default class AdminCasesController {
  private adminCasesService = new AdminCasesService();
  private commonCasesService = new CommonCasesService();
  private casesQueryService = new CasesQueryService();
  private casesDuplicationService = new CasesDuplicationService();
  private casesUpdationService = new CasesUpdationService();
  private casesPPTDocService = new CasesPPTDocService();
  private readonly passportFormService = new PassportFormService();

  async findAll(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, pageSize, statusId } = req.query;
      const adminId = req.admin?.role?.viewCases.seeOnlyAssignedCases
        ? req.admin?._id
        : "";
      if (
        statusId &&
        !req.admin.role.viewCasesByStatus.get(statusId as string)
      ) {
        throw new Error("You are not authorized to view cases in this status");
      }
      const response = await this.casesQueryService.findAll({
        statusId: String(statusId!),
        caseManagerId: adminId,
        userRoleViewAccess: req.admin?.role?.viewCaseDetails!,
        page: Number(page),
        pageSize: Number(pageSize),
        locationAccess: req.admin.role.viewCasesByLocation,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async groupByAccounts(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, statusId } = req.query;
      const adminId = req.admin?.role?.viewCases.seeOnlyAssignedCases
        ? req.admin?._id
        : "";
      const response = await this.casesQueryService.groupByAccounts(
        String(statusId!),
        adminId,
        Number(page)
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async fetchDuplicateCases(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.casesDuplicationService.fetchDuplicateCases(
        {}
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async fetchDuplicateCaseById(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;

      const response =
        await this.casesDuplicationService.fetchDuplicateCaseById(caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async confirmDuplicate(req: any, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const { relatedCaseIds } = req.body;
      // const adminId = req.admin?.role?.showOnlyAssignedCases ? req.admin?._id : ""; //ATTENTION
      const adminId = req.admin?._id;
      const response = await this.casesDuplicationService.confirmDuplicate(
        caseId,
        relatedCaseIds,
        adminId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async markAsNotDuplicate(req: any, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      // const adminId = req.admin?.role?.showOnlyAssignedCases ? req.admin?._id : ""; //ATTENTION
      const adminId = req.admin?._id;
      const response = await this.casesDuplicationService.markAsNotDuplicate(
        caseId,
        adminId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findAllNew(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await this.casesQueryService.findAllNew();
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findOne(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const response = await this.casesQueryService.findOne(
        caseId,
        req.admin.role.viewCaseDetails,
        req.admin.role.viewCasesByStatus,
        req.admin.role.viewCasesByLocation
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async findByUserId(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const response = await this.casesQueryService.findByUserId(userId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async updateCaseInfo(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const admin = req.admin;

      const response = await this.casesUpdationService.updateCaseInfo(
        admin?._id,
        caseId,
        req.body
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async createCourierNote(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courierNote } = req.body;
      const { caseId } = req.params;
      const adminId = req.admin?._id;
      if (!courierNote) {
        return res
          .status(400)
          .json({ message: "note field missing", success: false });
      }

      const response = await this.casesUpdationService.createCourierNote(
        adminId,
        caseId,
        courierNote
      );
      res.status(response.status).json(response);
      res.end();
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }

  async filterAll(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        startDate,
        endDate,
        startTime,
        endTime,
        lastFourOfCC,
        email,
        phone,
        fullName,
        caseId,
        applicantName,
        statuses,
        processingLocations,
      } = req.body;
      const response = await this.casesQueryService.filterAllCases({
        startDate: startDate?.toString() || "",
        startTime: startTime?.toString() || "",
        endDate: endDate?.toString() || "",
        endTime: endTime?.toString() || "",
        lastFourOfCC: lastFourOfCC?.toString() || "",
        email: email?.toString() || "",
        phone: phone?.toString() || "",
        fullName: fullName?.toString() || "",
        caseId: caseId?.toString() || "",
        applicantName: applicantName?.toString() || "",
        statuses: statuses,
        processingLocations: processingLocations,
        onlyAssigned: req.admin.role.viewCases.seeOnlyAssignedCases,
        adminId: req.admin._id,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async filter(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        startDate,
        endDate,
        startTime,
        endTime,
        lastFourOfCC,
        email,
        phone,
        fullName,
        caseId,
        applicantName,
        statusId,
        page,
        pageSize,
      } = req.query;
      const response = await this.casesQueryService.filter({
        startDate: startDate?.toString() || "",
        startTime: startTime?.toString() || "",
        endDate: endDate?.toString() || "",
        endTime: endTime?.toString() || "",
        lastFourOfCC: lastFourOfCC?.toString() || "",
        email: email?.toString() || "",
        phone: phone?.toString() || "",
        fullName: fullName?.toString() || "",
        caseId: caseId?.toString() || "",
        applicantName: applicantName?.toString() || "",
        statusId: statusId?.toString() || "",
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 1,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async markCaseAsOpened(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const response = await this.casesUpdationService.markCaseAsOpened(caseId);

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  // to patch case data
  async patchCase(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const admin = req.admin;
      const { formKey, fieldKey, value } = req.body;
      if (!formKey || !fieldKey || !value)
        throw new Error("formKey, fieldKey and value are required");
      const response = await this.casesUpdationService.patchCase(
        admin?._id,
        caseId,
        formKey,
        fieldKey,
        value
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  // cancel case
  async cancelCase(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const { reason } = req.body;
      const admin = req.admin;

      if (!caseId) throw new Error("caseId is missing");
      const response = await this.casesUpdationService.cancelCase(
        admin?._id,
        caseId,
        reason
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getAllMessages(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const caseResponse = await this.casesQueryService.findOne(
        caseId,
        req.admin?.role.viewCaseDetails!
      );
      const userId = caseResponse.data?.caseData?.account?._id;
      const response = await this.casesQueryService.getAllMessages(userId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async sendMessage(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const { message } = req.body;
      console.log("admin message:", message);
      const response = await this.casesUpdationService.sendMessage({
        message,
        caseId,
        senderType: "admin",
        adminId: req.admin?._id,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async getRequiredDocuments(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const response = await this.commonCasesService.getRequiredDocuments(
        caseId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async bulkUpdateCaseManager(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseIds, caseManagerId } = req.body;
      const response = await this.casesUpdationService.bulkUpdateCaseManager(
        caseIds,
        caseManagerId,
        req.admin?.firstName + " " + req.admin?.lastName
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async bulkUpdateStatus(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseIds, statusId } = req.body;
      const response = await this.casesUpdationService.bulkUpdateStatus(
        caseIds,
        statusId,
        req.admin?.firstName + " " + req.admin?.lastName
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async updateNote(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId, noteId } = req.params;
      const { note } = req.body;
      const response = await this.casesUpdationService.updateNote(
        caseId,
        noteId,
        note
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async deleteNote(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId, noteId } = req.params;
      const response = await this.casesUpdationService.deleteNote(
        caseId,
        noteId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async updateCourierNote(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId, noteId } = req.params;
      const { note } = req.body;
      const response = await this.casesUpdationService.updateCourierNote(
        caseId,
        noteId,
        note
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async deleteCourierNote(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId, noteId } = req.params;
      const response = await this.casesUpdationService.deleteCourierNote(
        caseId,
        noteId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async approveDocuments(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;
      const response = await this.casesPPTDocService.approveDocuments(
        admin?._id,
        caseId
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async sendToExpertReview(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;
      const response = await this.casesPPTDocService.sendToExpertReview(
        admin?._id,
        caseId
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async revertDocuments(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;
      const { status } = req.body;
      const response = await this.casesPPTDocService.revertDocuments(
        admin?._id,
        caseId,
        status
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async rejectDocuments(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;
      const { verification, message } = req.body;

      const response = await this.casesPPTDocService.rejectDocuments(
        admin?._id,
        caseId,
        verification,
        message
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async confirmInboundShipment(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;
      const response = await this.casesUpdationService.confirmInboundShipment(
        caseId,
        admin?._id
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async rejectPassportApplication(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;
      const { message } = req.body;

      const response = await this.casesPPTDocService.rejectPassportApplication(
        admin?._id,
        caseId,
        message
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async uploadPassportApplication(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;
      const form = req.file as Express.Multer.File;
      const { formType } = req.body;
      const response = await this.casesPPTDocService.uploadPassportApplication(
        admin?._id,
        caseId,
        {
          form,
          formType: formType as "DS11" | "DS82" | "DS11_DS64",
        }
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
  async approvePassportApplication(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;

      const response = await this.casesPPTDocService.approvePassportApplication(
        admin?._id,
        caseId
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async revertPassportApplication(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const admin = req.admin;
      const { caseId } = req.params;
      const { status } = req.body;

      const response = await this.casesPPTDocService.revertPassportApplication(
        admin?._id,
        caseId,
        status
      );

      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  getPassportApplication = async (
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { caseId } = req.params;
      const response = await this.passportFormService.getPassportForm(caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  };

  async getAllEmailRecords(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const response = await this.commonCasesService.getAllEmailRecords(caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  //charge customer manually
  async chargeCustomerManually(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId, transaction } = req.body;
      if (!caseId) throw new Error("case ID required");
      const result = await this.adminCasesService.chargeCustomerManually(
        caseId,
        transaction,
        req.admin.firstName + " " + req.admin.lastName
      );
      res.status(result.status).json(result);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async trackCaseEmailEvents(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { trackingId } = req.query;
      console.log("tracking id : ", trackingId);
      const response = await this.adminCasesService.trackCaseEmailEvents(
        String(trackingId)
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async sendTestimonialRequest(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      console.log("case id ; ", caseId);
      if (!caseId) throw new Error("case ID required");
      const response = await this.adminCasesService.sendTestimonialRequest(
        caseId,
        req.admin.firstName + " " + req.admin.lastName
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async chargeForOrder(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const {
        serviceType,
        processor,
        serviceLevel,
        additionalServices,
        billingInfo,
      } = req.body as {
        serviceType: string;
        serviceLevel: string;
        processor: string;
        additionalServices: {
          service: string;
          addons: string[];
        }[];
        billingInfo: {
          cardHolderName: string;
          cardNumber: string;
          expirationDate: string;
          cardVerificationCode: string;
        };
      };
      if (!caseId) throw new Error("case ID required");
      const response = await this.adminCasesService.chargeForOrder(
        caseId,
        {
          serviceLevel,
          serviceType,
          additionalServices,
          billingInfo,
          processor,
        },
        req.admin.firstName + " " + req.admin.lastName
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async changeAccountEmail(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { newEmail, oldEmail } = req.body;
      const response = await this.adminCasesService.changeAccountEmail({
        newEmail,
        oldEmail,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async sendEmailToClient(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const { content, subject, cc } = req.body as {
        content: string;
        subject: string;
        cc: string[];
      };
      const response = await this.adminCasesService.sendEmailToClient({
        caseId,
        data: {
          message: content,
          subject,
          cc,
        },
        adminName: req.admin.firstName + " " + req.admin.lastName,
      });
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async toggleAutoEmails(
    req: AuthenticatedAdminRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { caseId } = req.params;
      const response = await this.adminCasesService.toggleAutoEmails(caseId);
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
