"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useRef } from "react";
import {
  Trash2,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  CheckSquare,
  Square,
  Plus,
} from "lucide-react";

const initialMockInterviews = [
  {
    id: "1",
    candidate: "Jane Doe",
    jobTitle: "Frontend Developer",
    date: "2024-07-29T10:00:00Z",
    status: "scheduled",
    notes: "",
  },
  {
    id: "2",
    candidate: "John Smith",
    jobTitle: "Backend Developer",
    date: "2024-07-30T14:30:00Z",
    status: "scheduled",
    notes: "",
  },
  {
    id: "3",
    candidate: "Alice Johnson",
    jobTitle: "UI/UX Designer",
    date: "2024-08-01T09:00:00Z",
    status: "scheduled",
    notes: "",
  },
  {
    id: "4",
    candidate: "Michael Brown",
    jobTitle: "QA Tester",
    date: "2024-08-02T11:00:00Z",
    status: "scheduled",
    notes: "",
  },
  {
    id: "5",
    candidate: "Emily Davis",
    jobTitle: "Product Manager",
    date: "2024-08-03T15:00:00Z",
    status: "scheduled",
    notes: "",
  },
  {
    id: "6",
    candidate: "Chris Lee",
    jobTitle: "DevOps Engineer",
    date: "2024-08-04T13:00:00Z",
    status: "completed",
    notes: "",
  },
  {
    id: "7",
    candidate: "Sarah Kim",
    jobTitle: "Data Scientist",
    date: "2024-08-05T10:30:00Z",
    status: "cancelled",
    notes: "",
  },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const PAGE_SIZE = 5;

function toCSV(rows: { [key: string]: any }[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]).filter((k) => k !== "id");
  const csv = [headers.join(",")].concat(
    rows.map((row: { [key: string]: any }) =>
      headers.map((h) => `"${(row[h] || "").replace(/"/g, '""')}"`).join(",")
    )
  );
  return csv.join("\n");
}

