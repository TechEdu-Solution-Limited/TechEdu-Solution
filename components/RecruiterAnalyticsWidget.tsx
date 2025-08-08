import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const stats = [
  { label: "Jobs Posted", value: 4 },
  { label: "Applications", value: 12 },
  { label: "Interviews", value: 5 },
  { label: "Hires", value: 2 },
];

const applicationsData = [
  { job: "Frontend Dev", applications: 5 },
  { job: "Backend Dev", applications: 3 },
  { job: "UI/UX Designer", applications: 2 },
  { job: "QA Tester", applications: 2 },
];

export const RecruiterAnalyticsWidget: React.FC = () => (
  <div className="bg-white border border-blue-100 rounded-xl shadow p-6 flex flex-col gap-6">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center">
          <div className="text-2xl font-bold text-[#011F72]">{stat.value}</div>
          <div className="text-xs text-gray-600 text-center">{stat.label}</div>
        </div>
      ))}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-[#011F72] mb-2">
        Applications Per Job
      </h3>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={applicationsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="job" fontSize={10} />
          <YAxis allowDecimals={false} fontSize={10} />
          <Tooltip />
          <Bar dataKey="applications" fill="#011F72" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <a
      href="/dashboard/recruiter/analytics"
      className="text-blue-600 hover:underline text-xs text-right mt-2 self-end"
    >
      View Full Analytics
    </a>
  </div>
);
