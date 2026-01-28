import mongoose, { Schema } from "mongoose";
import { StatusesModel } from "./statuses.model";
import ENV from "../utils/lib/env.config";
import MailService from "../services/common/mail.service";

const billingInfoSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: false,
  },
  cardHolderName: {
    type: String,
    required: false,
  },
  expirationDate: {
    type: String,
    required: false,
  },
  cardVerificationCode: {
    type: String,
    required: false,
  },
});

const caseInfoSchema = new mongoose.Schema({
  fromCountryCode: {
    type: String,
    required: false,
  },
  toCountryCode: {
    type: String,
    required: false,
  },
  paymentProcessor: {
    type: mongoose.Schema.ObjectId,
    ref: "processors",
  },
  serviceLevelUpdated: {
    type: Boolean,
    default: false,
  },
  invoiceInformation: {
    type: [{ service: String, price: Number }],
    default: [],
  },
  caseManager: {
    type: mongoose.Schema.ObjectId,
    ref: "admins",
    required: true,
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },

  stateOfResidency: {
    type: String,
    default: "",
  },
  statusDate: { type: Date, default: Date.now },
  status: {
    type: mongoose.Schema.ObjectId,
    // default: "",
    ref: "statuses",
  },
  subStatus1: {
    type: mongoose.Schema.ObjectId,
    default: null,
    ref: "statuses",
    required: false,
  },
  subStatus2: {
    type: mongoose.Schema.ObjectId,
    default: null,
    ref: "statuses",
    required: false,
  },
  serviceLevel: {
    type: mongoose.Schema.ObjectId,
    ref: "servicelevels",
    required: false,
    default: null,
  },
  serviceType: {
    type: mongoose.Schema.ObjectId,
    ref: "servicetypes",
    required: false,
    default: null,
  },
  referralSource: {
    type: {
      source: String,
      medium: String,
      keyword: String,
      referral: String,
      promoCode: String,
      referringUrl: String,
    },
  },
  additionalShippingOptions: {},
  additionalServices: {
    type: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "additionalservices",
          required: true,
        },
        addons: {
          type: [mongoose.Schema.Types.ObjectId],
          default: [],
        },
      },
    ],
    default: [],
  },
  statusChange: String,

  requestForTestimonial: {
    type: Boolean,
    default: false,
  },
  disableAutoEmails: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: [String],
    default: [],
  },
  voidTransaction: {
    type: Boolean,
    default: false,
  },
  makeConfirmationMailObsolete: {
    type: Boolean,
    default: false,
  },
  processingLocation: {
    type: mongoose.Schema.ObjectId,
    ref: "shippings",
    required: false,
    default: null,
  },
  contingentMailSentTimes: {
    type: [Date],
    default: [],
  },
});

const applicantInfoSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    middleName: { type: String, required: false },
    dateOfBirth: { type: String, required: false },
  },
  { strict: false, timestamps: true },
);

const DuplicatesWithSchema = new mongoose.Schema({
  caseId: {
    type: Schema.Types.ObjectId,
    ref: "cases",
    required: true,
  },
  caseNo: {
    type: String,
    required: true,
  },
  matchReason: [
    {
      type: String,
      required: true,
    },
  ],
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
});

const DuplicateInfoSchema = new mongoose.Schema({
  isDuplicate: {
    type: Boolean,
    default: false,
  },
  duplicatesWith: [DuplicatesWithSchema],
  adminDecision: {
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED_DUPLICATE", "NOT_DUPLICATE"],
      default: "PENDING",
    },
    decidedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "admins",
      default: null,
    },
    decidedAt: {
      type: Date,
      default: null,
    },
    notes: String,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "admins",
    default: null,
  },
  lastUpdatedAt: {
    type: Date,
    default: null,
  },
});

const travelPlansSchema = {
  hasPlans: {
    type: Boolean,
    default: false,
  },
  destination: {
    type: String,
    default: "",
  },
  travelDate: {
    type: Date,
    default: null,
  },
  travelPurpose: {
    type: String,
    default: "",
  },
};

const sourceInfoSchema = {
  howDidYouHearAboutUs: {
    type: String,
    default: "",
  },
  source: {
    type: String,
    default: "",
  },
  medium: {
    type: String,
    default: "",
  },
  keyword: {
    type: String,
    default: "",
  },
  referral: {
    type: String,
    default: "",
  },
  referringUrl: {
    type: String,
    default: "",
  },
};

