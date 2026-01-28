type IDynamicFormField = {
  _id: string;
  id?: string;
  title: string;
  key: string;
  placeholder: string;
  sortOrder: number;
  type:
    | "text"
    | "number"
    | "textarea"
    | "date"
    | "checkbox"
    | "select"
    | "email"
    | "month"
    | "year"
    | "tel";
  validations?: {
    required?: { value: boolean; message?: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    restrictPastDates?: { value: boolean; message?: string };
    restrictFutureDates?: { value: boolean; message?: string };
    pattern?: { value: RegExp; message: string };
    [key: string]: any;
  };
  options?: { title: string; value: string }[];
};

type IForm = {
  _id?: string;
  id: string;
  name: string;
  type: "common" | "individual" | "billing";
  sortOrder: number;
  fields: IDynamicFormField[];
  originCountry: string;
  destinationCountry: string;
};

type IPassportFormKeys =
  | "personalInfo"
  | "contactInfo"
  | "emergencyContact"
  | "physicalDescription"
  | "marriage"
  | "parentInfo"
  | "addressInfo"
  | "permanentAddress"
  | "passportHistory"
  | "travelPlans";

type IFormsSection = {
  _id: string;
  title: string;
  forms: IForm[];
};

// interface IDynamicFormField {
//   name: string;
//   key: string;
//   placeholder: string;
//   type: string;
//   validations: {
//     required?: { value: boolean; message?: string };
//     minLength?: { value: number; message: string };
//     pattern?: { value: RegExp; message: string };
//     [key: string]: any;
//   };
// }

interface ICountry {
  _id: string;
  name: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency_name: string;
  currency_symbol: string;
  nationality: string;
  emoji?: string;
  flag: string;
  banner: string;
  bannerLocation: string;
  countryCode: string;
  countryIso: string;
  states: {
    name: string;
    iso: string;
  }[];
  isActive: boolean;
  isOrigin: boolean;
  isDestination: boolean;
  tnc: string;
}

interface IState {
  name: string;
  state_code: string;
}

interface IVisaType {
  _id: string;
  visaType: string;
  country: ObjectId | ICountry;
  originCountries: ICountry[];
  shippingAddresses: any[];
  description: string;
  shortHand: string;
  isActive: boolean;
  isDeleted: boolean;
  serviceFee: number;
  embassyFee: number;
  governmentFee: number;
  validity: string;
  processingTime: string;
  serviceLevels?: IServiceLevel[];
}

interface IServiceLevel {
  _id: string;
  serviceLevel: string;
  time: string;
  price: string;
  nonRefundableFee: string;
  inboundFee: string;
  outboundFee: string;
  paymentGateway: string;
  authOnlyFrontend: string;
  amex: boolean;
  doubleCharge: string;
  visaTypes: IVisaType[];
  isActive: boolean;
  isDeleted: boolean;
}

interface IAdditionalService {
  _id: string;
  title: string;
  description: string;
  description2: string;
  price: number;
  serviceTypes: ServiceType[];
  addons: Addon[];
  isActive: boolean;
  isDeleted: boolean;
}

interface ServiceType {
  _id: string;
  serviceType: string;
  shippingAddresses: string[]; // Assuming shippingAddresses is an array of strings
  description: string;
  shortHand: string;
  isActive: boolean;
  isDeleted: boolean;
  embassyFee: number;
  governmentFee: number;
  processingTime: string;
  requiredDocuments: RequiredDocument[];
}

interface RequiredDocument {
  title: string;
  instructions: string[];
  sampleImage: string;
  _id: string;
}

type IApplySteps = "application" | "shipping" | "order-confirmation";

interface IAddon {
  subTitle: string;
  price: number;
  _id: string;
}
