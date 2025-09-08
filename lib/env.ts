/**
 * Environment utility for conditional checks
 */

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

export const shouldLog = (
  level: "log" | "info" | "debug" | "warn" | "error"
) => {
  if (isProduction) {
    return level === "warn" || level === "error";
  }
  return true;
};

export const isConsoleEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGS !== "false";

export default {
  isDevelopment,
  isProduction,
  isTest,
  shouldLog,
  isConsoleEnabled,
};
