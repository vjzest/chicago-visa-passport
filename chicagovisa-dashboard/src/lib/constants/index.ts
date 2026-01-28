import ClipBoardCopyIcon from "../../../public/assets/icons/clipboard-copy.svg";
import UserPlaceHolder from "../../../public/assets/images/user-placeholder.jpg";
// import TechnicalIssue from "../../../public/assets/images/techical-issue.png";
const IMGS = {
  ClipBoardCopyIcon,
  UserPlaceHolder,
  // TechnicalIssue,
};

const NAV_LINKS = [
  {
    name: "Home",
    link: "/performance",
  },
  {
    name: "About Us",
    link: "/about-us",
  },
  {
    name: "Contact Us",
    link: "/contact-us",
  },
] as const;

export { NAV_LINKS, IMGS };
