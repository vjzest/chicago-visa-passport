// Define the base interface for slide data
export interface HeroSlide {
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
}

// Define the hero data array
export const heroData: HeroSlide[] = [
  {
    title: "Get Your U.S. Passport Fast and Securely",
    description:
      "Simplify your passport application with our trusted expedited online services.",
    buttonText: "Start Application",
    imageSrc: "/assets/passportLogo.png", // Updated with consistent naming and extension
  },
  {
    title: "Expedited Passport Processing",
    description:
      "Get your passport in as little as 24 hours with our expedited service.",
    buttonText: "Learn More",
    imageSrc: "/assets/passport-with-circle.png", // Use the same image for consistency
  },
  {
    title: "Passport Renewal Made Easy",
    description:
      "Quick and hassle-free passport renewal service for U.S. citizens.",
    buttonText: "Renew Now",
    imageSrc: "/assets/passport-with-circle.png", // Use the same image for consistency
  },
];

// Define the extended interface for the Hero component props
export interface HeroProps extends HeroSlide {
  onButtonClick?: () => void;
  onPrevSlide?: () => void;
  onNextSlide?: () => void;
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  totalSlides: number;
}
