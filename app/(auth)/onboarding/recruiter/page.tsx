// @/app/(auth)/onboarding/recruiter/page.tsx

import RecruiterOnboarding from "@/components/Onboarding/RecruiterOnboarding";
import AuthGuard from "@/components/AuthGuard";
import { Suspense } from "react";

export default function RecruiterOnboardingPage() {
  return (
    <AuthGuard>
      <Suspense>
        <RecruiterOnboarding />
      </Suspense>
    </AuthGuard>
  );
}
