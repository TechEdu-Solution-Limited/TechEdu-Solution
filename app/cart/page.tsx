// @/app/cart/page.tsx

import CartPage from "@/components/CartPage";
import { Suspense } from "react";
import Link from "next/link";

export default function CartPageWrapper() {
  return (
    <Suspense>
      <CartPage />
    </Suspense>
  );
}
