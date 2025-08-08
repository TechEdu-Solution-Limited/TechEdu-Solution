import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Services – Thesis Help, Mentorship & Scholarship Coaching",
  description:
    "Get personalized academic mentorship, dissertation editing, and scholarship coaching. Book a discovery call with TechEdu Solution Limited.",
  keywords:
    "PhD support, thesis editing, scholarship UK, academic coaching, dissertation help",
  openGraph: {
    title: "Academic Services – Thesis Help, Mentorship & Scholarship Coaching",
    description:
      "Get personalized academic mentorship, dissertation editing, and scholarship coaching. Book a discovery call with TechEdu Solution Limited.",
    url: "https://techedusolution.com/academic-services",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/academic-services-og.jpg",
        width: 1200,
        height: 630,
        alt: "Academic Services at TechEdu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Academic Services – Thesis Help, Mentorship & Scholarship Coaching",
    description:
      "Get personalized academic mentorship, dissertation editing, and scholarship coaching. Book a discovery call with TechEdu Solution Limited.",
    images: ["/assets/academic-services-og.jpg"],
  },
  alternates: {
    canonical: "https://techedusolution.com/academic-services",
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
  other: {
    keywords:
      "PhD support, thesis editing, scholarship UK, academic coaching, dissertation help",
  },
};
