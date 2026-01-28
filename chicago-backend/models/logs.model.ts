import mongoose, { Schema, Document } from "mongoose";

export interface ILogDoc extends Document {
  actorType: "user" | "admin" | "server";
  admin?: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  module: string;
  moduleId?: mongoose.Types.ObjectId;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILog {
  actorType: "user" | "admin" | "server";
  admin?: string;
  user?: string;
  module: string;
  moduleId?: mongoose.Types.ObjectId;
  action: string;
}

const logSchema = new Schema<ILogDoc>(
  {
    actorType: {
      type: String,
      enum: ["user", "admin", "server"],
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      required: function (this: ILogDoc) {
        return this.actorType === "admin";
      },
      validate: {
        validator: function (this: ILogDoc, v: any) {
          if (this.actorType === "admin") {
            return v != null;
          }
          return true;
        },
        message: "Admin ID is required when actorType is 'admin'",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "accounts",
      required: function (this: ILogDoc) {
        return this.actorType === "user";
      },
      validate: {
        validator: function (this: ILogDoc, v: any) {
          if (this.actorType === "user") {
            return v != null;
          }
          return true;
        },
        message: "User ID is required when actorType is 'user'",
      },
    },
    module: {
      type: String,
      enum: [
        "cases",
        "applications",
        "statuses",
        "formssections",
        "AdditionalService",
        "servicelevels",
        "countries",
        "serviceTypes",
        "shippings",
        "configurations",
        "promo",
        "roles",
        "admins",
        "consultation",
        "notices",
        "processor",
        "config",
      ],
      required: true,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    action: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const LogsModel = mongoose.model<ILogDoc>("logs", logSchema);
