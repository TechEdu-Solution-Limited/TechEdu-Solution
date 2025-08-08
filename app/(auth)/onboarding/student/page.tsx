// @/app/(auth)/onboarding/student/page.tsx

import StudentOnboarding from "@/components/Onboarding/StudentOnboarding";
import AuthGuard from "@/components/AuthGuard";
import { Suspense } from "react";

export default function StudentOnboardingPage() {
  return (
    <AuthGuard>
      <Suspense>
        <StudentOnboarding />
      </Suspense>
    </AuthGuard>
  );
}
