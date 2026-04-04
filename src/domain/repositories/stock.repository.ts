// Domain layer - Repository interface

import { Stock, Portfolio } from '../entities/stock.entity';

export interface StockRepository {
  fetchStocks(): Promise<Stock[]>;
  fetchPortfolio(): Promise<Portfolio>;
  buyStock(stockId: string, quantity: number): Promise<boolean>;
  sellStock(stockId: string, quantity: number): Promise<boolean>;
}
