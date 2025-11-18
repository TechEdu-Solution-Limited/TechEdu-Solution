// src/types/payment.ts

/** Common currency type */
export type CurrencyCode = "gbp" | "usd" | "eur" | (string & {});

/** Pricing models & tiering helpers (for captured snapshots) */
export type PriceModel = "one_time" | "subscription" | "free";
export type TierType = "volume" | "stairstep";

/** Participant type shared across API */
export type ParticipantType = "individual" | "team";

/** A stricter union we can normalize around */
export type UnifiedSucceeded = "succeeded" | "success";

export interface CapturedPricingSnapshot {
  /** Model at time of purchase */
  model: PriceModel;
  /** Quantity purchased (for per_unit) */
  quantity?: number;
  /** Effective unit price (after volume/tier) in MAJOR units (e.g., 135.00) */
  unitPrice?: number;
  /** Subtotal, VAT, total in MAJOR units */
  subtotal?: number;
  vat?: number;
  total?: number;
  /** Currency code used to display */
  currency?: CurrencyCode;
  /** Optional discount applied (percent) */
  discountPercentage?: number;
  /** Optional detail for graduated pricing */
  tierType?: TierType;
  graduatedDetail?: Array<{
    qty: number;
    unitPrice: number;
    line: number;
  }>;
}

/* ------------------------------------------------------------------ */
/* Core records                                                         */
/* ------------------------------------------------------------------ */

export interface PaymentIntent {
  _id: string;
  userId: string;
  productId: string;

  /** Amount in MINOR units (e.g., pence/cents). Keep this as minor to align with Stripe. */
  amount: number;
  currency: string;

  productType: string;
  bookingService: string;
  platformRole: string;
  transactionId: string;
  profileId: string; // Profile ID is required
  isSession: boolean;
  isClassroom: boolean;

  customerId?: string;
  stripePaymentIntentId?: string;

  /** Keep your existing values + Stripe-style "succeeded" for consistency */
  status: "pending" | "processing" | UnifiedSucceeded | "failed" | "cancelled";

  /** Optional snapshot so UIs don’t break if product pricing changes later */
  capturedPricing?: CapturedPricingSnapshot;

  /** Use ISO strings everywhere for consistency */
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  provider: "stripe";
  transactionId: string;

  /** Recommend: MINOR units for consistency with Stripe */
  amount: number;

  /** Keep both for bw-compat; normalize at the API layer if desired */
  status: "pending" | UnifiedSucceeded | "failed";

  currency: string;
  userId: string;
  productId: string;
  charges: string;

  jobApplicationId?: string;
  bookingId?: string;

  stripeProductId?: string;
  stripePriceId?: string;

  couponCode?: string;
  clientSecret?: string;

  metadata: Record<string, unknown>;
  webhookReceived: boolean;
  receiptUrl?: string;

  productType:
    | "Training & Certification"
    | "Academic Support Services"
    | "Career Development & Mentorship"
    | "Institutional & Team Services"
    | "AI-Powered or Automation Services"
    | "Recruitment & Job Matching"
    | "Marketing, Consultation & Free Services";

  bookingService: string;

  platformRole:
    | "student"
    | "individualTechProfessional"
    | "teamTechProfessional"
    | "recruiter"
    | "institution"
    | "admin"
    | "visitor";

  profileId: string; // Profile ID is required
  isSession: boolean;
  isClassroom: boolean;

  /** Optional snapshot to preserve display values */
  capturedPricing?: CapturedPricingSnapshot;

  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;

  /** Recommend using ISO string everywhere for consistency */
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Webhooks & refunds                                                  */
/* ------------------------------------------------------------------ */

export interface PaymentWebhook {
  id: string;
  object: string;
  type: string;
  data: {
    object: {
      id: string;
      object: string;
      amount: number; // Stripe sends MINOR units
      currency: string;
      status: string;
      payment_intent?: string;
      charge?: string;
      customer?: string;
      metadata?: Record<string, unknown>;
    };
  };
  created: number;
}

export interface PaymentRefund {
  _id: string;
  paymentId: string;
  amount: number; // recommend MINOR units
  reason: string;
  status: "pending" | "succeeded" | "failed";
  stripeRefundId?: string;
  createdAt: Date;
  processedAt?: Date;
}

/* ------------------------------------------------------------------ */
/* Create / Update requests & list filters                             */
/* ------------------------------------------------------------------ */

export interface CreatePaymentIntentRequest {
  /** MINOR units expected by backend (align with Stripe) */
  amount: number;
  currency: string;

  productId: string;
  productType:
    | "Training & Certification"
    | "Academic Support Services"
    | "Career Development & Mentorship"
    | "Institutional & Team Services"
    | "AI-Powered or Automation Services"
    | "Recruitment & Job Matching"
    | "Marketing, Consultation & Free Services";

  bookingService: string;

  platformRole:
    | "student"
    | "individualTechProfessional"
    | "teamTechProfessional"
    | "recruiter"
    | "institution"
    | "admin"
    | "visitor";

  userId: string; // required
  profileId: string; // required

  isSession: boolean;
  isClassroom: boolean;

  customerId?: string;
  bookingId: string;

