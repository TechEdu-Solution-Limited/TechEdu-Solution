import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire Graduate Talent with CareerConnect by TechEdu Solution",
  description:
    "Post jobs, access verified CVs, and manage shortlists with CareerConnect — the faster way to hire job-ready graduates.",
  keywords:
    "hire graduates UK, job portal for HR, shortlist tool, job board with CV reviews, CareerConnect employers",
  openGraph: {
    title: "Hire Graduate Talent with CareerConnect by TechEdu Solution",
    description:
      "Post jobs, access verified CVs, and manage shortlists with CareerConnect — the faster way to hire job-ready graduates.",
    url: "https://techedusolution.com/career-connect/employers",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/employers-og.jpg",
        width: 1200,
        height: 630,
        alt: "CareerConnect Employers Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Graduate Talent with CareerConnect by TechEdu Solution",
    description:
      "Post jobs, access verified CVs, and manage shortlists with CareerConnect — the faster way to hire job-ready graduates.",
    images: ["/assets/employers-og.jpg"],
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
    canonical: "https://techedusolution.com/career-connect/employers",
  },
};

export default function EmployersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
