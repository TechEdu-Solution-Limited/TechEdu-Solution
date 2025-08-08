// @/app/(auth)/login/page.tsx
import PaymentSuccessPage from "@/components/PaymentSuccess";
import { Suspense } from "react";

export default function PaymentSuccess() {
  return (
    <Suspense>
      <PaymentSuccessPage />
    </Suspense>
  );
}
