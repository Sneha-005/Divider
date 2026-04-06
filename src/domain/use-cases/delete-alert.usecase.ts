/**
 * Delete Alert Use Case
 * Handles deletion of price alerts
 */

import { IAlertRepository } from "../repositories/alert.repository";

export class DeleteAlertUseCase {
  constructor(private repository: IAlertRepository) {}

  async execute(alertId: string): Promise<void> {
    return this.repository.deleteAlert(alertId);
  }
}
