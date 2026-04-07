/**
 * Alert Entity - Business logic model
 */

export class Alert {
  constructor(
    readonly alertId: string,
    readonly symbol: string,
    readonly thresholdPrice: number,
    readonly condition: "ABOVE" | "BELOW",
    readonly isActive: boolean,
    readonly createdAt: string,
  ) {}

  static create(data: {
    alert_id: string;
    symbol: string;
    threshold_price: number;
    condition: "ABOVE" | "BELOW";
    is_active: boolean;
    created_at: string;
  }): Alert {
    return new Alert(
      data.alert_id,
      data.symbol,
      data.threshold_price,
      data.condition,
      data.is_active,
      data.created_at,
    );
  }

  getFormattedTime(): string {
    const date = new Date(this.createdAt);
    return date.toLocaleString('en-IN');
  }

  getDisplayCondition(): string {
    return this.condition === "ABOVE" ? "≥" : "≤";
  }
}
