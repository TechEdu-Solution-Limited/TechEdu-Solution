import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Consultation Services – TechEdu Solution",
  description:
    "Book a free consultation with TechEdu Solution experts for academic support, career development, tech mentorship, business strategy, and AI governance.",
  keywords: [
    "free consultation",
    "career consultation",
    "academic consultation",
    "tech mentorship",
    "business strategy consultation",
    "AI governance consultation",
    "education and career support",
  ],
  openGraph: {
    title: "Free Consultation Services – TechEdu Solution",
    description:
      "Get expert guidance across career development, academic advancement, tech mentorship, business strategy, and AI governance with a free consultation.",
    url: "https://techedusolution.com/free-consultation",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/career-session.webp",
        width: 1200,
        height: 630,
        alt: "Free consultation session at TechEdu Solution",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Consultation Services – TechEdu Solution",
    description:
      "Book your free consultation with TechEdu Solution experts for academic, career, and business support.",
    images: ["/assets/career-session.webp"],
  },
  alternates: {
    canonical: "https://techedusolution.com/free-consultation",
  },
};

export default function FreeConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


