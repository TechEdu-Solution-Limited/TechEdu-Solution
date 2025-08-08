"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  Eye,
  Filter,
  Users,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { mockTalentData } from "@/data/talents";

type OfferDetails = { position: string; salary: string; startDate: string };
type Talent = (typeof mockTalentData)[number] & {
  offerStatus?: "none" | "sent" | "accepted" | "declined";
  offerDetails?: null | OfferDetails;
};

function getInitialTalentData(): Talent[] {
  return mockTalentData.map((talent) => ({
    ...talent,
    offerStatus: "none",
    offerDetails: null,
  }));
}

export default function TalentDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const role = searchParams.get("role") || "";
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";

  const [page, setPage] = useState(pageParam);
  const itemsPerPage = 6;

  const [shortlisted, setShortlisted] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("shortlistedTalents") || "[]");
    }
    return [];
  });

  const [savedSearches, setSavedSearches] = useState<
    {
      name: string;
      filters: { search: string; role: string; location: string };
    }[]
  >(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("talentSavedSearches") || "[]");
    }
    return [];
  });

  const [talents, setTalents] = useState<Talent[]>(getInitialTalentData());

  // Offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTalent, setOfferTalent] = useState<Talent | null>(null);
  const [offerForm, setOfferForm] = useState({
    position: "",
    salary: "",
    startDate: "",
  });
  const [offerError, setOfferError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shortlistedTalents", JSON.stringify(shortlisted));
      localStorage.setItem(
        "talentSavedSearches",
        JSON.stringify(savedSearches)
      );
    }
  }, [shortlisted, savedSearches]);

  function handleShortlist(id: string) {
    setShortlisted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }, [page]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // Save Search logic
  function handleSaveSearch() {
    const name = prompt("Name this search:");
    if (!name) return;
    const exists = savedSearches.some((s) => s.name === name);
    if (exists) {
      alert("A saved search with this name already exists.");
      return;
    }
    setSavedSearches((prev) => [
      ...prev,
      { name, filters: { search, role, location } },
    ]);
  }
  function handleApplySavedSearch(filters: {
    search: string;
    role: string;
    location: string;
  }) {
    handleFilterChange("search", filters.search);
    handleFilterChange("role", filters.role);
    handleFilterChange("location", filters.location);
    setPage(1);
  }
  function handleDeleteSavedSearch(name: string) {
    setSavedSearches((prev) => prev.filter((s) => s.name !== name));
  }

  function openOfferModal(talent: Talent) {
    setOfferTalent(talent);
    setOfferForm(
      talent.offerDetails || { position: "", salary: "", startDate: "" }
    );
    setShowOfferModal(true);
    setOfferError("");
  }
  function closeOfferModal() {
    setShowOfferModal(false);
    setOfferTalent(null);
    setOfferError("");
  }
  function handleOfferFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOfferForm({ ...offerForm, [e.target.name]: e.target.value });
  }
  function handleSendOffer() {
    if (!offerForm.position || !offerForm.salary || !offerForm.startDate) {
      setOfferError("All fields are required.");
      return;
    }
    setTalents((prev) =>
      prev.map((t) =>
        t.id === offerTalent?.id
          ? { ...t, offerStatus: "sent", offerDetails: { ...offerForm } }
          : t
      )
    );
    closeOfferModal();
  }
  function handleOfferStatusUpdate(status: "accepted" | "declined") {
    setTalents((prev) =>
      prev.map((t) =>
        t.id === offerTalent?.id ? { ...t, offerStatus: status } : t
      )
    );
    closeOfferModal();
  }
  function handleDownloadOfferLetter() {
    if (!offerTalent || !offerTalent.offerDetails) return;
    const details = offerTalent.offerDetails;
    const html = `<html><body><h2>Offer Letter</h2><p>Dear ${offerTalent.name},</p><p>We are pleased to offer you the position of <b>${details.position}</b> with a starting salary of <b>${details.salary}</b> and a start date of <b>${details.startDate}</b>.</p><p>Congratulations!</p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Offer_Letter_${offerTalent.name.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredData = mockTalentData.filter((talent) => {
    const matchesRole = role ? talent.roleInterest === role : true;
    const matchesSearch = search
      ? talent.name.toLowerCase().includes(search.toLowerCase()) ||
        talent.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        ) ||
        talent.degree.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesLocation = location
      ? talent.location.toLowerCase().includes(location.toLowerCase())
      : true;

    return matchesRole && matchesSearch && matchesLocation;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const uniqueRoles = [
    ...new Set(mockTalentData.map((talent) => talent.roleInterest)),
  ];
  const uniqueLocations = [
    ...new Set(mockTalentData.map((talent) => talent.location)),
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-8 h-8 text-[#011F72]" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#011F72]">
              Talent Directory
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover exceptional graduates ready to launch their careers.
            Connect with verified talent across various industries and
            locations.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{mockTalentData.length} Talents Available</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.7 Average Rating</span>
            </div>
          </div>
        </div>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-[#011F72] mb-2">
              Saved Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center bg-blue-50 border border-blue-100 rounded-full px-3 py-1 text-xs font-medium gap-2"
                >
                  <button
                    className="text-blue-700 hover:underline"
                    onClick={() => handleApplySavedSearch(s.filters)}
                  >
                    {s.name}
                  </button>
                  <span className="text-gray-500">
                    [{s.filters.search && `"${s.filters.search}" `}
                    {s.filters.role && `${s.filters.role} `}
                    {s.filters.location && `${s.filters.location}`}]
                  </span>
                  <button
                    className="ml-1 text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteSavedSearch(s.name)}
                    title="Delete saved search"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Search & Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#011F72]" />
              <h2 className="text-lg font-semibold text-[#011F72]">
                Search & Filters
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 min-[900px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search talents, skills..."
                  value={search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 rounded-[10px]"
                />
              </div>
              <select
                className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
                value={role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
                value={location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 flex-col sm:flex-row">
                <Button
                  onClick={() => {
                    router.push("?");
                    setPage(1);
                  }}
                  variant="outline"
                  className="bg-[#0D1140] text-white hover:bg-[#2952c1] rounded-[10px]"
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={handleSaveSearch}
                  variant="outline"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-[10px]"
                  type="button"
                >
                  Save Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {currentData.length} of {filteredData.length} talents
            {search && ` for "${search}"`}
            {role && ` in ${role}`}
            {location && ` from ${location}`}
          </p>
        </div>

        {/* Talent Grid */}
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {currentData.map((talent, index) => {
            // Always use the enriched talents state for rendering
            const t = talents.find((tt) => tt.id === talent.id) || {
              ...talent,
              offerStatus: "none",
              offerDetails: null,
            };
            const isShortlisted = shortlisted.includes(t.id);
            return (
              <li
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border hover:shadow-md transition"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 mb-4 flex items-center justify-center">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
                <p className="flex items-center gap-2 text-gray-800 font-medium text-sm mb-1">
                  <span>📌</span> {t.name}
                  {t.offerStatus && t.offerStatus !== "none" && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        t.offerStatus === "sent"
                          ? "bg-yellow-100 text-yellow-700"
                          : t.offerStatus === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.offerStatus.charAt(0).toUpperCase() +
                        t.offerStatus.slice(1)}{" "}
                      Offer
                    </span>
                  )}
                </p>
                <p className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <span>📍</span> {t.location}
                </p>
                <p className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <span>💼</span> {t.roleInterest}
                </p>
                <p className="flex items-start gap-2 text-gray-500 text-xs italic mb-4 text-left">
                  <span>📄</span>
                  <span>{t.cvInsight}</span>
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <Link
                    href={`/dashboard/talents/${t.id}`}
                    className="bg-gray-200 text-gray-700 font-semibold rounded-[10px] px-4 py-2 w-full hover:bg-gray-300 text-center"
                  >
                    View Profile
                  </Link>
                  <Button
                    onClick={() => handleShortlist(t.id)}
                    className={`w-full rounded-[10px] flex items-center justify-center gap-2 ${
                      isShortlisted
                        ? "bg-blue-100 text-blue-800"
                        : "bg-[#0D1140] text-white hover:bg-[#2952c1]"
                    }`}
                    disabled={isShortlisted}
                  >
                    {isShortlisted ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" /> Shortlisted
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" /> Shortlist
                      </>
                    )}
                  </Button>
                  {(!t.offerStatus || t.offerStatus === "none") && (
                    <Button
                      onClick={() => openOfferModal(t)}
                      className="w-full rounded-[10px] flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 mt-1"
                    >
                      Send Offer
                    </Button>
                  )}
                  {t.offerStatus && t.offerStatus !== "none" && (
                    <Button
                      onClick={() => openOfferModal(t)}
                      className="w-full rounded-[10px] flex items-center justify-center gap-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 mt-1"
                    >
                      View Offer
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`cursor-pointer ${
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    return (
                      p === 1 ||
                      p === totalPages ||
                      (p >= page - 1 && p <= page + 1)
                    );
                  })
                  .map((p, index, array) => (
                    <div key={p}>
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setPage(p)}
                          isActive={page === p}
                          className={`cursor-pointer ${
                            page === p
                              ? "text-[#011F72] border-[#011F72] rounded-[10px]"
                              : ""
                          }`}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    </div>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={`cursor-pointer ${
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      {/* Offer Modal */}
      {showOfferModal && offerTalent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition animate-fadeInModal">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100 animate-scaleIn">
            <h2 className="text-xl font-bold mb-4 text-[#011F72]">
              {offerTalent.offerStatus === "none"
                ? "Send Offer"
                : "Offer Details"}
            </h2>
            {offerTalent.offerStatus === "none" ? (
              <>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={offerForm.position}
                    onChange={handleOfferFormChange}
                    className="border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={offerForm.salary}
                    onChange={handleOfferFormChange}
                    className="border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={offerForm.startDate}
                    onChange={handleOfferFormChange}
                    className="border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                {offerError && (
                  <div className="text-red-500 text-xs mb-2">{offerError}</div>
                )}
                <div className="flex gap-4 justify-end mt-4">
                  <button
                    onClick={closeOfferModal}
                    className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendOffer}
                    className="px-4 py-2 rounded-[10px] bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Send Offer
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <span className="font-semibold">Position:</span>{" "}
                  {offerTalent.offerDetails?.position}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Salary:</span>{" "}
                  {offerTalent.offerDetails?.salary}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Start Date:</span>{" "}
                  {offerTalent.offerDetails?.startDate}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      offerTalent.offerStatus === "sent"
                        ? "bg-yellow-100 text-yellow-700"
                        : offerTalent.offerStatus === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {(offerTalent.offerStatus || "none")
                      .charAt(0)
                      .toUpperCase() +
                      (offerTalent.offerStatus || "none").slice(1)}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap mt-4">
                  {offerTalent.offerStatus === "sent" && (
                    <button
                      onClick={() => handleOfferStatusUpdate("accepted")}
                      className="px-4 py-2 rounded-[10px] bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Mark Accepted
                    </button>
                  )}
                  {offerTalent.offerStatus === "sent" && (
                    <button
                      onClick={() => handleOfferStatusUpdate("declined")}
                      className="px-4 py-2 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Mark Declined
                    </button>
                  )}
                  <button
                    onClick={handleDownloadOfferLetter}
                    className="px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Download Offer Letter
                  </button>
                  <button
                    onClick={closeOfferModal}
                    className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
