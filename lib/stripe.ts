import { loadStripe } from "@stripe/stripe-js";

// Client-side Stripe instance
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  {
    stripeAccount: process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID,
  }
);

export interface CreateCheckoutSessionData {
  items: Array<{
    id: number;
    title: string;
    price: number;
    image: string;
  }>;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

// Payment intent creation interface
export interface CreatePaymentIntentData {
  amount: number;
  currency: string;
  productId: string;
  productType: string;
  bookingService: string;
  platformRole: string;
}

// Payment intent response interface
export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  data?: {
    paymentIntentId: string;
    clientSecret: string;
    redirectUrl?: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
