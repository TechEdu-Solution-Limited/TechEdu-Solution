import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Package Estimator Tool – Bundle Services & Estimate Costs | TechEdu Solution",
  description:
    "Use TechEdu Solution's Package Estimator to mix and match tools, services, and training, then get instant pricing, bundle savings, and booking options.",
  keywords: [
    "package estimator",
    "service bundle estimator",
    "education service pricing",
    "training package pricing",
    "career services bundle",
    "consulting package estimator",
  ],
  openGraph: {
    title:
      "Package Estimator Tool – Bundle Services & Estimate Costs | TechEdu Solution",
    description:
      "Build your perfect support package in minutes. Select tools, services, and training, then see instant estimates and savings with TechEdu Solution.",
    url: "https://techedusolution.com/tools/package-estimator",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/icons/undraw_calculator_21hp.svg",
        width: 1200,
        height: 630,
        alt: "Package estimator illustration",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Package Estimator Tool – Bundle Services & Estimate Costs | TechEdu Solution",
    description:
      "Estimate costs and discover smart bundles for academic, career, and business services with TechEdu Solution's Package Estimator.",
    images: ["/icons/undraw_calculator_21hp.svg"],
  },
  alternates: {
    canonical: "https://techedusolution.com/tools/package-estimator",
  },
};

export default function PackageEstimatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


