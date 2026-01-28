import mongoose from "mongoose";

export interface IAdminDoc extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  role: mongoose.Types.ObjectId;
  username: string;
  password: string;
  status: "Active" | "Archive";
  image: string | null;
  ipRestriction: boolean;
  ipAddress: string;
}

const adminsSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Archive"],
      default: "Active",
    },
    role: {
      type: mongoose.Schema.ObjectId,
      ref: "roles",
      required: true,
    },

    autoAssign: {
      type: Boolean,
      required: true,
    },

    ipRestriction: {
      type: Boolean,
      required: false,
      default: false,
    },
    ipAddress: {
      type: String,
      required: false,
      default: "",
      // validate: {
      //   //validate that if ipRestriction field is true then ipAddress should be valid ip
      //   validator: function (value: string) {
      //     const ipv4Pattern =
      //       /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

      //     // IPv6 regex pattern
      //     const ipv6Pattern =
      //       /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

      //     return ipv4Pattern.test(value) || ipv6Pattern.test(value);
      //   },
      // },
      // message: (props: {value: string}) =>
      //   `${props.value} is not a valid IP address`,
    },
    authTokenVersion: {
      type: String,
    },
  },
  { timestamps: true }
);

export const AdminsModel = mongoose.model("admins", adminsSchema);
