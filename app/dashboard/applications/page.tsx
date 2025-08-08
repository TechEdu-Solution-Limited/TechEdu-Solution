"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getApiRequestWithRefresh,
  apiRequestWithRefresh,
} from "@/lib/apiFetch";
import { JobApplication } from "@/types/application";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "applied", label: "Applied" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interviewed", label: "Interviewed" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const statusColorMap: { [key: string]: string } = {
  applied: "bg-gray-200 text-gray-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-blue-100 text-blue-800",
  interviewed: "bg-purple-100 text-purple-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const perPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getTokenFromCookies() || undefined;
        // The API does not seem to support pagination, filtering, or searching.
        // These features are implemented on the client-side for now.
        const res = await getApiRequestWithRefresh(
          "/api/ats/job-applications",
          token
        );
        if (res.data.success) {
          setApplications(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch applications.");
        }
      } catch (e: any) {
        setError(e.message || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: JobApplication["status"]
  ) => {
    try {
      const token = getTokenFromCookies() || undefined;
      const res = await apiRequestWithRefresh(
        `/api/ats/job-applications/${id}`,
        "PUT",
        { status: newStatus },
        token
      );
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app
          )
        );
        toast.success(`Application status updated to ${newStatus}.`);
      } else {
        toast.error(res.data.message || "Failed to update status.");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred while updating status.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = getTokenFromCookies() || undefined;
      const res = await apiRequestWithRefresh(
        `/api/ats/job-applications/${id}`,
        "DELETE",
        undefined,
        token
      );
      if (res.data.success) {
        setApplications((prev) => prev.filter((app) => app._id !== id));
        toast.success("Application has been deleted.");
      } else {
        toast.error(res.data.message || "Failed to delete application.");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred while deleting.");
    }
  };

  const filtered = applications.filter((app) => {
    const applicantName = app.applicant?.fullName || "";
    const applicantEmail = app.applicant?.email || "";
    const jobTitle = app.jobPost?.title || "";

    const matchesSearch =
      applicantName.toLowerCase().includes(search.toLowerCase()) ||
      applicantEmail.toLowerCase().includes(search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" ? true : app.status === status;
    return matchesSearch && matchesStatus && !app.isDeleted;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">Applications</h1>
          <p className="text-gray-600 mt-1">
            View and manage all job applications received.
          </p>
        </div>
        <Button asChild className="rounded-[10px]" variant="outline">
          <Link href="/dashboard/applications/shortlisted">
            View Shortlisted
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" /> Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search by candidate, email, or job..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-[10px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="rounded-[10px] w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[10px]">
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      <p>Loading applications...</p>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell className="font-medium">
                        {app.applicant?.fullName || "N/A"}
                      </TableCell>
                      <TableCell>{app.applicant?.email || "N/A"}</TableCell>
                      <TableCell>{app.jobPost?.title || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize rounded-[10px] ${
                            statusColorMap[app.status] ||
                            "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{app.skillMatchScore || 0}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-[10px]"
                            title="View"
                            onClick={() =>
                              router.push(`/dashboard/applications/${app._id}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-[10px]"
                            title="Shortlist"
                            onClick={() =>
                              handleUpdateStatus(app._id, "shortlisted")
                            }
                            disabled={
                              app.status === "shortlisted" ||
                              app.status === "hired" ||
                              app.status === "rejected"
                            }
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="rounded-[10px]"
                            title="Reject"
                            onClick={() => handleDelete(app._id)}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          {!isLoading && !error && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-[10px]"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-[10px]"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
