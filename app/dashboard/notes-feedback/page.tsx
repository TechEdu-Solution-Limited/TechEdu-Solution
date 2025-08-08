"use client";
import React, { useState } from "react";
import { Search, Star, ThumbsUp, FileText } from "lucide-react";

const mockCandidates = [
  { id: "1", name: "Jane Doe", job: "Frontend Developer", stage: "Interview" },
  { id: "2", name: "John Smith", job: "Backend Developer", stage: "Screening" },
  { id: "3", name: "Alice Johnson", job: "UI/UX Designer", stage: "Offer" },
  { id: "4", name: "Michael Brown", job: "QA Tester", stage: "Applied" },
  { id: "5", name: "Emily Davis", job: "Product Manager", stage: "Interview" },
];

type Feedback = {
  note: string;
  rating: number;
  recommend: boolean;
  date: string;
};

const uniqueJobs = Array.from(new Set(mockCandidates.map((c) => c.job)));
const uniqueStages = Array.from(new Set(mockCandidates.map((c) => c.stage)));

export default function NotesFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<{
    [candidateId: string]: Feedback[];
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [modalCandidate, setModalCandidate] = useState<any>(null);
  const [form, setForm] = useState({ note: "", rating: 5, recommend: true });
  const [formError, setFormError] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  function openModal(candidate: any) {
    setModalCandidate(candidate);
    setForm({ note: "", rating: 5, recommend: true });
    setFormError("");
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setModalCandidate(null);
    setFormError("");
  }
  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.note.trim()) {
      setFormError("Note is required.");
      return;
    }
    if (!modalCandidate) return;
    setFeedbacks((prev) => ({
      ...prev,
      [modalCandidate.id]: [
        {
          ...form,
          rating: Number(form.rating),
          date: new Date().toLocaleString(),
        },
        ...(prev[modalCandidate.id] || []),
      ],
    }));
    setForm({ note: "", rating: 5, recommend: true });
    setFormError("");
  }

  // Analytics
  const allFeedbacks = Object.values(feedbacks).flat();
  const totalFeedback = allFeedbacks.length;
  const avgRating = totalFeedback
    ? (
        allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalFeedback
      ).toFixed(2)
    : "-";
  const recommendRate = totalFeedback
    ? Math.round(
        (allFeedbacks.filter((fb) => fb.recommend).length / totalFeedback) * 100
      )
    : "-";

  function handleExportFeedback() {
    const rows = [];
    for (const c of mockCandidates) {
      const fbList = feedbacks[c.id] || [];
      for (const fb of fbList) {
        rows.push({
          name: c.name,
          job: c.job,
          stage: c.stage,
          note: fb.note,
          rating: fb.rating,
          recommend: fb.recommend ? "Yes" : "No",
          date: fb.date,
        });
      }
    }
    if (rows.length === 0) return alert("No feedback to export.");
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(",")]
      .concat(
        rows.map((row) =>
          headers
            .map(
              (h) =>
                `"${((row as Record<string, any>)[h] || "").replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportCandidateFeedback(
    candidateId: string,
    candidateName: string
  ) {
    const fbList = feedbacks[candidateId] || [];
    if (fbList.length === 0)
      return alert("No feedback to export for this candidate.");
    const rows = fbList.map((fb) => ({
      note: fb.note,
      rating: fb.rating,
      recommend: fb.recommend ? "Yes" : "No",
      date: fb.date,
    }));
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(",")]
      .concat(
        rows.map((row) =>
          headers
            .map(
              (h) =>
                `"${((row as Record<string, any>)[h] || "").replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback_${candidateName.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredCandidates = mockCandidates.filter((c) => {
    const matchesJob = jobFilter ? c.job === jobFilter : true;
    const matchesStage = stageFilter ? c.stage === stageFilter : true;
    const matchesSearch = searchTerm
      ? c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.job.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesJob && matchesStage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-2">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold text-[#011F72] mb-8">
          Notes & Feedback
        </h1>
        {/* Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow flex items-center gap-3 p-4">
            <Star className="text-yellow-500 w-6 h-6" />
            <div>
              <div className="text-xs text-gray-500">Average Rating</div>
              <div className="text-lg font-bold text-[#011F72]">
                {avgRating}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow flex items-center gap-3 p-4">
            <FileText className="text-blue-500 w-6 h-6" />
            <div>
              <div className="text-xs text-gray-500">Total Feedback</div>
              <div className="text-lg font-bold text-[#011F72]">
                {totalFeedback}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow flex items-center gap-3 p-4">
            <ThumbsUp className="text-green-600 w-6 h-6" />
            <div>
              <div className="text-xs text-gray-500">Recommendation Rate</div>
              <div className="text-lg font-bold text-[#011F72]">
                {recommendRate}%
              </div>
            </div>
          </div>
        </div>
        {/* Filters, Search, Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or job..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border rounded-[10px] px-3 py-2 w-full sm:w-64"
              />
            </div>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="border rounded-[10px] px-3 py-2 w-full sm:w-auto"
            >
              <option value="">All Jobs</option>
              {uniqueJobs.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="border rounded-[10px] px-3 py-2 w-full sm:w-auto"
            >
              <option value="">All Stages</option>
              {uniqueStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleExportFeedback}
            className="px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700 transition font-semibold text-xs w-full sm:w-auto"
          >
            Export All Feedback
          </button>
        </div>
        {/* Candidate Cards */}
        <div className="grid gap-4">
          {filteredCandidates.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b last:border-b-0"
            >
              <div>
                <div className="font-semibold text-[#011F72] text-lg flex items-center gap-2">
                  {c.name}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {c.job} &mdash; {c.stage}
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => openModal(c)}
                    className="px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold"
                  >
                    Add/View Feedback
                  </button>
                  <button
                    onClick={() => handleExportCandidateFeedback(c.id, c.name)}
                    className="px-3 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold flex items-center gap-1"
                  >
                    <FileText size={14} /> Export
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <div className="text-xs text-gray-500">
                  Feedback: {(feedbacks[c.id] || []).length}
                </div>
                {(feedbacks[c.id] || []).length > 0 && (
                  <div className="flex gap-1">
                    <Star className="text-yellow-500 w-4 h-4" />
                    <span className="text-xs font-semibold text-[#011F72]">
                      {typeof (
                        feedbacks[c.id].reduce(
                          (sum, fb) => sum + fb.rating,
                          0
                        ) / feedbacks[c.id].length
                      ) === "number"
                        ? (
                            feedbacks[c.id].reduce(
                              (sum, fb) => sum + fb.rating,
                              0
                            ) / feedbacks[c.id].length
                          ).toFixed(2)
                        : "-"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Feedback Modal */}
        {showModal && modalCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition animate-fadeInModal">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100 animate-scaleIn">
              <h2 className="text-xl font-bold mb-4 text-[#011F72]">
                Feedback for {modalCandidate.name}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mb-6"
              >
                <div>
                  <label className="block font-medium mb-1">
                    Note<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleFormChange}
                    className="border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
                    rows={3}
                    required
                  />
                  {formError && (
                    <div className="text-red-500 text-xs mt-1">{formError}</div>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    min={1}
                    max={5}
                    value={form.rating}
                    onChange={handleFormChange}
                    className="border rounded-[10px] px-3 py-2 w-20 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="recommend"
                    checked={form.recommend}
                    onChange={handleFormChange}
                    id="recommend"
                  />
                  <label htmlFor="recommend" className="font-medium">
                    Recommend for hire
                  </label>
                </div>
                <div className="flex gap-4 justify-end mt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
                  >
                    Add Feedback
                  </button>
                </div>
              </form>
              <h3 className="text-md font-semibold text-[#011F72] mb-2">
                Feedback History
              </h3>
              <div className="max-h-48 overflow-y-auto flex flex-col gap-3">
                {(feedbacks[modalCandidate.id] || []).length === 0 ? (
                  <div className="text-gray-400 text-xs">No feedback yet.</div>
                ) : (
                  feedbacks[modalCandidate.id].map((fb, i) => (
                    <div key={i} className="bg-blue-50 rounded-[10px] p-3">
                      <div className="text-xs text-gray-600 mb-1">
                        {fb.date}
                      </div>
                      <div className="text-sm text-gray-800 mb-1">
                        {fb.note}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span>
                          Rating: <b>{fb.rating}</b>
                        </span>
                        <span
                          className={
                            fb.recommend ? "text-green-700" : "text-red-700"
                          }
                        >
                          {fb.recommend ? "Recommended" : "Not recommended"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
