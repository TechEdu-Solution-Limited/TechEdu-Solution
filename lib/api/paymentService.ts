import { postApiRequest, getApiRequest, putApiRequest } from "../apiFetch";
import type {
  PaymentIntent,
  Payment,
  CreatePaymentIntentRequest,
  PaymentResponse,
  PaymentRefund,
  ApiResponse,
  PaymentsResponse,
  PaymentFilters,
  UpdatePaymentRequest,
} from "@/types";

export class PaymentService {
  private static baseUrl = "/api/payments";

  /**
   * Create a payment intent
   */
  static async createPaymentIntent(
    data: CreatePaymentIntentRequest,
    token: string
  ): Promise<ApiResponse<PaymentResponse>> {
    console.log("Creating payment intent with data:", data);
    console.log("Using token:", token ? "Token present" : "No token");

    const response = await postApiRequest(
      `${this.baseUrl}/create-intent`,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Payment intent response:", response);
    return response;
  }

  /**
   * Get payment intent by ID
   */
  static async getPaymentIntent(
    paymentIntentId: string,
    token: string
  ): Promise<ApiResponse<PaymentIntent>> {
    return getApiRequest(`${this.baseUrl}/intent/${paymentIntentId}`, token);
  }

  /**
   * Confirm payment intent
   */
  static async confirmPaymentIntent(
    paymentIntentId: string,
    token: string
  ): Promise<ApiResponse<PaymentResponse>> {
    return postApiRequest(
      `${this.baseUrl}/intent/${paymentIntentId}/confirm`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Cancel payment intent
   */
  static async cancelPaymentIntent(
    paymentIntentId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/intent/${paymentIntentId}/cancel`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Get payment by ID
   */
  static async getPayment(
    paymentId: string,
    token: string
  ): Promise<ApiResponse<Payment>> {
    return getApiRequest(`${this.baseUrl}/${paymentId}`, token);
  }

  /**
   * Get user's payment history with filters
   */
  static async getUserPayments(
    token: string,
    filters?: PaymentFilters
  ): Promise<ApiResponse<PaymentsResponse>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.baseUrl}/my-payments?${queryString}`
      : `${this.baseUrl}/my-payments`;

    return getApiRequest(url, token);
  }

  /**
   * Update payment status
   */
  static async updatePayment(
    paymentId: string,
    data: UpdatePaymentRequest,
    token: string
  ): Promise<ApiResponse<Payment>> {
    return putApiRequest(`${this.baseUrl}/${paymentId}`, data, token);
  }

  /**
   * Get payment statistics
   */
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
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.baseUrl}/stats?${queryString}`
      : `${this.baseUrl}/stats`;
    return getApiRequest(url, token);
  }

  /**
   * Process webhook
   */
  static async processWebhook(
    webhookData: any
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(`${this.baseUrl}/webhook`, webhookData);
  }

  /**
   * Create refund
   */
  static async createRefund(
    paymentId: string,
    data: {
      amount: number;
      reason: string;
    },
    token: string
  ): Promise<ApiResponse<PaymentRefund>> {
    return postApiRequest(`${this.baseUrl}/${paymentId}/refund`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get refund by ID
   */
  static async getRefund(
    refundId: string,
    token: string
  ): Promise<ApiResponse<PaymentRefund>> {
    return getApiRequest(`${this.baseUrl}/refunds/${refundId}`, token);
  }

  /**
   * Get payment refunds
   */
  static async getPaymentRefunds(
    paymentId: string,
    token: string
  ): Promise<ApiResponse<PaymentRefund[]>> {
    return getApiRequest(`${this.baseUrl}/${paymentId}/refunds`, token);
  }

  /**
   * Get payment methods
   */
  static async getPaymentMethods(token: string): Promise<
    ApiResponse<{
      paymentMethods: any[];
      defaultMethod?: any;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/payment-methods`, token);
  }

  /**
   * Add payment method
   */
  static async addPaymentMethod(
    data: {
      paymentMethodId: string;
      isDefault?: boolean;
    },
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(`${this.baseUrl}/payment-methods`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Remove payment method
   */
  static async removePaymentMethod(
    paymentMethodId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/payment-methods/${paymentMethodId}/remove`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Set default payment method
   */
  static async setDefaultPaymentMethod(
    paymentMethodId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/payment-methods/${paymentMethodId}/default`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Get payment analytics
   */
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
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.baseUrl}/analytics?${queryString}`
      : `${this.baseUrl}/analytics`;
    return getApiRequest(url, token);
  }

  /**
   * Export payments
   */
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
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.baseUrl}/export?${queryString}`
      : `${this.baseUrl}/export`;
    return getApiRequest(url, token);
  }
}
