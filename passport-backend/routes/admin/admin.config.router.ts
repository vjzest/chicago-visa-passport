import express, { NextFunction, Request, Response } from "express";
import AdminContactInfoController from "../../controllers/admin/admin.contact-info.controller";
import AdminConfigController from "../../controllers/admin/admin.config.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const adminConfigRouter = express.Router();
const adminContactInfoController = new AdminContactInfoController();
const adminConfigController = new AdminConfigController();

adminConfigRouter.use(adminAuthMiddleware);

adminConfigRouter.get(
  "/contact-info",

  (req: Request, res: Response, next: NextFunction) =>
    adminContactInfoController.getContactInfo(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminConfigRouter.put(
  "/contact-info",

  (req: Request, res: Response, next: NextFunction) =>
    adminContactInfoController.update(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.post(
  "/online-processing-fee",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.updateOnlineProcessingFee(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.get(
  "/online-processing-fee",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getOnlineProcessingFee(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.put(
  "/gov-fee",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.updateGovFee(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.get(
  "/gov-fee",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getGovFee(req as AuthenticatedAdminRequest, res, next)
);
adminConfigRouter.put(
  "/payment-disclaimer",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.updatePaymentDisclaimer(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.get(
  "/payment-disclaimer",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getPaymentDisclaimer(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminConfigRouter.put(
  "/terms-and-conditions",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.updateTermsAndConditions(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminConfigRouter.get(
  "/terms-and-conditions",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getTermsAndConditions(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.put(
  "/privacy-policy",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.updatePrivacyPolicy(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminConfigRouter.get(
  "/privacy-policy",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getPrivacyPolicy(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.put(
  "/refund-policy",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.updateRefundPolicy(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminConfigRouter.get(
  "/refund-policy",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getRefundPolicy(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

adminConfigRouter.get(
  "/load-balancer",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getLoadBalancerSetup(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.put(
  "/load-balancer",

  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.editLoadBalancerSetup(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.get(
  "/ip-lock/status",
  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getIpLockStatus(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.patch(
  "/ip-lock/:action",
  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.toggleIpLock(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.get(
  "/departure-date-field",
  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.getDepartureDateField(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);
adminConfigRouter.patch(
  "/departure-date-field",
  (req: Request, res: Response, next: NextFunction) =>
    adminConfigController.toggleDepartureDateField(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default adminConfigRouter;
