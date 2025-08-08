import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareerConnect – Hire & Get Hired Smarter",
  description:
    "CareerConnect by TechEdu Solution matches graduates with employers. Post jobs, get shortlisted, and connect to real talent.",
  keywords:
    "graduate jobs UK, smart hiring, job portal, talent matching, CV feedback, mock interview prep, CareerConnect",
  openGraph: {
    title: "CareerConnect – Hire & Get Hired Smarter",
    description:
      "CareerConnect by TechEdu Solution matches graduates with employers. Post jobs, get shortlisted, and connect to real talent.",
    url: "https://techedusolution.com/career-connect",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/career-connect-og.jpg",
        width: 1200,
        height: 630,
        alt: "CareerConnect Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerConnect – Hire & Get Hired Smarter",
    description:
      "CareerConnect by TechEdu Solution matches graduates with employers. Post jobs, get shortlisted, and connect to real talent.",
    images: ["/assets/career-connect-og.jpg"],
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
    canonical: "https://techedusolution.com/career-connect",
  },
};

export default function CareerConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
