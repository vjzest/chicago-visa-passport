const chinaImg = "/landing/assets/china-img.png";
const ghanaImg = "/landing/assets/ghana-img.png";
const brazilImg = "/landing/assets/brazil-img.png";
const ukImg = "/landing/assets/uk-img.png";
const nigeriaImg = "/landing/assets/nigeria-img.png";
const russiaImg = "/landing/assets/russia-img.png";

const indiaImg = "/landing/assets/india-img.png";
const vietnamImg = "/landing/assets/vietnam-img.png";
const kenyaImg = "/landing/assets/kenya-img.png";
const cambodiaImg = "/landing/assets/cambodia-img.png";

const departmentPdf = "/assets/DS3053-NEW-2021.pdf";
const ds64 = "/assets/ds64.pdf";
const limitedPass = "/assets/2nd_limited_pass.pdf";
const busyLetter = "/assets/busi_letter.pdf";
const authorizationLetter = "/assets/AUTHORIZATIONLETTER.pdf";
const serviceOrder = "/assets/form.pdf";

export const ukEtaRequirements = [
  {
    requirements: [
      {
        section_title: "Tourist E-Visa",
        content: {
          text: "For travelers visiting the United Kingdom for tourism:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph - meeting e-visa (ETA) specifications",
          ],
        },
      },
      {
        section_title: "Business E-Visa",
        content: {
          text: "For travelers visiting the United Kingdom for business purposes:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph – per e-visa (ETA) requirements",
          ],
        },
      },
    ],
  },
];

