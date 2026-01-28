import { Router } from 'express';
import {
    getHomepageContent,
    updateHomepageContent,
    deleteHomepageContent
} from '../../controllers/admin/admin.contentController';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import upload from '../../utils/multer';

const router = Router();

router.get('/homepage', getHomepageContent);

router.put('/homepage',
    adminAuthMiddleware,
    upload.any(),
    updateHomepageContent
);

router.delete('/homepage', adminAuthMiddleware, deleteHomepageContent);

export default router;