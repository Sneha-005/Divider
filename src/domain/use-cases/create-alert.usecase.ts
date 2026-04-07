/**
 * Use Case: Create Alert
 */

import { IAlertRepository } from "../repositories/alert.repository";
import { Alert } from "../entities/alert.entity";

export class CreateAlertUseCase {
  constructor(private alertRepository: IAlertRepository) {}

  async execute(
    symbol: string,
    price: number,
    condition: "ABOVE" | "BELOW"
  ): Promise<Alert> {
    return this.alertRepository.createAlert(symbol, price, condition);
  }
}
