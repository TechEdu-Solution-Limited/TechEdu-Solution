"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertTriangle,
  User,
  FileText,
  BookOpen,
  Mail,
  Image as ImageIcon,
  Star,
} from "lucide-react";

const FIELD_CONFIG = [
  {
    key: "bio",
    label: "Bio",
    icon: <User className="text-blue-600" size={20} />,
    cta: "/dashboard/profile-progress",
  },
  {
    key: "education",
    label: "Education",
    icon: <BookOpen className="text-green-600" size={20} />,
    cta: "/dashboard/profile-progress",
  },
  {
    key: "uploads",
    label: "Uploads",
    icon: <FileText className="text-purple-600" size={20} />,
    cta: "/dashboard/upload-documents",
  },
  {
    key: "contact",
    label: "Contact Info",
    icon: <Mail className="text-orange-600" size={20} />,
    cta: "/dashboard/profile-progress",
  },
  {
    key: "profilePicture",
    label: "Profile Picture",
    icon: <ImageIcon className="text-pink-600" size={20} />,
    cta: "/dashboard/profile-progress",
  },
  {
    key: "skills",
    label: "Skills",
    icon: <Star className="text-yellow-600" size={20} />,
    cta: "/dashboard/profile-progress",
  },
];

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function ProfileProgressPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<any>({});
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/studentDashboardData.json");
        if (!res.ok) throw new Error("Failed to load profile data");
        const json = await res.json();
        setFields(json.profile?.fields || {});
        setCompletion(json.profile?.completion || 0);
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-4" />
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  const allComplete =
    completion === 100 || FIELD_CONFIG.every((f) => fields[f.key]);

  return (
    <div className="w-full py-8 px-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <Progress
              value={completion}
              className="w-full transition-all duration-700"
            />
            <span className="font-semibold text-lg">{completion}%</span>
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {allComplete ? (
              <span className="text-green-700 font-semibold flex items-center gap-2">
                <CheckCircle
                  className="inline-block text-green-600"
                  size={18}
                />
                Profile Complete! Great job!
              </span>
            ) : (
              <>
                Complete all fields below to unlock all features and get better
                recommendations.
              </>
            )}
          </div>

          <div className="space-y-4">
            {FIELD_CONFIG.map((field) => {
              const isComplete = !!fields[field.key];
              return (
                <div
                  key={field.key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-[10px]"
                >
                  <div className="flex items-center gap-3">
                    {field.icon}
                    <span className="font-medium">{field.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <span className="flex items-center gap-1 text-green-700">
                        <CheckCircle size={18} />
                        <span className="text-xs font-semibold">Complete</span>
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-yellow-700">
                          <AlertTriangle size={18} />
                          <span className="text-xs font-semibold">
                            Incomplete
                          </span>
                        </span>
                        <Link href={field.cta}>
                          <Button size="sm" variant="outline" className="ml-2">
                            Complete Now
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
