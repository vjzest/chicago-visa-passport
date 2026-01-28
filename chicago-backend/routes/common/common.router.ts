import express, { NextFunction, Request, Response } from "express";
import CommonCasesController from "../../controllers/common/common.cases.controller";
import CommonContactController from "../../controllers/common/common.contact.controller";
import CommonServiceController from "../../controllers/common/common.servicelevels.controller";
import CommonPromoController from "../../controllers/common/common.promo.controller";
import CommonServiceTypeController from "../../controllers/common/common.servicetypes.controller";
import CommonContactInfoController from "../../controllers/common/common.contact-info.controller";
import CommonFaqController from "../../controllers/common/common.faq.controller";
import CommonTrackingController from "../../controllers/common/common.tracking.controller";
import CommonConfigController from "../../controllers/common/common.config.controller";
import CommonAdditionalController from "../../controllers/common/common.additional.controller";
import CommonShippingAddressController from "../../controllers/common/common.shipping-address.controller";
import CommonFormsController from "../../controllers/common/common.forms.controller";
import CommonBlogsController from "../../controllers/common/common.blogs.controller";
import CommonConsularFeeController from "../../controllers/common/common.consular-fee.controller";
import CommonCountryPairController from "../../controllers/common/common.country-pair.controller";
import CommonJurisdictionAddressController from "../../controllers/common/common.jurisdiction-address.controller";
import CommonPaymentLinkController from "../../controllers/common/common.payment-link.controller";

const commonRouter = express.Router();
const commonCasesController = new CommonCasesController();
const commonContactController = new CommonContactController();
const serviceController = new CommonServiceController();
const commonPromoController = new CommonPromoController();
const commonServiceTypeController = new CommonServiceTypeController();
const commonContactInfoController = new CommonContactInfoController();
const commonFaqController = new CommonFaqController();
const commonTrackingController = new CommonTrackingController();
const commonConfigController = new CommonConfigController();
const commonAdditionalController = new CommonAdditionalController();
const commonFormsController = new CommonFormsController();
const commonShippingAddressController = new CommonShippingAddressController();
const commonBlogsController = new CommonBlogsController();
const commonConsularFeeController = new CommonConsularFeeController();
const commonCountryPairController = new CommonCountryPairController();
const commonJurisdictionAddressController = new CommonJurisdictionAddressController();
const commonPaymentLinkController = new CommonPaymentLinkController();

commonRouter.post("/cases", (req: Request, res: Response, next: NextFunction) =>
  commonCasesController.create(req, res, next)
);

commonRouter.put(
  "/callback-request/:caseId",
  (req: Request, res: Response, next: NextFunction) =>
    commonCasesController.makeCallbackRequest(req, res, next)
);

commonRouter.post(
  "/check-email-used",
  (req: Request, res: Response, next: NextFunction) =>
    commonCasesController.checkIfEmailUsed(req, res, next)
);

commonRouter.get(
  "/cases/:caseId/:caseNo",
  (req: Request, res: Response, next: NextFunction) =>
    commonCasesController.getCaseByIdAndNo(req, res, next)
);

commonRouter.post(
  "/contact",
  (req: Request, res: Response, next: NextFunction) =>
    commonContactController.create(req, res, next)
);

// service level
commonRouter.get(
  "/service-levels",
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.getAllServiceLevels(req, res, next)
);
commonRouter.get(
  "/service-levels/:id",
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.findOne(req, res, next)
);

//forms
commonRouter.get(
  "/forms/:sectionId",
  (req: Request, res: Response, next: NextFunction) =>
    commonFormsController.findFormsOfASection(req, res, next)
);

// common promo code
commonRouter.get(
  "/promo/:code",
  (req: Request, res: Response, next: NextFunction) =>
    commonPromoController.findOne(req, res, next)
);

commonRouter.get(
  "/visa-types/:visaTypeId",
  (req: Request, res: Response, next: NextFunction) =>
    commonServiceTypeController.findOne(req, res, next)
);

