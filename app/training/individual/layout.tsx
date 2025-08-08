import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Individual Training – TechEdu Solution",
  description:
    "Live Zoom-based training for graduates, students, and early-career professionals. Build practical skills, earn certificates, and boost your career with TechEdu Solution.",
  keywords:
    "individual training, online courses, graduate skills, student training, live classes, TechEdu certificates, career launch",
  openGraph: {
    title: "Individual Training – TechEdu Solution",
    description:
      "Live Zoom-based training for graduates, students, and early-career professionals. Build practical skills, earn certificates, and boost your career with TechEdu Solution.",
    url: "https://techedusolution.com/training/individual",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/young-serious-busy-professional-business.webp",
        width: 1200,
        height: 630,
        alt: "Individual Training at TechEdu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Individual Training – TechEdu Solution",
    description:
      "Live Zoom-based training for graduates, students, and early-career professionals. Build practical skills, earn certificates, and boost your career with TechEdu Solution.",
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
    canonical: "https://techedusolution.com/training/individual",
  },
};

export default function IndividualTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
