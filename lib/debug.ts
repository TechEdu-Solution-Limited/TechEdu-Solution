/**
 * Debug utility for development-only logging
 * Provides structured logging for different contexts
 */

import { safeConsole } from './console';

const isDevelopment = process.env.NODE_ENV === 'development';

export const debug = {
  // General debugging
  log: (...args: any[]) => {
    if (isDevelopment) {
      safeConsole.log('[DEBUG]', ...args);
    }
  },

  // API debugging
  api: {
    request: (endpoint: string, method: string, data?: any) => {
      if (isDevelopment) {
        safeConsole.group(`🌐 API Request: ${method} ${endpoint}`);
        safeConsole.log('Data:', data);
        safeConsole.groupEnd();
      }
    },

    response: (endpoint: string, status: number, data?: any) => {
      if (isDevelopment) {
        safeConsole.group(`✅ API Response: ${status} ${endpoint}`);
        safeConsole.log('Data:', data);
        safeConsole.groupEnd();
      }
    },

    error: (endpoint: string, error: any) => {
      if (isDevelopment) {
        safeConsole.group(`❌ API Error: ${endpoint}`);
        safeConsole.error('Error:', error);
        safeConsole.groupEnd();
      }
    },
  },

  // Component debugging
  component: {
    mount: (componentName: string, props?: any) => {
      if (isDevelopment) {
        safeConsole.log(`🔧 ${componentName} mounted`, props);
      }
    },

    update: (componentName: string, props?: any) => {
      if (isDevelopment) {
        safeConsole.log(`🔄 ${componentName} updated`, props);
      }
    },

    unmount: (componentName: string) => {
      if (isDevelopment) {
        safeConsole.log(`🗑️ ${componentName} unmounted`);
      }
    },
  },

  // User action debugging
  user: {
    action: (action: string, data?: any) => {
      if (isDevelopment) {
        safeConsole.log(`👤 User Action: ${action}`, data);
      }
    },

    navigation: (from: string, to: string) => {
      if (isDevelopment) {
        safeConsole.log(`🧭 Navigation: ${from} → ${to}`);
      }
    },
  },

  // Performance debugging
  performance: {
    start: (label: string) => {
      if (isDevelopment) {
        safeConsole.time(`⏱️ ${label}`);
      }
    },

    end: (label: string) => {
      if (isDevelopment) {
        safeConsole.timeEnd(`⏱️ ${label}`);
      }
    },

    measure: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
      if (isDevelopment) {
        safeConsole.time(`⏱️ ${label}`);
        const result = await fn();
        safeConsole.timeEnd(`⏱️ ${label}`);
        return result;
      }
      return fn();
    },
  },

  // Group debugging
  group: (label: string) => {
    if (isDevelopment) {
      safeConsole.group(`📁 ${label}`);
    }
  },

  groupEnd: () => {
    if (isDevelopment) {
      safeConsole.groupEnd();
    }
  },
};

export default debug;
