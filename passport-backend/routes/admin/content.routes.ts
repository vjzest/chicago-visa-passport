import { Router } from "express";
import { getContent, updateContent, seedContent } from "../../controllers/admin/content.controller";

const router = Router();

// Public route to fetch content
router.get("/content", getContent);

// Admin routes (should be protected in a real app, adding middleware if available)
router.put("/admin/content", updateContent);
router.post("/admin/content/seed", seedContent);

export default router;
