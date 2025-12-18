import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Builder Wizard – Step-by-Step CV Creation | TechEdu Solution",
  description:
    "Build your CV step by step with TechEdu Solution's CV Builder Wizard. Answer quick prompts, preview live, and export a recruiter-ready CV.",
  keywords: [
    "CV builder wizard",
    "step-by-step CV builder",
    "create CV online",
    "student CV builder",
    "graduate CV builder",
    "interactive CV builder",
  ],
  openGraph: {
    title:
      "CV Builder Wizard – Step-by-Step CV Creation | TechEdu Solution",
    description:
      "Use the interactive CV Builder Wizard from TechEdu Solution to create a recruiter-ready CV in structured steps.",
    url: "https://techedusolution.com/cv-builder/start",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/cv-building.webp",
        width: 1200,
        height: 630,
        alt: "CV builder wizard interface",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "CV Builder Wizard – Step-by-Step CV Creation | TechEdu Solution",
    description:
      "Create a recruiter-ready CV in clear steps with TechEdu Solution's CV Builder Wizard.",
    images: ["/assets/cv-building.webp"],
  },
  alternates: {
    canonical: "https://techedusolution.com/cv-builder/start",
  },
};

export default function CvBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


