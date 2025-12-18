import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – TechEdu Solution Limited",
  description:
    "Read TechEdu Solution Limited's Privacy Policy explaining how we collect, use, and protect your personal data across our platforms and services.",
  keywords: [
    "TechEdu privacy policy",
    "data protection",
    "GDPR education platform",
    "privacy notice",
    "user data",
    "cookies and tracking",
  ],
  openGraph: {
    title: "Privacy Policy – TechEdu Solution Limited",
    description:
      "Learn how TechEdu Solution Limited handles your personal data, privacy rights, and security across our education and career platforms.",
    url: "https://techedusolution.com/privacy-policy",
    siteName: "TechEdu Solution Limited",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy – TechEdu Solution Limited",
    description:
      "Understand TechEdu Solution Limited's approach to privacy, data protection, and user rights.",
  },
  alternates: {
    canonical: "https://techedusolution.com/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


