import { Router, Request, Response, NextFunction } from "express";
import AdminCountryPairController from "../../controllers/admin/admin.country-pair.controller";
import {
  adminAuthMiddleware,
  AuthenticatedAdminRequest,
} from "../../middlewares/auth.middleware";

const router = Router();
const countryPairController = new AdminCountryPairController();

// Apply admin authentication middleware to all routes
router.use(adminAuthMiddleware);

/**
 * @route   GET /api/admin/country-pairs/enabled-from
 * @desc    Get all enabled "from" countries
 * @access  Admin
 */
router.get(
  "/enabled-from",
  (req: Request, res: Response, next: NextFunction) =>
    countryPairController.getEnabledFromCountries(req, res, next)
);

/**
 * @route   GET /api/admin/country-pairs/enabled-to
 * @desc    Get all enabled "to" countries
 * @access  Admin
 */
router.get(
  "/enabled-to",
  (req: Request, res: Response, next: NextFunction) =>
    countryPairController.getEnabledToCountries(req, res, next)
);

/**
 * @route   GET /api/admin/country-pairs
 * @desc    Get all country pairs
 * @access  Admin
 */
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  countryPairController.findAll(req, res, next)
);

/**
 * @route   GET /api/admin/country-pairs/:id
 * @desc    Get a single country pair
 * @access  Admin
 */
router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  countryPairController.findOne(req, res, next)
);

/**
 * @route   POST /api/admin/country-pairs
 * @desc    Create a new country pair
 * @access  Admin
 */
router.post("/", (req: Request, res: Response, next: NextFunction) =>
  countryPairController.create(req as AuthenticatedAdminRequest, res, next)
);

/**
 * @route   PUT /api/admin/country-pairs/:id
 * @desc    Update a country pair
 * @access  Admin
 */
router.put("/:id", (req: Request, res: Response, next: NextFunction) =>
  countryPairController.update(req as AuthenticatedAdminRequest, res, next)
);

/**
 * @route   PATCH /api/admin/country-pairs/:id/toggle-active
 * @desc    Toggle active status of a country pair
 * @access  Admin
 */
router.patch("/:id/toggle-active", (req: Request, res: Response, next: NextFunction) =>
  countryPairController.toggleActive(req as AuthenticatedAdminRequest, res, next)
);

export default router;
