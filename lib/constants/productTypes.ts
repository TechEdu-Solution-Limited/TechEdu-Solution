// Product Type Constants
export const PRODUCT_TYPE_OPTIONS = [
  "Training & Certification",
  "Academic Support Services",
  "Career Development & Mentorship",
  "Corporate & Business Consultancy",
  "Career Connect",
  // "Institutional & Team Services",
  // "AI-Powered or Automation Services",
  // "Marketing, Consultation & Free Services",
] as const;

// Tab types for pricing page
export type TabType =
  | "academic services"
  | "career development"
  | "corporate & business consultancy"
  | "training";

// Product type mapping to TabType
export const PRODUCT_TYPE_MAPPING: Record<TabType, string> = {
  "academic services": "Academic Support Services",
  "career development": "Career Development & Mentorship",
  "corporate & business consultancy": "Corporate & Business Consultancy",
  training: "Training & Certification",
} as const;

export const studentServices = [
  "Academic Support Services",
  "Training & Certification",
  "Career Development & Mentorship",
];

export const individualTechProfessionalServices = [
  "Academic Support Services",
  "Training & Certification",
  "Career Development & Mentorship",
];

export const teamTechProfessionalServices = [
  "Academic Support Services",
  "Training & Certification",
  "Career Development & Mentorship",
];

export const recruiterServices = [
  "Academic Support Services",
  "Training & Certification",
  "Career Development & Mentorship",
  "Career Connect",
];

export const institutionServices = [
  "Academic Support Services",
  "Training & Certification",
  "Career Development & Mentorship",
];

// Empty state messages for each product type
export const EMPTY_STATE_MESSAGES: Record<
  TabType,
  { title: string; description: string }
> = {
  "academic services": {
    title: "No Academic Services Found",
    description:
      "We couldn't find any academic support services matching your current filters. Try adjusting your search criteria or browse our complete catalog of academic services.",
  },
  "career development": {
    title: "No Career Services Found",
    description:
      "We couldn't find any career development services matching your current filters. Try adjusting your search criteria or explore our full range of career services.",
  },
  "corporate & business consultancy": {
    title: "No Corporate Services Found",
    description:
      "We couldn't find any corporate consultancy services matching your current filters. Try adjusting your search criteria or browse our complete business services catalog.",
  },
  training: {
    title: "No Training Programs Found",
    description:
      "We couldn't find any training programs matching your current filters. Try adjusting your search criteria or browse our complete training catalog.",
  },
} as const;

// Other product-related constants
export const DIFFICULTY_LEVEL_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export const SORT_OPTIONS = [
  { value: "price", label: "Price" },
  { value: "service", label: "Name" },
  { value: "category", label: "Category" },
] as const;
