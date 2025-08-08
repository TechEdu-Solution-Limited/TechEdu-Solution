import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started – TechEdu Solution",
  description:
    "Start your journey with TechEdu Solution. Choose your path as a student, graduate, professional, or employer and unlock access to scholarships, CV tools, training, and hiring solutions.",
  keywords:
    "get started, TechEdu onboarding, student path, graduate path, professional path, employer path, education tools, career tools",
  openGraph: {
    title: "Get Started – TechEdu Solution",
    description:
      "Start your journey with TechEdu Solution. Choose your path as a student, graduate, professional, or employer and unlock access to scholarships, CV tools, training, and hiring solutions.",
    url: "https://techedusolution.com/get-started",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/online-instructor-led-course.avif",
        width: 1200,
        height: 630,
        alt: "Get Started at TechEdu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Started – TechEdu Solution",
    description:
      "Start your journey with TechEdu Solution. Choose your path as a student, graduate, professional, or employer and unlock access to scholarships, CV tools, training, and hiring solutions.",
    images: ["/assets/online-instructor-led-course.avif"],
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
    canonical: "https://techedusolution.com/get-started",
  },
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
