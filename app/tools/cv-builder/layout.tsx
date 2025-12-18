import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Builder Tool – Create Job-Ready CVs | TechEdu Solution",
  description:
    "Use TechEdu Solution's CV Builder to design professional, recruiter-ready CVs with global formatting options, expert prompts, and export-ready templates.",
  keywords: [
    "CV builder",
    "online CV builder",
    "resume builder",
    "ATS friendly CV",
    "professional CV templates",
    "graduate CV",
    "student CV",
    "international CV formats",
  ],
  openGraph: {
    title: "CV Builder Tool – Create Job-Ready CVs | TechEdu Solution",
    description:
      "Build a polished CV that opens doors in the UK, EU, US and beyond using TechEdu Solution's CV Builder with expert-reviewed sections and live preview.",
    url: "https://techedusolution.com/tools/cv-builder",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/people-graduating-with-diplomas.webp",
        width: 1200,
        height: 630,
        alt: "TechEdu Solution CV Builder interface",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Builder Tool – Create Job-Ready CVs | TechEdu Solution",
    description:
      "Design recruiter-ready CVs with live preview, smart prompts, and export-ready templates using TechEdu Solution's CV Builder.",
    images: ["/assets/people-graduating-with-diplomas.webp"],
  },
  alternates: {
    canonical: "https://techedusolution.com/tools/cv-builder",
  },
};

export default function CvBuilderToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


