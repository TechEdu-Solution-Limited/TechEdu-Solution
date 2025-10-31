// app/billing-complete/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentService } from "@/lib/api/paymentService";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

export default function BillingCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BillingCompleteInner />
    </Suspense>
  );
}

function BillingCompleteInner() {
  const sp = useSearchParams();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  useEffect(() => {
    const run = async () => {
      const setupIntentId = sp.get("setup_intent");
      const redirectStatus = sp.get("redirect_status");
      if (!setupIntentId) {
        setStatus("err");
        return;
      }

      try {
        const token = getTokenFromCookies() || "";

        // Retrieve the payload you stored before starting setup:
        // { productId, quantity, billingMode, plan? }
        const raw = localStorage.getItem("pendingSetupPayload");
        if (!raw) {
          setStatus("err");
          return;
        }
        const payload = JSON.parse(raw);
        payload.setupIntentId = setupIntentId;

        const resp = await PaymentService.confirmInstallments(payload, token);
        const ok =
          (resp as any)?.ok ??
          (resp as any)?.success ??
          (resp as any)?.data?.ok ??
          (resp as any)?.data?.success;
        if (!ok)
          throw new Error(
            (resp as any)?.message ||
              (resp as any)?.data?.message ||
              "Failed to finalize."
          );

        localStorage.removeItem("pendingSetupPayload");
        setStatus("ok");
        toast.success(
          payload.billingMode === "subscription"
            ? "Subscription started"
            : "Installment plan activated"
        );
        // redirect wherever you want:
        window.location.href = "/dashboard";
      } catch (e: any) {
        setStatus("err");
        toast.error(e?.message || "Could not finalize your billing setup");
      }
    };
    run();
  }, [sp]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-sm text-gray-700">
        {status === "idle" && "Finalizing your billing setup…"}
        {status === "ok" && "All set. Redirecting…"}
        {status === "err" && "We couldn’t finalize your billing setup."}
      </p>
    </div>
  );
}
