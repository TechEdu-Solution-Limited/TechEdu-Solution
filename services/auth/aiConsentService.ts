// src/services/auth/aiConsentService.ts
export const aiConsentService = {
  /**
   * Accept AI processing consent (global / profile-level).
   * Idempotent per backend; safe to call anytime.
   */
  async acceptProcessing(): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/ai/consent/accept", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return false;
      const data = await res.json().catch(() => ({} as any));
      return !!(data && (data as any).ok);
    } catch {
      return false;
    }
  },
};
