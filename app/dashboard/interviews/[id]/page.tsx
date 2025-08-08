"use client";
import { useParams } from "next/navigation";
import { Calendar } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

// Same mock data as the widget
const mockInterviews = [
  {
    id: "1",
    candidate: "Jane Doe",
    jobTitle: "Frontend Developer",
    date: "2024-07-29T10:00:00Z",
    status: "scheduled",
  },
  {
    id: "2",
    candidate: "John Smith",
    jobTitle: "Backend Developer",
    date: "2024-07-30T14:30:00Z",
    status: "scheduled",
  },
  {
    id: "3",
    candidate: "Alice Johnson",
    jobTitle: "UI/UX Designer",
    date: "2024-08-01T09:00:00Z",
    status: "scheduled",
  },
  {
    id: "4",
    candidate: "Michael Brown",
    jobTitle: "QA Tester",
    date: "2024-08-02T11:00:00Z",
    status: "scheduled",
  },
  {
    id: "5",
    candidate: "Emily Davis",
    jobTitle: "Product Manager",
    date: "2024-08-03T15:00:00Z",
    status: "scheduled",
  },
  {
    id: "6",
    candidate: "Chris Lee",
    jobTitle: "DevOps Engineer",
    date: "2024-08-04T13:00:00Z",
    status: "completed",
  },
  {
    id: "7",
    candidate: "Sarah Kim",
    jobTitle: "Data Scientist",
    date: "2024-08-05T10:30:00Z",
    status: "cancelled",
  },
];

export default function InterviewDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const interviewData = mockInterviews.find((i) => i.id === id);
  const [interview, setInterview] = useState(interviewData);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [message, setMessage] = useState("");

  if (!interview) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Interview Not Found</h1>
        <Link
          href="/dashboard/interviews"
          className="text-blue-600 hover:underline"
        >
          Back to Interviews
        </Link>
      </div>
    );
  }

  const handleCancel = () => {
    setInterview({ ...interview, status: "cancelled" });
    setMessage("Interview cancelled.");
    setShowReschedule(false);
  };

  const handleReschedule = () => {
    setShowReschedule(true);
    setMessage("");
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDate) {
      setInterview({ ...interview, date: newDate, status: "scheduled" });
      setMessage("Interview rescheduled.");
      setShowReschedule(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Interview Details</h1>
      <div className="bg-white border border-blue-100 rounded-xl shadow p-6 mb-6">
        <div className="mb-4">
          <span className="font-semibold text-[#011F72]">Job Title:</span>{" "}
          {interview.jobTitle}
        </div>
        <div className="mb-4">
          <span className="font-semibold text-[#011F72]">Candidate:</span>{" "}
          {interview.candidate}
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-blue-400" />
          <span className="font-semibold text-[#011F72]">Date/Time:</span>
          <span className="ml-2 text-blue-700 font-medium">
            {new Date(interview.date).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-[#011F72]">Status:</span>{" "}
          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
        </div>
        {message && (
          <div className="mb-4 text-green-600 font-medium">{message}</div>
        )}
        {interview.status === "scheduled" && !showReschedule && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleReschedule}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reschedule
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel Interview
            </button>
          </div>
        )}
        {showReschedule && (
          <form
            onSubmit={handleRescheduleSubmit}
            className="mt-4 flex flex-col gap-2"
          >
            <label className="font-medium">New Date/Time:</label>
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="border rounded px-2 py-1"
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowReschedule(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      <Link
        href="/dashboard/interviews"
        className="text-blue-600 hover:underline"
      >
        Back to Interviews
      </Link>
    </div>
  );
}
