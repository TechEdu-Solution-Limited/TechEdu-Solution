"use client";
import React from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
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

const conversionData = [
  { stage: "Applied", value: 12 },
  { stage: "Interviewed", value: 5 },
  { stage: "Hired", value: 2 },
];

const hiresPerMonth = [
  { month: "Jan", hires: 0 },
  { month: "Feb", hires: 1 },
  { month: "Mar", hires: 0 },
  { month: "Apr", hires: 1 },
  { month: "May", hires: 0 },
  { month: "Jun", hires: 0 },
  { month: "Jul", hires: 0 },
  { month: "Aug", hires: 0 },
  { month: "Sep", hires: 0 },
  { month: "Oct", hires: 0 },
  { month: "Nov", hires: 0 },
  { month: "Dec", hires: 0 },
];

const COLORS = ["#011F72", "#3B82F6", "#10B981"];

export default function RecruiterAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard/recruiter"
          className="text-blue-600 hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-[#011F72] mb-6">
          Analytics & Insights
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-white rounded-xl shadow p-4"
            >
              <div className="text-2xl font-bold text-[#011F72]">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Applications Per Job
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={applicationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="job" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="applications"
                  fill="#011F72"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Interview Conversion Funnel
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={conversionData}
                  dataKey="value"
                  nameKey="stage"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {conversionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#011F72] mb-4">
            Hires Per Month
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hiresPerMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="hires"
                stroke="#011F72"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
