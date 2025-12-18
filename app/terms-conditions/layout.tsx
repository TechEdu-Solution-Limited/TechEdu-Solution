import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions – TechEdu Solution Limited",
  description:
    "Review the Terms & Conditions governing your use of TechEdu Solution Limited's training, digital products, and platforms.",
  keywords: [
    "TechEdu terms and conditions",
    "terms of use",
    "training terms",
    "digital products terms",
    "licensing terms",
    "copyright notice",
  ],
  openGraph: {
    title: "Terms & Conditions – TechEdu Solution Limited",
    description:
      "Understand the Terms & Conditions for using TechEdu Solution Limited’s training, resources, and digital platforms.",
    url: "https://techedusolution.com/terms-conditions",
    siteName: "TechEdu Solution Limited",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions – TechEdu Solution Limited",
    description:
      "Read the Terms & Conditions that apply when accessing TechEdu Solution Limited services and content.",
  },
  alternates: {
    canonical: "https://techedusolution.com/terms-conditions",
  },
};

export default function TermsConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


