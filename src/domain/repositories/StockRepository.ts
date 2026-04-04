import { Stock, Portfolio, TradeOrder } from '../entities/Stock';

export interface StockRepository {
  getStocks(): Promise<Stock[]>;
  getPortfolio(): Promise<Portfolio>;
  executeTrade(order: TradeOrder): Promise<{ success: boolean; message: string }>;
}
