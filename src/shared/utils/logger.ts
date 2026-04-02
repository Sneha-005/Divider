/**
 * Centralized logging utility
 * Use this instead of console.log for better control over logs
 */

const isDevelopment = __DEV__;

export const Logger = {
  log: (tag: string, message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[${tag}]`, message, ...args);
    }
  },

  error: (tag: string, message: string, ...args: any[]) => {
    console.error(`[${tag}] ERROR:`, message, ...args);
  },

  warn: (tag: string, message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`[${tag}] WARNING:`, message, ...args);
    }
  },

  debug: (tag: string, message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.debug(`[${tag}] DEBUG:`, message, ...args);
    }
  },
};
