import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding – TechEdu Solution",
  description:
    "Personalize your TechEdu Solution experience. Select your role and get customized tools, dashboards, and recommendations for your academic or career journey.",
  keywords:
    "onboarding, personalize dashboard, select role, TechEdu onboarding, student onboarding, graduate onboarding, employer onboarding",
  openGraph: {
    title: "Onboarding – TechEdu Solution",
    description:
      "Personalize your TechEdu Solution experience. Select your role and get customized tools, dashboards, and recommendations for your academic or career journey.",
    url: "https://techedusolution.com/onboarding",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/icons/undraw_teacher_s628.svg",
        width: 1200,
        height: 630,
        alt: "Onboarding at TechEdu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onboarding – TechEdu Solution",
    description:
      "Personalize your TechEdu Solution experience. Select your role and get customized tools, dashboards, and recommendations for your academic or career journey.",
    images: ["/icons/undraw_teacher_s628.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://techedusolution.com/onboarding",
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
