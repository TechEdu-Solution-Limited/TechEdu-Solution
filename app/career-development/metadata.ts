import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Development – Coaching, CV & Job Support",
  description:
    "Book career coaching, resume reviews, interview prep, and use CareerConnect to get discovered. Get expert help at TechEdu Solution.",
  openGraph: {
    title: "Career Development – Coaching, CV & Job Support",
    description:
      "Book career coaching, resume reviews, interview prep, and use CareerConnect to get discovered. Get expert help at TechEdu Solution.",
    url: "https://techedusolution.com/career-development",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/career-development-og.jpg",
        width: 1200,
        height: 630,
        alt: "Career Development Services at TechEdu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Development – Coaching, CV & Job Support",
    description:
      "Book career coaching, resume reviews, interview prep, and use CareerConnect to get discovered. Get expert help at TechEdu Solution.",
    images: ["/assets/career-development-og.jpg"],
  },
  alternates: {
    canonical: "https://techedusolution.com/career-development",
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
};
