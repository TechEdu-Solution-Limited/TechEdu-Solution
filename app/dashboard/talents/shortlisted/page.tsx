"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookmarkCheck } from "lucide-react";
import { mockTalentData } from "@/data/talents";
import { useRef } from "react";

export default function ShortlistedTalentsPage() {
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [tags, setTags] = useState<{ [id: string]: string[] }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShortlisted(
        JSON.parse(localStorage.getItem("shortlistedTalents") || "[]")
      );
    }
  }, []);

  // Load notes and tags from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNotes =
        JSON.parse(localStorage.getItem("talentNotes") || "{}") || {};
      const storedTags =
        JSON.parse(localStorage.getItem("talentTags") || "{}") || {};
      setNotes(storedNotes);
      setTags(storedTags);
    }
  }, [shortlisted]);

  // Save notes to localStorage
  function handleNoteChange(id: string, value: string) {
    setNotes((prev) => {
      const updated = { ...prev, [id]: value };
      localStorage.setItem("talentNotes", JSON.stringify(updated));
      return updated;
    });
  }

  // Save tags to localStorage
  function handleTagsChange(id: string, value: string) {
    const tagArr = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setTags((prev) => {
      const updated = { ...prev, [id]: tagArr };
      localStorage.setItem("talentTags", JSON.stringify(updated));
      return updated;
    });
  }

  const shortlistedTalents = mockTalentData.filter((talent) =>
    shortlisted.includes(talent.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Shortlisted Candidates
          </h1>
          <p className="text-gray-600 mt-1">
            All candidates you have shortlisted for your open roles.
          </p>
        </div>
        <Button asChild className="rounded-[10px]" variant="outline">
          <Link href="/dashboard/talents">Back to Talent Search</Link>
        </Button>
      </div>
      {shortlistedTalents.length === 0 ? (
        <div className="text-center text-gray-500 py-24">
          <p className="text-lg">No candidates have been shortlisted yet.</p>
          <p className="mt-2">
            Go to the Talent Search to add candidates to your shortlist.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {shortlistedTalents.map((talent) => (
            <li
              key={talent.id}
              className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border hover:shadow-md transition"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-400">👤</span>
              </div>
              <p className="flex items-center gap-2 text-gray-800 font-medium text-sm mb-1">
                <span>📌</span> {talent.name}
              </p>
              <p className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <span>📍</span> {talent.location}
              </p>
              <p className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <span>💼</span> {talent.roleInterest}
              </p>
              <p className="flex items-start gap-2 text-gray-500 text-xs italic mb-4 text-left">
                <span>📄</span>
                <span>{talent.cvInsight}</span>
              </p>
              <div className="flex flex-col gap-2 w-full">
                <Link
                  href={`/dashboard/talents/${talent.id}`}
                  className="bg-gray-200 text-gray-700 font-semibold rounded-[10px] px-4 py-2 w-full hover:bg-gray-300 text-center"
                >
                  View Profile
                </Link>
                <Button
                  className="w-full rounded-[10px] flex items-center justify-center gap-2 bg-blue-100 text-blue-800"
                  disabled
                >
                  <BookmarkCheck className="w-4 h-4" /> Shortlisted
                </Button>
                {/* Notes Section */}
                <div className="mt-2 text-left">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full border rounded-[10px] p-2 text-sm min-h-[60px]"
                    value={notes[talent.id] || ""}
                    onChange={(e) =>
                      handleNoteChange(talent.id, e.target.value)
                    }
                    placeholder="Add notes about this candidate..."
                  />
                </div>
                {/* Tags Section */}
                <div className="mt-2 text-left">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    className="w-full border rounded-[10px] p-2 text-sm"
                    value={(tags[talent.id] || []).join(", ")}
                    onChange={(e) =>
                      handleTagsChange(talent.id, e.target.value)
                    }
                    placeholder="e.g. JavaScript, Team Player, Remote"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(tags[talent.id] || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 rounded-[10px] px-2 py-0.5 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
