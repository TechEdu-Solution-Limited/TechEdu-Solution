// @/app/(auth)/onboarding/institution/page.tsx

import InstitutionOnboarding from "@/components/Onboarding/InstitutionOnboarding";
import AuthGuard from "@/components/AuthGuard";
import { Suspense } from "react";

export default function institutionOnboardingPage() {
  return (
    <AuthGuard>
      <Suspense>
        <InstitutionOnboarding />
      </Suspense>
    </AuthGuard>
  );
}
