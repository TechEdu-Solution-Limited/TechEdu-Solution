// @/app/checkout/page.tsx

import { Suspense } from "react";
import CheckoutPage from "@/components/CheckoutPage";

export default function CheckoutPageWrapper() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
