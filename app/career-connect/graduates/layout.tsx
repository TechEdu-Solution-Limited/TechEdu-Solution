import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job-Ready Graduate Profiles – CareerConnect by TechEdu Solution",
  description:
    "Create a verified graduate profile, get coaching, and connect directly with recruiters using CareerConnect.",
  keywords:
    "graduate job board UK, internship platform, entry-level jobs, CV builder, mock interview coaching, CareerConnect for graduates",
  openGraph: {
    title: "Job-Ready Graduate Profiles – CareerConnect by TechEdu Solution",
    description:
      "Create a verified graduate profile, get coaching, and connect directly with recruiters using CareerConnect.",
    url: "https://techedusolution.com/career-connect/graduates",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/graduates-og.jpg",
        width: 1200,
        height: 630,
        alt: "CareerConnect Graduates Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job-Ready Graduate Profiles – CareerConnect by TechEdu Solution",
    description:
      "Create a verified graduate profile, get coaching, and connect directly with recruiters using CareerConnect.",
    images: ["/assets/graduates-og.jpg"],
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
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://techedusolution.com/career-connect/graduates",
  },
};

export default function GraduatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
