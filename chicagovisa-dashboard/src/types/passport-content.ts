export interface PassportAccordion {
    title: string;
    text?: string; // HTML content
}

export interface PassportSection {
    title: string;
    description: string;
    accordions: PassportAccordion[];
}

export interface UsPassportPage {
    title: string;
    description: string;
    buttonText?: string;
    image: {
        src: string;
        alt: string;
    };
    passportSections: PassportSection[];
}

export interface UsPassportApplication {
    step1: {
        title: string;
        citizenOf: string;
        travelingTo: string;
        speedOfService: string;
        selectPassportType: string;
        mostPopular: string;
        serviceFee: string;
        consularFee: string;
        consularFeeNA: string;
        applicantInformation: string;
        contactInformation: string;
        emailNote: string;
        consentText: string;
        continueButton: string;
    },
    step2: {
        title: string;
        backButton: string;
        shippingAddress: string;
        billingAddress: string;
        billingSameAsShipping: string;
        paymentMethod: string;
    }
}

export interface PassportContentData {
    usPassportPage: UsPassportPage;
    usPassportApplication: UsPassportApplication;
}