  // Additional booking details for payment intent
  userNotes?: string;
  attachments?: string[]; // keep array type
  isTeam: boolean;
  participantType: ParticipantType;
}

/** Slim version your new API supports */
export interface SimplePaymentIntentRequest {
  productId: string;
  quoteId?: string;
  isTeam: boolean;
  userNotes: string;
  attachments?: string[]; // CHANGED: was string
  participantType: ParticipantType; // CHANGED: was string
  numberOfExpectedParticipants?: number; // optional for flexibility
  jobApplicationId?: string;
  couponCode?: string;
  customerId?: string;
}

/** Generic response wrapper */
export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    paymentIntentId: string;
    clientSecret?: string;
    redirectUrl?: string;
    bookingId?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: Payment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: "all" | "pending" | "success" | "succeeded" | "failed";
  provider?: "all" | "stripe" | "flutterwave" | "paystack";
  productType?:
    | "all"
    | "Training & Certification"
    | "Academic Support Services"
    | "Career Development & Mentorship"
    | "Institutional & Team Services"
    | "AI-Powered or Automation Services"
    | "Recruitment & Job Matching"
    | "Marketing, Consultation & Free Services";
  platformRole?:
    | "all"
    | "student"
    | "individualTechProfessional"
    | "teamTechProfessional"
    | "recruiter"
    | "institution"
    | "admin"
    | "visitor";
  currency?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface UpdatePaymentRequest {
  status?: "pending" | "success" | "succeeded" | "failed";
  receiptUrl?: string;
  webhookReceived?: boolean;
}

/* ------------------------------------------------------------------ */
/* NEW: Endpoint contracts you shared (price + installments)          */
/* ------------------------------------------------------------------ */

/** GET /api/products/{id}/price-preview?quantity=... */
export interface PricePreviewResponse {
  ok: boolean;
  currency: CurrencyCode;
  model: PriceModel;
  quantity: number;
  subtotal: number; // MAJOR
  vat: number; // MAJOR
  total: number; // MAJOR
  unitPrice?: number; // MAJOR
  tierType?: TierType;
  quoteId?: string; // Quote ID to be used in installments/subscription start endpoint
  graduatedDetail?: Array<{
    qty: number;
    unitPrice: number;
    line: number;
  }>;
}

/** GET /api/products/{id}/installments-preview?quantity=... */
export type InstallmentInterval = "day" | "week" | "month" | "year";

export interface InstallmentPlan {
  count: number;
  interval: InstallmentInterval;
  intervalCount: number;
  downPaymentType: "percent" | "amount";
  downPaymentValue: number;
}

export interface InstallmentsPreviewResponse {
  ok: boolean;
  currency: CurrencyCode;
  total: number; // MAJOR
  downPayment: number; // MAJOR
  installments: number[]; // MAJOR
  plan: InstallmentPlan;
}

/** POST /api/billing/installments/payment-setup */
export interface InstallmentsPaymentSetupRequest {
  user: { id: string; email: string; name: string };
  quoteId: string; // Quote ID from price preview response
}
export interface InstallmentsPaymentSetupResponse {
  customerId: string;
  paymentIntentClientSecret?: string;
  setupIntentClientSecret?: string;
  intentType: "payment_intent" | "setup_intent" | "both";
  paymentIntentId?: string;
  setupIntentId?: string;
  total: number;
  downPayment: number;
  installments: number[];
  currency?: CurrencyCode;
}

/** POST /api/billing/installments/create-schedule */
export interface InstallmentsCreateScheduleRequest {
  setupIntentId: string;
  quoteId: string;
}

export interface InstallmentsCreateScheduleResponse {
  ok: true;
  scheduleId: string;
  planId: string;
  status: "active" | "inactive" | "cancelled";
  currency: CurrencyCode;
  total: number;
  downPayment: number;
  installments: number[];
  stripeProductId?: string;
  stripePriceIds?: string[];
}

// Backwards-compatible aliases
export type InstallmentsStartRequest = InstallmentsPaymentSetupRequest;
export type InstallmentsStartResponse = InstallmentsPaymentSetupResponse;
export type InstallmentsConfirmRequest = InstallmentsCreateScheduleRequest;
export type InstallmentsConfirmResponse = InstallmentsCreateScheduleResponse;

/** POST /api/billing/subscriptions/payment-setup */
export interface SubscriptionPaymentSetupRequest {
  user: { id: string; email: string; name: string };
  quoteId: string;
  setupIntentId?: string;
  paymentMethodId?: string;
}

export interface SubscriptionPaymentSetupResponse {
  subscriptionId?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  paymentIntentClientSecret?: string; // PaymentIntent client_secret (for immediate charge if any)
  setupIntentClientSecret?: string; // SetupIntent client_secret (for recurring subscription)
  intentType?: "payment_intent" | "setup_intent" | "both"; // Type of intent(s) returned
  invoiceTotal?: number; // Total invoice amount in major units
}

/** POST /api/billing/installments/early-payoff */
export interface EarlyPayoffRequest {
  scheduleId: string;
}
export interface EarlyPayoffResponse {
  ok: true;
  invoiceId: string;
  amountPaid: number; // MAJOR
  currency: CurrencyCode;
}

/** POST /api/billing/installments/plan-status */
export interface InstallmentsPlanStatusRequest {
  scheduleId: string;
}

export interface InstallmentsPlanStatusResponse {
  ok: true;
  scheduleId: string;
  planId: string;
  status: "active" | "inactive" | "cancelled";
  totals: {
    currency: CurrencyCode;
    total: number;
    downPayment: number;
    amountPaid: number;
    amountRemaining: number;
  };
  installments: {
    count: number;
    amounts: number[];
    successfulCharges: number;
    failedCharges: number;
  };
  earlyPayoff: {
    allowed: boolean;
    used: boolean;
    at?: string;
    invoiceId?: string;
  };
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}


/* ------------------------------------------------------------------ */
/* Payment method (replace any[])                                     */
/* ------------------------------------------------------------------ */

export interface SavedPaymentMethod {
  id: string;
  type: "card" | "bank_account" | string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault?: boolean;
  /** Provider-specific fields */
  [k: string]: unknown;
}
