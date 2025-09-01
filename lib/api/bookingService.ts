import {
  postApiRequest,
  getApiRequest,
  deleteApiRequest,
  putApiRequest,
} from "../apiFetch";
import type {
  Booking,
  BookingRequest,
  BookingResponse,
  Instructor,
  InstructorAvailability,
  ServiceCategory,
  ServiceLevel,
  ApiResponse,
  RescheduleRequest,
  RescheduleRequestResponse,
  CreateRescheduleRequestData,
} from "@/types";

export class BookingService {
  private static baseUrl = "/api/academic-services";

  /**
   * Create a new booking
   */
  static async createBooking(
    data: BookingRequest,
    token: string
  ): Promise<ApiResponse<BookingResponse>> {
    return postApiRequest(`${this.baseUrl}/bookings`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get user's bookings
   */
  static async getUserBookings(
    token: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<
    ApiResponse<{
      bookings: Booking[];
      totalCount: number;
      totalPages: number;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/bookings/my`, token, params);
  }

  /**
   * Get booking by ID
   */
  static async getBooking(
    bookingId: string,
    token: string
  ): Promise<ApiResponse<Booking>> {
    return getApiRequest(`${this.baseUrl}/bookings/${bookingId}`, token);
  }

  /**
   * Update booking
   */
  static async updateBooking(
    bookingId: string,
    data: Partial<BookingRequest>,
    token: string
  ): Promise<ApiResponse<BookingResponse>> {
    return postApiRequest(`${this.baseUrl}/bookings/${bookingId}`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(
    bookingId: string,
    token: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    const data = reason ? { cancellationReason: reason } : {};
    return postApiRequest(
      `${this.baseUrl}/bookings/${bookingId}/cancel`,
      data,
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Reschedule booking
   */
  static async rescheduleBooking(
    bookingId: string,
    newDate: string,
    token: string
  ): Promise<ApiResponse<BookingResponse>> {
    return postApiRequest(
      `${this.baseUrl}/bookings/${bookingId}/reschedule`,
      { scheduledDate: newDate },
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Create a reschedule request
   */
  static async createRescheduleRequest(
    data: CreateRescheduleRequestData,
    token: string
  ): Promise<ApiResponse<RescheduleRequestResponse>> {
    return postApiRequest(`${this.baseUrl}/reschedule`, data, {
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Reject a reschedule request
   */
  static async rejectRescheduleRequest(
    rescheduleId: string,
    token: string,
    reason?: string
  ): Promise<ApiResponse<RescheduleRequestResponse>> {
    return putApiRequest(
      `${this.baseUrl}/reschedule/${rescheduleId}/reject`,
      { reason },
      token
    );
  }

  /**
   * Approve a reschedule request
   */
  static async approveRescheduleRequest(
    rescheduleId: string,
    token: string
  ): Promise<ApiResponse<RescheduleRequestResponse>> {
    return putApiRequest(
      `${this.baseUrl}/reschedule/${rescheduleId}/approve`,
      {},
      token
    );
  }

  /**
   * Get reschedule request by ID
   */
  static async getRescheduleRequest(
    rescheduleId: string,
    token: string
  ): Promise<ApiResponse<RescheduleRequestResponse>> {
    return getApiRequest(`${this.baseUrl}/reschedule/${rescheduleId}`, token);
  }

  /**
   * Get all reschedule requests for a user
   */
  static async getUserRescheduleRequests(
    token: string,
    params?: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<
    ApiResponse<{
      requests: RescheduleRequest[];
      totalCount: number;
      totalPages: number;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/reschedule`, token, params);
  }

  /**
   * Get reschedule requests for an instructor
   */
  static async getInstructorRescheduleRequests(
    instructorId: string,
    token: string,
    params?: {
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<
    ApiResponse<{
      requests: RescheduleRequest[];
      totalCount: number;
      totalPages: number;
    }>
  > {
    return getApiRequest(
      `${this.baseUrl}/instructors/${instructorId}/reschedule-requests`,
      token,
      params
    );
  }

  /**
   * Get available instructors
   */
  static async getInstructors(params?: {
    specialization?: string;
    availability?: string;
    rating?: number;
  }): Promise<ApiResponse<Instructor[]>> {
    return getApiRequest(`${this.baseUrl}/instructors`, undefined, params);
  }

  /**
   * Get instructor by ID
   */
  static async getInstructor(
    instructorId: string
  ): Promise<ApiResponse<Instructor>> {
    return getApiRequest(`${this.baseUrl}/instructors/${instructorId}`);
  }

  /**
   * Get instructor availability
   */
  static async getInstructorAvailability(
    instructorId: string,
    date: string
  ): Promise<ApiResponse<InstructorAvailability>> {
    return getApiRequest(
      `${this.baseUrl}/instructors/${instructorId}/availability`,
      undefined,
      { date }
    );
  }

  /**
   * Get instructor schedule
   */
  static async getInstructorSchedule(
    instructorId: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<
    ApiResponse<{
      schedule: any[];
      totalBookings: number;
    }>
  > {
    return getApiRequest(
      `${this.baseUrl}/instructors/${instructorId}/schedule`,
      undefined,
      params
    );
  }

  /**
   * Get service categories
   */
  static async getServiceCategories(
    productType?: string
  ): Promise<ApiResponse<ServiceCategory[]>> {
    const params = productType ? { productType } : undefined;
    return getApiRequest(`${this.baseUrl}/categories`, undefined, params);
  }

  /**
   * Get service levels
   */
  static async getServiceLevels(): Promise<ApiResponse<ServiceLevel[]>> {
    return getApiRequest(`${this.baseUrl}/levels`);
  }

  /**
   * Get available time slots
   */
  static async getAvailableTimeSlots(params: {
    instructorId?: string;
    serviceId: string;
    date: string;
    duration?: number;
  }): Promise<
    ApiResponse<{
      timeSlots: {
        startTime: string;
        endTime: string;
        isAvailable: boolean;
      }[];
    }>
  > {
    return getApiRequest(`${this.baseUrl}/available-slots`, undefined, params);
  }

  /**
   * Get booking statistics
   */
  static async getBookingStats(
    token: string,
    params?: {
      startDate?: string;
      endDate?: string;
      instructorId?: string;
    }
  ): Promise<
    ApiResponse<{
      totalBookings: number;
      completedBookings: number;
      cancelledBookings: number;
      averageRating: number;
      totalRevenue: number;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/bookings/stats`, token, params);
  }

  /**
   * Get instructor bookings (for instructors)
   */
  static async getInstructorBookings(
    token: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      date?: string;
    }
  ): Promise<
    ApiResponse<{
      bookings: Booking[];
      totalCount: number;
      totalPages: number;
    }>
  > {
    return getApiRequest(`${this.baseUrl}/instructors/bookings`, token, params);
  }

  /**
   * Update instructor availability
   */
  static async updateInstructorAvailability(
    instructorId: string,
    data: {
      date: string;
      timeSlots: {
        startTime: string;
        endTime: string;
        isAvailable: boolean;
      }[];
    },
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/instructors/${instructorId}/availability`,
      data,
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Get booking calendar
   */
  static async getBookingCalendar(
    token: string,
    params?: {
      startDate?: string;
      endDate?: string;
      instructorId?: string;
    }
  ): Promise<
    ApiResponse<{
      calendar: any[];
      events: any[];
    }>
  > {
    return getApiRequest(`${this.baseUrl}/bookings/calendar`, token, params);
  }

  /**
   * Send booking reminder
   */
  static async sendBookingReminder(
    bookingId: string,
    token: string
  ): Promise<ApiResponse<{ message: string }>> {
    return postApiRequest(
      `${this.baseUrl}/bookings/${bookingId}/reminder`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  /**
   * Get booking analytics (admin only)
   */
  static async getBookingAnalytics(
    token: string,
    params?: {
      startDate?: string;
      endDate?: string;
      instructorId?: string;
      serviceId?: string;
    }
  ): Promise<
    ApiResponse<{
      totalBookings: number;
      totalRevenue: number;
      averageBookingValue: number;
      popularServices: any[];
      bookingTrends: any[];
      instructorPerformance: any[];
    }>
  > {
    return getApiRequest(`${this.baseUrl}/bookings/analytics`, token, params);
  }
}
