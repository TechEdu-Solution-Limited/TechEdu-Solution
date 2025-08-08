import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login – TechEdu Solution",
  description:
    "Login to your TechEdu Solution account to access CV Builder, scholarship tools, training records, and personalized support.",
  keywords:
    "TechEdu login, cv builder login, resume portal sign in, student dashboard login",
  openGraph: {
    title: "Login – TechEdu Solution",
    description:
      "Login to your TechEdu Solution account to access CV Builder, scholarship tools, training records, and personalized support.",
    url: "https://techedusolution.com/login",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/authImage.webp",
        width: 1200,
        height: 630,
        alt: "TechEdu Solution Login Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login – TechEdu Solution",
    description:
      "Login to your TechEdu Solution account to access CV Builder, scholarship tools, training records, and personalized support.",
    images: ["/assets/authImage.webp"],
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
    canonical: "https://techedusolution.com/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
