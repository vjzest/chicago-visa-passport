import { Request, Response } from 'express';
import HomepageContent from '../../models/data.model';
import { uploadToS3, deleteFromS3 } from '../../utils/s3';
import { get, set } from 'lodash';
export const getHomepageContent = async (req: Request, res: Response) => {
    try {
        const content = await HomepageContent.findOne();
        if (!content) {
            // Return 200 with null instead of 404 to allow frontend to use defaults smoothly
            return res.status(200).json(null);
        }
        res.status(200).json(content.toObject());
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
export const updateHomepageContent = async (req: Request, res: Response) => {
    try {
        const incomingData = JSON.parse(req.body.data);
        const files = req.files as Express.Multer.File[];
        const oldContent = await HomepageContent.findOne().lean();

        if (files && files.length > 0) {
            for (const file of files) {
                const uploadResult = await uploadToS3(file.buffer, file.originalname, file.mimetype, 'site-content');
                const path = file.fieldname.replace(/_/g, '.');

                if (oldContent) {
                    const oldUrl = get(oldContent, path);
                    if (oldUrl && typeof oldUrl === 'string' && oldUrl.includes('s3.amazonaws.com')) {
                        await deleteFromS3(oldUrl);
                    }
                }
                set(incomingData, path, uploadResult.url);
            }
        }

        const updatedContent = await HomepageContent.findOneAndUpdate({}, incomingData, {
            new: true,
            upsert: true,
        });

        res.status(200).json({ message: 'Content updated successfully', data: updatedContent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};
export const deleteHomepageContent = async (req: Request, res: Response) => {
    try {
        const content = await HomepageContent.findOne();
        if (content) {
            const contentObj = content.toObject();
            const urlsToDelete: string[] = [];

            const findUrls = (obj: any) => {
                for (const key in obj) {
                    if (typeof obj[key] === 'string' && obj[key].includes('s3.amazonaws.com')) {
                        urlsToDelete.push(obj[key]);
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        findUrls(obj[key]);
                    }
                }
            };

            findUrls(contentObj);
            if (urlsToDelete.length > 0) {
                await Promise.all(urlsToDelete.map(url => deleteFromS3(url)));
            }
        }
        await HomepageContent.deleteMany({});
        res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};