commonRouter.get(
  "/online-processing-fee",
  (req: Request, res: Response, next: NextFunction) =>
    commonConfigController.getOnlineProcessingFee(req, res, next)
);

commonRouter.get(
  "/contact-info",
  (req: Request, res: Response, next: NextFunction) =>
    commonContactInfoController.getContactInfo(req, res, next)
);

commonRouter.get(
  "/departure-date-status",
  (req: Request, res: Response, next: NextFunction) => {
    return commonConfigController.getDepartureDateStatus(req, res, next);
  }
);

commonRouter.get("/faq", (req: Request, res: Response, next: NextFunction) =>
  commonFaqController.findActive(req, res, next)
);

commonRouter.get(
  "/track-shipments",
  (req: Request, res: Response, next: NextFunction) =>
    commonTrackingController.trackShipmentByTrackingId(req, res, next)
);

commonRouter.get(
  "/additional-services",
  (req: Request, res: Response, next: NextFunction) =>
    commonAdditionalController.getAll(req, res, next)
);
commonRouter.get(
  "/shipping-addresses",
  (req: Request, res: Response, next: NextFunction) =>
    commonShippingAddressController.getAllShippingAddress(req, res, next)
);

commonRouter.get(
  "/terms-and-conditions",
  (req: Request, res: Response, next: NextFunction) =>
    commonConfigController.getTermsAndConditions(req, res, next)
);
commonRouter.get(
  "/privacy-policy",
  (req: Request, res: Response, next: NextFunction) =>
    commonConfigController.getPrivacyPolicy(req, res, next)
);
commonRouter.get(
  "/refund-policy",
  (req: Request, res: Response, next: NextFunction) =>
    commonConfigController.getRefundPolicy(req, res, next)
);
commonRouter.get(
  "/gov-fee",
  (req: Request, res: Response, next: NextFunction) =>
    commonConfigController.getGovFee(req, res, next)
);
commonRouter.get(
  "/payment-disclaimer",
  (req: Request, res: Response, next: NextFunction) =>
    commonConfigController.getPaymentDisclaimer(req, res, next)
);

commonRouter.get(
  "/blogs",
  (req: Request, res: Response, next: NextFunction) => {
    commonBlogsController.findAll(req, res, next);
  }
);
commonRouter.get(
  "/blogs/:slug",
  (req: Request, res: Response, next: NextFunction) => {
    commonBlogsController.findOne(req, res, next);
  }
);

commonRouter.put(
  "/contingent",
  (req: Request, res: Response, next: NextFunction) => {
    return commonCasesController.createOrUpdateContingentCase(req, res, next);
  }
);

commonRouter.get(
  "/contingent/:caseId",
  (req: Request, res: Response, next: NextFunction) => {
    return commonCasesController.getContingentCase(req, res, next);
  }
);

// Consular fees endpoint
commonRouter.get(
  "/consular-fees",
  (req: Request, res: Response, next: NextFunction) => {
    return commonConsularFeeController.findByCountryCodes(req, res, next);
  }
);

// Country pairs endpoints (public)
commonRouter.get(
  "/country-pairs/enabled-from",
  (req: Request, res: Response, next: NextFunction) => {
    return commonCountryPairController.getEnabledFromCountries(req, res, next);
  }
);

commonRouter.get(
  "/country-pairs/enabled-to",
  (req: Request, res: Response, next: NextFunction) => {
    return commonCountryPairController.getEnabledToCountries(req, res, next);
  }
);

// Jurisdiction addresses endpoint (public)
commonRouter.get(
  "/jurisdiction-addresses",
  (req: Request, res: Response, next: NextFunction) => {
    return commonJurisdictionAddressController.getByCountryCodes(req, res, next);
  }
);

// Public Payment Link endpoint
commonRouter.get(
  "/payment-links/:token",
  (req: Request, res: Response, next: NextFunction) => {
    return commonPaymentLinkController.getPaymentLink(req, res, next);
  }
);

export default commonRouter;
