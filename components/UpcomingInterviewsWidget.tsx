import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface Interview {
  id: string;
  candidate: string;
  jobTitle: string;
  date: string; // ISO string
  status: "scheduled" | "completed" | "cancelled";
}

// Enhanced mock data for demonstration
const mockInterviews: Interview[] = [
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

export const UpcomingInterviewsWidget: React.FC = () => {
  // Sort by soonest
  const upcoming = mockInterviews
    .filter((i) => i.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-white border border-blue-100 rounded-xl shadow p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-[#011F72] mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-blue-400" /> Upcoming Interviews
      </h2>
      {upcoming.length === 0 ? (
        <div className="text-gray-500 flex-1 flex items-center justify-center">
          No upcoming interviews!
        </div>
      ) : (
        <ul className="space-y-3 flex-1">
          {upcoming.map((interview) => (
            <li
              key={interview.id}
              className="flex items-center justify-between bg-blue-50 rounded-[10px] px-4 py-3 border border-blue-100"
            >
              <div>
                <div className="font-semibold text-[#011F72]">
                  {interview.jobTitle}
                </div>
                <div className="text-xs text-gray-500">
                  {interview.candidate}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                <span className="text-sm text-blue-700 font-medium">
                  {new Date(interview.date).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <Link
                  href={`/dashboard/interviews/${interview.id}`}
                  className="ml-2 text-blue-400 hover:text-[#011F72] font-semibold flex items-center gap-1 text-xs"
                >
                  View <ArrowRight size={14} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 text-right">
        <Link
          href="/dashboard/interviews"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          View All Interviews
        </Link>
      </div>
    </div>
  );
};
