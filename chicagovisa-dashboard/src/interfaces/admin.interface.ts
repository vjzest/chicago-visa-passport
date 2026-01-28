import { TRoleData } from "@/app/(site)/manage-roles/data";
export interface IAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: TRoleData | string;
  email: string;
  image: string;
  status: "Active" | "Archive";
  ipRestriction: boolean;
  ipAddress: string;
  autoAssign: boolean;
}