export const visas = [
  {
    id: 1,
    slug: "china",
    image: chinaImg,
    country: "China Travel Visas",
    hero_title: "China Visa Requirements",
    hero_description:
      "Comprehensive requirements for China Tourist, Business, Work, Student, Crew, Non-Business, and Family Visit visas.",
    requirements: [
      {
        section_title: "China Tourist Visa (L)",
        content: {
          text: "For travelers visiting China for tourism:",
          list: [
            "Completed China Visa Application Form",
            "Original Passport",
            "Proof of Residence or Address",
            "Previous China Visa (if applicable)",
            "Applicants born in China, Hong Kong, or Taiwan",
            "Minor Applicants (under 18)",
            "Multiple Citizenships",
            "Special Categories",
            "Proof of U.S. Status",
          ],
        },
      },
      {
        section_title: "China Business Visa (M)",
        content: {
          text: "For business-related travel to China:",
          list: [
            "Completed China Visa Application Form",
            "Invitation Letter",
            "Proof of Residence or Address",
            "Original Passport",
            "Previous China Visa (if applicable)",
            "Applicants born in China, Hong Kong, or Taiwan",
            "Multiple Citizenships",
            "Special Categories",
            "Proof of U.S. Status",
          ],
        },
      },
      {
        section_title: "China Work Visa (Z)",
        content: {
          text: "For employment in China:",
          list: [
            "Completed China Visa Application Form",
            "Work Permit Notice",
            "Proof of Residence or Address",
            "Original Passport",
            "Previous China Visa (if applicable)",
            "👨‍👩Dependents of Z Visa Applicants",
            "Applicants born in China, Hong Kong, or Taiwan",
            "Multiple Citizenships",
            "Special Categories",
            "Proof of U.S. Status",
          ],
        },
      },
      {
        section_title: "China Student Visa (X1/X2)",
        content: {
          text: "For students pursuing studies in China:",
          list: [
            "Completed China Visa Application Form",
            "Admission Letter",
            "JW201 or JW202 Form",
            "Proof of Residence or Address",
            "Original Passport",
            "Previous China Visa",
            "Applicants born in China, Hong Kong, or Taiwan",
            "Minor Applicants (under 18)",
            "Multiple Citizenships",
            "Special Categories",
            "Proof of U.S. Status",
          ],
        },
      },
      {
        section_title: "China Crew Visa (C)",
        content: {
          text: "For crew members traveling to China:",
          list: [
            "Completed China Visa Application Form",
            "Business Letter",
            "Crew ID Card",
            "Proof of Residence or Address",
            "Original Passport",
            "Previous China Visa (if applicable)",
            "Applicants born in China, Hong Kong, or Taiwan",
            "Multiple Citizenships",
            "Proof of U.S. Status",
          ],
        },
      },
      {
        section_title: "China Non-Business Visa (F)",
        content: {
          text: "For non-commercial visits to China:",
          list: [
            "Completed China Visa Application Form",
            "Invitation Letter",
            "Proof of Residence/Address",
            "Original Passport",
            "Previous China Visa (if applicable)",
            "Applicants born in China, Hong Kong, or Taiwan — additional documentation may be required",
            "Multiple Citizenships",
            "Special Categories - may require additional authorization",
            "Proof of U.S. Status",
          ],
        },
      },
      {
        section_title: "China Family Visit Visa (Q1/Q2)",
        content: {
          text: "For visiting family members in China:",
          list: [
            "Completed China Visa Application Form",
            "Invitation Letter",
            "Proof of Residence/Address",
            "Original Passport",
            "Previous China Visa (if applicable)",
            "Applicants born in China, Hong Kong, or Taiwan — may need additional documentation",
            "Minor Applicants (under 18) — birth certificate and parental authorization letter may be required",
            "Multiple Citizenships",
            "Special Categories — may require additional processing",
            "Proof of U.S. Status",
          ],
        },
      },
      {
        section_title: "China Family Visit Visa (S1/S2)",
        content: {
          text: "For dependents of Chinese residents or Z Visa holders:",
          list: [
            "Completed China Visa Application Form",
            "Invitation Letter",
            "👨‍👩Dependents of Z-Visa holders — must provide proof of relationship",
            "Proof of Residence/Address",
            "Original Passport",
            "Previous China Visa (if applicable)",
            "Applicants born in China, Hong Kong, or Taiwan — additional documentation may be needed",
            "Minor Applicants (under 18) — birth certificate and parental authorization letter may be required",
            "Multiple Citizenships",
            "Special Categories — may require further approval",
            "Proof of U.S. Status",
          ],
        },
      },
    ],
  },
  {
    id: 2,
    slug: "brazil",
    image: brazilImg,
    country: "Brazil Visa",
    hero_title: "Brazil Travel Visas",
    hero_description:
      "Comprehensive guide for Brazil Tourist and Business Visa applications for non-U.S. passport holders.",
    requirements: [
      {
        section_title: "Brazil Tourist Visa (Non-U.S. Passport Holders)",
        content: {
          text: "To apply for a Brazil Tourist Visa, please prepare the following documents:",
          list: [
            "Completed Brazil Visa Application Form",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "Cover Letter",
            "Recent Bank Statement",
            "Hotel Reservation or Invitation Letter",
            "Round-Trip Flight Itinerary",
            "For Minors (Under 18):",
            "Copy of Birth Certificate",
            "Parental Authorization",
          ],
        },
      },
      {
        section_title: "Brazil Business Visa (Non-U.S. Passport Holders)",
        content: {
          text: "Applicants traveling for business purposes must provide the following:",
          list: [
            "Completed Brazil Visa Application Form",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "Business Letter from Employer",
            "Recent Bank Statement",
            "Proof of Residence/Address",
            "Proof of U.S. Status",
            "Round-Trip Flight Itinerary",
          ],
        },
      },
    ],
  },
  {
    id: 3,
    slug: "ghana",
    country: "Ghana Visa",
    image: ghanaImg,
    hero_title: "Ghana Travel Visas",
    hero_description:
      "Detailed guide for Ghana Tourist and Business Visa applications including vaccination, invitation, and documentation requirements.",
    requirements: [
      {
        section_title: "Ghana Tourist Visa Requirements",
        content: {
          text: "Applicants traveling to Ghana for tourism must provide the following documents:",
          list: [
            "Completed Ghana Visa Application Form",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "Proof of Yellow Fever Vaccination",
            "Hotel Reservation or Invitation Letter",
            "Round-Trip Flight Itinerary",
            "For Minors (Under 18):",
            "Notarized Consent Letter",
            "Proof of U.S. Immigration Status",
          ],
        },
      },
      {
        section_title: "Ghana Business Visa Requirements",
        content: {
          text: "Applicants traveling for business purposes must prepare the following:",
          list: [
            "Completed Ghana Visa Application Form",
            "Business Letter from Employer",
            "Invitation Letter",
            "Copy of ID",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "Proof of Yellow Fever Vaccination",
            "Round-Trip Flight Itinerary",
            "Proof of U.S. Immigration Status",
          ],
        },
      },
    ],
  },
  {
    id: 4,
    slug: "nigeria",
    country: "Nigeria Visa",
    image: nigeriaImg,
    hero_title: "Nigeria Travel Visas",
    hero_description:
      "Comprehensive list of documents required for Nigeria Tourist and Business Visa applications, including financial proof and invitation details.",
    requirements: [
      {
        section_title: "Nigeria Tourist Visa Requirements",
        content: {
          text: "Applicants traveling to Nigeria for tourism or family visits must submit the following:",
          list: [
            "Completed Nigeria Visa Application Form",
            "Original Passport",
            "Two (2) Recent Passport Photographs",
            "Hotel Booking Confirmation or Invitation Letter",
            "Recent Bank Statement",
            "Round-Trip Flight Itinerary",
            "For Minors (Under 18):",
            "Notarized Consent Letter from parents or guardians",
            "Copy of Birth Certificate",
            "Proof of U.S. Immigration Status",
          ],
        },
      },
      {
        section_title: "Nigeria Business Visa Requirements",
        content: {
          text: "Applicants traveling to Nigeria for business meetings, conferences, or trade must provide:",
          list: [
            "Completed Nigeria Visa Application Form",
            "Original Passport",
            "Two (2) Recent Passport Photographs",
            "Business Letter from Employer",
            "Invitation Letter from Business Host in Nigeria",
            "Recent Bank Statement",
            "Round-Trip Flight Itinerary",
            "Proof of U.S. Immigration Status",
          ],
        },
      },
    ],
  },
  {
    id: 5,
    slug: "russia",
    country: "Russia Visa",
    image: russiaImg,
    hero_title: "Russia Travel Visas",
    hero_description:
      "Detailed documentation guide for Russia Tourist, Business, Private, Humanitarian, and Student Visa applications.",
    requirements: [
      {
        section_title: "Russia Tourist Visa Requirements",
        content: {
          text: "Applicants traveling to Russia for tourism or short-term visits must provide the following:",
          list: [
            "Completed Russian Visa Application Form",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "If You Have a Valid Russian Visa in an Expired/Cancelled Passport",
            "Special Requirement: Applicants born in Russia or the Former USSR must provide proof of name change or renunciation of Russian citizenship",
            "For Minors (Under 18):",
            "Notarized Consent Letter from parents or guardians",
            "Copy of Birth Certificate",
          ],
        },
      },
      {
        section_title: "Russia Business Visa Requirements",
        content: {
          text: "Applicants traveling for business meetings, conferences, or trade must submit:",
          list: [
            "Completed Russian Visa Application Form",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "Original Official Russian Business Invitation Letter",
            "If You Have a Valid Russian Visa in an Expired/Cancelled Passport – include both passports",
            "Special Requirement: Applicants born in Russia or the Former USSR must provide relevant documentation of name change or citizenship status",
          ],
        },
      },
      {
        section_title: "Russia Private Visa Requirements",
        content: {
          text: "Applicants visiting family or friends in Russia must provide:",
          list: [
            "Completed Russian Visa Application Form",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "Original Russian Private Invitation Letter",
            "Special Requirement: Applicants born in Russia or the Former USSR must provide documentation of citizenship status or name change",
            "For Minors (Under 18):",
            "Notarized Parental Consent Letter",
            "Copy of Birth Certificate",
          ],
        },
      },
      {
        section_title: "Russia Humanitarian Visa Requirements",
        content: {
          text: "Applicants traveling for cultural, religious, scientific, or charitable purposes must provide:",
          list: [
            "Completed Russian Visa Application Form",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "Original Humanitarian Visa Invitation",
            "Special Requirement: Applicants born in Russia or the Former USSR must include proof of citizenship or name change",
          ],
        },
      },
      {
        section_title: "Russia Student Visa Requirements",
        content: {
          text: "Applicants pursuing studies in Russia must include the following:",
          list: [
            "Completed Russian Visa Application Form",
            "Original Passport",
            "One (1) Recent Passport Photograph",
            "Original Russian Student Invitation Letter",
            "Original HIV Test Result",
            "Special Requirement: Applicants born in Russia or the Former USSR must provide relevant citizenship documentation",
            "For Minors (Under 18):",
            "Notarized Consent Letter from parents or guardians",
            "Copy of Birth Certificate",
          ],
        },
      },
    ],
  },
  {
    id: 6,
    slug: "uk",
    country: "United Kingdom Visa",
    image: ukImg,
    hero_title: "United Kingdom Travel Visas",
    hero_description:
      "Comprehensive documentation guide for UK Tourist, Business, Student, Short-Term Work, and Marriage Visitor Visa applications.",
    requirements: [
      {
        section_title: "UK Tourist Visa Requirements",
        content: {
          text: "Applicants traveling to the United Kingdom for tourism or family visits must submit:",
          list: [
            "Completed UK Visa Application Form",
            "Original Passport",
            "Two (2) Recent Passport-Sized Photographs",
            "Employment or Enrollment Letter",
            "Hotel Reservation",
            "Invitation Letter",
            "Personal Statement",
            "Travel Itinerary",
            "Bank Statement",
          ],
        },
      },
      {
        section_title: "UK Business Visa Requirements",
        content: {
          text: "Applicants traveling for business meetings, conferences, or trade must include:",
          list: [
            "Completed UK Visa Application Form",
            "Original Passport",
            "Two (2) Recent Passport Photographs",
            "Cover Letter – from your company stating the purpose of travel, duration, and contact details",
            "Bank Statements",
            "Hotel Reservation",
            "Company Registration Certificate",
            "Business Invitation Letter",
            "Income Tax Returns – for the last 3 years",
            "Certificate of Proprietorship or equivalent business ownership proof (if self-employed)",
            "Round-Trip Flight Itinerary",
          ],
        },
      },
      {
        section_title: "UK Student Visa Requirements",
        content: {
          text: "Applicants applying to study in the United Kingdom must provide:",
          list: [
            "Completed Student Visa Application Form",
            "Original Passport",
            "One (1) Passport-Type Photograph",
            "Proof of Immigration Status in the U.S. (if applicable)",
            "Biometric Enrollment Confirmation",
            "Recent Bank Statement",
            "Medical Certificate",
            "UK Visas and Immigration (UKVI) Document Checklist",
          ],
        },
      },
      {
        section_title: "UK Short-Term Work Visa Requirements",
        content: {
          text: "For applicants undertaking temporary or short-term employment in the UK:",
          list: [
            "Completed Visa Application Form",
            "Original Passport",
            "Passport-Type Photograph",
            "Proof of Immigration Status",
            "Biometric Enrollment Confirmation",
            "Host Sponsorship Form",
            "UKVI Document Checklist",
          ],
        },
      },
      {
        section_title: "UK Marriage Visitor Visa Requirements",
        content: {
          text: "Applicants traveling to the United Kingdom to get married or register a civil partnership must include:",
          list: [
            "Completed Marriage Visitor Visa Application Form",
            "Original Passport",
            "Passport-Type Photograph",
            "Proof of Immigration Status",
            "Biometric Enrollment Confirmation",
            "Proof of Sufficient Funds",
            "Travel Itinerary",
            "Proof of Relationship – evidence of genuine relationship with your partner",
            "UK Visas and Immigration (UKVI) Document Checklist",
          ],
        },
      },
    ],
  },
];

