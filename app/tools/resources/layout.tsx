import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Resources Hub – Guides, Templates & Tools | TechEdu Solution",
  description:
    "Explore TechEdu Solution's Learning Resource Hub with videos, audio content, PDFs, templates, and tools to accelerate your education, career, and business growth.",
  keywords: [
    "learning resources",
    "career resources",
    "education guides",
    "PDF templates",
    "training videos",
    "career tools",
    "scholarship resources",
    "CV resources",
  ],
  openGraph: {
    title:
      "Learning Resources Hub – Guides, Templates & Tools | TechEdu Solution",
    description:
      "Access expert-curated guides, templates, videos and tools in the TechEdu Solution Learning Resource Hub.",
    url: "https://techedusolution.com/tools/resources",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/online-instructor-led-course.avif",
        width: 1200,
        height: 630,
        alt: "Online learning resources at TechEdu Solution",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Learning Resources Hub – Guides, Templates & Tools | TechEdu Solution",
    description:
      "Browse expert-created resources, templates, and tools to support your academic and career journey with TechEdu Solution.",
    images: ["/assets/online-instructor-led-course.avif"],
  },
  alternates: {
    canonical: "https://techedusolution.com/tools/resources",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


