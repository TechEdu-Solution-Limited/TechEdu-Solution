import { toast } from "react-toastify";
import {
  getTokenFromCookies,
  saveTokenToCookies,
  getCookie,
  setCookie,
  deleteTokenFromCookies,
  deleteRefreshTokenFromCookies,
} from "@/lib/cookies";
import { getDeviceInfo } from "@/utils/getDeviceInfo";

/**
 * Base URL for API requests. For Next.js API routes, we use relative URLs
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Empty string for relative URLs to Next.js API routes

/**
 * Generic API response type
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * API error type
 */
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  detail?: string;
}

/**
 * User registration data type
 */
export interface UserRegistrationData {
  fullName?: string;
  email: string;
  password: string;
  role: string;
}

/**
 * User update data type
 */
export interface UserUpdateData {
  email?: string;
  password?: string;
  role?: string;
  // Add other fields as needed
}

/**
 * Login user
 */
export interface UserLoginData {
  email: string;
  password: string;
}

/**
 * Helper to create headers for API requests
 */
const createHeaders = (
  token?: string,
  extraHeaders: Record<string, string> = {}
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

/**
 * Generic API request function
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: Record<string, any>,
  token?: string,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  const requestHeaders = createHeaders(token, headers);
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    body: method !== "GET" && body ? JSON.stringify(body) : undefined,
  };
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const responseText = await response.text();
    const data = isJson && responseText ? JSON.parse(responseText) : {};

    if (!response.ok) {
      // Throw the entire backend error object if available
      throw data;
    }

    return { data, status: response.status, message: data.message };
  } catch (error: any) {
    // If error is already an object from backend, just throw it
    if (error && typeof error === "object") {
      throw error;
    }
    // Otherwise, throw a generic error
    throw {
      message: error.message || "Network error occurred",
      status: error.status || 0,
    };
  }
};

// Convenience helpers
export const getApiRequest = async <T = any>(
  endpoint: string,
  token?: string,
  params?: Record<string, string | number | boolean>
): Promise<ApiResponse<T>> => {
  let url = endpoint;
  if (params) {
    const search = new URLSearchParams(params as any).toString();
    url += (endpoint.includes("?") ? "&" : "?") + search;
  }
  return apiRequest<T>(url, "GET", undefined, token);
};

export const postApiRequest = async <T = any>(
  endpoint: string,
  bodyOrToken: Record<string, any> | string,
  headersOrBody?: Record<string, any> | Record<string, string>
): Promise<ApiResponse<T>> => {
  // Check if the second parameter is a token string
  if (typeof bodyOrToken === "string") {
    // Pattern: postApiRequest(endpoint, token, body)
    const token = bodyOrToken;
    const body = (headersOrBody as Record<string, any>) || {};
    return apiRequest<T>(endpoint, "POST", body, token);
  } else {
    // Pattern: postApiRequest(endpoint, body, headers)
    const body = bodyOrToken;
    const headers = (headersOrBody as Record<string, string>) || {};
    return apiRequest<T>(endpoint, "POST", body, undefined, headers);
  }
};

export const updateApiRequest = async <T = any>(
  endpoint: string,
  token: string,
  data: any
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, "PUT", data, token);
};

export const deleteApiRequest = async <T = any>(
  endpoint: string,
  token: string
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, "DELETE", undefined, token);
};

export const putApiRequest = async <T = any>(
  endpoint: string,
  data: any,
  token: string
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, "PUT", data, token);
};

export const patchApiRequest = async <T = any>(
  endpoint: string,
  token: string,
  data: any
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, "PATCH", data, token);
};

/**
 * Register a new user
 */
export const registerUser = async (
  formData: UserRegistrationData
): Promise<ApiResponse<any>> => {
  return postApiRequest("/api/auth/register", formData);
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<ApiResponse<any>> => {
  return postApiRequest("/api/auth/verify-email", { token });
};

/**
 * Login user
 */
export const loginUser = async (
  formData: UserLoginData
): Promise<ApiResponse<any>> => {
  return postApiRequest("/api/auth/login", formData);
};

/**
 * Update user profile
 */
export const updateUser = async (
  userId: string,
  formData: UserUpdateData,
  token: string
): Promise<ApiResponse<any>> => {
  return updateApiRequest(`/api/users/${userId}/`, token, formData);
};

/**
 * Get paginated data with search support
 */
export const getAllApiRequestWithPagination = async <T = any>(
  endpoint: string,
  pageSize: number,
  pageNo: number,
  token?: string,
  searchQuery = ""
): Promise<ApiResponse<T>> => {
  const params = new URLSearchParams({
    page_size: String(pageSize),
    page: String(pageNo),
  });
  if (searchQuery) params.append("q", searchQuery);
  const paginatedEndpoint = `${endpoint}?${params.toString()}`;
  return apiRequest<T>(paginatedEndpoint, "GET", undefined, token);
};

/**
 * Forgot password - send reset email
 */
export const forgotPassword = async (
  email: string
): Promise<ApiResponse<any>> => {
  return postApiRequest("/api/auth/forgot-password", { email });
};

/**
 * Reset password with new password
 */
export const resetPassword = async (
  password: string
): Promise<ApiResponse<any>> => {
  return postApiRequest("/api/auth/reset-password", { password });
};

/**
 * Get single user-me
 */
export const getUserMe = async (token: string): Promise<ApiResponse<any>> => {
  return getApiRequest("/api/user/me", token);
};

/**
 * Logout user (with metadata)
 */
export const logoutUser = async (): Promise<ApiResponse<any>> => {
  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  const requestBody = {
    reason: "user_initiated",
    deviceInfo: getDeviceInfo(),
    location: "New York, NY, USA", // Replace with real location if you implement IP-based lookup
    accessToken,
    refreshToken,
  };

  try {
    const response = await postApiRequest("/api/auth/logout", requestBody);
    return response;
  } catch (error) {
    throw error;
  } finally {
    deleteTokenFromCookies(); // Always clear cookies on logout
    deleteRefreshTokenFromCookies();
  }
};

/**
 * Change user password
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<ApiResponse<any>> => {
  return postApiRequest("/api/user/change-password", {
    oldPassword,
    newPassword,
  });
};

/**
 * Update onboardingStatus
 */
export const updateOnboardingStatus = async (
  userId: string,
  status: string,
  token: string
) => {
  const response = await apiRequest(
    `/api/onboarding/${userId}/status`,
    "PATCH",
    { status: "completed" },
    token || ""
  );
  return response.data;
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (
  email: string
): Promise<ApiResponse<any>> => {
  return postApiRequest("/api/auth/resend-verification", { email });
};

/**
 * Check if JWT token is valid (for silent re-auth)
 */
export const checkTokenValidity = async (
  token: string
): Promise<ApiResponse<any>> => {
  return getApiRequest("/api/auth/check-token", token);
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<ApiResponse<any>> => {
  return postApiRequest("/api/auth/refresh-token", { refreshToken });
};

/**
 * Enhanced API request with automatic token refresh
 */
export const apiRequestWithRefresh = async <T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  body?: any,
  token?: string,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    // First attempt with current token
    const response = await apiRequest<T>(
      endpoint,
      method,
      body,
      token,
      headers
    );
    return response;
  } catch (error: any) {
    // If token is expired (401), try to refresh
    if (error.status === 401 && token) {
      try {
        const refreshToken = getCookie("refreshToken");
        if (refreshToken) {
          const refreshResponse = await refreshAccessToken(refreshToken);

          if (refreshResponse.data && refreshResponse.data.data) {
            const newAccessToken = refreshResponse.data.data.access_token;
            const newRefreshToken = refreshResponse.data.data.refresh_token;

            // Save new tokens
            saveTokenToCookies(newAccessToken);
            if (newRefreshToken) {
              setCookie("refreshToken", newRefreshToken, {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });
            }

            // Retry the original request with new token
            return await apiRequest<T>(
              endpoint,
              method,
              body,
              newAccessToken,
              headers
            );
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // If refresh fails, clear tokens and throw original error
        throw error;
      }
    }

    // Re-throw the original error if not 401 or refresh failed
    throw error;
  }
};

/**
 * Enhanced GET request with automatic token refresh
 */
export const getApiRequestWithRefresh = async <T = any>(
  endpoint: string,
  token?: string
): Promise<ApiResponse<T>> => {
  return apiRequestWithRefresh<T>(endpoint, "GET", undefined, token);
};

/**
 * Enhanced POST request with automatic token refresh
 */
export const postApiRequestWithRefresh = async <T = any>(
  endpoint: string,
  body: any,
  token?: string
): Promise<ApiResponse<T>> => {
  return apiRequestWithRefresh<T>(endpoint, "POST", body, token);
};

/**
 * Get user's current active role
 */
export const getActiveRole = async (
  token?: string
): Promise<ApiResponse<any>> => {
  const response = await getApiRequestWithRefresh(
    "/api/users/active-role",
    token
  );
  console.log("[getActiveRole] Backend Response:", response);
  return response;
};

/**
 * Switch user role between individual and team tech professional
 */
export const switchUserRole = async (
  token?: string
): Promise<ApiResponse<any>> => {
  const response = await postApiRequestWithRefresh(
    "/api/users/switch-role",
    {},
    token
  );
  console.log("[switchUserRole] Backend Response:", response);
  return response;
};
