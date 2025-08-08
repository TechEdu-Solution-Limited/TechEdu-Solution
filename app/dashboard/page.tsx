// app/dashboard/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";

export default function DashboardHomePage() {
  const router = useRouter();
  const { userRole } = useRole();

  useEffect(() => {
    // Map roles to their dashboard routes
    const dashboardRoutes: Record<string, string> = {
      student: "/dashboard/student",
      individualTechProfessional: "/dashboard/individual-tech-professional",
      teamTechProfessional: "/dashboard/team-tech-professional",
      recruiter: "/dashboard/company",
      institution: "/dashboard/institution",
      employer: "/dashboard/company",
      admin: "/dashboard/admin",
    };
    const targetRoute = dashboardRoutes[userRole] || "/dashboard/student";
    router.replace(targetRoute);
  }, [userRole, router]);

  // Show nothing while redirecting
  return null;
}
