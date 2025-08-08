import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications – TechEdu Solution",
  description:
    "Earn verifiable, employer-recognized certificates with every TechEdu Solution training program. Showcase your skills and boost your career opportunities.",
  keywords:
    "certifications, verifiable certificates, TechEdu certification, digital credentials, training certificates, employer recognition",
  openGraph: {
    title: "Certifications – TechEdu Solution",
    description:
      "Earn verifiable, employer-recognized certificates with every TechEdu Solution training program. Showcase your skills and boost your career opportunities.",
    url: "https://techedusolution.com/training/certifications",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/people-graduating-with-diplomas.webp",
        width: 1200,
        height: 630,
        alt: "Certifications at TechEdu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Certifications – TechEdu Solution",
    description:
      "Earn verifiable, employer-recognized certificates with every TechEdu Solution training program. Showcase your skills and boost your career opportunities.",
    images: ["/assets/people-graduating-with-diplomas.webp"],
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
    canonical: "https://techedusolution.com/training/certifications",
  },
};

export default function CertificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
