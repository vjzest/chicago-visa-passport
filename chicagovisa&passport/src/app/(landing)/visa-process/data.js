const visaProccess = "/landing/assets/visa-process-img.png";
const visaProccess2 = "/landing/assets/step-2-img.png";
const visaProccess3 = "/landing/assets/step-3-img.png";

export const visaSteps = [
  {
    id: 1,
    bg: "#122241",
    top: "50px",
    textColor: "white",
    img: visaProccess,
    title: "Start Your <br /> Application",
    paragraphs: [
      "Begin by completing our quick and secure online application form.",
    ],
    list: [
      "Enter your personal details, travel information, and any required background information.",
      "Our system is designed to make the process simple, guiding you step by step.",
      "You’ll also receive a checklist of supporting documents needed for your application.",
    ],
    final: "👉 This step usually takes just 10–15 minutes to complete.",
  },
  {
    id: 2,
    bg: "#c7e6fd",
    top: "100px",
    textColor: "#1c1c1c",
    img: visaProccess2,
    title: "Submit Your <br /> Documents",
    paragraphs: [
      "Once your application is complete, upload or deliver your required documents for verification.",
      "Our team reviews each submission carefully to ensure accuracy and compliance with all government requirements before proceeding to the next stage.",
    ],
  },
  {
    id: 3,
    bg: "#f8f9fd",
    top: "150px",
    translateY: "50px",
    textColor: "#1c1c1c",
    img: visaProccess3,
    title: "Receive Your <br /> Passport or Visa",
    paragraphs: [
      "After approval, you’ll receive your passport or visa quickly and securely — either by mail or in person, depending on your preference.",
      "We’ll notify you at every stage so you know exactly when your documents are ready for collection.",
    ],
  },
];
