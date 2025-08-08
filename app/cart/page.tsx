// @/app/cart/page.tsx

import CartPage from "@/components/CartPage";
import { Suspense } from "react";
import Link from "next/link";

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <CartPage />
    </Suspense>
  );
}
