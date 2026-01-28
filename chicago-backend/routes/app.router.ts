/**
 * @description Router for the application
 */
import express, { NextFunction, Request, Response } from "express";
// admin
import adminCasesRouter from "./admin/admin.cases.router";
import adminAuthRouter from "./admin/admin.auth.router";
import adminFormRouter from "./admin/admin.forms.router";
import adminPromoRouter from "./admin/admin.promo.router";
import adminShippingRouter from "./admin/admin.shipping.router";
import adminServiceRouter from "./admin/admin.service-level.router";
import adminFaqRouter from "./admin/admin.faq.router";
import adminFedexConfigRouter from "./admin/admin.fedex.router";
import adminStatusRouter from "./admin/admin.statuses.router";
import adminRolesRouter from "./admin/admin.roles.router";
// user
import userAuthRouter from "./user/user.auth.router";
import userTransactionRouter from "./user/user.transactions.router";
import userPassportFormRouter from "./user/user.passport.form.router";
import userPaymentLinkRouter from "./user/user.payment-link.router";
// common
import commonRouter from "./common/common.router";
import paymentRoutes from "./admin/nmi.payment.router";

import CustomError from "../utils/classes/custom-error";
import { errorMiddleware } from "../middlewares/error.middleware";
import adminAdminsRouter from "./admin/admin.admins.router";
import adminServiceTypeRouter from "./admin/admin.service-types.router";
import userAddressesRouter from "./user/user.addresses.router";
import userAccountRouter from "./user/user.account.router";
import userServiceTypeRouter from "./user/user.servicetypes.router";
import userCaseRouter from "./user/user.case.router";
import adminProcessorsRouter from "./admin/admin.processors.router";
import adminLogsRouter from "./admin/admin.logs.router";
import adminReportsRouter from "./admin/admin.reports.router";
import adminMailRouter from "./admin/admin.mail.router";
import adminTransactionsRouter from "./admin/admin.transactions.router";
import adminConfigRouter from "./admin/admin.config.router";
import adminAdditionalServiceRouter from "./admin/admin.additional.router";
import userServiceLevelRouter from "./user/user.servicelevel.router";
import adminLoaRouter from "./admin/admin.loa.router";
import adminContingentRouter from "./admin/admin.contingent-cases.router";
import { webhookRouter } from "./common/webooks.router";
import adminBlogsRouter from "./admin/admin.blogs.router";
import adminQueriesRouter from "./admin/admin.queries.router";
import adminFilesRouter from "./admin/admin.files.router";
import adminFedexPackagesRouter from "./admin/admin.fedex-packages.router";
import adminManifestRoutes from "./admin/admin.manifest.routes";
import adminCountryAccessRouter from "./admin/admin.country-access.router";
import adminCountryPairRouter from "./admin/admin.country-pair.router";
import adminConsularFeeRouter from "./admin/admin.consular-fee.router";
import adminJurisdictionAddressRouter from "./admin/admin.jurisdiction-address.router";
import adminJurisdictionRouter from "./admin/admin.jurisdiction.router";
import adminContentRouter from "./admin/admin.contentRoutes";
import adminPaymentLinkRouter from "./admin/admin.payment-link.router";
import adminSSORouter from "./admin/admin.sso.router";

const appRouter = express.Router();

appRouter.use("/admin/logs", adminLogsRouter);
// ...
appRouter.use("/content", adminContentRouter);
appRouter.use("/admin/content", adminContentRouter);
appRouter.use("/admin/payment-link", adminPaymentLinkRouter);
appRouter.use("/admin/cases", adminCasesRouter);
appRouter.use("/admin/queries", adminQueriesRouter);
appRouter.use("/admin/contingent-cases", adminContingentRouter);
appRouter.use("/admin/auth", adminAuthRouter);
appRouter.use("/admin/roles", adminRolesRouter);
appRouter.use("/admin/admins", adminAdminsRouter);
appRouter.use("/admin/forms", adminFormRouter);
appRouter.use("/admin/faq", adminFaqRouter);
appRouter.use("/admin/promo", adminPromoRouter);
appRouter.use("/admin/shippings", adminShippingRouter);
appRouter.use("/admin/statuses", adminStatusRouter);
appRouter.use("/admin/service-levels", adminServiceRouter);
appRouter.use("/admin/processors", adminProcessorsRouter);
appRouter.use("/admin/files", adminFilesRouter);
appRouter.use("/admin/email", adminMailRouter);
appRouter.use("/admin/additional-services", adminAdditionalServiceRouter);
// fedex configurations
appRouter.use("/admin/configs", adminConfigRouter);
appRouter.use("/admin/configs", adminFedexConfigRouter);
appRouter.use("/admin/loa", adminLoaRouter);
appRouter.use("/admin/service-types", adminServiceTypeRouter);
appRouter.use("/admin/reports", adminReportsRouter);
appRouter.use("/admin/blogs", adminBlogsRouter);
appRouter.use("/admin/transactions", adminTransactionsRouter);
appRouter.use("/admin/payment", paymentRoutes);
appRouter.use("/admin/fedex-packages", adminFedexPackagesRouter);
appRouter.use("/admin/manifest", adminManifestRoutes);
appRouter.use("/admin/country-access", adminCountryAccessRouter);
appRouter.use("/admin/country-pairs", adminCountryPairRouter);
appRouter.use("/admin/consular-fees", adminConsularFeeRouter);
appRouter.use("/admin/jurisdictions", adminJurisdictionRouter);
appRouter.use("/admin/jurisdiction-addresses", adminJurisdictionAddressRouter);
appRouter.use("/admin/sso", adminSSORouter);


// users
appRouter.use("/user/auth", userAuthRouter);
appRouter.use("/user/addresses", userAddressesRouter);
appRouter.use("/user/account", userAccountRouter);
appRouter.use("/user/case", userCaseRouter);
appRouter.use("/user/service-types", userServiceTypeRouter);
appRouter.use("/user/service-levels", userServiceLevelRouter);
appRouter.use("/user/transactions", userTransactionRouter);
appRouter.use("/user/passport-form", userPassportFormRouter);
appRouter.use("/user/payment-links", userPaymentLinkRouter);

//common
appRouter.use("/common", commonRouter);
appRouter.use("/webhooks", webhookRouter);

appRouter.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) =>
    errorMiddleware(error, req, res, next),
);

export default appRouter;
