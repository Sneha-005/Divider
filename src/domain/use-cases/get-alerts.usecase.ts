/**
 * Use Case: Get Alerts
 */

import { IAlertRepository } from "../repositories/alert.repository";
import { Alert } from "../entities/alert.entity";

export class GetAlertsUseCase {
  constructor(private alertRepository: IAlertRepository) {}

  async execute(): Promise<Alert[]> {
    return this.alertRepository.getAlerts();
  }
}
