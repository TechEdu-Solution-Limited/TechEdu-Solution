"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Eye, Bookmark, Send } from "lucide-react";
import Link from "next/link";

export default function ApplicationSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#011F72]">
          Application Submitted Successfully!
        </h1>
        <p className="text-gray-600 text-lg">
          Your job application has been received and is being reviewed by our
          team.
        </p>
      </div>

      {/* Success Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">
            What Happens Next?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-[#011F72]">Application Review</p>
                <p className="text-sm text-gray-600">
                  Our recruitment team will review your application within 2-3
                  business days.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-[#011F72]">
                  Assessment & Matching
                </p>
                <p className="text-sm text-gray-600">
                  Your skills will be assessed against the job requirements for
                  the best match.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-[#011F72]">Next Steps</p>
                <p className="text-sm text-gray-600">
                  If selected, you'll receive an email with next steps for
                  interviews or assessments.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-lg">
            Track Your Application
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            You can track the status of your application in your dashboard.
          </p>
          <div className="flex justify-center">
            <Button asChild className="text-white hover:text-black">
              <Link href="/dashboard/applications">
                <Eye className="w-4 h-4 mr-2" />
                View My Applications
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link href="/dashboard/jobs">
            <Bookmark className="w-4 h-4 mr-2" />
            Browse More Jobs
          </Link>
        </Button>
        <Button asChild className="flex-1 text-white hover:text-black">
          <Link href="/dashboard">
            <Send className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
      </div>

      {/* Additional Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-medium text-[#011F72] mb-2">💡 Pro Tips</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Keep your profile and CV updated for better matching</li>
            <li>• Set up job alerts to never miss relevant opportunities</li>
            <li>• Network with other professionals in your field</li>
            <li>• Prepare for potential interviews while waiting</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
