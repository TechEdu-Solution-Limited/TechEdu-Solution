import type { Metadata } from "next";

type TabType =
  | "academic"
  | "career"
  | "corporate"
  | "ai"
  | "talent"
  | "training";

interface ServiceCategory {
  title: string;
  description: string;
  keywords: string[];
  focusKeywords: string[];
}

const serviceCategories: Record<TabType, ServiceCategory> = {
  academic: {
    title: "Academic Support Services",
    description:
      "PhD mentoring, academic transition training, thesis review, and publication support for students and researchers.",
    keywords: [
      "PhD mentoring",
      "academic support",
      "thesis review",
      "publication support",
      "academic transition",
      "scholarship coaching",
      "data analysis",
      "academic writing",
      "research support",
      "student services",
    ],
    focusKeywords: [
      "PhD mentoring",
      "academic support services",
      "thesis review",
    ],
  },
  career: {
    title: "Career Development & Mentorship",
    description:
      "Professional CV services, interview preparation, and career coaching to advance your professional journey.",
    keywords: [
      "CV services",
      "interview preparation",
      "career coaching",
      "professional development",
      "job search",
      "career guidance",
      "resume writing",
      "career transition",
      "professional mentoring",
      "career advancement",
    ],
    focusKeywords: ["CV services", "interview preparation", "career coaching"],
  },
  corporate: {
    title: "Corporate Consultancy & Business Training",
    description:
      "Business analysis training, professional consultancy, and leadership development for organizations.",
    keywords: [
      "business analysis",
      "corporate consultancy",
      "leadership training",
      "professional consultancy",
      "business training",
      "executive coaching",
      "data analysis",
      "corporate insights",
      "management training",
      "business strategy",
    ],
    focusKeywords: [
      "business analysis training",
      "corporate consultancy",
      "leadership development",
    ],
  },
  ai: {
    title: "AI Consultancy Packages",
    description:
      "AI ethics consultation, governance frameworks, and enterprise AI services for responsible AI implementation.",
    keywords: [
      "AI consultancy",
      "AI ethics",
      "AI governance",
      "artificial intelligence",
      "AI policy",
      "AI strategy",
      "machine learning",
      "AI implementation",
      "AI risk management",
      "AI compliance",
    ],
    focusKeywords: ["AI consultancy", "AI ethics", "AI governance"],
  },
  talent: {
    title: "Institutional & Team Services",
    description:
      "Tech talent sourcing and recruitment services for organizations seeking specialized professionals.",
    keywords: [
      "tech recruitment",
      "talent sourcing",
      "hiring services",
      "tech professionals",
      "recruitment consultancy",
      "talent acquisition",
      "tech hiring",
      "specialized recruitment",
      "executive search",
      "tech talent",
    ],
    focusKeywords: ["tech recruitment", "talent sourcing", "hiring services"],
  },
  training: {
    title: "Training & Certification",
    description:
      "Technology-enhanced learning workshops and comprehensive training programs for skill development.",
    keywords: [
      "tech training",
      "certification programs",
      "workshops",
      "skill development",
      "professional training",
      "technology courses",
      "online training",
      "tech workshops",
      "certification",
      "learning programs",
    ],
    focusKeywords: ["tech training", "certification programs", "workshops"],
  },
};

export function generatePricingMetadata(tab?: TabType): Metadata {
  const baseUrl = "https://techedusolution.com";
  const baseTitle = "Professional Services Pricing | TechEdu Solution";
  const baseDescription =
    "Explore comprehensive professional services including academic support, career development, corporate consultancy, AI services, and training programs. Transparent pricing for students, professionals, and businesses.";

  if (!tab) {
    return {
      title: baseTitle,
      description: baseDescription,
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
      openGraph: {
        title: baseTitle,
        description: baseDescription,
        url: `${baseUrl}/pricing`,
        images: [
          {
            url: `${baseUrl}/assets/pricing-og-image.jpg`,
            width: 1200,
            height: 630,
            alt: "TechEdu Solution Professional Services Pricing",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: baseTitle,
        description: baseDescription,
        images: [`${baseUrl}/assets/pricing-twitter-image.jpg`],
      },
    };
  }

  const category = serviceCategories[tab];
  const title = `${category.title} Pricing | TechEdu Solution`;
  const description = `${category.description} Transparent pricing and flexible delivery options.`;

  return {
    title,
    description,
    keywords: [
      ...category.keywords,
      "pricing",
      "cost",
      "rates",
      "UK",
      "professional services",
      "transparent pricing",
    ],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/pricing?category=${tab}`,
      images: [
        {
          url: `${baseUrl}/assets/${tab}-pricing-og.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.title} Pricing - TechEdu Solution`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/assets/${tab}-pricing-twitter.jpg`],
    },
    alternates: {
      canonical: `/pricing?category=${tab}`,
    },
  };
}

export function generateServiceStructuredData(tab: TabType, products?: any[]) {
  const category = serviceCategories[tab];

  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.title,
    description: category.description,
    provider: {
      "@type": "Organization",
      name: "TechEdu Solution",
      url: "https://techedusolution.com",
      logo: "https://techedusolution.com/assets/logo.png",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    availableLanguage: "en",
    serviceType: category.title,
    category: "Professional Services",
  };

  if (products && products.length > 0) {
    return {
      ...baseStructuredData,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: category.title,
        description: category.description,
        itemListElement: products.map((product, index) => ({
          "@type": "Offer",
          position: index + 1,
          itemOffered: {
            "@type": "Service",
            name: product.service || product.title,
            description: product.description,
            category: product.productCategoryTitle || category.title,
          },
          price: product.price,
          priceCurrency: "GBP",
          availability: product.enabled
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          validFrom: product.createdAt,
          url: `https://techedusolution.com/training/catalog/${product.slug}`,
        })),
      },
    };
  }

  return baseStructuredData;
}
