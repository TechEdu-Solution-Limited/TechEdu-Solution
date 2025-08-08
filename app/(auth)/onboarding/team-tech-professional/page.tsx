// @/app/(auth)/onboarding/team-tech-Professional/page.tsx

import TeamTechProfessionalOnboarding from "@/components/Onboarding/TeamTechProfessionalOnboarding";
import AuthGuard from "@/components/AuthGuard";
import { Suspense } from "react";

export default function teamTechProfessionalOnboardingPage() {
  return (
    <AuthGuard>
      <Suspense>
        <TeamTechProfessionalOnboarding />
      </Suspense>
    </AuthGuard>
  );
}
