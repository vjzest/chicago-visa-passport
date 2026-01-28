import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/classes/custom-error';

export const validateFileType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return next(new CustomError(400, `Only ${allowedTypes.join(', ')} files are allowed`));
    }
    next();
  };
};
export const validateImageOrPdf = (req: Request, res: Response, next: NextFunction) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  return validateFileType(allowedTypes)(req, res, next);
};