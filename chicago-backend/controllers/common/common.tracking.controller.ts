import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/classes/custom-error";
import FedexUtil from "../../utils/fedex";
export default class CommonTrackingController {
  private fedexUtil = new FedexUtil();

  async trackShipmentByTrackingId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { trackingIds } = req.query as { trackingIds: string | string[] };
      const response = await this.fedexUtil.trackShipment(
        Array.isArray(trackingIds) ? trackingIds : [trackingIds]
      );
      console.log(response);
      res.status((response as any).status).json(response);
    } catch (error) {
      next(new CustomError(500, (error as Error).message));
    }
  }
}
