import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://techedusolution.com";

type PublicProduct = {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  enabled?: boolean;
};

async function fetchPublicProducts(): Promise<PublicProduct[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) return [];

  try {
    const res = await fetch(
      `${apiBase}/api/products/public?limit=1000`,
      {
        // Cache but allow periodic refresh
        next: { revalidate: 60 * 60 }, // 1 hour
      }
    );

    if (!res.ok) return [];

    const json = await res.json();
    // Support multiple possible shapes
    const payload = json?.data ?? json ?? {};
    const products: PublicProduct[] =
      payload.products ?? payload.items ?? payload.results ?? [];

    if (!Array.isArray(products)) return [];

    return products.filter((p) => !("enabled" in p) || p.enabled);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/academic-services`, lastModified: new Date() },
    { url: `${BASE_URL}/career-development`, lastModified: new Date() },
    { url: `${BASE_URL}/training`, lastModified: new Date() },
    { url: `${BASE_URL}/pricing`, lastModified: new Date() },
    { url: `${BASE_URL}/career-connect`, lastModified: new Date() },
    { url: `${BASE_URL}/career-connect/graduates`, lastModified: new Date() },
    { url: `${BASE_URL}/career-connect/employers`, lastModified: new Date() },
    { url: `${BASE_URL}/free-consultation`, lastModified: new Date() },
    { url: `${BASE_URL}/corporate-consultancy`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
    { url: `${BASE_URL}/tools/cv-builder`, lastModified: new Date() },
    { url: `${BASE_URL}/tools/scholarship-coach`, lastModified: new Date() },
    { url: `${BASE_URL}/tools/package-estimator`, lastModified: new Date() },
    { url: `${BASE_URL}/tools/resources`, lastModified: new Date() },
    { url: `${BASE_URL}/training/catalog`, lastModified: new Date() },
    { url: `${BASE_URL}/training/individual`, lastModified: new Date() },
    { url: `${BASE_URL}/training/teams`, lastModified: new Date() },
    { url: `${BASE_URL}/training/certifications`, lastModified: new Date() },
    { url: `${BASE_URL}/companies`, lastModified: new Date() },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date() },
    { url: `${BASE_URL}/terms-conditions`, lastModified: new Date() },
  ];

  const productRoutes: MetadataRoute.Sitemap = [];

  const products = await fetchPublicProducts();
  for (const product of products) {
    if (!product.slug) continue;
    productRoutes.push({
      url: `${BASE_URL}/training/catalog/${product.slug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : product.createdAt
        ? new Date(product.createdAt)
        : new Date(),
    });
  }

  return [...staticRoutes, ...productRoutes];
}


