"use client";
import React, { useState, useRef } from "react";

const STAGES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

type OfferDetails = { position: string; salary: string; startDate: string };
type Candidate = {
  id: string;
  name: string;
  job: string;
  stage: string;
  notes: string;
  offerStatus: "none" | "sent" | "accepted" | "declined";
  offerDetails: null | OfferDetails;
};

const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Jane Doe",
    job: "Frontend Developer",
    stage: "Applied",
    notes: "Strong portfolio.",
    offerStatus: "none",
    offerDetails: null,
  },
  {
    id: "2",
    name: "John Smith",
    job: "Backend Developer",
    stage: "Screening",
    notes: "Needs more Node.js experience.",
    offerStatus: "none",
    offerDetails: null,
  },
  {
    id: "3",
    name: "Alice Johnson",
    job: "UI/UX Designer",
    stage: "Interview",
    notes: "Great communication.",
    offerStatus: "none",
    offerDetails: null,
  },
  {
    id: "4",
    name: "Michael Brown",
    job: "QA Tester",
    stage: "Applied",
    notes: "ISTQB certified.",
    offerStatus: "none",
    offerDetails: null,
  },
  {
    id: "5",
    name: "Emily Davis",
    job: "Product Manager",
    stage: "Offer",
    notes: "",
    offerStatus: "none",
    offerDetails: null,
  },
  {
    id: "6",
    name: "Chris Lee",
    job: "DevOps Engineer",
    stage: "Hired",
    notes: "",
    offerStatus: "none",
    offerDetails: null,
  },
  {
    id: "7",
    name: "Sarah Kim",
    job: "Data Scientist",
    stage: "Rejected",
    notes: "",
    offerStatus: "none",
    offerDetails: null,
  },
];