export const evisas = [
  {
    id: 1,
    slug: "vietnam-evisa",
    country: "Vietnam eVisa",
    hero_title: "Vietnam Travel eVisa",
    hero_description:
      "Using eVisa Now technology, Vietnam eVisa applicants can apply for electronic visas right from the comfort of their own home. Complete the Vietnam eVisa form and upload any required documentation for the application easily online. Once the application is complete, give us a call to confirm your application or wait for us to contact you to verify and process payment. After completing payment, our team will process your online application and email your Vietnam eVisa to you. If you need help completing the form, our professionals are here to help. Give us a call or visit our office for more information.",
    hero_image: vietnamImg,
    requirements: [
      {
        section_title: "Vietnam Tourist eVisa Requirements",
        content: {
          text: "For travelers visiting Vietnam for tourism purposes:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph – meeting e-visa specifications",
          ],
        },
      },
      {
        section_title: "Vietnam Business eVisa Requirements",
        content: {
          text: "For travelers visiting Vietnam for business purposes:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph – per e-visa requirements",
          ],
        },
      },
    ],
  },
  {
    id: 2,
    slug: "india-evisa",
    country: "India eVisa",
    hero_title: "India Travel eVisa",
    hero_description:
      "Apply online for your Indian electronic visa easily and securely. Whether you are visiting for tourism or business, the India eVisa process is fast, paperless, and convenient.",
    hero_image: indiaImg,
    requirements: [
      {
        section_title: "India Tourist eVisa Requirements",
        content: {
          text: "For travelers visiting India for tourism purposes:",
          list: ["Scanned Passport", "Digital Passport Photograph"],
        },
      },
      {
        section_title: "India Business eVisa Requirements",
        content: {
          text: "For travelers visiting India for business purposes:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph – per e-visa requirements",
            "Digital Copy of Business Card",
            "Invitation Letter",
          ],
        },
      },
    ],
  },
  {
    id: 3,
    slug: "brazil-evisa",
    country: "Brazil eVisa",
    hero_title: "Brazil Travel eVisa",
    hero_description:
      "Complete your Brazil eVisa application in minutes. Apply online quickly and securely without visiting the embassy.",
    hero_image: brazilImg,
    requirements: [
      {
        section_title: "Brazil Tourist eVisa Requirements",
        content: {
          text: "Applicants traveling to Brazil for tourism must submit:",
          list: [
            "Scanned Copy of Passport",
            "Digital Passport Photograph",
            "For Minors (Under 18):",
            "Notarized Consent Letter from parents or legal guardians",
            "Copy of Birth Certificate",
          ],
        },
      },
      {
        section_title: "Brazil Business eVisa Requirements",
        content: {
          text: "Applicants traveling for business purposes must provide:",
          list: ["Scanned Copy of Passport", "Digital Passport Photograph"],
        },
      },
    ],
  },
  {
    id: 4,
    slug: "kenya-evisa",
    country: "Kenya eVisa",
    hero_title: "Kenya Travel eVisa",
    hero_description:
      "Get your Kenya eVisa approval online — fast and simple. Apply from home, upload your documents, and receive your eVisa by email without visiting the embassy.",
    hero_image: kenyaImg,
    requirements: [
      {
        section_title: "Kenya Tourist eVisa Requirements",
        content: {
          text: "For travelers visiting Kenya for tourism:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph – per e-visa specifications",
            "Hotel Confirmation",
            "Flight Itinerary",
          ],
        },
      },
      {
        section_title: "Kenya Business eVisa Requirements",
        content: {
          text: "For travelers visiting Kenya for business purposes:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph – per e-visa requirements",
            "Invitation Letter",
            "Copy of Passport or National ID – of the person signing the invitation letter",
            "Business Registration or License",
          ],
        },
      },
    ],
  },
  {
    id: 5,
    slug: "cambodia-evisa",
    country: "Cambodia eVisa",
    hero_title: "Cambodia Travel eVisa",
    hero_description:
      "Apply for a Cambodia eVisa without visiting the embassy. The online application process is simple — submit your documents, make payment, and receive your visa directly by email.",
    hero_image: cambodiaImg,
    requirements: [
      {
        section_title: "Cambodia Tourist eVisa Requirements",
        content: {
          text: "For travelers visiting Cambodia for tourism:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph – meeting e-visa specifications",
          ],
        },
      },
      {
        section_title: "Cambodia Business eVisa Requirements",
        content: {
          text: "For travelers visiting Cambodia for business purposes:",
          list: [
            "Scanned Passport",
            "Digital Passport Photograph – per e-visa requirements",
          ],
        },
      },
    ],
  },
];

