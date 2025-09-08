/**
 * Logger utility for handling console output in different environments
 * Disables all console output in production builds
 */

const isProduction = process.env.NODE_ENV === "production";

// Store original console methods for potential debugging
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
  group: console.group,
  groupEnd: console.groupEnd,
  table: console.table,
  time: console.time,
  timeEnd: console.timeEnd,
  trace: console.trace,
  assert: console.assert,
  count: console.count,
  countReset: console.countReset,
  clear: console.clear,
};

export const logger = {
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    if (!isProduction) {
      console.error(...args);
    }
  },

  warn: (...args: any[]) => {
    if (!isProduction) {
      console.warn(...args);
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

  // Group methods
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

  // Table method
  table: (data: any) => {
    if (!isProduction) {
      console.table(data);
    }
  },

  // Time methods
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

  // Trace method
  trace: (...args: any[]) => {
    if (!isProduction) {
      console.trace(...args);
    }
  },

  // Assert method
  assert: (condition: boolean, ...args: any[]) => {
    if (!isProduction) {
      console.assert(condition, ...args);
    }
  },

  // Count method
  count: (label: string) => {
    if (!isProduction) {
      console.count(label);
    }
  },

  // Count reset method
  countReset: (label: string) => {
    if (!isProduction) {
      console.countReset(label);
    }
  },

  // Clear method
  clear: () => {
    if (!isProduction) {
      console.clear();
    }
  },
};

// Override global console in production
if (isProduction) {
  // Override console methods to be no-ops in production
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.group = () => {};
  console.groupEnd = () => {};
  console.table = () => {};
  console.time = () => {};
  console.timeEnd = () => {};
  console.trace = () => {};
  console.assert = () => {};
  console.count = () => {};
  console.countReset = () => {};
  console.clear = () => {};
}

// Export original console for debugging if needed
export { originalConsole };

export default logger;
