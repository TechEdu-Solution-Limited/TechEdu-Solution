// /lib/api/paymentService.ts
import { ApiResponse } from "@/types";
import { postApiRequest, getApiRequest, putApiRequest } from "../apiFetch";
import type {
  PaymentIntent,
  Payment,
  PaymentRefund,
  PaymentsResponse,
  PaymentFilters,
  PaymentResponse,
  UpdatePaymentRequest,
  CreatePaymentIntentRequest,
  SimplePaymentIntentRequest,
  PricePreviewResponse,
  InstallmentsPreviewResponse,
  InstallmentsStartRequest,
  InstallmentsStartResponse,
  InstallmentsConfirmRequest,
  InstallmentsConfirmResponse,
  SubscriptionConfirmRequest,
  SubscriptionConfirmResponse,
  EarlyPayoffRequest,
  EarlyPayoffResponse,
  SavedPaymentMethod,
} from "@/types/payment";
import safeConsole from "../console";
import { toMinor } from "../constants/currency";
import { PriceModel } from "../constants/pricing";

export class PaymentService {
  /* -------------------------------------------------------------- *
   * Helpers
   * -------------------------------------------------------------- */

  /** Build query string with sane defaults: skip null/undefined, "", "all"; repeat keys for arrays */
  private static buildQuery(params?: Record<string, unknown>) {
    if (!params) return "";
    const qp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      if (v === "" || v === "all") continue;

      if (Array.isArray(v)) {
        if (v.length === 0) continue;
        v.forEach((item) => qp.append(k, String(item)));
        continue;
      }
      qp.append(k, String(v));
    }
    const s = qp.toString();
    return s ? `?${s}` : "";
  }

  /* -------------------------------------------------------------- *
   * Payment Intents (existing)
   * -------------------------------------------------------------- */

  static async createPaymentIntent(
    data: CreatePaymentIntentRequest,
    token: string
  ): Promise<ApiResponse<PaymentResponse>> {
    // NOTE: data.amount expected in MINOR units (backend/Stripe aligned)
    return postApiRequest(`/api/payments/create-intent`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Safer "simple" PI: caller supplies MAJOR, we convert to MINOR correctly for any currency exponent.
   */
  static async createSimplePaymentIntent(
    data: SimplePaymentIntentRequest,
    amountMajor: number,
    currency: string,
    token: string
  ): Promise<ApiResponse<PaymentResponse>> {
    // sanitize payload thoroughly
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => {
        if (v === undefined || v === null) return false;
        if (typeof v === "string" && v.trim() === "") return false;
        if (Array.isArray(v) && v.length === 0) return false;
        if (typeof v === "number" && !Number.isFinite(v)) return false;
        return true;
      })
    );

    const amount = toMinor(amountMajor, currency);
    const payload = { ...filteredData, amount, currency };

    // Log summary only (no secrets / clientSecret)
    safeConsole.log("🔍 [PaymentService] Creating Payment Intent", {
      endpoint: "/api/payments/create-intent",
      payload: {
        amount,
        currency,
        ...((payload as any).productId && {
          productId: (payload as any).productId,
        }),
        ...((payload as any).isTeam && { isTeam: (payload as any).isTeam }),
        ...((payload as any).participantType && {
          participantType: (payload as any).participantType,
        }),
        ...((payload as any).numberOfExpectedParticipants && {
          numberOfExpectedParticipants: (payload as any)
            .numberOfExpectedParticipants,
        }),
      },
      hasToken: !!token,
    });

    const response = await postApiRequest(
      `/api/payments/create-intent`,
      payload,
      { Authorization: `Bearer ${token}` }
    );

    safeConsole.log("🔍 [PaymentService] Payment Intent API Response", {
      status: response?.status,
      hasData: !!response?.data,
      dataKeys: response?.data ? Object.keys(response.data) : [],
    });

    return response;
  }

  static async getPaymentIntent(
    paymentIntentId: string,
    token: string
  ): Promise<ApiResponse<PaymentIntent>> {
    return getApiRequest(`/api/payments/intent/${paymentIntentId}`, token);
  }

  static async confirmPaymentIntent(
    paymentIntentId: string,
    token: string
  ): Promise<ApiResponse<PaymentResponse>> {
    return postApiRequest(
      `/api/payments/intent/${paymentIntentId}/confirm`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  static async cancelPaymentIntent(
    paymentIntentId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `/api/payments/intent/${paymentIntentId}/cancel`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  static async getPayment(
    paymentId: string,
    token: string
  ): Promise<ApiResponse<Payment>> {
    return getApiRequest(`/api/payments/${paymentId}`, token);
  }

  static async getUserPayments(
    token: string,
    filters?: PaymentFilters
  ): Promise<ApiResponse<PaymentsResponse>> {
    const query = this.buildQuery(filters as any);
    return getApiRequest(`/api/payments/my-payments${query}`, token);
  }

  static async updatePayment(
    paymentId: string,
    data: UpdatePaymentRequest,
    token: string
  ): Promise<ApiResponse<Payment>> {
    return putApiRequest(`/api/payments/${paymentId}`, data, token);
  }

  static async getPaymentStats(
    token: string,
    params?: {
      startDate?: string;
      endDate?: string;
      productType?: string;
      platformRole?: string;
    }
  ): Promise<
    ApiResponse<{
      totalPayments: number;
      totalAmount: number;
      successfulPayments: number;
      failedPayments: number;
      averageAmount: number;
      currency: string;
    }>
  > {
    const query = this.buildQuery(params);
    return getApiRequest(`/api/payments/stats${query}`, token);
  }

  static async processWebhook(
    webhookData: any
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(`/api/payments/webhook`, webhookData);
  }

  static async createRefund(
    paymentId: string,
    data: { amount: number; reason: string },
    token: string
  ): Promise<ApiResponse<PaymentRefund>> {
    return postApiRequest(`/api/payments/${paymentId}/refund`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  static async getRefund(
    refundId: string,
    token: string
  ): Promise<ApiResponse<PaymentRefund>> {
    return getApiRequest(`/api/payments/refunds/${refundId}`, token);
  }

  static async getPaymentRefunds(
    paymentId: string,
    token: string
  ): Promise<ApiResponse<PaymentRefund[]>> {
    return getApiRequest(`/api/payments/${paymentId}/refunds`, token);
  }

  static async getPaymentMethods(token: string): Promise<
    ApiResponse<{
      paymentMethods: SavedPaymentMethod[];
      defaultMethod?: SavedPaymentMethod;
    }>
  > {
    return getApiRequest(`/api/payments/payment-methods`, token);
  }

  static async addPaymentMethod(
    data: { paymentMethodId: string; isDefault?: boolean },
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(`/api/payments/payment-methods`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  static async removePaymentMethod(
    paymentMethodId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `/api/payments/payment-methods/${paymentMethodId}/remove`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  static async setDefaultPaymentMethod(
    paymentMethodId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `/api/payments/payment-methods/${paymentMethodId}/default`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  static async getPaymentAnalytics(
    token: string,
    params?: {
      startDate?: string;
      endDate?: string;
      productType?: string;
      platformRole?: string;
    }
  ): Promise<
    ApiResponse<{
      totalRevenue: number;
      totalTransactions: number;
      averageTransactionValue: number;
      successRate: number;
      refundRate: number;
      revenueByProductType: any[];
      revenueByMonth: any[];
      topProducts: any[];
    }>
  > {
    const query = this.buildQuery(params);
    return getApiRequest(`/api/payments/analytics${query}`, token);
  }

  static async exportPayments(
    token: string,
    params?: {
      startDate?: string;
      endDate?: string;
      productType?: string;
      status?: string;
      format?: "csv" | "excel";
    }
  ): Promise<ApiResponse<{ downloadUrl: string }>> {
    const query = this.buildQuery(params);
    return getApiRequest(`/api/payments/export${query}`, token);
  }

  /* -------------------------------------------------------------- *
   * NEW: Pricing previews
   * -------------------------------------------------------------- */

  // POST /api/payment/price-preview per new flow
  static async postPricePreview(
    payload: {
      productId: string;
      quantity: number;
      unitName?: "person" | "team";
    },
    token?: string
  ): Promise<ApiResponse<any>> {
    return postApiRequest(`/api/payments/price-preview`, payload, {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  // No separate GET installments preview in the new flow

  /* -------------------------------------------------------------- *
   * NEW: Installments and Subscriptions lifecycle (Stripe SetupIntent + Schedule)
   * -------------------------------------------------------------- */

  static async startInstallmentsSetup(
    payload: InstallmentsStartRequest,
    token: string
  ): Promise<ApiResponse<InstallmentsStartResponse>> {
    return postApiRequest(`/api/billing/installments/start`, payload, {
      Authorization: `Bearer ${token}`,
    });
  }

  static async confirmInstallments(
    payload: InstallmentsConfirmRequest,
    token: string
  ): Promise<ApiResponse<InstallmentsConfirmResponse>> {
    return postApiRequest(`/api/billing/installments/confirm`, payload, {
      Authorization: `Bearer ${token}`,
    });
  }

  static async confirmSubscription(
    payload: SubscriptionConfirmRequest,
    token: string
  ): Promise<ApiResponse<SubscriptionConfirmResponse>> {
    return postApiRequest(`/api/billing/subscriptions/confirm`, payload, {
      Authorization: `Bearer ${token}`,
    });
  }

  static async earlyPayoff(
    payload: EarlyPayoffRequest,
    token: string
  ): Promise<ApiResponse<EarlyPayoffResponse>> {
    return postApiRequest(`/api/billing/installments/early-payoff`, payload, {
      Authorization: `Bearer ${token}`,
    });
  }
}
