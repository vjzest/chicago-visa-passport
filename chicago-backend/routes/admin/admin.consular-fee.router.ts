import { Router, Request, Response, NextFunction } from "express";
import AdminConsularFeeController from "../../controllers/admin/admin.consular-fee.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const router = Router();
const consularFeeController = new AdminConsularFeeController();

// Apply admin authentication middleware to all routes
router.use(adminAuthMiddleware);

/**
 * @route   GET /api/admin/consular-fees/country-pair/:countryPairId
 * @desc    Get all fees for a country pair
 * @access  Admin
 */
router.get(
  "/country-pair/:countryPairId",
  (req: Request, res: Response, next: NextFunction) =>
    consularFeeController.findByCountryPair(req, res, next)
);

/**
 * @route   GET /api/admin/consular-fees/country-pair/:countryPairId/grouped
 * @desc    Get fees grouped by service level
 * @access  Admin
 */
router.get(
  "/country-pair/:countryPairId/grouped",
  (req: Request, res: Response, next: NextFunction) =>
    consularFeeController.findGroupedByServiceLevel(req, res, next)
);

/**
 * @route   GET /api/admin/consular-fees/country-pair/:countryPairId/service-level/:serviceLevelId
 * @desc    Get fees for a specific service level
 * @access  Admin
 */
router.get(
  "/country-pair/:countryPairId/service-level/:serviceLevelId",
  (req: Request, res: Response, next: NextFunction) =>
    consularFeeController.findByServiceLevel(req, res, next)
);

/**
 * @route   POST /api/admin/consular-fees
 * @desc    Upsert a single fee
 * @access  Admin
 */
router.post("/", (req: Request, res: Response, next: NextFunction) =>
  consularFeeController.upsert(req as AuthenticatedAdminRequest, res, next)
);

/**
 * @route   POST /api/admin/consular-fees/batch
 * @desc    Batch upsert multiple fees
 * @access  Admin
 */
router.post("/batch", (req: Request, res: Response, next: NextFunction) =>
  consularFeeController.batchUpsert(req as AuthenticatedAdminRequest, res, next)
);

/**
 * @route   DELETE /api/admin/consular-fees/:countryPairId/:serviceLevelId/:serviceTypeId
 * @desc    Delete a specific fee
 * @access  Admin
 */
router.delete(
  "/:countryPairId/:serviceLevelId/:serviceTypeId",
  (req: Request, res: Response, next: NextFunction) =>
    consularFeeController.delete(req as AuthenticatedAdminRequest, res, next)
);

/**
 * @route   DELETE /api/admin/consular-fees/:countryPairId/:serviceLevelId
 * @desc    Delete all fees for a service level
 * @access  Admin
 */
router.delete(
  "/:countryPairId/:serviceLevelId",
  (req: Request, res: Response, next: NextFunction) =>
    consularFeeController.deleteByServiceLevel(
      req as AuthenticatedAdminRequest,
      res,
      next
    )
);

export default router;

