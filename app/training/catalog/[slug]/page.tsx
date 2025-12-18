import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getApiRequest } from "@/lib/apiFetch";
import type { Product } from "@/types/product";
import ProductPageClient from "./ProductPageClient";

const BASE_URL = "https://techedusolution.com";

type ProductSlugPageProps = {
  params: Promise<{ slug: string }>;
};

type ProductBySlugResponse = {
  success: boolean;
  data?: Product;
  message?: string;
};

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await getApiRequest<ProductBySlugResponse>(
      `/api/products/public/slug/${slug}`
    );
    const payload = res?.data;
    if (payload?.success && payload.data) {
      return payload.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by slug", slug, error);
    return null;
  }
}

function buildProductJsonLd(product: Product) {
  const imagePath =
    product.thumbnailUrl || product.iconUrl || "/assets/techedusolution.jpg";
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : `${BASE_URL}${imagePath}`;
  const url = `${BASE_URL}/training/catalog/${product.slug}`;

  const price =
    (product.pricing?.basePrice as number | undefined) ??
    (typeof product.price === "number" ? product.price : 0);
  const currency = (product.currency || "GBP").toUpperCase();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.service,
    description: product.seoDescription || product.description,
    image: [imageUrl],
    sku: product._id,
    brand: {
      "@type": "Brand",
      name: "TechEdu Solution",
    },
    category:
      product.productCategoryTitle ||
      product.category ||
      "Training & Certification",
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: price.toString(),
      availability: product.enabled
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export async function generateMetadata({
  params,
}: ProductSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  const url = `${BASE_URL}/training/catalog/${slug}`;

  if (!product) {
    return {
      title: "Training Program Not Found | TechEdu Solution",
      description:
        "The training program you are looking for could not be found.",
      alternates: {
        canonical: url,
      },
    };
  }

  const title =
    product.seoTitle ||
    `${product.service} | Training & Certification | TechEdu Solution`;

  const rawDescription = product.seoDescription || product.description || "";
  const description =
    rawDescription.length > 155
      ? `${rawDescription.slice(0, 152)}...`
      : rawDescription;

  const imagePath =
    product.thumbnailUrl || product.iconUrl || "/assets/techedusolution.jpg";
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : `${BASE_URL}${imagePath}`;

  const canonicalUrl = `${BASE_URL}/training/catalog/${product.slug}`;

  return {
    title,
    description,
    keywords: product.tags && product.tags.length > 0 ? product.tags : undefined,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "TechEdu Solution",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ProductPage({ params }: ProductSlugPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = buildProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
