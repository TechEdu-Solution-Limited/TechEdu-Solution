import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Corporate Consultancy – Strategy, Training, and Talent | TechEdu Solution",
  description:
    "Partner with TechEdu Solution for enterprise training, data-backed consulting, and smarter hiring. Transform your organization with our expert solutions. Book a free strategy call today.",
  keywords: [
    "corporate training UK",
    "hiring support",
    "institutional partnership",
    "academic consultancy",
    "KPI dashboard tools",
    "enterprise solutions",
    "business consulting",
    "talent management",
    "workforce development",
  ],
  authors: [{ name: "TechEdu Solution" }],
  creator: "TechEdu Solution",
  publisher: "TechEdu Solution",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://techedusolution.com"),
  alternates: {
    canonical: "/corporate-consultancy",
  },
  openGraph: {
    title:
      "Corporate Consultancy – Strategy, Training, and Talent | TechEdu Solution",
    description:
      "Partner with TechEdu Solution for enterprise training, data-backed consulting, and smarter hiring. Transform your organization with our expert solutions.",
    url: "https://techedusolution.com/corporate-consultancy",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/images/corporate-consultancy-og.jpg",
        width: 1200,
        height: 630,
        alt: "TechEdu Solution Corporate Consultancy Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Corporate Consultancy – Strategy, Training, and Talent | TechEdu Solution",
    description:
      "Partner with TechEdu Solution for enterprise training, data-backed consulting, and smarter hiring. Transform your organization with our expert solutions.",
    images: ["/images/corporate-consultancy-twitter.jpg"],
    creator: "@techedusolution",
    site: "@techedusolution",
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
  category: "Business Services",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
