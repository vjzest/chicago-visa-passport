type IDynamicFormField = {
  _id: string;
  id: string;
  writable?: boolean;
  title: string;
  key: string;
  placeholder: string;
  sortOrder?: number;
  type:
  | "text"
  | "number"
  | "textarea"
  | "date"
  | "checkbox"
  | "select"
  | "email"
  | "tel";
  validations?: {
    required?: { value: boolean; message?: string };
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    restrictPastDates?: { value: boolean; message?: string };
    restrictFutureDates?: { value: boolean; message?: string };
    [key: string]: any;
  };
  options?: { title: string; value: string; tooltip?: string; des?: string }[];
};

type IForm = {
  _id?: string;
  id: string;
  name: string;
  sortOrder: number;
  fields: IDynamicFormField[];
  type: "common" | "individual";
};

type IFormsSection = {
  _id: string;
  title: string;
  forms: IForm[];
};

interface IServiceType {
  _id: string;
  serviceType: string;
  shippingAddress: IShippingAddress | string;
  description: string;
  shortHand: string;
  sortOrder: number;
  isActive: boolean;
  isArchived: boolean;
  isEvisa?: boolean;
  processingTime: string;
  validity?: string;
  silentKey?: string;
  countryPair?: ICountryPair | string;
  allowedCitizenOf?: string[];
  requiredDocuments?: any[];
  requiredDocuments2?: any[];
}

interface IServiceLevel {
  _id: string;
  serviceLevel: string;
  time: string;
  speedInWeeks: number;
  price: number;
  nonRefundableFee: number;
  inboundFee: number;
  outboundFee: number;
  paymentGateway: string | { _id: string; processorName?: string };
  authOnlyFrontend: string;
  amex: boolean;
  loa: string;
  doubleCharge: string;
  serviceTypes: IServiceType[];
  isActive: boolean;
  isArchived: boolean;
}

interface ILoa {
  _id: string;
  name: string;
  url: string;
}

interface IFAQ {
  _id: string;
  question: string;
  answer: string;
}

interface IStatus {
  _id?: string;
  title: string;
  description?: string;
  sortOrder?: number;
  level?: 1 | 2 | 3;
  parent?: string;
  children?: string[];
  roles: string[];
  headers: string[];
}
interface IShippingAddress {
  _id: string;
  locationName: string;
  company: string;
  authorisedPerson: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  instruction: string;
  isDeleted: boolean;
  isActive: boolean;
}

interface ICountryPair {
  _id: string;
  fromCountryCode: string;
  fromCountryName: string;
  toCountryCode: string;
  toCountryName: string;
  isJurisdictional: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IAddon {
  subTitle: string;
  price: number;
  _id: string;
}

interface IAdditionalService {
  _id: string;
  title: string;
  description: string;
  description2: string;
  price: number;
  serviceTypes: string[];
  addons: Addon[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