export const passportSections = [
  {
    title: "New Passport",
    description:
      "Whether your passport expired or you’ve never had a passport, everyone will need to apply for a new US passport at some point. For new US passport services in Chicago, choose Chicago Passport & Visa Services.",
    accordions: [
      {
        title: "Requirements for First US Passport Application",
        text: `
          <ul>
            <li>You must be applying for the first time.</li>
            <li>Your previous passport was issued more than 15 years ago.</li>
            <li>Your previous passport was issued when you were under 16 years of age.</li>
          </ul>
        `,
      },
      {
        title: "How to Apply",
        text: `
          <p><a href="https://pptform.state.gov/?Submit2=Complete+Online+%26+Print&AspxAutoDetectCookieSupport=1">DS-11 Online Application</a></p>
          <ul>
            <li>Do not sign the application until instructed to do so.</li>
          </ul>`,
      },
      {
        title: "Government & Service Fees",
        text: `
          <ul>
            <li>A personal check or money order made payable to the “US Department of State” in the amount of $190.00.</li>
            <li>If you are applying for a US passport with regular services, the check should be made out in the amount of $190.00. Follow this link for the state fee.</li>
            <li>Temporary/starter checks or checks without a name or address will NOT be accepted.</li>
          </ul>
          <p>Chicago Passport & Visa Services fees will be applied in addition to the government fees.</p>
          `,
      },
      {
        title: "Additional Requirements for New US Passports",
        text: `
          <p>
            <a href="#">Passport Photos</a>
            |
            <a href="#">Proof of US Citizenship</a>
            |
            <a href="#">Proof of Identity </a>
            |
            <a href="#">Letter of Authorization </a>
            |
            <a href="#">Service Order Form</a>
            |
            <a href="#">Must Appear in Person </a>
          </p>
          `,
      },
    ],
  },
  {
    title: "Passport Renewal",
    description:
      "Renew your passport in Chicago with Chicago Passport & Visa Services. We offer emergency and rush passport services, so if you’re looking to expedite your passport, we have all the same-day solutions for you.",
    accordions: [
      {
        title: "Requirements for US Passport Renewal",
        text: `
          <p>Your US Passport can only be renewed if ALL these conditions are met.</p>
          <ul>
            <li>You still have your US passport in your possession.</li>
            <li>Your previous US passport was issued when you were 16 years or over.</li>
            <li>Your previous US passport was issued no more than 15 years ago.</li>
            <li>Your US passport is undamaged.</li>
          </ul>
        `,
      },
      {
        title: "How to Apply",
        text: `
          <a href="https://pptform.state.gov/?Submit2=Complete+Online+%26+Print&AspxAutoDetectCookieSupport=1"/>DS-82 Online Application</a>
          <ul>
            <li>Do not sign the application until instructed to do so.</li>
          </ul>
        `,
      },
      {
        title: "Changed Your Name Due to Marriage or Divorce?",
        text: `
          <p>In the event that you changed your name due to marriage or divorce, you will need to bring in a certified copy of your marriage certificate or a court decree that shows your name change.</p>
        `,
      },
      {
        title: "Apply By Mail",
        text: `
          <p>If you are processing your passport application with rush or regular mail, fill out two letters of authorization and Service Order Forms and send it along with the required supporting documents.</p>
        `,
      },
      {
        title: "Government & Services Fees",
        text: `
          <ul>
            <li>Personal check or money order made payable to the “US Department of State” in the amount of $190.00.</li>
            <li>If you are applying for a US passport with regular services, the check should be made out in the amount of $190.00. <a href="https://travel.state.gov/content/travel/en/passports.html"> Follow this link for the state fee.</a></li>
            <li>Temporary/starter checks or checks without a name or address will NOT be accepted.</li>
          </ul>
          <p>Chicago Passport & Visa Services fees will be applied in addition to the government fees.</p>
        `,
      },
      {
        title: "Additional Requirements for US Passport Renewals",
        text: `
          <p>
            <a href="#">Passport Photos</a>
            |
            <a href="#">Proof of US Citizenship</a>
            |
            <a href="#">Proof of Identity </a>
            |
            <a href="#">Letter of Authorization </a>
            |
            <a href="#">Service Order Form</a>
            |
            <a href="#">Must Appear in Person </a>
          </p>
        `,
      },
    ],
  },
  {
    title: "Child Passport",
    description:
      "Since a child’s passport cannot be renewed, a minor will have to apply for a new one each time. If the child is 16 years or older, they can apply for a new adult passport.",
    accordions: [
      {
        title: "Requirements for US Passport for Minors",
        text: `
          <ul>
            <li>Applicants must be under the age of 16.</li>
            <li>All children, including newborns, must have their own passport.</li>
            <li>An appearance by both parents and the minor at a passport acceptance office is required and is a mandatory step of your child’s passport order. If only one parent can appear, a special letter of consent (form DS-3053) must be completed and notarized along with the copy of the parent’s ID.</li>
          </ul>
          <a href="${departmentPdf}" target="_blank">Letter of Consent DS-3053</a>
        `,
      },
      {
        title: "How to Apply",
        text: `
          <a href="https://pptform.state.gov/?Submit2=Complete+Online+%26+Print&AspxAutoDetectCookieSupport=1" target="_blank">DS-11 Online Application</a>
          <ul>
            <li>Do not sign the application until instructed to do so.</li>
          </ul>
        `,
      },
      {
        title: "Proof of Identity",
        text: `
          <ul>
            <li>Both parents’ driver’s licenses with photo or passport.</li>
          </ul>
        `,
      },
      {
        title: "Government & Services Fees",
        text: `
          <ul>
            <li>A personal check or money order made payable to the “US Department of State” in the amount of $160.00 (expedite processing).</li>
            <li>If you are applying for a US passport with regular services, the check should be made out to the “US Department of State” in the amount of $160.00. <a href="https://travel.state.gov/content/travel/en/passports.html" target="_blank">Follow this link for the state fee.</a></li>
            <li>Temporary/starter checks or checks without name and address will NOT be accepted.</li>
          </ul>
          <p>Chicago Passport & Visa Services fees will be applied in addition to the government fees.</p>
        `,
      },
      {
        title: "Additional Requirements for US Passports for Children",
        text: `
          <p>
            <a href="#">Passport Photos</a>
            |
            <a href="#">Proof of US Citizenship</a>
            |
            <a href="#">Proof of Identity </a>
            |
            <a href="#">Letter of Authorization </a>
            |
            <a href="#">Service Order Form</a>
            |
            <a href="#">Must Appear in Person </a>
          </p>
        `,
      },
    ],
  },
  {
    title: "Lost Passport",
    description:
      "If your passport is lost, stolen, or damaged, you should replace it quickly. Chicago Passport & Visa Services offers lost passport renewal solutions so you have a replacement passport in time for your next trip. Also, canceling a lost passport quickly ensures it can’t be used if it falls into the wrong hands.",
    accordions: [
      {
        title: "Requirements to Replace a Passport (Lost/Stolen/Damaged)",
        text: "Lost passports are considered by the passport agency to be very serious. The loss stays on your record, so we encourage you to make every effort to find your passport even after a new passport is issued. When, or if, you find the old passport, it is important to return both passports to the US Passport Service to have the lost passport removed from your record.",
      },
      {
        title: "How to Apply",
        text: `
          <a href="https://pptform.state.gov/?Submit2=Complete+Online+%26+Print&AspxAutoDetectCookieSupport=1" target="_blank">DS-11 Online Application</a>
          <ul>
            <li>Do not sign the application until instructed to do so.</li>
          </ul>
        `,
      },
      {
        title: "Statement Regarding a Lost or Stolen Passport",
        text: `
          <a href="${ds64}" target="_blank">DS-64 Application Form</a>
          <ul>
            <li>Applicant needs to submit a completed DS-64 Lost or Stolen Form.</li>
            <li>You’ll need to make sure you give details on your efforts to recover your lost passport.</li>
          </ul>
        `,
      },
      {
        title: "Government & Service Fees",
        text: `
          <ul>
            <li>A personal check or money order made payable to the “US Department of State” in the amount of $170.00.</li>
            <li>If you are applying for a US passport with regular services, the check should be made out to the “US Department of State” in the amount of $110.00.</li>
            <li>Temporary/starter checks or checks without a name or address with NOT be accepted.</li>
          </ul>
          <p>Chicago Passport & Visa Services fees will be applied in addition to the government fees.</p>
        `,
      },
      {
        title: "Additional Requirements for Lost US Passports",
        text: `
          <p>
            <a href="#">Passport Photos</a>
            |
            <a href="#">Proof of US Citizenship</a>
            |
            <a href="#">Proof of Identity </a>
            |
            <a href="#">Letter of Authorization </a>
            |
            <a href="#">Service Order Form</a>
            |
            <a href="#">Must Appear in Person </a>
          </p>
        `,
      },
    ],
  },
  {
    title: "Passport Name Change",
    description:
      "Passports must reflect the correct name of the passport holder. Therefore, it’s essential that you receive a new passport due to marriage, divorce, adoption, or other legal reasons from Chicago Passport & Visa Services.",
    accordions: [
      {
        title: "Requirements for US Passport Name Change",
        text: "In order to change the name on your passport, you must have an original court-ordered name change and an original marriage certificate or divorce decree. You must go through a US passport renewal process in order to change your name.",
      },
      {
        title: "How to Apply",
        text: `
          <a href="https://pptform.state.gov/?Submit2=Complete+Online+%26+Print&AspxAutoDetectCookieSupport=1" target="_blank">DS-5504 Online Application</a>
          <ul>
            <li>Do not sign the application until instructed to do so.</li>
          </ul>
        `,
      },
      {
        title: "Original Court Documents",
        text: `
          <p>Please provide the original court document that changes your name. For example, marriage certificate, divorce, or legal name change document.</p>
        `,
      },
      {
        title: "Changed Your Name Due to Marriage or Divorce?",
        text: `
          <p>In the event that you changed your name due to marriage or divorce, you will need to bring in a certified copy of your marriage certificate or a court decree that shows your name change.</p>
        `,
      },
      {
        title: "Applying By Mail?",
        text: `
          <p>If you are processing your passport application with rush or regular mail, fill out two letters of authorization and Service Order Forms and send them along with the documents.</p>
        `,
      },
      {
        title: "Government & Service Fees",
        text: `
          <ul>
            <li>A personal check or money order made payable to the “US Department of State” in the amount of $170.00.</li>
            <li>If you are applying for a US passport with regular services, the check should be made out to the “US Department of State” in the amount of $110.00.</li>
            <li>Temporary/starter checks or checks without a name or address will NOT be accepted.</li>
          </ul>
          <p>Chicago Passport & Visa Services fees will be applied in addition to the government fees.</p>
        `,
      },
      {
        title: "Additional Requirements for US Passport Name Change",
        text: `
          <p>
            <a href="#">Passport Photos</a>
            |
            <a href="#">Proof of US Citizenship</a>
            |
            <a href="#">Proof of Identity </a>
            |
            <a href="#">Letter of Authorization </a>
            |
            <a href="#">Service Order Form</a>
            |
            <a href="#">Must Appear in Person </a>
          </p>
        `,
      },
    ],
  },
  {
    title: "Second Limited Passport",
    description:
      "US citizens are allowed to have two different passports: a normal 10-year passport and a second limited passport. Second limited passports allow holders to travel internationally while processing a US visa. With these specific passports, holders can also travel to countries that don’t allow entry to people to visit if their normal passport has stamps from enemy countries.",
    accordions: [
      {
        title: "How to Apply",
        text: `
          <a href="https://pptform.state.gov/?Submit2=Complete+Online+%26+Print&AspxAutoDetectCookieSupport=1" target="_blank">DS-82 Online Application</a>
          <ul>
            <li>Do not sign the application until instructed to do so.</li>
          </ul>
        `,
      },
      {
        title: "Statement Regarding Second Limited Passport",
        text: `
          <a href="${limitedPass}" target="_blank">Statement Regarding Second Limited Passport</a>
          <ul>
            <li>You must submit a completed and signed statement of second limited passport.</li>
          </ul>
        `,
      },
      {
        title: "Business Letter",
        text: `
          <a href="${busyLetter}" target="_blank">Statement Regarding Second Limited Passport</a>
          <ul>
            <li>If you are traveling on business and requesting a second limited passport, you must provide a valid reason for a second limited passport on company letterhead.</li>
          </ul>
        `,
      },
      {
        title: "Government & Service Fees",
        text: `
          <ul>
            <li>A personal check or money order made payable to the “US Department of State” in the amount of $170.00.</li>
            <li>Temporary/starter checks or checks without a name or address will NOT be accepted.</li>
          </ul>
          <p>Chicago Passport & Visa Services fees will be applied in addition to the government fees.</p>
        `,
      },
      {
        title: "Additional Requirements for US Passport Name Change",
        text: `
          <p>
            <a href="#">Passport Photos</a>
            |
            <a href="#">Proof of US Citizenship</a>
            |
            <a href="#">Proof of Identity </a>
            |
            <a href="#">Letter of Authorization </a>
            |
            <a href="#">Service Order Form</a>
            |
            <a href="#">Must Appear in Person </a>
          </p>
        `,
      },
    ],
  },
  {
    title: "Additional Requirements for US Passports",
    description: "",
    accordions: [
      {
        title: "Passport Photos",
        text: `
          <ul>
            <li>Photo should be 2” x 2” on a white background.</li>
            <li>Photo should not be older than one month.</li>
          </ul>
        `,
      },
      {
        title: "Current US Passport",
        text: `
          <ul>
            <li>You must submit your current undamaged passport.</li>
            <li>The expired passport will be returned to you along with the new passport.</li>
          </ul>
        `,
      },
      {
        title: "Proof of US Citizenship",
        text: `
          <p>Please provide an original or a certified copy of one of the following:</p>
          <ul>
            <li>Certified birth certificate (long form, not abstract).</li>
            <li>Consulate report of birth abroad certificate.</li>
            <li>Naturalization Certificate.</li>
            <li>A certified copy of birth certificate that has the registrar’s raised, embossed, impressed, or multicolored seal.</li>
          </ul>
        `,
      },
      {
        title: "Proof of Identity",
        text: `
          <p>Please provide an original or a certified copy of one of the following:</p>
          <ul>
            <li>Valid driver’s license or state ID.</li>
            <li>Government identification or valid military identification.</li>
          </ul>
        `,
      },
      {
        title: "Letter of Authorization",
        text: `
          <a href='${authorizationLetter}' target="_blank">Letter of Authorization</a>
          <ul>
            <li>Fully completed letter of authorization to authorize Chicago Passport & Visa Services to do the service for you.</li>
          </ul>
        `,
      },
      {
        title: "Service Order Form",
        text: `
          <a href='${serviceOrder}' target="_blank">Service Order Form</a>
          <ul>
            <li>Please fill out the form and bring it to our office with all the required supporting documents.</li>
          </ul>
        `,
      },
      {
        title: "Must Appear in Person",
        text: `
          <p>To apply for a new passport, you must come to our office in person. After completing all the required paperwork, you will be sent to a passport acceptance facility. There, they will put all your paperwork, including your check and original documents, in a sealed package and hand it back to you, which then needs to be dropped off at our office to start the process.</p>
        `,
      },
    ],
  },
];
