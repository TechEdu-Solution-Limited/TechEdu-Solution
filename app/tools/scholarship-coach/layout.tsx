import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarship Coach Tool – Win Global Scholarships | TechEdu Solution",
  description:
    "Use TechEdu Solution's Scholarship Coach to plan competitive applications for DAAD, Chevening, Erasmus+, Fulbright, CSC and more with templates and strategy guides.",
  keywords: [
    "scholarship coach",
    "scholarship strategy",
    "DAAD scholarship",
    "Chevening scholarship",
    "Erasmus scholarship",
    "Fulbright scholarship",
    "CSC scholarship",
    "personal statement templates",
    "SOP templates",
  ],
  openGraph: {
    title: "Scholarship Coach Tool – Win Global Scholarships | TechEdu Solution",
    description:
      "Land scholarships with strategy, not guesswork. Get templates, guides and optional coach feedback for your applications worldwide.",
    url: "https://techedusolution.com/tools/scholarship-coach",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/people-graduating-with-diplomas.webp",
        width: 1200,
        height: 630,
        alt: "Graduates celebrating scholarship success",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scholarship Coach Tool – Win Global Scholarships | TechEdu Solution",
    description:
      "Plan and optimise scholarship applications with expert-backed templates and strategy guides from TechEdu Solution.",
    images: ["/assets/people-graduating-with-diplomas.webp"],
  },
  alternates: {
    canonical: "https://techedusolution.com/tools/scholarship-coach",
  },
};

export default function ScholarshipCoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


