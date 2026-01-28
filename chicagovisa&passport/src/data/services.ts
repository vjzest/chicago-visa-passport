import { ENV } from "@/lib/env";

interface Service {
  case: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerSteps1: string;
  bannerSteps2: string;
  bannerSteps3: string;
  bannerButton: {
    text: string;
    link: string;
  };
  image: string;
  bannerContent: string;
  whoFor: {
    title: string;
    description: string;
  };
  processingTime: {
    title: string;
    description: string;
  };
  cost: {
    title: string;
    description: string;
  };
  requirements: {
    title: string;
    description: string;
    items: Array<{
      id: number;
      title: string;
      description: string;
      points: string | Array<string>;
      isExpanded: boolean;
      hasIcon: boolean;
    }>;
    requirementButton: {
      text: string;
      link: string;
    };
  };
  government: {
    title: string;
    subTitle: string;
    instruction: string;
    paymentInstructions: Array<{
      id: number;
      description: string;
    }>;
    button: {
      text: string;
      link: string;
    };
  };
  pricing: {
    title: string;
    subTitle: string;
    items: Array<{
      id: number;
      title: string;
      processingTime: string;
      price: string;
      fees: string;
      button: {
        text: string;
        link: string;
      };
    }>;
  };
}

interface Services {
  [key: string]: Service;
}

