import { Response, Request, NextFunction } from "express";
import AddressesService from "../../services/user/addresses.service";

export default class UserAddressesController {
  addressesService = new AddressesService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { line1, line2, city, state, zip, country, phone } = req.body;
      const response = await this.addressesService.create(
        //@ts-ignore
        req?.user?._id,
        {
          line1,
          line2,
          city,
          state,
          zip,
          country,
          phone,
        }
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.addressesService.findAll(
        //@ts-ignore
        req?.user?._id
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { addressId } = req.params;
      const { line1, line2, city, state, zip, country, phone } = req.body;
      const response = await this.addressesService.update(
        //@ts-ignore
        req?.user?._id,
        addressId,
        {
          line1,
          line2,
          city,
          state,
          zip,
          country,
          phone,
        }
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { addressId } = req.params;
      const response = await this.addressesService.delete(
        //@ts-ignore
        req?.user?._id,
        addressId
      );
      res.status(response.status).json(response);
    } catch (error) {
      next(new Error((error as Error).message));
    }
  }
}
