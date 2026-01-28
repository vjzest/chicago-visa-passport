import JetPassportsFull from "../../../public/assets/images/jet-passports-logo.png";
import JetPassports from "../../../public/assets/images/jet-passports-logo-short.png";
import Logo from "../../../public/assets/images/jet-passports-logo-short.png";
import World from "../../../public/assets/images/World.svg";
import Play from "../../../public/assets/images/play.png";
import Lady from "../../../public/assets/images/lady.png";
import Banner from "../../../public/assets/images/banner-1.png";
import Earth_Plane from "../../../public/assets/images/Earth-Plane.png";
import BannerOval from "../../../public/assets/images/banner-oval.png";
import HowItWorks from "../../../public/assets/images/how-it-works.png";
import Passport from "../../../public/assets/images/passport.png";
import PassportVideo from "../../../public/assets/images/passportVideo.png";
import VisaService from "../../../public/assets/images/visa-service.png";
import confirmOrder from "../../../public/assets/images/order-confirm.png";
import Dots from "../../../public/assets/images/dots.png";
import NotFound from "../../../public/assets/images/404.svg";
import DotsWhite from "../../../public/assets/images/dots-white.png";
import Destination1 from "../../../public/assets/images/destination1.png";
import Destination2 from "../../../public/assets/images/destination2.png";
import Destination3 from "../../../public/assets/images/destination3.png";
import Phone from "../../../public/icons/phone.svg";
import FootNote from "../../../public/icons/footnote.svg";
import Twitter from "../../../public/icons/twitter.svg";
import Instagram from "../../../public/icons/instagram.svg";
import LinkedIn from "../../../public/icons/linkedin.svg";
import VerifyTick from "../../../public/icons/verifyTick.svg";
import QuestionMark from "../../../public/assets/images/question-mark.svg";
import TheNewYorkTimesLogo from "../../../public/assets/images/the-new-york-times-logo.png";
import TomsGuideLogo from "../../../public/assets/images/toms-guide-logo.png";
import TripAdvisorLogo from "../../../public/assets/images/tripadvisor-logo.png";
import AirbnbLogo from "../../../public/assets/images/airbnb-logo.png";
import DashboardBanner from "../../../public/assets/images/dashboard-banner.png";
import ClockImage from "@public/assets/images/clock-image.jpg";
import FormImage from "@public/assets/images/form-image.webp";
import LinkBroken from "@public/assets/images/link-broken.png";
import PaymentFailed from "@public/assets/images/payment-failed.png";
import PaymentFailedLady from "@public/assets/images/payment-failed-lady-with-card.png";
import TechnicalIssue from "@public/assets/images/techical-issue.png";
import ChevronRight from "@public/assets/right-chevron.png";
import NMISeal from "@public/assets/nmi.png";
import VerifiedShield from "@public/assets/shield.jpg";
import LadyGivingPassport from "@public/assets/lady-giving-passport.jpeg";
import UsaFlagLogo from "@public/assets/flag-usa.jpg";
import EncryptionLogo from "@public/assets/encryption.webp";
// card images
import Amx from "../../../public/assets/images/amex.svg";
import MsCard from "../../../public/assets/images/mastercard.svg";
import MesCard from "../../../public/assets/images/maestro.svg";
import Visa from "../../../public/assets/images/visa.svg";
import DcCard from "../../../public/assets/images/diners.svg";
import Rupay from "../../../public/assets/images/rupay.png";
import Jcb from "../../../public/assets/images/jcb.svg";
import Discover from "../../../public/assets/images/discover.svg";
import Card from "../../../public/assets/images/default.svg";
import OrderConfirmPageImage from "../../../public/assets/order-confirm2/order-page-img.png";
import OrderConfirmPageClientPortal from "../../../public/assets/order-confirm2/order-page-client-portal.png";
import OrderConfirmPageStartLaterPortal from "../../../public/assets/order-confirm2/order-page-start-later-portal.png";
import LogoOnly from "../../../public/icons/logo-only.svg";

