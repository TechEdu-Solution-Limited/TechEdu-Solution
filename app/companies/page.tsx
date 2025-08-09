"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, SearchX } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Company = {
  _id: string;
  name: string;
  type?: "recruiter" | "institution" | "tech_professional" | string;
  industry?: string;
  country?: string;
  website?: string;
  isVerified?: boolean;
  isActive?: boolean;
};

type ApiCompaniesResponse = {
  success: boolean;
  message: string;
  data: {
    companies: Company[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const companyTypes = ["recruiter", "institution", "tech_professional"] as const;

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters and query state
  const [type, setType] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [isVerified, setIsVerified] = useState<string>(""); // "true" | "false" | ""
  const [isActive, setIsActive] = useState<string>(""); // "true" | "false" | ""
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("name.asc"); // name.asc | name.desc | createdAt.desc | createdAt.asc
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const buildParams = () => {
    const params: Record<string, string | number | boolean> = {
      page,
      limit,
    };
    if (type) params.type = type;
    if (industry) params.industry = industry;
    if (country) params.country = country;
    if (isVerified) params.isVerified = isVerified === "true";
    if (isActive) params.isActive = isActive === "true";
    if (search) {
      params.search = search;
      // Also include 'q' to support backends using this param name
      (params as any).q = search;
    }
    if (sort) params.sort = sort;
    return params;
  };

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApiRequest<ApiCompaniesResponse>(
        "/api/companies",
        undefined,
        buildParams()
      );
      const payload = res?.data?.data || res?.data; // handle either shape
      setCompanies(payload?.companies || []);
      setTotal(payload?.total ?? 0);
    } catch (e: any) {
      setError(e?.message || "Failed to load companies");
      setCompanies([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    type,
    industry,
    country,
    isVerified,
    isActive,
    search,
    sort,
    page,
    limit,
  ]);

  const resetFilters = () => {
    setType("");
    setIndustry("");
    setCountry("");
    setIsVerified("");
    setIsActive("");
    setSearch("");
    setSort("name.asc");
    setPage(1);
    setLimit(10);
  };

  return (
    <section className="pt-32 pb-10 px-4 md:px-16 mx-auto">
      <h1 className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-6 flex items-center justify-center gap-3">
        <Building2 className="text-[#002647]" size={36} />
        <span className="uppercase text-outline text-white">All Companies</span>
      </h1>

      <p className="max-w-3xl mx-auto text-center text-gray-700 mb-6">
        Discover verified recruiters, institutions, and tech professionals
        across industries and regions. Use the filters below to refine by type,
        industry, country, status, or search by name.
      </p>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-[10px] p-4 mb-6">
        {(type || industry || country || isVerified || isActive || search) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {type && (
              <Badge variant="secondary" className="flex items-center gap-2">
                Type: {type}
                <button aria-label="Remove type" onClick={() => setType("")}>
                  ×
                </button>
              </Badge>
            )}
            {industry && (
              <Badge variant="secondary" className="flex items-center gap-2">
                Industry: {industry}
                <button
                  aria-label="Remove industry"
                  onClick={() => setIndustry("")}
                >
                  ×
                </button>
              </Badge>
            )}
            {country && (
              <Badge variant="secondary" className="flex items-center gap-2">
                Country: {country}
                <button
                  aria-label="Remove country"
                  onClick={() => setCountry("")}
                >
                  ×
                </button>
              </Badge>
            )}
            {isVerified && (
              <Badge variant="secondary" className="flex items-center gap-2">
                {isVerified === "true" ? "Verified" : "Unverified"}
                <button
                  aria-label="Remove verified filter"
                  onClick={() => setIsVerified("")}
                >
                  ×
                </button>
              </Badge>
            )}
            {isActive && (
              <Badge variant="secondary" className="flex items-center gap-2">
                {isActive === "true" ? "Active" : "Inactive"}
                <button
                  aria-label="Remove status filter"
                  onClick={() => setIsActive("")}
                >
                  ×
                </button>
              </Badge>
            )}
            {search && (
              <Badge variant="secondary" className="flex items-center gap-2">
                Search: {search}
                <button aria-label="Clear search" onClick={() => setSearch("")}>
                  ×
                </button>
              </Badge>
            )}
            <button
              type="button"
              className="ml-2 text-sm underline text-gray-700"
              onClick={resetFilters}
            >
              Clear all
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Company Type
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={type}
              onChange={(e) => {
                setPage(1);
                setType(e.target.value);
              }}
            >
              <option value="">All</option>
              {companyTypes.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. Technology"
              value={industry}
              onChange={(e) => {
                setPage(1);
                setIndustry(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Country</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g. United Kingdom"
              value={country}
              onChange={(e) => {
                setPage(1);
                setCountry(e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Verified
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={isVerified}
                onChange={(e) => {
                  setPage(1);
                  setIsVerified(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Status</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={isActive}
                onChange={(e) => {
                  setPage(1);
                  setIsActive(e.target.value);
                }}
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Search</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              placeholder="Search by name or industry"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Sort</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name.asc">Name (A-Z)</option>
              <option value="name.desc">Name (Z-A)</option>
              <option value="createdAt.desc">Newest</option>
              <option value="createdAt.asc">Oldest</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <button
              className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50"
              onClick={resetFilters}
              type="button"
            >
              Reset
            </button>
            <button
              className="px-4 py-2 rounded-md bg-[#0D1140] text-white hover:bg-blue-700"
              onClick={() => {
                setPage(1);
                fetchCompanies();
              }}
              type="button"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="min-h-[200px]">
        {!loading && total > 0 && (
          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            <span>
              Showing {Math.min((page - 1) * limit + 1, total)}–
              {Math.min(page * limit, total)} of {total} results
            </span>
            <span>
              Page {page} of {totalPages}
            </span>
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
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
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
            <SearchX size={40} className="text-gray-400 mb-2" />
            <p className="font-medium">No companies found.</p>
            <p className="text-sm mt-1">Try adjusting filters or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((c) => (
              <div
                key={c._id}
                className="bg-white border border-gray-200 rounded-[10px] p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <a
                    className="font-semibold text-gray-900 hover:underline"
                    href={`/companies/${c._id}`}
                  >
                    {c.name}
                  </a>
                  <div className="flex items-center gap-2">
                    {c.type && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 border">
                        {c.type}
                      </span>
                    )}
                    {typeof c.isVerified === "boolean" && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          c.isVerified
                            ? "bg-green-100 border-green-300"
                            : "bg-gray-100"
                        }`}
                      >
                        {c.isVerified ? "Verified" : "Unverified"}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">
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
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {typeof c.isActive === "boolean" &&
                      (c.isActive ? "Active" : "Inactive")}
                  </span>
                  <Link
                    href={`/companies/${c._id}`}
                    className="text-sm text-[#0D1140] underline"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-md border disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded-md border disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Per page</label>
          <select
            className="border rounded-md px-2 py-1"
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(parseInt(e.target.value, 10));
            }}
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
