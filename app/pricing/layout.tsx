import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Services Pricing | TechEdu Solution",
  description:
    "Explore comprehensive professional services including academic support, career development, corporate consultancy, AI services, and training programs. Transparent pricing for students, professionals, and businesses.",
  keywords: [
    "professional services pricing",
    "academic support services",
    "career development",
    "corporate consultancy",
    "AI governance services",
    "tech training programs",
    "business analysis training",
    "PhD mentoring",
    "CV services",
    "interview preparation",
    "leadership coaching",
    "data science training",
    "UK professional services",
    "online training courses",
    "certification programs",
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
    canonical: "/pricing",
  },
  openGraph: {
    title: "Professional Services Pricing | TechEdu Solution",
    description:
      "Comprehensive professional services with transparent pricing. Academic support, career development, corporate consultancy, AI services, and training programs for students, professionals, and businesses.",
    url: "https://techedusolution.com/pricing",
    siteName: "TechEdu Solution",
    images: [
      {
        url: "/assets/pricing-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechEdu Solution Professional Services Pricing",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Services Pricing | TechEdu Solution",
    description:
      "Comprehensive professional services with transparent pricing. Academic support, career development, corporate consultancy, AI services, and training programs.",
    images: ["/assets/pricing-twitter-image.jpg"],
    creator: "@techedusolution",
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
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "education",
  classification: "Professional Services",
  other: {
    "application-name": "TechEdu Solution",
    "apple-mobile-web-app-title": "TechEdu Pricing",
    "msapplication-TileColor": "#0D1140",
    "theme-color": "#0D1140",
  },
};

// Structured Data for Pricing Page
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechEdu Solution",
  url: "https://techedusolution.com",
  logo: "https://techedusolution.com/assets/logo.png",
  description:
    "Comprehensive professional services including academic support, career development, corporate consultancy, AI services, and training programs.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "GB",
    addressRegion: "England",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+44-xxx-xxx-xxxx",
    contactType: "customer service",
    email: "info@techedusolution.com",
  },
  sameAs: [
    "https://linkedin.com/company/techedusolution",
    "https://twitter.com/techedusolution",
  ],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "GBP",
    lowPrice: "60",
    highPrice: "5000",
    offerCount: "25+",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "TechEdu Solution",
    },
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Professional Services",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Academic Support Services",
        description:
          "PhD mentoring, academic transition training, thesis review, and publication support",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "PhD Mentoring",
              description: "One-on-one PhD mentoring sessions",
            },
            price: "80",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "80",
              priceCurrency: "GBP",
              unitText: "per hour",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "PhD Admission & Scholarship Coaching",
              description:
                "6-month program for PhD applications and scholarship guidance",
            },
            price: "1000",
            priceCurrency: "GBP",
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Career Development & Mentorship",
        description: "CV services, interview preparation, and career coaching",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "CV Revamp",
              description:
                "Essential refresh with document review and revisions",
            },
            price: "80",
            priceCurrency: "GBP",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Interview Preparation",
              description: "Targeted coaching with prep resources and feedback",
            },
            price: "70",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "70",
              priceCurrency: "GBP",
              unitText: "per hour",
            },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Corporate Consultancy & Business Training",
        description:
          "Business analysis training, professional consultancy, and leadership development",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Business Analysis Training",
              description: "8-week program with workshop and toolkit",
            },
            price: "700",
            priceCurrency: "GBP",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Professional Consultancy",
              description: "One-on-one strategy sessions",
            },
            price: "100",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "100",
              priceCurrency: "GBP",
              unitText: "per hour",
            },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "AI Consultancy Packages",
        description:
          "AI ethics consultation, governance frameworks, and enterprise AI services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI Ethics Consultation",
              description: "1-hour live session with summary brief",
            },
            price: "150",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "150",
              priceCurrency: "GBP",
              unitText: "per hour",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI Governance Framework",
              description: "Comprehensive advisory with policy and roadmap",
            },
            price: "1200",
            priceCurrency: "GBP",
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Institutional & Team Services",
        description: "Tech talent sourcing and recruitment services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Tech Talent Sourcing",
              description: "Standard search with targeted candidate sourcing",
            },
            price: "500",
            priceCurrency: "GBP",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "500",
              priceCurrency: "GBP",
              unitText: "per hire",
            },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Training & Certification",
        description:
          "Technology-enhanced learning workshops and training programs",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Workshops & Training",
              description: "Essentials - 1.5-hour session with training slides",
            },
            price: "70",
            priceCurrency: "GBP",
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Comprehensive Learning",
              description: "3-hour deep-dive with interactive exercises",
            },
            price: "150",
            priceCurrency: "GBP",
          },
        ],
      },
    ],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </>
  );
}
