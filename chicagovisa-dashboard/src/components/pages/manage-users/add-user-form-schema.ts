import { z } from "zod";

export const AddUserFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(20, "Must be less than 20 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(20, "Must be less than 20 characters"),
  username: z
    .string()
    .min(1, "username is required")
    .max(15, "Must be less than 15 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  adminType: z.enum(["Ultimate", "Admin", "Manager"]),
  showInDropdown: z.boolean(),
  autoAssign: z.boolean(),
  status: z.enum(["Active", "Archive"]),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must be less than 12 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .min(1, "Password is required"),
});
