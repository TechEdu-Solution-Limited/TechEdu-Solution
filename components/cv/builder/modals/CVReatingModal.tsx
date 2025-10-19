// components/cv/RatingModal.tsx
"use client";

import React from "react";
import { CVRatingResult } from "@/services/cv/cvServiceOptimized";

export interface RatingModalProps {
  open: boolean;
  data: CVRatingResult | null;
  onClose: () => void;
  onStartEditing: () => void;
}

function formatFileSize(bytes: number = 0) {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function RatingModal({
  open,
  data,
  onClose,
  onStartEditing,
}: RatingModalProps) {
  if (!open || !data) return null;

  const { rating, fileMeta } = data;

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow max-w-2xl w-full">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            CV Rating &amp; Feedback
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Overall */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
            {rating.overall}
          </div>
          <div className="text-sm text-gray-500">Overall Score</div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(rating.sections || {}).map(([k, v]) => (
            <div key={k} className="rounded-lg border p-3 text-center">
              <div className="text-xl font-semibold">{v as number}</div>
              <div className="text-xs text-gray-500 capitalize">{k}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Strengths</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {(rating.strengths || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Gaps</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {(rating.gaps || []).map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-6 text-sm">
          <div className="rounded-lg border p-3">
            <div className="text-gray-500">ATS Friendly</div>
            <div className="font-semibold">
              {rating.atsFriendly ? "Yes" : "No"}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-gray-500">Keyword Coverage</div>
            <div className="font-semibold">{rating.keywordCoverage}%</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-gray-500">Seniority</div>
            <div className="font-semibold capitalize">{rating.seniority}</div>
          </div>
        </div>

        {rating.notes && (
          <div className="mt-4">
            <h4 className="font-semibold mb-1">Notes</h4>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {rating.notes}
            </p>
          </div>
        )}

        {rating.match && (
          <div className="mt-4 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Job Match</h4>
              <div className="text-sm">
                Score:{" "}
                <span className="font-semibold">{rating.match.score}</span>
              </div>
            </div>

            {Array.isArray(rating.match.missingSkills) &&
              rating.match.missingSkills.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">
                    Missing skills
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {rating.match.missingSkills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {Array.isArray(rating.match.reasons) &&
              rating.match.reasons.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Reasons</div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {rating.match.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {fileMeta && (
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border p-3">
              <div className="text-gray-500">Size</div>
              <div className="font-semibold">
                {formatFileSize(fileMeta.bytes || 0)}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-gray-500">Pages</div>
              <div className="font-semibold">{fileMeta.pages ?? "–"}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-gray-500">Type</div>
              <div className="font-semibold">
                {fileMeta.mime || fileMeta.ext}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[10px] border border-gray-300 dark:border-gray-600"
          >
            Close
          </button>
          <button
            onClick={onStartEditing}
            className="px-4 py-2 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700"
          >
            Start Editing This CV
          </button>
        </div>
      </div>
    </div>
  );
}
