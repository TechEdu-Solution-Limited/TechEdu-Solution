/**
 * Safe console utility that removes logs in production
 * Keeps console.error and console.warn for debugging
 */

const isProduction = process.env.NODE_ENV === "production";

export const safeConsole = {
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },

  info: (...args: any[]) => {
    if (!isProduction) {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (!isProduction) {
      console.debug(...args);
    }
  },

  group: (label: string) => {
    if (!isProduction) {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (!isProduction) {
      console.groupEnd();
    }
  },

  table: (data: any) => {
    if (!isProduction) {
      console.table(data);
    }
  },

  time: (label: string) => {
    if (!isProduction) {
      console.time(label);
    }
  },

  timeEnd: (label: string) => {
    if (!isProduction) {
      console.timeEnd(label);
    }
  },

  // Always keep these in production
  error: (...args: any[]) => {
    console.error(...args);
  },

  warn: (...args: any[]) => {
    console.warn(...args);
  },
};

export default safeConsole;
