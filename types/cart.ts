// /types/cart.ts

export interface CartItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  discountPercentage: number;
  category: string;
  productType: string;
  image: string;
  duration: string;
  certificate: boolean;
  status: string;
  level: string;
  requiresBooking?: boolean;

  // Product details for booking
  deliveryMode?: string;
  sessionType?: string;
  isRecurring?: boolean;
  programLength?: number;
  mode?: string;
  durationInMinutes?: number;
  minutesPerSession?: number;
  hasClassroom?: boolean;
  hasSession?: boolean;
  hasAssessment?: boolean;
  hasCertificate?: boolean;
  requiresEnrollment?: boolean;
  isBookableService?: boolean;
  isAttachmentRequired?: boolean;
  instructorId?: string;
  instructorName?: string;
  virtualPlatform?: string;
  classroomCapacity?: number;
  classroomRequirements?: string[];

  // Booking details for bookable services
  bookingDetails?: {
    fullName: string;
    email: string;
    phone: string;
    preferredDate?: Date;
    preferredTime?: string;
    numberOfParticipants?: number;
    participantType?: string;
    userNotes?: string;
    bookingData?: any;
    bookingId: string;
  };

  pricing?: {
    model: "one_time" | "subscription";
    priceBasis?: "flat" | "per_unit";
    unitName?: "person" | "team";
    currency?: string;
    allowQuantity?: boolean;
    taxInclusive?: boolean;
    basePrice?: number; // major
    tierType?: "volume" | "stairstep";
    tiers?: Array<{
      upTo: number;
      unitPrice: number;
    }>;
    minQty?: number;
    maxQty?: number;
    installments?: {
      enabled: boolean;
      interval?: "day" | "week" | "month" | "year";
      intervalCount?: number;
      downPaymentType?: "percent" | "amount";
      downPaymentValue?: number;
      count?: number;
      allowEarlyPayoff?: boolean;
    };
    autoRenew?: boolean;

    // subscription fields used in checkout
    subscriptionPrice?: number;
    interval?: "day" | "week" | "month" | "year";
    intervalCount?: number;
    trialDays?: number;
    setupFee?: number;
    proration?: boolean;
    vatPercentage?: number;
    discountPercentage?: number;
  };
}

/* -------- Price preview from server -------- */
export type SubscriptionPreviewDetails = {
  price: number;
  interval: string;
  intervalCount: number;
  trialDays: number;
  setupFee: number;
  autoRenew: boolean;
  minTermMonths: number;
  proration: boolean;
};

export type PricePreview = {
  ok?: boolean;
  currency: string;
  quantity: number;
  subtotal: number;
  vat: number;
  total: number;
  unitPrice?: number;
  model?: string; // "one_time" | "subscription"
  tierType?: string;
  quoteId?: string; // Quote ID from price-preview response
  subscription?: SubscriptionPreviewDetails;
};

export type BillingChoice = "pay_in_full" | "installments" | "subscription";
