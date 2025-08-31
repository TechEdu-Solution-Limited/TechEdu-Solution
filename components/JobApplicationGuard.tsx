"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";
import { getValidToken, clearAuthCookies } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Lock, UserCheck, ArrowRight } from "lucide-react";

interface JobApplicationGuardProps {
  children: React.ReactNode;
  jobId?: string;
}

export default function JobApplicationGuard({
  children,
  jobId,
}: JobApplicationGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData, loading: roleLoading } = useRole();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);

      try {
        // Get and validate the current token
        const { token, isValid, reason } = getValidToken();

        if (!token || !isValid) {
          // No token or invalid token - redirect to registration
          clearAuthCookies(); // Clean up any invalid cookies
          const returnUrl = jobId
            ? `/dashboard/jobs/${jobId}/apply`
            : "/dashboard/jobs";
          router.push(
            `/register?role=individualTechProfessional&returnUrl=${encodeURIComponent(
              returnUrl
            )}`
          );
          return;
        }

        // Wait for role context to load
        if (roleLoading) {
          return;
        }

        // Check if user data exists and has the required role
        if (!userData) {
          // Token is valid but no user data - this shouldn't happen normally
          // Clear cookies and redirect to login as fallback
          clearAuthCookies();
          const returnUrl = jobId
            ? `/dashboard/jobs/${jobId}/apply`
            : "/dashboard/jobs";
          router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }

        if (userData.role !== "individualTechProfessional") {
          // User exists but doesn't have the right role
          setIsChecking(false);
          return;
        }

        // User is authenticated and has the right role
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking access:", error);
        // If there's an error, clear cookies and redirect to registration
        clearAuthCookies();
        router.push("/register?role=individualTechProfessional");
      }
    };

    checkAccess();
  }, [router, jobId, roleLoading, userData]);

  // Show loading state while checking
  if (isChecking || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  // User doesn't have the required role
  if (!userData || userData.role !== "individualTechProfessional") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600">
              Only Individual Tech Professionals can apply for jobs. Your
              current role is:{" "}
              <span className="font-semibold">
                {userData?.role || "Unknown"}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              You can either update your current profile role or create a new
              account with the correct role.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() =>
                  router.push("/register?role=individualTechProfessional")
                }
                className="w-full"
              >
                Create New Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button
                onClick={() => router.push("/login?")}
                variant="ghost"
                className="w-full"
              >
                Login with Existing Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and has the right role - render children
  return <>{children}</>;
}
