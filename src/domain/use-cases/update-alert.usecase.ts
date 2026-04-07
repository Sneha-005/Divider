/**
 * Update Alert Use Case
 * Handles updating price alerts
 */

import { IAlertRepository } from "../repositories/alert.repository";
import { Alert } from "../entities/alert.entity";

export class UpdateAlertUseCase {
  constructor(private repository: IAlertRepository) {}

  async execute(
    alertId: string,
    symbol: string,
    price: number,
    condition: "ABOVE" | "BELOW"
  ): Promise<Alert> {
    return this.repository.updateAlert(alertId, symbol, price, condition);
  }
}
