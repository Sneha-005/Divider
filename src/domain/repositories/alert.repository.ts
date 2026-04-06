/**
 * Alert Repository Interface
 * Defines contracts for alert operations
 */

import { Alert } from "../entities/alert.entity";

export interface IAlertRepository {
  /**
   * Fetch all alerts for the current user
   */
  getAlerts(): Promise<Alert[]>;

  /**
   * Create a new price alert
   */
  createAlert(
    symbol: string,
    price: number,
    condition: "ABOVE" | "BELOW"
  ): Promise<Alert>;
}
