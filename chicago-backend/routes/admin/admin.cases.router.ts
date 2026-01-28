import express, { NextFunction, Request, Response } from "express";
import AdminCasesController from "../../controllers/admin/admin.cases.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";
import upload from "../../utils/multer";

const adminCasesRouter = express.Router();
const adminCasesController = new AdminCasesController();
adminCasesRouter.use(adminAuthMiddleware);

adminCasesRouter.get(
  "/",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.findAll(req as AuthenticatedAdminRequest, res, next)
);

adminCasesRouter.get(
  "/group-by-accounts",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.groupByAccounts(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.get(
  "/duplicate-cases",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.fetchDuplicateCases(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.get(
  "/duplicate-cases/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.fetchDuplicateCaseById(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.post(
  "/:caseId/confirm-duplicate",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.confirmDuplicate(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.post(
  "/:caseId/courier-note",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.createCourierNote(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.post(
  "/:caseId/mark-as-not-duplicate",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.markAsNotDuplicate(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.get(
  "/new",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.findAllNew(req as AuthenticatedAdminRequest, res, next)
);

adminCasesRouter.get(
  "/caseId/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.findOne(req as AuthenticatedAdminRequest, res, next)
);

adminCasesRouter.get(
  "/required-documents/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.getRequiredDocuments(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.put(
  "/caseId/:caseId",

  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.updateCaseInfo(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.post(
  "/filter-all-cases",

  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.filterAll(req as AuthenticatedAdminRequest, res, next);
  }
);
adminCasesRouter.get(
  "/filter",

  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.filter(req as AuthenticatedAdminRequest, res, next);
  }
);
adminCasesRouter.patch(
  "/caseId/:caseId/open",

  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.markCaseAsOpened(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);
adminCasesRouter.patch(
  "/:caseId",

  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.patchCase(req as AuthenticatedAdminRequest, res, next);
  }
);
adminCasesRouter.patch(
  "/cancel/:caseId",

  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.cancelCase(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.post(
  "/:caseId/send-message",

  (req: Request, res: Response, next: NextFunction) => {
    return adminCasesController.sendMessage(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.get(
  "/:caseId/messages",

  (req: Request, res: Response, next: NextFunction) => {
    return adminCasesController.getAllMessages(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);
adminCasesRouter.get(
  "/userId/:userId",

  (req: Request, res: Response, next: NextFunction) => {
    return adminCasesController.findByUserId(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.get(
  "/case-emails/track-email-events",
  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.trackCaseEmailEvents(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.get(
  "/case-emails/:caseId",

  (req: Request, res: Response, next: NextFunction) => {
    return adminCasesController.getAllEmailRecords(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.put(
  "/bulk-update/case-manager",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.bulkUpdateCaseManager(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.put(
  "/bulk-update/status",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.bulkUpdateStatus(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.put(
  "/note/:caseId/:noteId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.updateNote(req as AuthenticatedAdminRequest, res, next)
);
adminCasesRouter.delete(
  "/note/:caseId/:noteId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.deleteNote(req as AuthenticatedAdminRequest, res, next)
);
adminCasesRouter.put(
  "/courier-note/:caseId/:noteId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.updateCourierNote(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.delete(
  "/courier-note/:caseId/:noteId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.deleteCourierNote(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.patch(
  "/confirm-inbound-shipment/:caseId",

  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.confirmInboundShipment(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.put(
  "/approve-documents/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.approveDocuments(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.put(
  "/reject-documents/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.rejectDocuments(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.put(
  "/expert-review/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.sendToExpertReview(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.put(
  "/revert-documents/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.revertDocuments(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.get(
  "/passport-application/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.getPassportApplication(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.put(
  "/upload-passport-application/:caseId",
  upload.single("form"),

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.uploadPassportApplication(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.put(
  "/approve-passport-application/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.approvePassportApplication(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.put(
  "/reject-passport-application/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.rejectPassportApplication(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminCasesRouter.put(
  "/revert-passport-application/:caseId",

  (req: Request, res: Response, next: NextFunction) =>
    adminCasesController.revertPassportApplication(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminCasesRouter.post(
  "/charge-customer-manually",
  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.chargeCustomerManually(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.patch(
  "/send-testimonial-request/:caseId",
  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.sendTestimonialRequest(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.patch(
  "/charge-for-order/:caseId",
  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.chargeForOrder(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.patch(
  "/case-account/change-email",
  (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.changeAccountEmail(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.post(
  "/caseId/:caseId/custom-email",
  async (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.sendEmailToClient(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

adminCasesRouter.patch(
  "/caseId/:caseId/toggle-auto-emails",
  async (req: Request, res: Response, next: NextFunction) => {
    adminCasesController.toggleAutoEmails(
      req as AuthenticatedAdminRequest,
      res,
      next
    );
  }
);

export default adminCasesRouter;
