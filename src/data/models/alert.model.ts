/**
 * Alert API Response Models (DTOs)
 */

export interface AlertResponse {
  alert_id: string;
  user_id?: string;
  symbol: string;
  threshold_price: number;
  condition: "ABOVE" | "BELOW";
  is_active: boolean;
  created_at: string;
}

export interface CreateAlertRequest {
  symbol: string;
  price: number;
  condition: "ABOVE" | "BELOW";
}

export interface CreateAlertResponse {
  alert_id: string;
  user_id: string;
  symbol: string;
  threshold_price: number;
  condition: "ABOVE" | "BELOW";
  is_active: boolean;
  created_at: string;
}
