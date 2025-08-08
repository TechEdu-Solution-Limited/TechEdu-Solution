// @/app/career-connect/talents/page.tsx

import TalentsPage from "@/components/Talents";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense>
      <TalentsPage />
    </Suspense>
  );
}
