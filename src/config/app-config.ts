/**
 * Application Configuration
 * Centralize all app-wide settings here
 */

export const AppConfig = {
  // App Info
  app: {
    name: "Divider",
    version: "1.0.0",
    identifier: "com.yourcompany.divider",
  },

  // Debug Settings
  debug: {
    enableLogging: true,
    enableNetworkLogging: true,
    verboseErrors: true,
  },

  // API Settings
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.example.com",
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },

  // Feature Flags
  features: {
    enableAuth: true,
    enableAnalytics: true,
    enableOfflineMode: false,
  },
};
