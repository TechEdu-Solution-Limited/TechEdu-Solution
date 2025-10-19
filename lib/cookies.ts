import { parse, serialize } from "cookie";
import { safeConsole } from "@/lib/console";

/**
 * Cookie keys
 */
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_DATA_KEY = "userData";

const isProd = process.env.NODE_ENV === "production";

/**
 * Saves user data (JSON) into a cookie (percent-encoded).
 * Client-side only.
 */
export const saveUserDataToCookies = (data: any): void => {
  if (typeof document === "undefined") return;

  const value = encodeURIComponent(JSON.stringify(data));
  const cookie = serialize(USER_DATA_KEY, value, {
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  document.cookie = cookie;
};

/**
 * Safe reader for userData JSON cookie.
 * Returns parsed object or null on failure.
 */
export const getUserDataFromCookies = <T = any>(): T | null => {
  if (typeof document === "undefined") return null;

  const cookies = parse(document.cookie || "");
  const raw = cookies[USER_DATA_KEY];
  if (!raw) return null;

  try {
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded) as T;
  } catch (e) {
    safeConsole.error("[cookies] Failed to parse userData", e);
    return null;
  }
};

/**
 * Optional convenience: wrap writer with boolean return
 */
export const trySaveUserDataToCookies = (data: any): boolean => {
  try {
    saveUserDataToCookies(data);
    return true;
  } catch (e) {
    safeConsole.error("[cookies] saveUserDataToCookies failed", e);
    return false;
  }
};

/**
 * Saves the access token cookie.
 * Client-side only.
 */
export const saveTokenToCookies = (token: string): boolean => {
  try {
    if (typeof document === "undefined") return false;

    const cookie = serialize(TOKEN_KEY, encodeURIComponent(token), {
      httpOnly: false, // JS-accessible
      secure: isProd,
      sameSite: "lax", // "strict" can break some OAuth redirects
      maxAge: 60 * 60 * 24 * 2, // 2 days
      path: "/",
    });

    document.cookie = cookie;
    return true;
  } catch (error) {
    safeConsole.error("Failed to save token to cookies:", error);
    return false;
  }
};

/**
 * Saves the refresh token cookie.
 * Client-side only.
 */
export const saveRefreshTokenToCookies = (refreshToken: string): boolean => {
  try {
    if (typeof document === "undefined") return false;

    const cookie = serialize(
      REFRESH_TOKEN_KEY,
      encodeURIComponent(refreshToken),
      {
        httpOnly: false, // JS-accessible (consider httpOnly on server paths)
        secure: isProd,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      }
    );

    document.cookie = cookie;
    return true;
  } catch (error) {
    safeConsole.error("Failed to save refresh token to cookies:", error);
    return false;
  }
};

/**
 * Gets the access token from cookie.
 */
export const getTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = parse(document.cookie || "");
  const token = cookies[TOKEN_KEY];
  return token ? decodeURIComponent(token) : null;
};

/**
 * Gets the refresh token from cookie.
 */
export const getRefreshTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = parse(document.cookie || "");
  const token = cookies[REFRESH_TOKEN_KEY];
  return token ? decodeURIComponent(token) : null;
};

/**
 * Deletes access token cookie.
 */
export const deleteTokenFromCookies = (): boolean => {
  try {
    if (typeof document === "undefined") return false;

    const expiredCookie = serialize(TOKEN_KEY, "", {
      maxAge: -1,
      path: "/",
    });

    document.cookie = expiredCookie;
    return true;
  } catch (error) {
    safeConsole.error("Failed to delete token from cookies:", error);
    return false;
  }
};

/**
 * Deletes refresh token cookie.
 */
export const deleteRefreshTokenFromCookies = (): boolean => {
  try {
    if (typeof document === "undefined") return false;

    const expiredCookie = serialize(REFRESH_TOKEN_KEY, "", {
      maxAge: -1,
      path: "/",
    });

    document.cookie = expiredCookie;
    return true;
  } catch (error) {
    safeConsole.error("Failed to delete refresh token from cookies:", error);
    return false;
  }
};

/**
 * Clear all cookies (tries host + parent domains).
 */
export const clearAllCookies = (): boolean => {
  try {
    if (typeof document === "undefined") return false;

    const cookies = parse(document.cookie || "");

    const expireEverywhere = (name: string) => {
      const parts = location.hostname.split(".");
      const domains = parts.map((_, i) => "." + parts.slice(i).join("."));
      // try current host (no domain) + all parent domains
      for (const d of ["", ...domains]) {
        document.cookie = serialize(name, "", {
          maxAge: -1,
          path: "/",
          ...(d ? { domain: d } : {}),
        });
      }
    };

    Object.keys(cookies).forEach(expireEverywhere);

    // Also attempt to remove common auth cookies explicitly
    [
      TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_DATA_KEY,
      "userId",
      "authToken",
      "session",
    ].forEach(expireEverywhere);

    return true;
  } catch (error) {
    safeConsole.error("Failed to clear all cookies:", error);
    return false;
  }
};

/**
 * Save both tokens.
 */
export const saveTokensToCookies = (
  accessToken: string,
  refreshToken: string
): boolean => {
  const a = saveTokenToCookies(accessToken);
  const r = saveRefreshTokenToCookies(refreshToken);
  return a && r;
};

/**
 * Generic client-side getters/setters (decoded).
 */
export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const cookies = parse(document.cookie || "");
  return cookies[name];
};

export const getCookieDecoded = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const val = getCookie(name);
  return val ? decodeURIComponent(val) : null;
};

export const setCookie = (
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
    maxAge?: number;
    path?: string;
  } = {}
) => {
  if (typeof document === "undefined") return;

  const cookie = serialize(name, value, {
    httpOnly: false,
    secure: options.secure ?? isProd,
    sameSite: options.sameSite ?? "lax",
    maxAge: options.maxAge ?? 7 * 24 * 60 * 60,
    path: options.path ?? "/",
  });

  document.cookie = cookie;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;

  document.cookie = serialize(name, "", {
    maxAge: -1,
    path: "/",
  });
};

/**
 * Safer cookie logger (handles '=' inside values and decoding).
 */
export const logAllCookies = () => {
  if (typeof document === "undefined") return;

  const cookies = parse(document.cookie || "");
  const decoded: Record<string, string> = {};

  for (const [k, v] of Object.entries(cookies)) {
    try {
      decoded[k] = decodeURIComponent(v as string);
    } catch {
      decoded[k] = String(v ?? "");
    }
  }
  safeConsole.table(decoded);
};

// Convenience removers
export function deleteUserIdFromCookies() {
  deleteCookie("userId");
}
export function deleteUserDataFromCookies() {
  deleteCookie(USER_DATA_KEY);
}
