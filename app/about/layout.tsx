import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "About TechEdu Solution Limited – Personalized Mentorship, Tools & Growth",
  description:
    "Learn how TechEdu Solution Limited empowers students, professionals, and organizations through mentorship, micro-products, and data-driven training.",
  keywords: [
    "academic mentorship",
    "career growth",
    "scholarship coach",
    "CV builder",
    "graduate hiring",
    "training consultants",
    "CareerConnect",
  ],
  openGraph: {
    title:
      "About TechEdu Solution Limited – Personalized Mentorship, Tools & Growth",
    description:
      "Learn how TechEdu Solution Limited empowers students, professionals, and organizations through mentorship, micro-products, and data-driven training.",
    type: "website",
    locale: "en_US",
    siteName: "TechEdu Solution Limited",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "About TechEdu Solution Limited – Personalized Mentorship, Tools & Growth",
    description:
      "Learn how TechEdu Solution Limited empowers students, professionals, and organizations through mentorship, micro-products, and data-driven training.",
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
    canonical: "https://techedusolution.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
