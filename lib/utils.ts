import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./dashboardData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Encodes a redirect URL for use in query parameters
 * @param url - The URL to encode (e.g., "/dashboard/student")
 * @returns Encoded URL safe for query parameters
 */
export function encodeRedirectUrl(url: string): string {
  return encodeURIComponent(url);
}

/**
 * Decodes a redirect URL from query parameters
 * @param encodedUrl - The encoded URL from query parameters
 * @returns Decoded URL
 */
export function decodeRedirectUrl(encodedUrl: string): string {
  return decodeURIComponent(encodedUrl);
}

/**
 * Safely gets and decodes a redirect URL from search params
 * @param searchParams - URLSearchParams object
 * @param fallback - Fallback URL if redirect is not found or invalid
 * @returns Decoded redirect URL or fallback
 */
export function getRedirectUrl(
  searchParams: URLSearchParams,
  fallback: string = "/"
): string {
  const redirect = searchParams.get("redirect");
  if (!redirect) return fallback;

  try {
    const decoded = decodeRedirectUrl(redirect);
    // Validate that it's a relative path starting with /
    if (decoded.startsWith("/")) {
      return decoded;
    }
    return fallback;
  } catch (error) {
    console.error("Failed to decode redirect URL:", error);
    return fallback;
  }
}

export function isValidUserData(data: any): data is {
  fullName: string;
  email: string;
  avatar?: string;
  role?: UserRole;
} {
  return (
    typeof data === "object" &&
    typeof data.fullName === "string" &&
    typeof data.email === "string" &&
    [
      "student",
      "institution",
      "admin",
      "recruiter",
      "individualTechProfessional",
      "teamTechProfessional",
    ].includes(data.role)
  );
}
