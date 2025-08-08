// @/app/(auth)/onboarding/tech-professional/page.tsx

import IndividualTechProfessionalOnboarding from "@/components/Onboarding/IndividualTechProfessional";
import AuthGuard from "@/components/AuthGuard";
import { Suspense } from "react";

export default function individualTechProfessionalOnboardingPage() {
  return (
    <AuthGuard>
      <Suspense>
        <IndividualTechProfessionalOnboarding />
      </Suspense>
    </AuthGuard>
  );
}
