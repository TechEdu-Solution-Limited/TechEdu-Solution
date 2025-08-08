import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Training – TechEdu Solution",
  description:
    "Upskill your team with live, instructor-led Zoom training. Custom programs, verifiable certificates, and performance dashboards for organizations, NGOs, and schools.",
  keywords:
    "team training, corporate training, organizational upskilling, live classes, TechEdu certificates, group learning, performance dashboard",
  openGraph: {
    title: "Team Training – TechEdu Solution",
    description:
      "Upskill your team with live, instructor-led Zoom training. Custom programs, verifiable certificates, and performance dashboards for organizations, NGOs, and schools.",
    url: "https://techedusolution.com/training/teams",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/group-of-traning-people.webp",
        width: 1200,
        height: 630,
        alt: "Team Training at TechEdu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Training – TechEdu Solution",
    description:
      "Upskill your team with live, instructor-led Zoom training. Custom programs, verifiable certificates, and performance dashboards for organizations, NGOs, and schools.",
    images: ["/assets/group-of-traning-people.webp"],
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
    canonical: "https://techedusolution.com/training/teams",
  },
};

export default function TeamTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
