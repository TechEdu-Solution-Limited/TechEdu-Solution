// @/app/payment-failed/page.tsx

import PaymentFailedPage from "@/components/PaymentFailed";
import { Suspense } from "react";

export default function PaymentFailed() {
  return (
    <Suspense>
      <PaymentFailedPage />
    </Suspense>
  );
}
