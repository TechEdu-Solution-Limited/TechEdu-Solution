import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact TechEdu Solution Limited – Reach Out",
  description:
    "Have questions about academic support, career coaching, or training programs? Contact TechEdu Solution. We reply within 1 business day.",
  keywords:
    "contact TechEdu Solution, academic support contact, career coaching contact, training programs contact, education consultation",
  openGraph: {
    title: "Contact TechEdu Solution Limited – Reach Out",
    description:
      "Have questions about academic support, career coaching, or training programs? Contact TechEdu Solution. We reply within 1 business day.",
    type: "website",
    locale: "en_GB",
    siteName: "TechEdu Solution Limited",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact TechEdu Solution Limited – Reach Out",
    description:
      "Have questions about academic support, career coaching, or training programs? Contact TechEdu Solution. We reply within 1 business day.",
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
  verification: {
    google: "your-google-site-verification", // Replace with your actual Google verification code
  },
  alternates: {
    canonical: "https://techeduk.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
