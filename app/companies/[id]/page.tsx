"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getApiRequest } from "@/lib/apiFetch";
import { Skeleton } from "@/components/ui/skeleton";

type Company = {
  _id: string;
  name: string;
  type?: "recruiter" | "institution" | "tech_professional" | string;
  industry?: string;
  website?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function CompanyDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const companyId = params?.id;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    const fetchCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getApiRequest<any>(`/api/companies/${companyId}`);
        const payload = res?.data?.data || res?.data; // support both shapes
        setCompany(payload || null);
      } catch (e: any) {
        setError(e?.message || "Failed to load company");
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  return (
    <section className="pt-32 pb-10 px-4 md:px-16 mx-auto">
      <div className="mb-4 flex items-center gap-3 text-sm text-gray-600">
        <button
          className="underline"
          onClick={() => router.back()}
          type="button"
        >
          Back
        </button>
        <span>/</span>
        <Link href="/companies" className="underline">
          Companies
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-[10px] p-6 shadow-sm">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : !company ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
          <div className="mb-3 h-10 w-10 rounded-full bg-gray-200" />
          <p className="font-medium">Company not found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-[10px] p-6 shadow-sm">
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#002647] mb-2">
            {company.name}
          </h1>
          <div className="text-sm text-gray-700 mb-4 flex flex-wrap items-center gap-2">
            {company.type && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 border">
                {company.type}
              </span>
            )}
            {typeof company.isVerified === "boolean" && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  company.isVerified
                    ? "bg-green-100 border-green-300"
                    : "bg-gray-100"
                }`}
              >
                {company.isVerified ? "Verified" : "Unverified"}
              </span>
            )}
            {typeof company.isActive === "boolean" && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 border">
                {company.isActive ? "Active" : "Inactive"}
              </span>
            )}
          </div>

          {company.website && (
            <div className="mb-4">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {company.website}
              </a>
            </div>
          )}

          {company.industry && (
            <div className="mb-4 text-gray-800">
              <h2 className="font-semibold mb-1">Industry</h2>
              <p>{company.industry}</p>
            </div>
          )}

          <div className="text-xs text-gray-500">
            {company.createdAt && (
              <div>Created: {new Date(company.createdAt).toLocaleString()}</div>
            )}
            {company.updatedAt && (
              <div>Updated: {new Date(company.updatedAt).toLocaleString()}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
