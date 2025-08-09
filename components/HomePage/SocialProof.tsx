"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

type Company = {
  _id: string;
  name: string;
  type?: "recruiter" | "institution" | "tech_professional" | string;
  industry?: string;
  website?: string;
};

export default function SocialProof() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getApiRequest<any>("/api/companies", undefined, {
          page: 1,
          limit: 8,
          isActive: true,
        });
        const apiData = res?.data;
        const container = apiData?.data || apiData;
        const items: Company[] = container?.companies || [];
        setCompanies(items);
      } catch (e: any) {
        setError("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <section
      aria-labelledby="social-proof-heading"
      className="py-20 px-4 md:px-16 mx-auto bg-gray-50"
    >
      <h2
        id="social-proof-heading"
        className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-6 flex items-center justify-center gap-3"
      >
        <Building2 className="text-[#002647]" size={36} />
        <span className="uppercase text-outline text-white">Companies</span>
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-[10px] p-4 shadow-sm"
            >
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-600">
          <Building2 size={36} className="text-gray-400 mb-2" />
          <p className="font-medium">No companies to display.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-200 rounded-[10px] p-4 shadow-sm"
            >
              <Link
                href={`/companies/${c._id}`}
                className="font-semibold text-gray-900 hover:underline"
              >
                {c.name}
              </Link>
              <p className="text-sm text-gray-600">
                {c.industry || "Industry not specified"}
              </p>
              {c.website && (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline break-all"
                >
                  {c.website}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/companies"
          className="inline-flex items-center px-4 py-2 rounded-md bg-[#0D1140] text-white hover:bg-blue-700 text-sm"
        >
          View more companies
        </Link>
      </div>
    </section>
  );
}
