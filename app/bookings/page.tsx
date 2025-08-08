// @/app/bookings/page.tsx

import BookingPage from "@/components/Booking";
import { Suspense } from "react";

export default function BookingFormPage() {
  return (
    <Suspense>
      <BookingPage />
    </Suspense>
  );
}