export default function CandidatePipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedStage, setSelectedStage] = useState(STAGES[0]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalCandidate, setModalCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    job: "",
    stage: STAGES[0],
    notes: "",
  });
  const [addErrors, setAddErrors] = useState<{ [key: string]: string }>({});
  const addFormRef = useRef<HTMLFormElement>(null);

  // Add offer modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerCandidate, setOfferCandidate] = useState<Candidate | null>(null);
  const [offerForm, setOfferForm] = useState({
    position: "",
    salary: "",
    startDate: "",
  });
  const [offerError, setOfferError] = useState("");

  const openModal = (candidate: Candidate) => {
    setModalCandidate(candidate);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalCandidate(null);
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
    if (!addForm.name.trim()) errors.name = "Name is required.";
    if (!addForm.job.trim()) errors.job = "Job is required.";
    return errors;
  };
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAddForm();
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }
    setCandidates((prev) => [
      {
        id: (Date.now() + Math.random()).toString(),
        ...addForm,
        offerStatus: "none",
        offerDetails: null,
      },
      ...prev,
    ]);
    setShowAddModal(false);
    setAddForm({ name: "", job: "", stage: STAGES[0], notes: "" });
    setAddErrors({});
    if (addFormRef.current) addFormRef.current.reset();
  };

  function openOfferModal(candidate: Candidate) {
    setOfferCandidate(candidate);
    setOfferForm(
      candidate.offerDetails || { position: "", salary: "", startDate: "" }
    );
    setShowOfferModal(true);
    setOfferError("");
  }
  function closeOfferModal() {
    setShowOfferModal(false);
    setOfferCandidate(null);
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
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === offerCandidate?.id
          ? { ...c, offerStatus: "sent", offerDetails: { ...offerForm } }
          : c
      )
    );
    closeOfferModal();
  }
  function handleOfferStatusUpdate(status: "accepted" | "declined") {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === offerCandidate?.id ? { ...c, offerStatus: status } : c
      )
    );
    closeOfferModal();
  }
  function handleDownloadOfferLetter() {
    const details = offerCandidate?.offerDetails;
    if (!details) return;
    const html = `<html><body><h2>Offer Letter</h2><p>Dear ${offerCandidate.name},</p><p>We are pleased to offer you the position of <b>${details.position}</b> with a starting salary of <b>${details.salary}</b> and a start date of <b>${details.startDate}</b>.</p><p>Congratulations!</p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Offer_Letter_${offerCandidate.name.replace(
      /\s+/g,
      "_"
    )}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-2">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#011F72] mb-8">
          Candidate Pipeline
        </h1>
        {/* Tabs for stages */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-4 py-2 rounded-full font-semibold transition border ${
                selectedStage === stage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-[#011F72] border-blue-100 hover:bg-blue-50"
              }`}
            >
              {stage}
              <span className="ml-2 bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                {candidates.filter((c) => c.stage === stage).length}
              </span>
            </button>
          ))}
        </div>
        {/* Candidate cards for selected stage */}
        <div className="bg-white rounded-xl shadow p-6 min-h-[200px] flex flex-col gap-4">
          {candidates.filter((c) => c.stage === selectedStage).length === 0 ? (
            <div className="text-gray-400 text-xs text-center">
              No candidates in this stage
            </div>
          ) : (
            candidates
              .filter((c) => c.stage === selectedStage)
              .map((c) => (
                <div
                  key={c.id}
                  className="bg-blue-50 border border-blue-100 rounded-[10px] p-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div>
                    <div className="font-semibold text-[#011F72] flex items-center gap-2">
                      {c.name}
                      {c.offerStatus !== "none" && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            c.offerStatus === "sent"
                              ? "bg-yellow-100 text-yellow-700"
                              : c.offerStatus === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.offerStatus.charAt(0).toUpperCase() +
                            c.offerStatus.slice(1)}{" "}
                          Offer
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{c.job}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() => openModal(c)}
                    >
                      View
                    </button>
                    {selectedStage !== "Rejected" && (
                      <button
                        className="text-red-500 hover:underline text-xs"
                        onClick={() =>
                          setCandidates((prev) =>
                            prev.map((cand) =>
                              cand.id === c.id
                                ? { ...cand, stage: "Rejected" }
                                : cand
                            )
                          )
                        }
                      >
                        Reject
                      </button>
                    )}
                    {c.offerStatus === "none" && (
                      <button
                        className="text-indigo-700 hover:underline text-xs"
                        onClick={() => openOfferModal(c)}
                      >
                        Send Offer
                      </button>
                    )}
                    {c.offerStatus !== "none" && (
                      <button
                        className="text-indigo-700 hover:underline text-xs"
                        onClick={() => openOfferModal(c)}
                      >
                        View Offer
                      </button>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
        {/* Add Candidate FAB */}
        <button
          className="fixed bottom-8 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Add Candidate"
          onClick={() => setShowAddModal(true)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span className="hidden sm:inline font-semibold">Add Candidate</span>
        </button>
        {/* Add Candidate Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition animate-fadeInModal">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100 animate-scaleIn">
              <h2 className="text-xl font-bold mb-4 text-[#011F72]">
                Add Candidate
              </h2>
              <form
                ref={addFormRef}
                onSubmit={handleAddSubmit}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block font-medium mb-1">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={addForm.name}
                    onChange={handleAddChange}
                    className={`border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 ${
                      addErrors.name ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {addErrors.name && (
                    <div className="text-red-500 text-xs mt-1">
                      {addErrors.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Job Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="job"
                    value={addForm.job}
                    onChange={handleAddChange}
                    className={`border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200 ${
                      addErrors.job ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {addErrors.job && (
                    <div className="text-red-500 text-xs mt-1">
                      {addErrors.job}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Stage</label>
                  <select
                    name="stage"
                    value={addForm.stage}
                    onChange={handleAddChange}
                    className="border rounded-[10px] px-3 py-2 w-full focus:ring-2 focus:ring-blue-200"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
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
                    Add Candidate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Candidate Details Modal */}
        {showModal && modalCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition animate-fadeInModal">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100 animate-scaleIn">
              <h2 className="text-xl font-bold mb-4 text-[#011F72]">
                Candidate Details
              </h2>
              <div className="mb-2">
                <span className="font-semibold">Name:</span>{" "}
                {modalCandidate.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Job:</span> {modalCandidate.job}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Stage:</span>{" "}
                {modalCandidate.stage}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Notes:</span>{" "}
                {modalCandidate.notes || (
                  <span className="text-gray-400">No notes</span>
                )}
              </div>
              {modalCandidate.offerStatus !== "none" && (
                <div className="mb-2">
                  <span className="font-semibold">Offer Status:</span>{" "}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      modalCandidate.offerStatus === "sent"
                        ? "bg-yellow-100 text-yellow-700"
                        : modalCandidate.offerStatus === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {modalCandidate.offerStatus.charAt(0).toUpperCase() +
                      modalCandidate.offerStatus.slice(1)}{" "}
                    Offer
                  </span>
                </div>
              )}
              <div className="flex gap-4 justify-end mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-[10px] bg-gray-200 hover:bg-gray-300 transition"
                >
                  Close
                </button>
                {modalCandidate.offerStatus === "none" && (
                  <button
                    onClick={() => {
                      openOfferModal(modalCandidate);
                      closeModal();
                    }}
                    className="px-4 py-2 rounded-[10px] bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Send Offer
                  </button>
                )}
                {modalCandidate.offerStatus !== "none" && (
                  <button
                    onClick={() => {
                      openOfferModal(modalCandidate);
                      closeModal();
                    }}
                    className="px-4 py-2 rounded-[10px] bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    View Offer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Offer Modal */}
        {showOfferModal && offerCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition animate-fadeInModal">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-100 animate-scaleIn">
              <h2 className="text-xl font-bold mb-4 text-[#011F72]">
                {offerCandidate.offerStatus === "none"
                  ? "Send Offer"
                  : "Offer Details"}
              </h2>
              {offerCandidate.offerStatus === "none" ? (
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
                    <div className="text-red-500 text-xs mb-2">
                      {offerError}
                    </div>
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
                    {offerCandidate.offerDetails?.position}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Salary:</span>{" "}
                    {offerCandidate.offerDetails?.salary}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Start Date:</span>{" "}
                    {offerCandidate.offerDetails?.startDate}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        offerCandidate.offerStatus === "sent"
                          ? "bg-yellow-100 text-yellow-700"
                          : offerCandidate.offerStatus === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {offerCandidate.offerStatus.charAt(0).toUpperCase() +
                        offerCandidate.offerStatus.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-4">
                    {offerCandidate.offerStatus === "sent" && (
                      <button
                        onClick={() => handleOfferStatusUpdate("accepted")}
                        className="px-4 py-2 rounded-[10px] bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Mark Accepted
                      </button>
                    )}
                    {offerCandidate.offerStatus === "sent" && (
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
    </div>
  );
}
