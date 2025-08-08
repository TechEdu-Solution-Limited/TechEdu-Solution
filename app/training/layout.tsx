import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Zoom Training & Certification – TechEdu Solution",
  description:
    "Live Zoom training programs with verifiable certificates in data, career skills, soft skills & business tools.",
  keywords:
    "zoom training Uk, zoom training United States, zoom training UK, zoom training international, online certification, professional courses, graduate training, team upskilling, mentor-led programs, TechEdu Solution courses",
  openGraph: {
    title: "Online Zoom Training & Certification – TechEdu Solution",
    description:
      "Live Zoom training programs with verifiable certificates in data, career skills, soft skills & business tools.",
    type: "website",
    locale: "en_US",
    siteName: "TechEdu Solution",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Zoom Training & Certification – TechEdu Solution",
    description:
      "Live Zoom training programs with verifiable certificates in data, career skills, soft skills & business tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
