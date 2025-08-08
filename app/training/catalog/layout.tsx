import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Catalog – TechEdu Solution",
  description:
    "Browse all available training programs at TechEdu Solution. Filter by topic, level, or learning path and start your certification journey today.",
  keywords:
    "training catalog, course list, online training, certification programs, TechEdu courses, browse training",
  openGraph: {
    title: "Training Catalog – TechEdu Solution",
    description:
      "Browse all available training programs at TechEdu Solution. Filter by topic, level, or learning path and start your certification journey today.",
    url: "https://techedusolution.com/training/catalog",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/young-serious-busy-professional-business.webp",
        width: 1200,
        height: 630,
        alt: "Training Catalog at TechEdu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Training Catalog – TechEdu Solution",
    description:
      "Browse all available training programs at TechEdu Solution. Filter by topic, level, or learning path and start your certification journey today.",
    images: ["/assets/young-serious-busy-professional-business.webp"],
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
    canonical: "https://techedusolution.com/training/catalog",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
