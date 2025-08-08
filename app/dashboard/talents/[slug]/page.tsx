"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserIcon,
  BriefcaseIcon,
  MapPinIcon,
  BarChartIcon,
  ShieldCheckIcon,
  CalendarClockIcon,
  Download,
  MessageSquare,
  Star,
  Plus,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  ClipboardList,
} from "lucide-react";
import { mockTalentData } from "@/data/talents";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRef } from "react";

export default function TalentDashboardProfile() {
  const { slug } = useParams();
  const router = useRouter();
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [actionMsg, setActionMsg] = useState("");
  const [notes, setNotes] = useState<{ [id: string]: string }>({});
  const [tags, setTags] = useState<{ [id: string]: string[] }>({});
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; timestamp: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviews, setInterviews] = useState<
    { date: string; type: string; notes: string }[]
  >([]);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  // Move candidate and isShortlisted above useEffects
  const candidate = mockTalentData.find((t) => t.id === slug);
  const isShortlisted = candidate ? shortlisted.includes(candidate.id) : false;

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
  }, [slug]);

  // Load messages from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && candidate?.id) {
      const stored = JSON.parse(
        localStorage.getItem(`talentMessages_${candidate.id}`) || "[]"
      );
      setMessages(stored);
    }
  }, [candidate?.id, messageModalOpen]);

  // Load interviews from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && candidate?.id) {
      const stored = JSON.parse(
        localStorage.getItem(`talentInterviews_${candidate.id}`) || "[]"
      );
      setInterviews(stored);
    }
  }, [candidate?.id, interviewModalOpen]);

  // Scroll to bottom on open
  useEffect(() => {
    if (messageModalOpen && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messageModalOpen]);

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

  function handleShortlist(id: string) {
    setShortlisted((prev) => {
      if (!prev.includes(id)) {
        const updated = [...prev, id];
        localStorage.setItem("shortlistedTalents", JSON.stringify(updated));
        setActionMsg("Candidate added to shortlist.");
        setTimeout(() => setActionMsg(""), 2000);
        return updated;
      }
      return prev;
    });
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !candidate) return;
    const msg = {
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(
      `talentMessages_${candidate.id}`,
      JSON.stringify(updated)
    );
    setNewMessage("");
    setTimeout(() => {
      if (messageEndRef.current)
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleScheduleInterview(e: React.FormEvent) {
    e.preventDefault();
    if (!interviewDate || !interviewType || !candidate) return;
    const newInterview = {
      date: interviewDate,
      type: interviewType,
      notes: interviewNotes,
    };
    const updated = [...interviews, newInterview];
    setInterviews(updated);
    localStorage.setItem(
      `talentInterviews_${candidate.id}`,
      JSON.stringify(updated)
    );
    setInterviewDate("");
    setInterviewType("");
    setInterviewNotes("");
  }

  if (!candidate) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
        <p className="text-gray-600 mb-6">
          The candidate you are looking for does not exist.
        </p>
        <Button asChild className="rounded-[10px]" variant="outline">
          <Link href="/dashboard/talents">Back to Talent Search</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10 px-4">
      <Button
        variant="outline"
        className="rounded-[10px] mb-10"
        size="sm"
        asChild
      >
        <Link href="/dashboard/talents">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Talents
        </Link>
      </Button>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 mb-8">
        <div className="flex flex-col items-center">
          <Image
            src={candidate?.img || "/assets/placeholder-avatar.jpg"}
            alt={candidate?.name || "Candidate"}
            width={160}
            height={160}
            className="rounded-full border-4 border-gray-200 shadow-md object-cover"
          />
          <div className="flex gap-2 mt-4">
            <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-[10px] hover:bg-gray-100"
                >
                  <MessageSquare className="w-4 h-4 mr-1" /> Message
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-[10px]">
                <DialogHeader>
                  <DialogTitle>Message {candidate.name}</DialogTitle>
                </DialogHeader>
                <div className="max-h-64 overflow-y-auto mb-4 bg-gray-50 rounded-[10px] p-3 border">
                  {messages.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center">
                      No messages yet.
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="text-sm text-gray-800 bg-white rounded-[10px] px-3 py-2 inline-block">
                          {msg.text}
                        </div>
                        <div className="text-xs text-gray-400 ml-2">
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messageEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    className="flex-1 border rounded-[10px] p-2 text-sm"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <Button
                    type="submit"
                    className="rounded-[10px] text-white hover:text-black"
                  >
                    Send
                  </Button>
                </form>
                <DialogFooter />
              </DialogContent>
            </Dialog>
            <Dialog
              open={interviewModalOpen}
              onOpenChange={setInterviewModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-[10px] hover:bg-gray-100"
                >
                  <ClipboardList className="w-4 h-4 mr-1" /> Schedule Interview
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-[10px]">
                <DialogHeader>
                  <DialogTitle>
                    Schedule Interview with {candidate.name}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleScheduleInterview}
                  className="space-y-3 mb-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded-[10px] p-2 text-sm"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Interview Type
                    </label>
                    <select
                      className="w-full border rounded-[10px] p-2 text-sm"
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="Phone">Phone</option>
                      <option value="Video">Video</option>
                      <option value="In-Person">In-Person</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Notes
                    </label>
                    <textarea
                      className="w-full border rounded-[10px] p-2 text-sm min-h-[40px]"
                      value={interviewNotes}
                      onChange={(e) => setInterviewNotes(e.target.value)}
                      placeholder="Add any notes for this interview..."
                    />
                  </div>
                  <Button
                    type="submit"
                    className="rounded-[10px] w-full text-white hover:text-black"
                  >
                    Schedule Interview
                  </Button>
                </form>
                <div>
                  <h3 className="text-md font-semibold mb-2">
                    Scheduled Interviews
                  </h3>
                  {interviews.length === 0 ? (
                    <div className="text-gray-400 text-sm">
                      No interviews scheduled yet.
                    </div>
                  ) : (
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                      {interviews.map((iv, idx) => (
                        <li
                          key={idx}
                          className="bg-gray-50 border rounded-[10px] p-3"
                        >
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            {new Date(iv.date).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            {iv.type}
                          </div>
                          {iv.notes && (
                            <div className="text-xs text-gray-600 mt-1">
                              {iv.notes}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <DialogFooter />
              </DialogContent>
            </Dialog>
            <Button
              variant={isShortlisted ? "secondary" : "outline"}
              size="sm"
              className={`rounded-[10px] hover:bg-gray-100 flex items-center gap-1 ${
                isShortlisted ? "bg-blue-100 text-blue-800" : ""
              }`}
              onClick={() => handleShortlist(candidate.id)}
              disabled={isShortlisted}
            >
              {isShortlisted ? (
                <>
                  <BookmarkCheck className="w-4 h-4 mr-1" /> Shortlisted
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-1" /> Shortlist
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-[10px] hover:bg-gray-100"
            >
              <Download className="w-4 h-4 mr-1" /> Download CV
            </Button>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-[#011F72]">
            {candidate.name}
          </h1>
          <div className="flex items-center gap-2 text-lg text-gray-700">
            <BriefcaseIcon className="w-5 h-5" />
            {candidate.roleInterest}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPinIcon className="w-5 h-5" />
            {candidate.location}
          </div>
          <div className="flex items-center gap-2">
            <BarChartIcon className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">CV Insight Score:</span>{" "}
            {candidate.cvInsight || "N/A"}%
            {candidate.coachVerified && (
              <Badge className="ml-2 bg-green-100 text-green-800">
                <ShieldCheckIcon className="w-4 h-4 mr-1" />
                Coach Verified
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full rounded-[10px]">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="rounded-[10px]">
            Overview
          </TabsTrigger>
          <TabsTrigger value="experience" className="rounded-[10px]">
            Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="rounded-[10px]">
            Education
          </TabsTrigger>
          <TabsTrigger value="skills" className="rounded-[10px]">
            Skills
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              {candidate.roleInterest}
              <br />
              <span className="font-semibold">Location:</span>{" "}
              {candidate.location}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="experience">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            <ul className="space-y-4">
              {Array.isArray(candidate.experience)
                ? candidate.experience.map((exp: any, idx: number) => (
                    <li key={idx} className="border-b pb-2">
                      <div className="font-semibold">
                        {exp.title} @ {exp.company}
                      </div>
                      <div className="text-gray-600 text-sm">{exp.period}</div>
                      <div className="text-gray-700 mt-1">
                        {exp.description}
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="education">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <ul className="space-y-4">
              {Array.isArray(candidate.education)
                ? candidate.education.map((edu: any, idx: number) => (
                    <li key={idx} className="border-b pb-2">
                      <div className="font-semibold">
                        {edu.degree} @ {edu.university}
                      </div>
                      <div className="text-gray-600 text-sm">{edu.year}</div>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="skills">
          <div className="bg-white rounded-[10px] shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(candidate.skills || []).map((skill, idx) => (
                <Badge
                  key={idx}
                  className="bg-blue-100 text-blue-800 rounded-[10px]"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {actionMsg && (
        <div className="text-green-600 text-center mt-2">{actionMsg}</div>
      )}
      {/* Notes and Tags Section */}
      <div className="mt-6">
        {isShortlisted ? (
          <>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Notes
              </label>
              <textarea
                className="w-full border rounded-[10px] p-2 text-sm min-h-[60px]"
                value={notes[candidate.id] || ""}
                onChange={(e) => handleNoteChange(candidate.id, e.target.value)}
                placeholder="Add notes about this candidate..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Tags (comma separated)
              </label>
              <input
                className="w-full border rounded-[10px] p-2 text-sm"
                value={(tags[candidate.id] || []).join(", ")}
                onChange={(e) => handleTagsChange(candidate.id, e.target.value)}
                placeholder="e.g. JavaScript, Team Player, Remote"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {(tags[candidate.id] || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 rounded-[10px] px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-sm italic mt-4">
            Shortlist this candidate to add notes or tags.
          </div>
        )}
      </div>
    </div>
  );
}
