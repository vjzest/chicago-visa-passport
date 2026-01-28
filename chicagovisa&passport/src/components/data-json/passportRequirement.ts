export interface RequirementItem {
  id: string;
  title: string;
  description: string;
}

export interface ServiceInfo {
  title: string;
  subtitle: string;
  bulletPoints: string[];
}

export interface InfoColumn {
  title: string;
  description: string;
}

export const PASSPORT_REQUIREMENTS: RequirementItem[] = [
  {
    id: "item-1",
    title: "U.S. Passport (Adult 10-Year Validity)",
    description:
      "Your passport must have been valid for 10 years and still be valid or expired within the last 5 years.",
  },
  {
    id: "item-2",
    title: "DS-82 Form Completed Online",
    description: "Complete the DS-82 form online with accurate information.",
  },
  {
    id: "item-3",
    title: "Photocopy of Valid Photo ID",
    description: "A clear photocopy of your valid government-issued photo ID.",
  },
  {
    id: "item-4",
    title: "Passport Photo",
    description: "Recent passport photo meeting all requirements.",
  },
  {
    id: "item-5",
    title: "Proof of Travel Departure",
    description: "Documentation showing your travel plans and departure date.",
  },
  {
    id: "item-6",
    title: "Government Passport Fee",
    description: "Required government fees for passport processing.",
  },
];

export const SERVICE_INFO: ServiceInfo = {
  title: "Passport Renewal",
  subtitle: "In As Little As 3 Days",
  bulletPoints: [
    "Your passport was valid for 10 years and has expired within the last 5 years.",
    "You still have your passport, and it is in good condition.",
  ],
};

export const INFO_COLUMNS: InfoColumn[] = [
  {
    title: "Who Is It For",
    description:
      "U.S. citizens who need to renew their passport, and it is still in good condition.",
  },
  {
    title: "Processing Time",
    description: "Standard: 6-8 weeks. Expedited: As little as 3 Days.",
  },
  {
    title: "Cost",
    description:
      "Starting from $189, with additional fees for expedited services.",
  },
];