function statusBadge(status: string) {
  const color =
    status === "scheduled"
      ? "bg-blue-100 text-blue-700"
      : status === "completed"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function InterviewsPage() {
  const [interviews, setInterviews] = useState(initialMockInterviews);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(true);
  const [noteEditId, setNoteEditId] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    candidate: "",
    jobTitle: "",
    date: "",
    status: "scheduled",
    notes: "",
  });
  const [addErrors, setAddErrors] = useState<{ [key: string]: string }>({});
  const addFormRef = useRef<HTMLFormElement>(null);
  const [animatingRows, setAnimatingRows] = useState<{
    [id: string]: "in" | "out";
  }>({});

  // Filtering
  const filtered = interviews.filter((i) => {
    const matchesStatus = status === "all" || i.status === status;
    const matchesSearch =
      i.candidate.toLowerCase().includes(search.toLowerCase()) ||
      i.jobTitle.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return sortAsc ? aTime - bTime : bTime - aTime;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE) || 1;
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Selection
  const allOnPageSelected = paginated.every((i) => selected.includes(i.id));
  const someOnPageSelected = paginated.some((i) => selected.includes(i.id));

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    if (allOnPageSelected) {
      setSelected((prev) =>
        prev.filter((id) => !paginated.some((i) => i.id === id))
      );
    } else {
      setSelected((prev) => [
        ...prev,
        ...paginated.map((i) => i.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };
  const handleSelectNone = () => setSelected([]);

  // Actions
  const handleDelete = (id: string) => {
    setAnimatingRows((prev) => ({ ...prev, [id]: "out" }));
    setTimeout(() => {
      setDeleteTarget(id);
      setShowConfirm(true);
    }, 300);
  };
  const confirmDelete = () => {
    setInterviews((prev) => prev.filter((i) => i.id !== deleteTarget));
    setSelected((prev) => prev.filter((id) => id !== deleteTarget));
    setShowConfirm(false);
    setDeleteTarget(null);
  };
  const handleBulkDelete = () => {
    setConfirmBulk(true);
  };
  const confirmBulkDelete = () => {
    setInterviews((prev) => prev.filter((i) => !selected.includes(i.id)));
    setSelected([]);
    setConfirmBulk(false);
  };
  const handleExport = (onlySelected: boolean) => {
    const rows = onlySelected
      ? interviews.filter((i) => selected.includes(i.id))
      : interviews;
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = onlySelected
      ? "selected_interviews.csv"
      : "all_interviews.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleNoteEdit = (id: string, current: string) => {
    setNoteEditId(id);
    setNoteValue(current);
  };
  const handleNoteSave = (id: string) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, notes: noteValue } : i))
    );
    setNoteEditId(null);
    setNoteValue("");
  };

  const handleAddChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
    setAddErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateAddForm = () => {
    const errors: { [key: string]: string } = {};
    if (!addForm.candidate.trim())
      errors.candidate = "Candidate name is required.";
    if (!addForm.jobTitle.trim()) errors.jobTitle = "Job title is required.";
    if (!addForm.date) errors.date = "Date/Time is required.";
    else if (new Date(addForm.date).getTime() < Date.now() - 60 * 1000)
      errors.date = "Date/Time must be in the future.";
    return errors;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAddForm();
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }
    const newId = (Date.now() + Math.random()).toString();
    setInterviews((prev) => [
      {
        id: newId,
        ...addForm,
      },
      ...prev,
    ]);
    setAnimatingRows((prev) => ({ ...prev, [newId]: "in" }));
    setShowAddModal(false);
    setAddForm({
      candidate: "",
      jobTitle: "",
      date: "",
      status: "scheduled",
      notes: "",
    });
    setAddErrors({});
    if (addFormRef.current) addFormRef.current.reset();
    setTimeout(
      () =>
        setAnimatingRows((prev) => {
          const copy = { ...prev };
          delete copy[newId];
          return copy;
        }),
      600
    );
  };

  return (
    <div className="min-h-screen pb-24 relative">
      <h1 className="text-3xl font-bold mb-6 text-[#011F72]">Interviews</h1>
      <Card className="shadow-xl rounded-2xl border-blue-100">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#011F72]">
            Schedule & Manage Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by candidate or job title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border rounded-[10px] px-3 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-200 transition"
            />
            <div className="flex md:item-center gap-2">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="border rounded-[10px] px-3 py-2 w-full md:w-48 focus:ring-2 focus:ring-blue-200 transition"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className="flex items-center gap-1 border rounded-[10px] px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                onClick={() => setSortAsc((s) => !s)}
                title="Sort by date"
              >
                {sortAsc ? <ArrowUp size={16} /> : <ArrowDown size={16} />} Date
              </button>
              {/* Conditional Export/Delete Controls */}
              {selected.length === 0 ? (
                <button
                  className="flex items-center gap-1 border rounded-[10px] px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 transition"
                  onClick={() => handleExport(false)}
                  title="Export all interviews"
                >
                  <Download size={16} /> Export All
                </button>
              ) : (
                <>
                  <button
                    className="flex items-center gap-1 border rounded-[10px] px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 transition"
                    onClick={() => handleExport(true)}
                    title="Export selected interviews"
                  >
                    <Download size={16} /> Export Selected
                  </button>
                  <button
                    className="flex items-center gap-1 border rounded-[10px] px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 transition"
                    onClick={handleBulkDelete}
                    title="Delete selected interviews"
                  >
                    <Trash2 size={16} /> Delete Selected
                  </button>
                </>
              )}
              {/* {selected.length > 0 && (
                <button
                  className="flex items-center gap-1 border rounded-[10px] px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
                  onClick={handleSelectNone}
                  title="Clear selection"
                >
                  Deselect All
                </button>
              )} */}
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border shadow-sm bg-white">
            <table className="min-w-full border text-sm relative">
              <thead className="sticky top-0 z-10 bg-blue-50">
                <tr>
                  <th className="p-2 border">
                    <button
                      onClick={handleSelectAll}
                      className="focus:outline-none"
                      title={allOnPageSelected ? "Deselect all" : "Select all"}
                    >
                      {allOnPageSelected ? (
                        <CheckSquare size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th className="p-2 border">Candidate</th>
                  <th className="p-2 border">Job Title</th>
                  <th className="p-2 border">Date/Time</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Notes</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No interviews found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((i) => (
                    <tr
                      key={i.id}
                      className={`transition-all duration-500 ${
                        selected.includes(i.id)
                          ? "bg-blue-50"
                          : "hover:bg-blue-100"
                      } ${
                        animatingRows[i.id] === "in" ? "animate-fadeInRow" : ""
                      } ${
                        animatingRows[i.id] === "out"
                          ? "animate-fadeOutRow"
                          : ""
                      }`}
                      style={
                        animatingRows[i.id] === "out"
                          ? { opacity: 0, height: 0, pointerEvents: "none" }
                          : {}
                      }
                    >
                      <td className="p-2 border text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(i.id)}
                          onChange={() => handleSelect(i.id)}
                          aria-label="Select interview"
                          className="w-4 h-4 accent-blue-600"
                        />
                      </td>
                      <td className="p-2 border font-medium text-[#011F72]">
                        {i.candidate}
                      </td>
                      <td className="p-2 border">{i.jobTitle}</td>
                      <td className="p-2 border whitespace-nowrap">
                        {new Date(i.date).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="p-2 border">{statusBadge(i.status)}</td>
                      <td className="p-2 border">
                        {noteEditId === i.id ? (
                          <div className="flex flex-col gap-1">
                            <textarea
                              value={noteValue}
                              onChange={(e) => setNoteValue(e.target.value)}
                              className="border rounded-[10px] px-2 py-1 w-full min-w-[120px] focus:ring-2 focus:ring-blue-200"
                              rows={2}
                            />
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => handleNoteSave(i.id)}
                                className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setNoteEditId(null)}
                                className="bg-gray-200 px-2 py-1 rounded text-xs hover:bg-gray-300 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[120px]">
                              {i.notes || (
                                <span className="text-gray-400">No notes</span>
                              )}
                            </span>
                            <button
                              onClick={() => handleNoteEdit(i.id, i.notes)}
                              className="text-blue-600 hover:underline"
                              title="Add/Edit Note"
                            >
                              <StickyNote size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-2 border flex items-center gap-2">
                        <Link
                          href={`/dashboard/interviews/${i.id}`}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(i.id)}
                          className="text-red-600 hover:underline flex items-center gap-1 rounded-full p-1 hover:bg-red-50 transition"
                          title="Delete Interview"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 border rounded-[10px] disabled:opacity-50 bg-white hover:bg-blue-50 transition flex gap-1 items-center"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="font-medium text-[#011F72]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border rounded-[10px] disabled:opacity-50 bg-white hover:bg-blue-50 transition flex gap-1 items-center"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
          {/* Confirmation Dialogs */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-blue-100 animate-fadeIn">
                <h2 className="text-lg font-bold mb-4 text-[#011F72]">
                  Delete Interview
                </h2>
                <p className="mb-4 text-gray-700">
                  Are you sure you want to delete this interview?
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {confirmBulk && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-blue-100 animate-fadeIn">
                <h2 className="text-lg font-bold mb-4 text-[#011F72]">
                  Delete Selected Interviews
                </h2>
                <p className="mb-4 text-gray-700">
                  Are you sure you want to delete all selected interviews?
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setConfirmBulk(false)}
                    className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBulkDelete}
                    className="px-4 py-2 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Floating Action Button (FAB) */}
          <button
            className="fixed bottom-8 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
            title="Add Interview"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={24} />
            <span className="hidden sm:inline font-semibold">
              Add Interview
            </span>
          </button>
          {/* Add Interview Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition animate-fadeInModal">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100 animate-scaleIn">
                <h2 className="text-xl font-bold mb-4 text-[#011F72]">
                  Add Interview
                </h2>
                <form
                  ref={addFormRef}
                  onSubmit={handleAddSubmit}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="block font-medium mb-1">
                      Candidate Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="candidate"
                      value={addForm.candidate}
                      onChange={handleAddChange}
                      className={`border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 ${
                        addErrors.candidate ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {addErrors.candidate && (
                      <div className="text-red-500 text-xs mt-1">
                        {addErrors.candidate}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Job Title<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={addForm.jobTitle}
                      onChange={handleAddChange}
                      className={`border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 ${
                        addErrors.jobTitle ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {addErrors.jobTitle && (
                      <div className="text-red-500 text-xs mt-1">
                        {addErrors.jobTitle}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Date/Time<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={addForm.date}
                      onChange={handleAddChange}
                      className={`border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 ${
                        addErrors.date ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {addErrors.date && (
                      <div className="text-red-500 text-xs mt-1">
                        {addErrors.date}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Status</label>
                    <select
                      name="status"
                      value={addForm.status}
                      onChange={handleAddChange}
                      className="border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={addForm.notes}
                      onChange={handleAddChange}
                      className="border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-4 justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
                    >
                      Add Interview
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InterviewsPage;