const casesSchema = new mongoose.Schema(
  {
    caseNo: { type: String, unique: true, required: true },
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "accounts",
    },
    billingInfo: {
      type: billingInfoSchema,
      required: false,
      default: {
        cardNumber: "",
        cardHolderName: "",
        expirationDate: "",
        cardVerificationCode: "",
      },
    },
    travelPlansInfo: {
      type: travelPlansSchema,
      required: false,
      default: {
        hasPlans: false,
        destination: "",
        travelDate: null,
        travelPurpose: "",
      },
    },
    sourceInfo: {
      type: sourceInfoSchema,
      required: false,
      default: {
        howDidYouHearAboutUs: "",
        source: "",
        medium: "",
        keyword: "",
        referral: "",
        referringUrl: "",
      },
    },
    applicantInfo: {
      type: applicantInfoSchema,
      required: false,
      default: {
        firstName: "",
        lastName: "",
        middleName: "",
        dateOfBirth: "",
      },
    },
    contactInformation: {
      type: {
        email1: {
          type: String,
          required: true,
        },
        email2: String,
        phone1: {
          type: String,
          required: false,
          default: "",
        },
        phone2: String,
      },
      required: false,
    },
    potentialDuplicate: {
      type: DuplicateInfoSchema,
      required: false,
      default: {
        isDuplicate: false,
        duplicatesWith: [],
      },
    },
    caseInfo: {
      type: caseInfoSchema,
      default: {
        subStatus1: null,
        subStatus2: null,
        serviceLevel: null,
        serviceType: null,
        referralSource: {
          source: "",
          medium: "",
          keyword: "",
          referral: "",
          promoCode: "",
          referringUrl: "",
        },
        additionalShippingOptions: {
          firstMorningOvernight: false,
          saturdayDelivery: false,
          extraShipping: false,
          passportCard: false,
        },
        statusChange: "",
        processingLocation: null,
        inboundTrackingId: "",
        outboundTrackingId: "",
        outbound2TrackingId: "",
        requestForTestimonial: false,
        disableAutoEmails: false,
        notes: [],
        voidTransaction: false,
        makeConfirmationMailObsolete: false,
      },
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    refund: {
      isRefunded: {
        type: Boolean,
        default: false,
      },
      refundedAmount: {
        type: Number,
        default: 0,
      },
      refundNote: {
        type: String,
        default: "",
      },
    },
    void: {
      isVoid: {
        type: Boolean,
        default: false,
      },
      voidAmount: {
        type: Number,
        default: 0,
      },
      voidNote: {
        type: String,
        default: "",
      },
    },
    lastOpened: {
      type: Date,
      default: null,
    },
    cancellation: {
      type: {
        status: {
          type: String,
          enum: ["none", "requested", "cancelled", "rejected"],
          default: "none",
        },
        note: {
          type: String,
          default: "",
        },
        date: {
          type: Date,
          default: null,
        },
      },
      default: {
        status: "none",
        note: "",
        date: null,
      },
    },
    courierNotes: {
      type: [
        {
          note: String,
          host: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    actionNotes: {
      type: [
        {
          note: { type: String, required: true },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    passportFormLogs: {
      type: [
        {
          note: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    additionalShippingOptions: {
      type: {
        inboundShippingLabel: {
          type: String,
          default: "",
        },
        outboundShippingLabel: {
          type: String,
          default: "",
        },
        firstMorningOvernight: {
          type: Boolean,
          default: false,
        },
        saturdayDelivery: {
          type: Boolean,
          default: false,
        },
        extraShipping: {
          type: Boolean,
          default: false,
        },
        inBoundStatus: {
          type: String,
          enum: ["not sent", "sent", "delivered", ""],
        },
        outBoundStatus: {
          type: String,
          enum: ["not sent", "sent", "delivered", ""],
        },
        outBound2Status: {
          type: String,
          enum: ["not sent", "sent", "delivered", ""],
        },
        outBound3Status: {
          type: String,
          enum: ["not sent", "sent", "delivered", ""],
        },
        inboundTrackingId: {
          id: { type: String },
          note: { type: String },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
        outboundTrackingId: {
          id: { type: String, default: "" },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
        outbound2TrackingId: {
          id: { type: String, default: "" },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
        outbound3TrackingId: {
          id: { type: String, default: "" },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      },
      default: {},
    },
    passportFormUrl: {
      type: String,
      default: "",
    },
    reviewStage: {
      type: String,
      enum: ["application", "documents", "done"],
      default: "application",
    },
    applicationReviewStatus: {
      type: String,
      enum: ["pending", "ongoing", "approved", "rejected", "upload"],
      default: "pending",
    },
    applicationReviewMessage: {
      type: String,
      default: "",
    },
    docReviewStatus: {
      type: String,
      enum: ["pending", "ongoing", "approved", "rejected", "expert"],
      default: "pending",
    },
    docReviewMessage: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
    documents: {
      type: [
        {
          document: {
            type: mongoose.Schema.ObjectId,
            required: true,
          },
          isVerified: {
            type: Boolean,
            default: false,
          },
          urls: {
            type: [String],
            default: [],
          },
        },
      ],
      default: [],
    },
    notes: {
      type: [
        {
          manualNote: String,
          autoNote: String,
          host: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    isAccessible: {
      type: Boolean,
      default: false,
    },
    isOfflineLink: {
      type: Boolean,
      default: false,
    },
    submissionDate: {
      type: Date,
      required: false,
    },
    countDownStartDate: {
      type: Date,
      default: null,
    },
    departureDate: {
      type: String,
      default: "",
    },
    manifestRemarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, strict: false },
);
casesSchema.index({
  "applicantInfo.lastName": 1,
  "applicantInfo.dateOfBirth": 1,
});
casesSchema.index({ "contactInformation.phone1": 1 });
casesSchema.index({ "contactInformation.email1": 1 });

async function sendStatusChangeMail(
  this: any,
  next: mongoose.CallbackWithoutResultAndOptionalError,
) {
  // Check if any of the statuses were modified
  if (
    !this.isModified("caseInfo.status") &&
    !this.isModified("caseInfo.subStatus1") &&
    !this.isModified("caseInfo.subStatus2")
  ) {
    return next();
  }

  // const session = await mongoose.startSession();
  // session.startTransaction();
  try {
    // Fetch all statuses in parallel
    const [status, subStatus1, subStatus2] = await Promise.all([
      StatusesModel.findById(this.caseInfo.status),
      StatusesModel.findById(this.caseInfo.subStatus1),
      StatusesModel.findById(this.caseInfo.subStatus2),
    ]);

    const statuses = [status, subStatus1, subStatus2].filter(Boolean); // Filter out null values if any

    // Check if any status requires disabling access
    const shouldDisableAccess = statuses.some((s) => {
      return s?.disableCase === true;
    });
    if (shouldDisableAccess) {
      this.isAccessible = false;
    } else {
      this.isAccessible = true;
    }

    //whether to start the countdown (only start if status is "documents-submitted")
    const shouldStartCountdown = statuses.some((s) => {
      return s?.key === "documents-submitted";
    });

    if (shouldStartCountdown) {
      this.countDownStartDate = new Date();
    }

    // Check if any status requires sending an auto email
    let autoEmailMessage = "";
    const shouldSendEmail = statuses.reverse().some((s) => {
      if (s?.sendAutoEmail === true) {
        autoEmailMessage = s?.autoEmailMessage || "";
        return true;
      }
      return false;
    });

    await this.populate({
      path: "account",
      select: "consentToUpdates firstName lastName",
    });
    if (
      shouldSendEmail &&
      (this.account as any)?.consentToUpdates &&
      !this.caseInfo.disableAutoEmails
    ) {
      let statusBreadcrumb = "";
      if (status) {
        statusBreadcrumb += status.title;
      }
      if (subStatus1) {
        statusBreadcrumb += ` / ${subStatus1.title}`;
      }
      if (subStatus2) {
        statusBreadcrumb += ` / ${subStatus2.title}`;
      }
      const applicantName = `${this.applicantInfo?.firstName} ${this.applicantInfo?.lastName}`;
      const name =
        (this?.account as any)?.firstName +
        " " +
        (this?.account as any)?.lastName;

      const emailContent = autoEmailMessage
        ? `
      <p>Dear ${name},</p>
     ${autoEmailMessage}

      <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
    `
        : `
      <h2 style="color:rgb(15, 114, 58);">Passport Application Status Changed</h2>
      <p>Dear ${name},</p>
      <p>Your passport application for <strong>${applicantName}</strong> has been moved to status <strong style="color:rgb(30, 84, 190);">${statusBreadcrumb}</strong>.
      </p>

      <p>If you have any questions or require additional information, please feel free to contact our support team.</p>
    `;

      // Prepare and send email
      const emailData = {
        from: ENV.FROM_EMAIL,
        to: this?.contactInformation?.email1!,
        fullName: name,
        subject: "Passport Application Status Changed",
        htmlContent: emailContent,
      };
      await new MailService().sendEmailText(emailData, this._id);
    }

    // await session.commitTransaction();
    // session.endSession();
    next();
  } catch (error: any) {
    // await session.abortTransaction();
    // session.endSession();
    next(error);
  }
}
casesSchema.pre("save", sendStatusChangeMail);
//TODO find a way to use pre hooks for findOneAndUpdate, updateOne, and updateMany
// casesSchema.pre("findOneAndUpdate", sendStatusChangeMail);
// casesSchema.pre("updateOne", sendStatusChangeMail);
// casesSchema.pre("updateMany", sendStatusChangeMail);

export const CasesModel = mongoose.model("cases", casesSchema);