const IMGS = {
  Logo,
  LogoOnly,
  JetPassportsFull,
  JetPassports,
  World,
  Play,
  Lady,
  Banner,
  Earth_Plane,
  BannerOval,
  TheNewYorkTimesLogo,
  TomsGuideLogo,
  TripAdvisorLogo,
  AirbnbLogo,
  HowItWorks,
  Dots,
  DotsWhite,
  Destination1,
  Destination2,
  Destination3,
  Passport,
  PassportVideo,
  VisaService,
  confirmOrder,
  Phone,
  FootNote,
  Twitter,
  Instagram,
  LinkedIn,
  VerifyTick,
  QuestionMark,
  NotFound,
  DashboardBanner,
  PaymentFailed,
  Card,
  Amx,
  MsCard,
  MesCard,
  Visa,
  DcCard,
  Rupay,
  Jcb,
  Discover,
  ClockImage,
  FormImage,
  LinkBroken,
  PaymentFailedLady,
  TechnicalIssue,
  ChevronRight,
  NMISeal,
  VerifiedShield,
  LadyGivingPassport,
  UsaFlagLogo,
  EncryptionLogo,
  OrderConfirmPageImage,
  OrderConfirmPageClientPortal,
  OrderConfirmPageStartLaterPortal,
};

const NAV_LINKS = [
  {
    name: "Apply",
    link: "/apply",
  },
  {
    name: "Contact Us",
    link: "/contact-us",
  },
] as const;

const CONST_APIS = {
  countries:
    "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries.json",
};

const STATES: {
  [key: string]: { label: string; value: string }[];
} = {
  USA: [
    { label: "Alabama", value: "AL" },
    { label: "Alaska", value: "AK" },
    { label: "Arizona", value: "AZ" },
    { label: "Arkansas", value: "AR" },
    { label: "California", value: "CA" },
    { label: "Colorado", value: "CO" },
    { label: "Connecticut", value: "CT" },
    { label: "Delaware", value: "DE" },
    { label: "District of Columbia", value: "DC" },
    { label: "Florida", value: "FL" },
    { label: "Georgia", value: "GA" },
    { label: "Hawaii", value: "HI" },
    { label: "Idaho", value: "ID" },
    { label: "Illinois", value: "IL" },
    { label: "Indiana", value: "IN" },
    { label: "Iowa", value: "IA" },
    { label: "Kansas", value: "KS" },
    { label: "Kentucky", value: "KY" },
    { label: "Louisiana", value: "LA" },
    { label: "Maine", value: "ME" },
    { label: "Maryland", value: "MD" },
    { label: "Massachusetts", value: "MA" },
    { label: "Michigan", value: "MI" },
    { label: "Minnesota", value: "MN" },
    { label: "Mississippi", value: "MS" },
    { label: "Missouri", value: "MO" },
    { label: "Montana", value: "MT" },
    { label: "Nebraska", value: "NE" },
    { label: "Nevada", value: "NV" },
    { label: "New Hampshire", value: "NH" },
    { label: "New Jersey", value: "NJ" },
    { label: "New Mexico", value: "NM" },
    { label: "New York", value: "NY" },
    { label: "North Carolina", value: "NC" },
    { label: "North Dakota", value: "ND" },
    { label: "Ohio", value: "OH" },
    { label: "Oklahoma", value: "OK" },
    { label: "Oregon", value: "OR" },
    { label: "Pennsylvania", value: "PA" },
    { label: "Rhode Island", value: "RI" },
    { label: "South Carolina", value: "SC" },
    { label: "South Dakota", value: "SD" },
    { label: "Tennessee", value: "TN" },
    { label: "Texas", value: "TX" },
    { label: "Utah", value: "UT" },
    { label: "Vermont", value: "VT" },
    { label: "Virginia", value: "VA" },
    { label: "Washington", value: "WA" },
    { label: "West Virginia", value: "WV" },
    { label: "Wisconsin", value: "WI" },
    { label: "Wyoming", value: "WY" },
  ],
  CAN: [
    { label: "Alberta", value: "AB" },
    { label: "British Columbia", value: "BC" },
    { label: "Manitoba", value: "MB" },
    { label: "New Brunswick", value: "NB" },
    { label: "Newfoundland and Labrador", value: "NL" },
    { label: "Nova Scotia", value: "NS" },
    { label: "Northwest Territories", value: "NT" },
    { label: "Nunavut", value: "NU" },
    { label: "Ontario", value: "ON" },
    { label: "Prince Edward Island", value: "PE" },
    { label: "Quebec", value: "QC" },
    { label: "Saskatchewan", value: "SK" },
    { label: "Yukon", value: "YT" },
  ],
};

// src/lib/constants.ts
export const IMAGES = {
  PASSPORT: "/assets/passportLogo",
  PASSPORT_TEST: "/assets/passporttest.png",
  PASSPORT_2: "/assets/hero-passport-2.png",
  PASSPORT_3: "/assets/hero-passport-3.png",
} as const;

export { IMGS, NAV_LINKS, CONST_APIS, STATES };
