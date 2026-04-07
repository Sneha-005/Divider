/**
 * Profile Entity - Business logic model
 */

export class Profile {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly email: string,
    readonly phone: string,
    readonly bank_account: string,
    readonly bank_account_status: string,
    readonly member_since: string,
    readonly is_verified: boolean,
    readonly theme: string,
    readonly notification_alerts: boolean,
    readonly notification_trades: boolean,
    readonly notification_news: boolean,
    readonly two_factor_enabled: boolean,
  ) {}

  static create(data: {
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
  }): Profile {
    return new Profile(
      data.id,
      data.username,
      data.email,
      data.phone,
      data.bank_account,
      data.bank_account_status,
      data.member_since,
      data.is_verified,
      data.theme,
      data.notification_alerts,
      data.notification_trades,
      data.notification_news,
      data.two_factor_enabled,
    );
  }
}

export interface NotificationPreferences {
  notification_alerts?: boolean;
  notification_trades?: boolean;
  notification_news?: boolean;
  two_factor_enabled?: boolean;
}
