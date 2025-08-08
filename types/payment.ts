export interface PaymentIntent {
  _id: string;
  userId: string;
  productId: string;
  amount: number; // in cents
  currency: string;
  productType: string;
  bookingService: string;
  platformRole: string;
  transactionId: string;
  profileId?: string;
  isSession: boolean;
  isClassroom: boolean;
  customerId?: string;
  stripePaymentIntentId?: string;
  status: "pending" | "processing" | "succeeded" | "failed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  userId: string;
  provider: "stripe" | "flutterwave" | "paystack";
  transactionId: string;
  amount: number;
  status: "pending" | "success" | "failed";
  currency: string;
  productId: string;
  jobApplicationId?: string;
  bookingId?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  couponCode?: string;
  clientSecret?: string;
  metadata: Record<string, any>;
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
  profileId?: string;
  isSession: boolean;
  isClassroom: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentWebhook {
  id: string;
  object: string;
  type: string;
  data: {
    object: {
      id: string;
      object: string;
      amount: number;
      currency: string;
      status: string;
      payment_intent?: string;
      charge?: string;
      customer?: string;
      metadata?: Record<string, any>;
    };
  };
  created: number;
}

export interface PaymentRefund {
  _id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: "pending" | "succeeded" | "failed";
  stripeRefundId?: string;
  createdAt: Date;
  processedAt?: Date;
}

// Payment creation request - Updated to match new API spec
export interface CreatePaymentIntentRequest {
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
  profileId?: string;
  isSession: boolean;
  isClassroom: boolean;
  customerId?: string;
}

// Payment response
export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    paymentIntentId: string;
    clientSecret?: string;
    redirectUrl?: string;
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
  status?: "all" | "pending" | "success" | "failed";
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

// Update payment request
export interface UpdatePaymentRequest {
  status?: "pending" | "success" | "failed";
  receiptUrl?: string;
  webhookReceived?: boolean;
}
