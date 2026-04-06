/**
 * Alert Repository Implementation
 * Combines remote API for alert operations
 */

import { IAlertRepository } from "../../domain/repositories/alert.repository";
import { Alert } from "../../domain/entities/alert.entity";
import { AlertRemoteDataSource } from "../datasources/remote/alert.remote.datasource";
import { AlertResponse } from "../models/alert.model";

export class AlertRepositoryImpl implements IAlertRepository {
  constructor(private remoteDataSource: AlertRemoteDataSource) {}

  async getAlerts(): Promise<Alert[]> {
    try {
      const response = await this.remoteDataSource.getAlerts();
      
      // Handle null or undefined response
      if (!response) {
        return [];
      }
      
      // Handle response wrapped in data property
      const alertsData = Array.isArray(response) ? response : (response as any).data || [];
      
      return alertsData.map((data: AlertResponse) => Alert.create(data));
    } catch (error) {
      throw error;
    }
  }

  async createAlert(
    symbol: string,
    price: number,
    condition: "ABOVE" | "BELOW"
  ): Promise<Alert> {
    try {
      const response = await this.remoteDataSource.createAlert(
        symbol,
        price,
        condition
      );
      return Alert.create({
        alert_id: response.alert_id,
        symbol: response.symbol,
        threshold_price: response.threshold_price,
        condition: response.condition,
        is_active: response.is_active,
        created_at: response.created_at,
      });
    } catch (error) {
      throw error;
    }
  }
}
