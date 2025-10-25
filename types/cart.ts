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
  isAttachmentRequired?: boolean; // New field to indicate if attachments are required
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
    model: "one_time" | "subscription"; // add other variants later if you introduce them
    currency?: string;
    allowQuantity?: boolean;
    taxInclusive?: boolean;
    basePrice?: number; // major units
    tierType?: "none" | "volume" | "graduated";
    minQty?: number;
    maxQty?: number;
    installments?: {
      enabled: boolean;
      interval?: "day" | "week" | "month" | "year";
      intervalCount?: number;
      downPaymentType?: "none" | "percent" | "amount";
      downPaymentValue?: number;
      count?: number; // number of installments
      allowEarlyPayoff?: boolean;
    };
    autoRenew?: boolean;
  };
}

/* ---------------------------- Types ----------------------------- */
export type PricePreview = {
  ok?: boolean;
  currency: string;
  quantity: number;
  subtotal: number;
  vat: number;
  total: number;
  unitPrice?: number;
  model?: string; // "per_unit" | "subscription" | ...
  tierType?: string;
};
export type BillingChoice = "pay_in_full" | "installments" | "subscription";
