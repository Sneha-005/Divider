/**
 * Profile API Response Models (DTOs)
 */

export interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  phone: string;
  bank_account: string;
  bank_account_status: string;
  member_since: string;
  is_verified: boolean;
  theme: string;
  notification_alerts: boolean;
  notification_trades: boolean;
  notification_news: boolean;
  two_factor_enabled: boolean;
}

export interface UpdateProfileRequest {
  notification_alerts?: boolean;
  notification_trades?: boolean;
  notification_news?: boolean;
  two_factor_enabled?: boolean;
}

export interface ApiErrorResponse {
  error: string;
}
