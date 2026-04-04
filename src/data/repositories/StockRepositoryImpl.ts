import { Stock, Portfolio, TradeOrder } from '../../domain/entities/Stock';
import { StockRepository } from '../../domain/repositories/StockRepository';
import { StockLocalDataSource } from '../datasources/StockLocalDataSource';

export class StockRepositoryImpl implements StockRepository {
  private dataSource: StockLocalDataSource;

  constructor(dataSource: StockLocalDataSource) {
    this.dataSource = dataSource;
  }

  async getStocks(): Promise<Stock[]> {
    return this.dataSource.getStocks();
  }

  async getPortfolio(): Promise<Portfolio> {
    return this.dataSource.getPortfolio();
  }

  async executeTrade(order: TradeOrder): Promise<{ success: boolean; message: string }> {
    return this.dataSource.executeTrade(order);
  }
}
