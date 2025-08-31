import { getCookie } from "./cookies";

/**
 * Validates if a JWT token exists and is not expired
 * @param token - The JWT token to validate
 * @returns boolean indicating if token is valid
 */
export function validateToken(token: string): boolean {
  if (!token) return false;

  try {
    // Decode the JWT token (without verification - just for expiration check)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);

    // Check if token is expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime >= payload.exp) {
        return false; // Token is expired
      }
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

/**
 * Gets and validates the current user's token
 * @returns object with token and validity status
 */
export function getValidToken() {
  const token = getCookie("token");

  if (!token) {
    return { token: null, isValid: false, reason: "no_token" };
  }

  const isValid = validateToken(token);

  return {
    token,
    isValid,
    reason: isValid ? "valid" : "expired_or_invalid",
  };
}

/**
 * Clears all authentication cookies
 */
export function clearAuthCookies() {
  // Clear token
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear userData if it exists
  document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear any other auth-related cookies
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