export const services: Services = {
  "passport-renewal": {
    case: "passport-renewal",
    bannerTitle: "Fast Passport Renewal –",
    bannerSubtitle: "Get Yours in Just 3 Days",
    bannerSteps1:
      "You are eligible to renew your passport if it was originally issued for a 10-year validity period and has expired within the last five years. Additionally, you must still have the passport in your possession, and it should be in good condition.",
    bannerSteps2: "",
    bannerSteps3: "",
    bannerButton: {
      text: "Start Application",
      link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
    },
    image: "/assets/passport-services/renewal1.png",
    bannerContent:
      "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
    whoFor: {
      title: "Who Needs Passport Renewal?",
      description:
        "U.S. citizens with a valid 10-year passport that is still in good condition and needs renewal.",
    },
    processingTime: {
      title: "Processing Time",
      description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
    },
    cost: {
      title: "Cost",
      description:
        "Starting from $189, with additional fees for expedited services.",
    },
    requirements: {
      title: "Passport Renewal Requirements",
      description:
        "To renew your passport, you need to submit the following documents and meet these requirements:",
      items: [
        {
          id: 1,
          title: "Valid U.S. Passport (10-Year Adult Passport Book)",
          description:
            "Your passport must have been issued with a 10-year validity and must be either still valid or expired within the last 5 years. You must submit the physical passport, which must be undamaged.",
          points: [
            "If your name has changed, include a marriage certificate, divorce decree, or court-issued name change document.",
            "If you also have a valid passport card, it must be submitted along with the passport book.",
            "Child passports (valid for 5 years) cannot be renewed—a new application is required.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 2,
          title: "Passport Photo",
          description:
            "You must provide two new passport photos that meet the official requirements:",
          points: [
            "Recent Photos: Must be taken within the last 3 months.",
            "No Accessories Allowed: Hats and glasses are not permitted (unless medically necessary with a doctor’s note).",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 3,
          title: "DS-82 Form (Completed Online)",
          description: "",
          points: [
            "Fill out the DS-82 form online, print it with the barcode, and sign it.",
            "Handwritten forms are not accepted and will result in processing delays.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 4,
          title: "Government Passport Fee",
          description: "",
          points: [
            "Pay the $211.36 fee via personal check or money order payable to the U.S. Department of State.",
            "Ensure all details are clear and legible to prevent delays.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 5,
          title: "Photocopy of Valid Photo Identification",
          description:
            "Provide a clear, color copy (front and back) of one of the following:",
          points: [
            "Driver’s License,State ID Card,Military ID,Valid U. S. Passport",
            "If your name has changed, include an original marriage certificate, divorce decree, or court-issued name change document.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 6,
          title: "Proof of Travel Departure",
          description:
            "You must provide ONE of the following as proof of upcoming travel:",
          points: [
            "Flight Confirmation: A clear printout of your airline ticket email confirmation showing your name as the passenger.",
            "Driving Across the Border: Submit a printed foreign hotel confirmation AND a typed letter explaining your ground travel plans.",
            "Business Travel: Provide a typed company letter confirming the trip.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 7,
          title: "Letter of Authorization",
          description: "",
          points: [
            "Fill out by hand using black ink only.",
            "Incorrectly completed forms may cause a 4-business day delay.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
      ],
      requirementButton: {
        text: "Start Application",
        link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
      },
    },
    government: {
      title: "Government Passport Fees for Renewal",
      subTitle:
        "The passport renewal fee is $211.36, payable by personal check or money order to the U.S. Department of State. This payment must be included in the sealed envelope.",
      instruction: "Important Payment Instructions:",
      paymentInstructions: [
        {
          id: 1,
          description:
            "Write the applicant’s date of birth in the memo section of your check or money order.",
        },
        {
          id: 2,
          description:
            "Ensure all details are clearly written—for money orders, also include your name, address, and date of birth.",
        },
        {
          id: 3,
          description:
            "Avoid illegible handwriting, abbreviations, corrections, starter checks, or postdated checks, as these will be rejected and could delay processing by up to four days.",
        },
        {
          id: 4,
          description:
            "For personal checks, ensure your name and address are pre-printed on the check.",
        },
        {
          id: 5,
          description:
            "If applying for a passport card along with your book, add $30 to the total government fee.",
        },
        {
          id: 6,
          description:
            "Make a copy of your completed check or money order and place it loosely in your shipping envelope for reference.",
        },
      ],
      button: {
        text: "Get Started",
        link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
      },
    },
    pricing: {
      title: "Pricing",
      subTitle: "Choose the service that suits your passport needs.",
      items: [
        {
          id: 1,
          title: "Expedited",
          processingTime: "3-4 Weeks",
          price: "$189.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
          },
        },
        {
          id: 2,
          title: "Express",
          processingTime: "10-14 Business Days",
          price: "$299.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
          },
        },
        {
          id: 3,
          title: "Rush",
          processingTime: "7-10 Business Days",
          price: "$399.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
          },
        },
        {
          id: 4,
          title: "Priority",
          processingTime: "5-7 Business Days",
          price: "$499.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
          },
        },
        {
          id: 5,
          title: "Emergency",
          processingTime: "3-5 Business Days",
          price: "$599.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-renewal`,
          },
        },
      ],
    },
  },

  "new-adult-passport": {
    case: "new-adult-passport",
    bannerTitle: "Get New Passport",
    bannerSubtitle: "In As Little As 3 Days",
    bannerSteps1:
      "New passports are available for: First-time applicants that are aged 16 and older and adults whose previous passports expired over five years ago.",
    bannerSteps2: "",
    bannerSteps3: "",
    bannerButton: {
      text: "Start Application",
      link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
    },
    image: "/assets/passport-services/new-passport.png",
    bannerContent:
      "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
    whoFor: {
      title: "Who Is It For",
      description:
        "U.S. citizens who need to renew their passport, and it is still in good condition.",
    },
    processingTime: {
      title: "Processing Time",
      description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
    },
    cost: {
      title: "Cost",
      description:
        "Starting from $189*, plus additional government fees listed before and at the time of purchase.(* This price applies to a specific passport type and service speed. Prices are subject to change without notice or update.)",
    },
    requirements: {
      title: "Requirements For New Passport",
      description:
        "When applying to renew your passport, you need to submit the following documents and meet these requirements:",
      items: [
        {
          id: 1,
          title: "Proof of U.S. Citizenship",
          description:
            "You must submit one original document as proof of U.S. citizenship (copies are not accepted):",
          points: [
            "Certified U.S. Birth Certificate – Must be an official document. Texas and California “Abstract” birth certificates will not be accepted.",
            "Expired U.S. Passport – Must be undamaged. If you have a valid passport, it must also be submitted.",
            "Original Naturalization Certificate, FS-240, DS-1350, or Certificate of Citizenship Abroad.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 2,
          title: "Photocopy of Valid Photo Identification (Front & Back)",
          description:
            "Submit a clear color copy (front and back) of a valid government-issued ID:",
          points: [
            "Driver’s License",
            "State ID Card",
            "Military ID",
            "Valid U.S. Passport",
            "If your name has changed since the issuance of your citizenship document, you must also include an original marriage certificate, divorce decree, or court-issued name change document",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 3,
          title: "Passport Photo",
          description:
            "You must provide two new passport photos that meet the official requirements:",
          points: [
            "Recent Photos: Must be taken within the last 3 months.",
            "No Accessories Allowed: Hats and glasses are not permitted (unless medically necessary with a doctor’s note).",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 4,
          title: "Letter of Authorization",
          description: "",
          points: [
            "Fill out by hand using black ink only.",
            "Incorrectly completed forms may cause a 4-business day delay.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 5,
          title: "DS-82 Form Completed Online",
          description: "",
          points: [
            "The DS-11 application must be completed digitally and printed with a barcode.",
            "Handwritten forms are not accepted and will result in a 4-day delay.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 6,
          title: "Proof of Travel",
          description:
            "You must provide ONE of the following as proof of upcoming travel:",
          points: [
            "Flight Confirmation: A clear printout of your airline ticket email confirmation showing your name as the passenger.",
            "Driving Across the Border: Submit a printed foreign hotel confirmation AND a typed letter explaining your ground travel plans.",
            "Business Travel: Provide a typed company letter confirming the trip.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 7,
          title: "Government Passport Fee",
          description: "",
          points: [
            "$211.36 payment must be made via Personal Check or Money Order, payable to U.S. Department of State, and placed inside the sealed envelope.",
            "Ensure all details are clear and legible to prevent delays.",
            "An additional $35 fee is paid separately to the acceptance agent.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 8,
          title: "Print the Order Confirmation Email",
          description: "",
          points: [
            "Print the PDF attached to your order confirmation email and include it in your shipment.",
            "Ensure the email contains all order details and shipping addresses.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
      ],
      requirementButton: {
        text: "Start Application",
        link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
      },
    },
    government: {
      title: "Government Passport Fees for New Passport",
      subTitle:
        "A fee of $211.36 should be paid by personal check or money order, made out to the U.S. Department of State, and included in the sealed envelope. An additional $35 fee is paid separately to the acceptance agent.",
      instruction: "Important Payment Instructions:",
      paymentInstructions: [
        {
          id: 1,
          description:
            "Write the applicant's date of birth in the memo section of your check or money order.",
        },
        {
          id: 2,
          description:
            "Ensure the check or money order is clearly written. If using a money order, also include your name, address, and date of birth.",
        },
        {
          id: 3,
          description:
            "Avoid illegible writing, abbreviations, corrections, starter checks, or postdated checks, as these will be rejected and may delay processing by four days.",
        },
        {
          id: 4,
          description:
            "For personal checks, ensure your name and address are printed on the check.",
        },
        {
          id: 5,
          description:
            "If applying for a passport card as well, add $30 to the government fee.",
        },
        {
          id: 6,
          description:
            "Finally, make a copy of your completed check and place it loosely in your shipping envelope.",
        },
      ],
      button: {
        text: "Get Started",
        link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
      },
    },
    pricing: {
      title: "Pricing",
      subTitle: "Choose the service that suits your passport needs.",
      items: [
        {
          id: 1,
          title: "Expedited",
          processingTime: "3-4 Weeks",
          price: "$189.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
          },
        },
        {
          id: 2,
          title: "Express",
          processingTime: "10-14 Business Days",
          price: "$299.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
          },
        },
        {
          id: 3,
          title: "Rush",
          processingTime: "7-10 Business Days",
          price: "$399.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
          },
        },
        {
          id: 4,
          title: "Priority",
          processingTime: "5-7 Business Days",
          price: "$499.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
          },
        },
        {
          id: 5,
          title: "Emergency",
          processingTime: "3-5 Business Days",
          price: "$599.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=new-adult-passport`,
          },
        },
      ],
    },
  },

  "child-passport-services": {
    case: "child-passport-services",
    bannerTitle: "Child Passport",
    bannerSubtitle: "In As Little As 3 Days",
    bannerSteps1:
      "Child passports are available for applicants under 16 years of age. Whether or not the child has previously held a passport, applicants under 16 must apply for a child passport.",
    bannerSteps2: "",
    bannerSteps3: "",
    bannerButton: {
      text: "Start Application",
      link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
    },
    image: "/assets/passport-services/child-passport.png",
    bannerContent:
      "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
    whoFor: {
      title: "Who Is It For",
      description:
        "U.S. citizens who need to renew their passport, and it is still in good condition.",
    },
    processingTime: {
      title: "Processing Time",
      description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
    },
    cost: {
      title: "Cost",
      description:
        "Starting from $189, with additional fees for expedited services.",
    },
    requirements: {
      title: "Requirements for Child Passport",
      description:
        "When applying to renew your passport, you need to submit the following documents and meet these requirements:",
      items: [
        {
          id: 1,
          title: "Proof of U.S. Citizenship",
          description:
            "You must provide one of the following original documents as proof of U.S. citizenship:",
          points: [
            "Certified U.S. Birth Certificate – Must be an official document. Texas and California “Abstract” birth certificates are NOT accepted.",
            "Valid U.S. Passport (if applicable) – If the child currently has a valid passport, you must include it along with the birth certificate.",
            "Original U.S. Naturalization Certificate, FS-240, DS-1350, or Certificate of Citizenship Abroad – Acceptable as proof of U.S. citizenship.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 2,
          title: "Passport Photo (Two New Photos)",
          description: "",
          points: [
            "Must be recent: Photos must be taken within the last 3 months.",
            "No accessories allowed: Hats and glasses are prohibited",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 3,
          title: "Letter of Authorization",
          description:
            "Complete the Letter of Authorization by hand using black ink only.",
          points: [
            "Fill out by hand using black ink only. Avoid mistakes – Incorrectly completed forms may result in a 4-business day delay.",
            "For a Child Passport: Both parents MUST sign their own signature in the “Applicant Signature” section.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 4,
          title: "Photo Of Valid ID From Each Parent",
          description: "Please Copy in color the front and back of valid ID)",
          points: [
            "One clear color copy of both parent's valid Driver's License, State ID Card, or Military ID, or Passport.",
            "If parent's name has changed from citizenship document you also must provide the original marriage certificate, divorce decree, or court issued name change document.",
          ],
          isExpanded: true,
          hasIcon: true,
        },

        {
          id: 5,
          title: "Proof of Travel Departure",
          description:
            "You must provide ONE of the following as proof of upcoming travel:",
          points: [
            "Flight Confirmation: A clear printout of your airline ticket email confirmation showing your name as the passenger.",
            "Driving Across the Border: Submit a printed foreign hotel confirmation AND a typed letter explaining your ground travel plans.",
            "Business Travel: Provide a typed company letter confirming the trip.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 6,
          title: "Notarized Non-Present Parental Consent",
          description:
            "This form DS-3053 is required only if one parent is unable to be present at the Acceptance Agent appointment with the child.",
          points: [
            "The non-present parent must have the consent form notarized.",
            "The notarized form must be given to the attending parent, along with a clear copy of the non-present parent's valid ID (front and back).",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 7,
          title: "No Social Security Number Statement",
          description:
            "This form is only required if the child passport applicant does not have a Social Security Number (SSN).",
          points: [
            "The U.S. State Department expects all passport applicants to have an SSN.",
            "If the child has never been assigned a Social Security Number, the parent or legal guardian must submit a signed statement declaring that the child does not have one.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 8,
          title: "Government Passport Fee – $181.36",
          description: "",
          points: [
            "Payment of $181.36 must be made via Personal Check or Money Order, payable to U.S. Department of State and placed inside the sealed envelope. An additional $35 fee is paid separately to the acceptance agent.",
            "Write the applicant’s date of birth in the memo section of your check or money order.Starter checks or postdated checks (these will be rejected). For personal checks, ensure your name and address are pre-printed on the check.",
            "If applying for a child's passport card, add $15.00 to the government fee",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 9,
          title: "Print the Order Confirmation Email",
          description: "",
          points: [
            "Print the PDF attachment from your order confirmation email. Place it loosely inside your FedEx shipping envelope—do not let the acceptance agent seal it.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 10,
          title: "DS-11 Form – Completed Online & Printed with Barcode",
          description: "",
          points: [
            "The State Department DS-11 Passport Application must be digitally completed and printed with a barcode. Handwritten forms are NOT accepted and will result in a 4-day processing delay.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
      ],
      requirementButton: {
        text: "Start Application",
        link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
      },
    },
    government: {
      title: "Government Passport Fees for Child Passport",
      subTitle:
        "A fee of $181.36 should be paid by personal check or money order, made out to the U.S. Department of State, and included in the sealed envelope. Additionally, an acceptance agent fee of $35 is paid separately.",
      instruction: "Important Payment Instructions:",
      paymentInstructions: [
        {
          id: 1,
          description:
            "Write the applicant's date of birth in the memo section of your check or money order.",
        },
        {
          id: 2,
          description:
            "Ensure the check or money order is clearly written. If using a money order, also include your name, address, and date of birth.",
        },
        {
          id: 3,
          description:
            "Avoid illegible writing, abbreviations, corrections, starter checks, or postdated checks, as these will be rejected and may delay processing by four days.",
        },
        {
          id: 4,
          description:
            "For personal checks, ensure your name and address are printed on the check.",
        },
        {
          id: 5,
          description:
            "If applying for a passport card as well, add $15 to the government fee.",
        },
        {
          id: 6,
          description:
            "Finally, make a copy of your completed check and place it loosely in your shipping envelope.",
        },
      ],
      button: {
        text: "Get Started",
        link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
      },
    },
    pricing: {
      title: "Pricing",
      subTitle: "Choose the service that suits your passport needs.",
      items: [
        {
          id: 1,
          title: "Expedited",
          processingTime: "3-4 Weeks",
          price: "$189.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
          },
        },
        {
          id: 2,
          title: "Express",
          processingTime: "10-14 Business Days",
          price: "$299.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
          },
        },
        {
          id: 3,
          title: "Rush",
          processingTime: "7-10 Business Days",
          price: "$399.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
          },
        },
        {
          id: 4,
          title: "Priority",
          processingTime: "5-7 Business Days",
          price: "$499.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
          },
        },
        {
          id: 5,
          title: "Emergency",
          processingTime: "3-5 Business Days",
          price: "$599.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=child-passport`,
          },
        },
      ],
    },
  },

  "damaged-passport": {
    case: "damaged-passport",
    bannerTitle: "Replace Damaged Passport",
    bannerSubtitle: "In As Little As 3 Days",
    bannerSteps1:
      "Passport Card service is only for applicants that are 16 year old or older and choose to apply for the passport card and not the passport book. Keep in mind that passport cards can only be used to drive across the border or to take an ocean cruise, they cannot be used to board an international flight out of the US.",
    bannerSteps2: "",
    bannerSteps3: "",
    bannerButton: {
      text: "Start Application",
      link: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
    },
    image: "/assets/passport-services/damaged.png",
    bannerContent:
      "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
    whoFor: {
      title: "Who Is It For",
      description:
        "U.S. citizens who need to renew their passport, and it is still in good condition.",
    },
    processingTime: {
      title: "Processing Time",
      description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
    },
    cost: {
      title: "Cost",
      description:
        "Starting from $189, with additional fees for expedited services.",
    },
    requirements: {
      title: "Requirements for Damaged Passport",
      description:
        "When applying to renew your passport, you need to submit the following documents and meet these requirements:",
      items: [
        {
          id: 1,
          title: "Proof of U.S. Citizenship",
          description:
            "You must provide ONE of the following original documents:",
          points: [
            "Certified U.S. Birth Certificate (Must be an official document; Texas and California Abstract birth certificates are not accepted).",
            "Expired U.S. Passport (Must be undamaged; if you have a valid passport, it must also be submitted).",
            "Original Naturalization Certificate, FS-240, DS-1350, or Certificate of Citizenship Abroad.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 2,
          title: "Photocopy of Valid Photo Identification (Front & Back)",
          description:
            "You must provide one clear color copy (front and back) of a valid government-issued ID:",
          points: [
            "Driver’s License",
            "State ID Card",
            "Military ID",
            "Valid U.S. Passport",
            "If your name has changed from what appears on your citizenship document, you must also submit the original marriage certificate, divorce decree, or court-issued name change document.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 3,
          title: "Passport Photo",
          description:
            "You must provide two new passport photos that meet the following criteria:",
          points: [
            "Recent Photos: Must be taken within the last 3 months.",
            "No Accessories: Hats and glasses are prohibited (photos with them will be rejected).",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 4,
          title: "Letter of Authorization",
          description: "",
          points: [
            "Fill out by hand using black ink only.",
            "Incorrectly completed forms may cause a 4-business day delay.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 5,
          title: "DS-11 Form – Complete Online & Print with Barcode",
          description: "",
          points: [
            "Fill out the DS-82 form online, print it with the barcode, and sign it.",
            "Handwritten forms are not accepted and will result in processing delays.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 6,
          title: "Proof of Travel",
          description:
            "You must provide ONE of the following as proof of upcoming travel:",
          points: [
            "Flight Confirmation: A clear printout of your airline ticket email confirmation showing your name as the passenger.",
            "Driving Across the Border: Submit a printed foreign hotel confirmation AND a typed letter explaining your ground travel plans.",
            "Business Travel: Provide a typed company letter confirming the trip.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 7,
          title: "Damaged Passport Statement + Damaged Passport",
          description: "",
          points: [
            "Print the PDF form and provide a detailed explanation of how, when, and where the passport was damaged.",
            "Complete the form in blue or black ink, then sign and date it.",
            "Submit the actual damaged passport along with your application.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 8,
          title: "Government Passport Fee",
          description: "",
          points: [
            "Pay the $211.36 fee via personal check or money order payable to the U.S. Department of State.",
            "Ensure all details are clear and legible to prevent delays.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 9,
          title: "Print the Order Confirmation Email ",
          description: "",
          points: [
            "Print the PDF attached to your order confirmation email and include it in your shipment.",
            "Ensure the email contains all order details and shipping addresses.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
      ],
      requirementButton: {
        text: "Start Application",
        link: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
      },
    },
    government: {
      title: "Government Passport Fees for Damaged Passport",
      subTitle:
        "A fee of $211.36 should be paid by personal check or money order, made out to the U.S. Department of State, and included in the sealed envelope. An additional $35 fee is paid separately to the acceptance agent.",
      instruction: "Important Payment Instructions:",
      paymentInstructions: [
        {
          id: 1,
          description:
            "Write the applicant's date of birth in the memo section of your check or money order.",
        },
        {
          id: 2,
          description:
            "Ensure the check or money order is clearly written. If using a money order, also include your name, address, and date of birth.",
        },
        {
          id: 3,
          description:
            "Avoid illegible writing, abbreviations, corrections, starter checks, or postdated checks, as these will be rejected and may delay processing by four days.",
        },
        {
          id: 4,
          description:
            "For personal checks, ensure your name and address are printed on the check.",
        },
        {
          id: 5,
          description:
            "If applying for a passport card as well, add $30 to the government fee.",
        },
        {
          id: 6,
          description:
            "Finally, make a copy of your completed check and place it loosely in your shipping envelope.",
        },
      ],
      button: {
        text: "Get Started",
        link: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
      },
    },
    pricing: {
      title: "Pricing",
      subTitle: "Choose the service that suits your passport needs.",
      items: [
        {
          id: 1,
          title: "Expedited",
          processingTime: "3-4 Weeks",
          price: "$189.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
          },
        },
        {
          id: 2,
          title: "Express",
          processingTime: "10-14 Business Days",
          price: "$299.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
          },
        },
        {
          id: 3,
          title: "Rush",
          processingTime: "7-10 Business Days",
          price: "$399.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
          },
        },
        {
          id: 4,
          title: "Priority",
          processingTime: "5-7 Business Days",
          price: "$499.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
          },
        },
        {
          id: 5,
          title: "Emergency",
          processingTime: "3-5 Business Days",
          price: "$599.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=damaged-passport`,
          },
        },
      ],
    },
  },

  "add-passport-pages": {
    case: "add-passport-pages",
    bannerTitle: "Add Page",
    bannerSubtitle: "In As Little As 3 Days",
    bannerSteps1:
      "Passport Card service is only for applicants that are 16 year old or older and choose to apply for the passport card and not the passport book. Keep in mind that passport cards can only be used to drive across the border or to take an ocean cruise, they cannot be used to board an international flight out of the US.",
    bannerSteps2: "",
    bannerSteps3: "",
    bannerButton: {
      text: "Start Application",
      link: `${ENV.APPLY_URL}/apply?service-type=add-passport-pages`,
    },
    image: "/assets/passport-services/add-page.png",
    bannerContent:
      "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
    whoFor: {
      title: "Who Is It For",
      description:
        "U.S. citizens who need to renew their passport, and it is still in good condition.",
    },
    processingTime: {
      title: "Processing Time",
      description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
    },
    cost: {
      title: "Cost",
      description:
        "Starting from $189, with additional fees for expedited services.",
    },
    requirements: {
      title: "Requirements for Add Passport Pages",
      description:
        "When applying to renew your passport, you need to submit the following documents and meet these requirements:",
      items: [
        {
          id: 1,
          title: "U.S. Passport (Adult 10-Year Validity U.S. Passport Book)",
          description:
            "Your passport must have been valid for 10 years and still be valid or expired within the last 5 years. You must send in the actual passport, and it must be in good condition (no damage). If your name has changed, you also must provide a marriage certificate, divorce decree, or court-issued name change document. If you also have a valid passport card, it must also be sent in along with the passport book. Child passports are only valid for 5 years and therefore cannot be renewed.",
          points: [],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 2,
          title: "Photocopy of Valid Photo Identification",
          description:
            "Provide one clear color copy of your valid Driver's License, State ID Card, Military ID, or valid Passport (front and back). If your name has changed from your citizenship document, you also must provide the original marriage certificate, divorce decree, or court-issued name change document.",
          points: [],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 3,
          title: "Passport Photo",
          description:
            "Staple the passport photo to the application using a vertical staple at each corner (include a second loose photo). The photo must be new (under 3 months old) and different from the photo in the old passport. Hats and glasses are not allowed in the passport photo.",
          points: [],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 4,
          title: "Letter of Authorization",
          description:
            "Fill out the Letter of Authorization manually using blue or black ink. Select only the first two checkboxes at the top and leave the third one blank. Specify Chicago Passport & Visa Expedite as the Courier Company Name.",
          points: [],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 5,
          title: "DS-82 Form Completed Online",
          description:
            "Complete the DS-82 form online, print it with the barcode, and sign it. Handwritten forms are not acceptable and will cause delays.",
          points: [],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 6,
          title: "Proof of Travel Departure",
          description:
            "Include a clear printout of your airline ticket email confirmation or a foreign hotel confirmation and a typed letter explaining your travel details.",
          points: [],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 7,
          title: "Government Passport Fee",
          description:
            "Pay the $211.36 fee using a personal check or money order payable to U.S. Department of State.Ensure all details are legible to avoid processing delays.",
          points: [],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 8,
          title: "Print the Order Confirmation Email",
          description:
            "Print the PDF attached to your order confirmation email and include it in your shipment. Ensure the email contains all order details and shipping addresses.",
          points: [],

          isExpanded: true,
          hasIcon: true,
        },
      ],
      requirementButton: {
        text: "Start Application",
        link: "",
      },
    },
    government: {
      title: "Government Passport Fees for Add Passport Pages",
      subTitle:
        "A fee of $211.36 should be paid by personal check or money order, made out to the U.S. Department of State, and included in the sealed envelope. An additional $35 fee is paid separately to the acceptance agent.",
      instruction: "Important Payment Instructions:",
      paymentInstructions: [
        {
          id: 1,
          description:
            "Write the applicant's date of birth in the memo section of your check or money order.",
        },
        {
          id: 2,
          description:
            "Ensure the check or money order is clearly written. If using a money order, also include your name, address, and date of birth.",
        },
        {
          id: 3,
          description:
            "Avoid illegible writing, abbreviations, corrections, starter checks, or postdated checks, as these will be rejected and may delay processing by four days.",
        },
        {
          id: 4,
          description:
            "For personal checks, ensure your name and address are printed on the check.",
        },
        {
          id: 5,
          description:
            "If applying for a passport card as well, add $30 to the government fee.",
        },
        {
          id: 6,
          description:
            "Finally, make a copy of your completed check and place it loosely in your shipping envelope.",
        },
      ],
      button: {
        text: "Get Started",
        link: "",
      },
    },
    pricing: {
      title: "Pricing",
      subTitle: "Choose the service that suits your passport needs.",
      items: [
        {
          id: 1,
          title: "Expedited",
          processingTime: "3-4 Weeks",
          price: "$189.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: "",
          },
        },
        {
          id: 2,
          title: "Express",
          processingTime: "10-14 Business Days",
          price: "$299.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: "",
          },
        },
        {
          id: 3,
          title: "Rush",
          processingTime: "7-10 Business Days",
          price: "$399.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: "",
          },
        },
        {
          id: 4,
          title: "Priority",
          processingTime: "5-7 Business Days",
          price: "$499.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: "",
          },
        },
        {
          id: 5,
          title: "Emergency",
          processingTime: "3-5 Business Days",
          price: "$599.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: "",
          },
        },
      ],
    },
  },

  "passport-name-change": {
    case: "passport-name-change",
    bannerTitle: "Name Change",
    bannerSubtitle: "In As Little As 3 Days",
    bannerSteps1:
      "If your passport was issued less than a year ago and you need to change your name or fix incorrect data, then a data correction application is what you need.",
    bannerSteps2: "",
    bannerSteps3: "",
    bannerButton: {
      text: "Start Application",
      link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
    },
    image: "/assets/passport-services/name-change.png",
    bannerContent:
      "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
    whoFor: {
      title: "Who Is It For",
      description:
        "U.S. citizens who need to renew their passport, and it is still in good condition.",
    },
    processingTime: {
      title: "Processing Time",
      description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
    },
    cost: {
      title: "Cost",
      description:
        "Starting from $189, with additional fees for expedited services.",
    },
    requirements: {
      title: "Requirements for Name Change",
      description:
        "When applying to renew your passport, you need to submit the following documents and meet these requirements:",
      items: [
        {
          id: 1,
          title:
            "U.S. Passport (Adult 10-Year Validity – Name or Data Correction)",
          description: "",
          points: [
            "You must submit a 10-year validity (adult) passport that was issued less than one year ago.",
            "Replacement passports are for adults whose passports were issued within the last 12 months and require a name change or correction of personal data.",
            "A replacement passport can also be used to correct any errors in descriptive information.",
            "If your passport was issued more than a year ago, you must apply for a passport renewal instead.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 2,
          title: "Proof of U.S. Citizenship",
          description:
            "You must submit one original document as proof of U.S. citizenship (copies are not accepted):",
          points: [
            "Certified U.S. Birth Certificate – Must be an official document. Texas and California “Abstract” birth certificates will not be accepted.",
            "Expired U.S. Passport – Must be undamaged. If you have a valid passport, it must also be submitted.",
            "Original Naturalization Certificate, FS-240, DS-1350, or Certificate of Citizenship Abroad.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 3,
          title: "Photocopy of Valid Photo Identification (Front & Back)",
          description:
            "Submit a clear color copy (front and back) of a valid government-issued ID:",
          points: [
            "Driver’s License",
            "State ID Card",
            "Military ID",
            "Valid U.S. Passport",
            "If your name has changed since the issuance of your citizenship document, you must also include an original marriage certificate, divorce decree, or court-issued name change document.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 4,
          title: "Passport Photo",
          description:
            "You must provide two new passport photos that meet the official requirements:",
          points: [
            "Recent Photos: Must be taken within the last 3 months.",
            "No Accessories Allowed: Hats and glasses are not permitted (unless medically necessary with a doctor’s note).",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 5,
          title: "Letter of Authorization",
          description: "",
          points: [
            "Fill out by hand using black ink only.",
            "Incorrectly completed forms may cause a 4-business day delay.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 6,
          title: "DS-5504 Form – Completed Online & Printed with Barcode",
          description: "",
          points: [
            "The DS-5504 Passport Application must be digitally completed, printed with a barcode, and signed. Handwritten forms are NOT accepted and will result in a 4-day processing delay.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 7,
          title: "Proof of Travel",
          description:
            "You must provide ONE of the following as proof of upcoming travel:",
          points: [
            "Flight Confirmation: A clear printout of your airline ticket email confirmation showing your name as the passenger.",
            "Driving Across the Border: Submit a printed foreign hotel confirmation AND a typed letter explaining your ground travel plans.",
            "Business Travel: Provide a typed company letter confirming the trip",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 8,
          title: "Document Proving Name Change or Data Error",
          description:
            "To correct your passport information, you must submit one original document that verifies the necessary change:",
          points: [
            "For a name change: Provide the original marriage certificate, divorce decree, or court-issued name change document.For a data error correction: Submit an original certified document that proves the correct information, such as:",
            "Birth Certificate",
            " Naturalization Certificate",
            "Marriage Certificate",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 9,
          title: "Document Proving Name Change or Data Error",
          description: "",
          points: [
            "Payment of $81.36 must be made via Personal Check or Money Order, payable to U.S. Department of State",
            "Write the applicant’s date of birth in the memo section of the check or money order.",
            "Ensure all details are clearly written – If using a money order, also include your name, address, and date of birth.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 10,
          title: "Print the Order Confirmation Email",
          description: "",
          points: [
            "Print the PDF attached to your order confirmation email and include it in your shipment.",
            "Ensure the email contains all order details and shipping addresses.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
      ],
      requirementButton: {
        text: "Start Application",
        link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
      },
    },
    government: {
      title: "Government Passport Fees for Name Change",
      subTitle:
        "A fee of $211.36 should be paid by personal check or money order, made out to the U.S. Department of State, and included in the sealed envelope. ",
      instruction: "Important Payment Instructions:",
      paymentInstructions: [
        {
          id: 1,
          description:
            "Write the applicant's date of birth in the memo section of your check or money order.",
        },
        {
          id: 2,
          description:
            "Ensure the check or money order is clearly written. If using a money order, also include your name, address, and date of birth.",
        },
        {
          id: 3,
          description:
            "Avoid illegible writing, abbreviations, corrections, starter checks, or postdated checks, as these will be rejected and may delay processing by four days.",
        },
        {
          id: 4,
          description:
            "For personal checks, ensure your name and address are printed on the check.",
        },
        {
          id: 5,
          description:
            "If applying for a passport card as well, add $30 to the government fee.",
        },
        {
          id: 6,
          description:
            "Finally, make a copy of your completed check and place it loosely in your shipping envelope.",
        },
      ],
      button: {
        text: "Get Started",
        link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
      },
    },
    pricing: {
      title: "Pricing",
      subTitle: "Choose the service that suits your passport needs.",
      items: [
        {
          id: 1,
          title: "Expedited",
          processingTime: "3-4 Weeks",
          price: "$189.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
          },
        },
        {
          id: 2,
          title: "Express",
          processingTime: "10-14 Business Days",
          price: "$299.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
          },
        },
        {
          id: 3,
          title: "Rush",
          processingTime: "7-10 Business Days",
          price: "$399.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
          },
        },
        {
          id: 4,
          title: "Priority",
          processingTime: "5-7 Business Days",
          price: "$499.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
          },
        },
        {
          id: 5,
          title: "Emergency",
          processingTime: "3-5 Business Days",
          price: "$599.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-name-change`,
          },
        },
      ],
    },
  },

  "lost-stolen-passport": {
    case: "lost-stolen-passport",
    bannerTitle: "Replace Lost or Stolen",
    bannerSubtitle: " Passport In As Little As 3 Days",
    bannerSteps1:
      "If you're 16 or older and your passport has been lost or stolen, you should use our Lost Passport service to apply for a replacement. If your passport is lost and you’re sure it has expired, you'll need to submit a New Passport application.",
    bannerSteps2: "",
    bannerSteps3: "",
    bannerButton: {
      text: "Start Application",
      link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
    },
    image: "/assets/passport-services/lost.png",
    bannerContent:
      "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
    whoFor: {
      title: "Who Is It For",
      description:
        "U.S. citizens who need to renew their passport, and it is still in good condition.",
    },
    processingTime: {
      title: "Processing Time",
      description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
    },
    cost: {
      title: "Cost",
      description:
        "Starting from $189*, plus additional government fees listed before and at the time of purchase.(* This price applies to a specific passport type and service speed. Prices are subject to change without notice or update.)",
    },
    requirements: {
      title: "Requirements For Lost/Stolen Passport",
      description:
        "When applying to renew your passport, you need to submit the following documents and meet these requirements:",
      items: [
        {
          id: 1,
          title: "Proof of U.S. Citizenship",
          description:
            "You must provide ONE of the following original documents:",
          points: [
            "Certified U.S. Birth Certificate (Must be an official document; Texas and California Abstract birth certificates are not accepted).",
            "Expired U.S. Passport (Must be undamaged; if you have a valid passport, it must also be submitted).",
            "Original Naturalization Certificate, FS-240, DS-1350, or Certificate of Citizenship Abroad.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 2,
          title: "Photocopy of Valid Photo Identification (Front & Back)",
          description: "",
          points: [
            "You must provide a clear, color copy (front and back) of a valid government-issued ID, such as a Driver’s License, State ID Card, Military ID, or valid U.S. Passport. If your name differs from what is on your citizenship document, you must also submit an original Marriage Certificate, Divorce Decree, or Court-Issued Name Change Document.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 3,
          title: "Passport Photo Requirements (Two New Photos)",
          description:
            "You must provide two new passport photos that meet the following criteria:",
          points: [
            "Recent Photos: Must be taken within the last 3 months.",
            "No Accessories: Hats and glasses are prohibited (photos with them will be rejected).",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 4,
          title: "Letter of Authorization ",
          description: "",
          points: [
            "Fill out by hand using black ink only.",
            "Incorrectly completed forms may cause a 4-business day delay.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 5,
          title:
            "DS-11 & DS-64 Forms – Completed Online & Printed with Barcode",
          description: "",
          points: [
            "The DS-11 (New Passport Application) and DS-64 (Statement Regarding Lost Passport) must be digitally completed and printed with a barcode. Handwritten forms are NOT accepted and will result in a 4-day processing delay.",
            "If you do not know your lost passport book number, enter the digit “1” nine times (111111111) to complete the required field.",
            "On the Electronic Signature page, you MUST select “Print, Sign, and Mail.",
            "On the Next Steps page, scroll down and click PRINT FORM.",
            "The DS-11 and DS-64 applications will open as a single PDF document—PRINT IT OUT immediately.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 6,
          title: "Proof of Travel Departure",
          description:
            "You must provide ONE of the following as proof of upcoming travel:",
          points: [
            "Flight Confirmation: A clear printout of your airline ticket email confirmation showing your name as the passenger.",
            "Driving Across the Border: Submit a printed foreign hotel confirmation AND a typed letter explaining your ground travel plans.",
            "Business Travel: Provide a typed company letter confirming the trip.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 7,
          title: "Government Passport Fee – $211.36",
          description: "",
          points: [
            "Pay the $211.36 fee via personal check or money order payable to the U.S. Department of State.",
            "Ensure all details are clear and legible to prevent delays.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 8,
          title: "Print the Order Confirmation Email",
          description: "",
          points: [
            "Print the PDF attached to your order confirmation email and include it in your shipment.",
            "Ensure the email contains all order details and shipping addresses.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
      ],
      requirementButton: {
        text: "Start Application",
        link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
      },
    },
    government: {
      title: "Government Passport Fees for Lost/Stolen Passport",
      subTitle:
        "A fee of $211.36 should be paid by personal check or money order, made out to the U.S. Department of State, and included in the sealed envelope. An additional $35 fee is paid separately to the acceptance agent.",
      instruction: "Important Payment Instructions:",
      paymentInstructions: [
        {
          id: 1,
          description:
            "Write the applicant's date of birth in the memo section of your check or money order.",
        },
        {
          id: 2,
          description:
            "Ensure the check or money order is clearly written. If using a money order, also include your name, address, and date of birth.",
        },
        {
          id: 3,
          description:
            "Avoid illegible writing, abbreviations, corrections, starter checks, or postdated checks, as these will be rejected and may delay processing by four days.",
        },
        {
          id: 4,
          description:
            "For personal checks, ensure your name and address are printed on the check.",
        },
        {
          id: 5,
          description:
            "If applying for a passport card as well, add $30 to the government fee.",
        },
        {
          id: 6,
          description:
            "Finally, make a copy of your completed check and place it loosely in your shipping envelope.",
        },
      ],
      button: {
        text: "Get Started",
        link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
      },
    },
    pricing: {
      title: "Pricing",
      subTitle: "Choose the service that suits your passport needs.",
      items: [
        {
          id: 1,
          title: "Expedited",
          processingTime: "3-4 Weeks",
          price: "$189.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
          },
        },
        {
          id: 2,
          title: "Express",
          processingTime: "10-14 Business Days",
          price: "$299.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
          },
        },
        {
          id: 3,
          title: "Rush",
          processingTime: "7-10 Business Days",
          price: "$399.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
          },
        },
        {
          id: 4,
          title: "Priority",
          processingTime: "5-7 Business Days",
          price: "$499.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
          },
        },
        {
          id: 5,
          title: "Emergency",
          processingTime: "3-5 Business Days",
          price: "$599.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=lost/stolen-passport`,
          },
        },
      ],
    },
  },

  "passport-card": {
    case: "passport-card",
    bannerTitle: "Get Passport Card",
    bannerSubtitle: "In As Little As 3 Days",
    bannerSteps1:
      "Passport Card service is only for applicants that are 16 year old or older and choose to apply for the passport card and not the passport book. Keep in mind that passport cards can only be used to drive across the border or to take an ocean cruise, they cannot be used to board an international flight out of the US.",
    bannerSteps2: "",
    bannerSteps3: "",
    bannerButton: {
      text: "Start Application",
      link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
    },
    image: "/assets/passport-services/passport-card.png",
    bannerContent:
      "We are an authorized and registered provider, explicitly permitted by the U.S. Government to offer a specific service: Hand-Carry Expedited Passport Service, available only through authorized and registered commercial couriers.",
    whoFor: {
      title: "Who Is It For",
      description:
        "U.S. citizens who need to renew their passport, and it is still in good condition.",
    },
    processingTime: {
      title: "Processing Time",
      description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
    },
    cost: {
      title: "Cost",
      description:
        "Starting from $189, with additional fees for expedited services.",
    },
    requirements: {
      title: "Requirements For Passport Card",
      description:
        "When applying to renew your passport, you need to submit the following documents and meet these requirements:",
      items: [
        {
          id: 1,
          title: "Proof of U.S. Citizenship",
          description:
            "You must submit one original document as proof of U.S. citizenship (copies are not accepted):",
          points: [
            "Certified U.S. Birth Certificate – Must be an official document. Texas and California “Abstract” birth certificates will not be accepted.",
            "Expired U.S. Passport – Must be undamaged. If you have a valid passport, it must also be submitted.",
            "Original Naturalization Certificate, FS-240, DS-1350, or Certificate of Citizenship Abroad.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 2,
          title: "Photocopy of Valid Photo Identification (Front & Back)",
          description:
            "Submit a clear color copy (front and back) of a valid government-issued ID:",
          points: [
            "Driver’s License",
            "State ID Card",
            " Military ID",
            "Valid U.S. Passport",
            "If your name has changed since the issuance of your citizenship document, you must also include an original marriage certificate, divorce decree, or court-issued name change document.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 3,
          title: "Passport Photo",
          description:
            "You must provide two new passport photos that meet the official requirements:",
          points: [
            "Recent Photos: Must be taken within the last 3 months.",
            "No Accessories Allowed: Hats and glasses are not permitted (unless medically necessary with a doctor’s note).",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 4,
          title: "Letter of Authorization",
          description:
            "Fill out the Letter of Authorization manually using blue or black ink. Select only the first two checkboxes at the top and leave the third one blank. Specify Chicago Passport & Visa Expedite as the Courier Company Name.",
          points: [
            "Fill out by hand using black ink only.",
            "Incorrectly completed forms may cause a 4-business day delay.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 5,
          title: "DS-11 Form – Complete Online & Print with Barcode",
          description: "",
          points: [
            "The DS-11 application must be completed digitally and printed with a barcode.",
            "Handwritten forms are not accepted and will result in a 4-day delay.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 6,
          title: "Proof of Travel ",
          description:
            "You must provide ONE of the following as proof of upcoming travel:",
          points: [
            "Flight Confirmation: A clear printout of your airline ticket email confirmation showing your name as the passenger.Driving Across the Border: Submit a printed foreign hotel confirmation AND a typed letter explaining your ground travel plans.",
            "Business Travel: Provide a typed company letter confirming the trip",
          ],

          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 7,
          title: "Government Passport Fee",
          description: "",
          points: [
            "$111.36 payment must be made via Personal Check or Money Order, payable to U.S. Department of State, and placed inside the sealed envelope.",
            "An additional $35 fee is paid separately to the acceptance agent.",
          ],
          isExpanded: true,
          hasIcon: true,
        },
        {
          id: 8,
          title: "Print the Order Confirmation Email",
          description: "",
          points: [
            "Print the PDF attached to your order confirmation email and include it in your shipment.",
            "Ensure the email contains all order details and shipping addresses.",
          ],

          isExpanded: true,
          hasIcon: true,
        },
      ],
      requirementButton: {
        text: "Start Application",
        link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
      },
    },
    government: {
      title: "Government Passport Fees for Passport Card",
      subTitle:
        "A fee of $111.36 should be paid by personal check or money order, made out to the U.S. Department of State, and included in the sealed envelope. An additional $35 fee is paid separately to the acceptance agent.",
      instruction: "Important Payment Instructions:",
      paymentInstructions: [
        {
          id: 1,
          description:
            "Write the applicant's date of birth in the memo section of your check or money order.",
        },
        {
          id: 2,
          description:
            "Ensure the check or money order is clearly written. If using a money order, also include your name, address, and date of birth.",
        },
        {
          id: 3,
          description:
            "Avoid illegible writing, abbreviations, corrections, starter checks, or postdated checks, as these will be rejected and may delay processing by four days.",
        },
        {
          id: 4,
          description:
            "For personal checks, ensure your name and address are printed on the check.",
        },
        {
          id: 5,
          description:
            "If applying for a passport card as well, add $30 to the government fee.",
        },
        {
          id: 6,
          description:
            "Finally, make a copy of your completed check and place it loosely in your shipping envelope.",
        },
      ],
      button: {
        text: "Get Started",
        link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
      },
    },
    pricing: {
      title: "Pricing",
      subTitle: "Choose the service that suits your passport needs.",
      items: [
        {
          id: 1,
          title: "Expedited",
          processingTime: "3-4 Weeks",
          price: "$189.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
          },
        },
        {
          id: 2,
          title: "Express",
          processingTime: "10-14 Business Days",
          price: "$299.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
          },
        },
        {
          id: 3,
          title: "Rush",
          processingTime: "7-10 Business Days",
          price: "$399.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
          },
        },
        {
          id: 4,
          title: "Priority",
          processingTime: "5-7 Business Days",
          price: "$499.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
          },
        },
        {
          id: 5,
          title: "Emergency",
          processingTime: "3-5 Business Days",
          price: "$599.00",
          fees: "+ Government Fees",
          button: {
            text: "Get Started",
            link: `${ENV.APPLY_URL}/apply?service-type=passport-card`,
          },
        },
      ],
    },
  },
};
