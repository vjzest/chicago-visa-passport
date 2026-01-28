import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    firstName: { type: String, maxlength: 35 },
    lastName: { type: String, maxlength: 35 },
    dateOfBirth: { type: String },
    placeOfBirth: { type: String, maxlength: 40 },
    gender: { type: String },
    isUSCitizen: { type: Boolean, default: false },
  },
  {
    _id: false,
  }
);

const marriageDetailsSchema = new mongoose.Schema(
  {
    spouseFirstName: { type: String, maxlength: 35 },
    spouseLastName: { type: String, maxlength: 35 },
    spouseDateOfBirth: { type: String },
    marriageDate: { type: String },
    spousePlaceOfBirth: { type: String, maxlength: 40 },
    spouseIsUSCitizen: { type: Boolean, default: false },
    isWidowedOrDivorced: { type: Boolean },
    widowOrDivorceDate: { type: String },
  },
  {
    _id: false,
  }
);

const parentAndMarriageInfoSchema = new mongoose.Schema(
  {
    isParent1Unknown: { type: Boolean, required: true },
    isParent2Unknown: { type: Boolean, required: true },
    parent1: {
      type: parentSchema,
      required: [
        function () {
          //@ts-ignore
          return !this.isParent1Unknown;
        },
        "Parent 1 details are required if known",
      ],
    },
    parent2: {
      type: parentSchema,
      required: [
        function () {
          //@ts-ignore
          return !this.isParent2Unknown;
        },
        "Parent 2 details are required if known",
      ],
    },
    isMarried: { type: Boolean, required: true },
    marriageDetails: {
      type: marriageDetailsSchema,
      required: [
        function () {
          //@ts-ignore
          return this.isMarried;
        },
        "Marriage details are required if you are married",
      ],
    },
    isComplete: { type: Boolean, required: true },
  },
  {
    _id: false,
  }
);

// Custom validation
parentAndMarriageInfoSchema.pre("validate", function (next) {
  if (!this.isParent1Unknown) {
    if (!this.parent1?.firstName) {
      this.invalidate("parent1.firstName", "First name is required");
    }
    if (!this.parent1?.lastName) {
      this.invalidate("parent1.lastName", "Last name is required");
    }
    if (!this.parent1?.gender) {
      this.invalidate("parent1.gender", "Sex is required");
    }
  }

  if (!this.isParent2Unknown) {
    if (!this.parent2?.firstName) {
      this.invalidate("parent2.firstName", "First name is required");
    }
    if (!this.parent2?.lastName) {
      this.invalidate("parent2.lastName", "Last name is required");
    }
    if (!this.parent2?.gender) {
      this.invalidate("parent2.gender", "Sex is required");
    }
  }

  if (this.isMarried) {
    const md = this.marriageDetails;
    if (!md?.spouseFirstName) {
      this.invalidate(
        "marriageDetails.spouseFirstName",
        "Spouse first name is required"
      );
    }
    if (!md?.spouseLastName) {
      this.invalidate(
        "marriageDetails.spouseLastName",
        "Spouse last name is required"
      );
    }
    if (!md?.spouseDateOfBirth) {
      this.invalidate(
        "marriageDetails.spouseDateOfBirth",
        "Spouse date of birth is required"
      );
    }
    if (!md?.marriageDate) {
      this.invalidate(
        "marriageDetails.marriageDate",
        "Marriage date is required"
      );
    }
    if (!md?.spousePlaceOfBirth) {
      this.invalidate(
        "marriageDetails.spousePlaceOfBirth",
        "Spouse place of birth is required"
      );
    }
    if (md && !md?.isWidowedOrDivorced) {
      md.widowOrDivorceDate = null;
    }
    if (md?.isWidowedOrDivorced && !md?.widowOrDivorceDate) {
      this.invalidate(
        "marriageDetails.widowOrDivorceDate",
        "Widow or divorce date is required when widowed or divorced"
      );
    }
    // if (md?.isWidowedOrDivorced && md?.widowOrDivorceDate && md?.marriageDate) {
    //   const marriageDate = new Date(md?.marriageDate);
    //   const widowOrDivorceDate = new Date(md?.widowOrDivorceDate);
    //   if (widowOrDivorceDate < marriageDate) {
    //     this.invalidate(
    //       "marriageDetails.widowOrDivorceDate",
    //       "Widow or divorce date must be greater than or equal to marriage date"
    //     );
    //   }
    // }
  } else {
    this.marriageDetails = null;
  }

  next();
});

export { parentAndMarriageInfoSchema };
