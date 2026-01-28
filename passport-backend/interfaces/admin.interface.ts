import { IRole } from "../models/roles.model";
export default interface IAdmin {
  _id: string | any;
  email: string;
  firstName: string;
  lastName: string;
  role: IRole;
}
