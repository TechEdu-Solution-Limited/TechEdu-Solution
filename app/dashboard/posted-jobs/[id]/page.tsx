"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Job, mockJobs } from "@/lib/jobs-mock";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const job = mockJobs.find((j) => j.id === jobId);

  const [form, setForm] = useState(
    job || {
      id: jobId,
      title: "",
      location: "",
      type: "Full-time",
      status: "open",
      postedDate: "",
      applicants: 0,
    }
  );
  const [saved, setSaved] = useState(false);

  if (!job) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    // In real app, send update to backend here
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <Card className="rounded-[10px]">
        <CardHeader>
          <CardTitle>Edit Job Posting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="rounded-[10px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="rounded-[10px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border rounded-[10px] px-3 py-2 w-full"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded-[10px] px-3 py-2 w-full"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Posted Date
            </label>
            <Input
              name="postedDate"
              value={form.postedDate}
              onChange={handleChange}
              className="rounded-[10px]"
              type="date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Applicants</label>
            <Input
              name="applicants"
              value={form.applicants}
              onChange={handleChange}
              className="rounded-[10px]"
              type="number"
              min={0}
            />
          </div>
          <Button className="rounded-[10px] w-full" onClick={handleSave}>
            Save
          </Button>
          {saved && (
            <div className="text-green-600 text-center mt-2">Saved!</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
