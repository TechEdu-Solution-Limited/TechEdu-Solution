import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies on TechEdu Solution – Recruiters & Institutions",
  description:
    "Browse verified recruiters, institutions, and tech professionals on TechEdu Solution. Filter by type, industry, country, and status.",
  keywords: [
    "TechEdu companies",
    "recruiter directory",
    "institution partners",
    "tech professionals",
    "graduate employers",
    "company profiles",
  ],
  openGraph: {
    title: "Companies on TechEdu Solution – Recruiters & Institutions",
    description:
      "Discover verified recruiters, institutions, and tech professionals using TechEdu Solution's hiring and training ecosystem.",
    url: "https://techedusolution.com/companies",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/career-connect-og.jpg",
        width: 1200,
        height: 630,
        alt: "TechEdu Solution company and recruiter network",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Companies on TechEdu Solution – Recruiters & Institutions",
    description:
      "Explore company and recruiter profiles on TechEdu Solution to understand who hires and collaborates on the platform.",
    images: ["/assets/career-connect-og.jpg"],
  },
  alternates: {
    canonical: "https://techedusolution.com/companies",
  },
};

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


