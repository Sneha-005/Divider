// Data layer - Repository Implementation

import { StockRepository } from '../../domain/repositories/stock.repository';
import { Stock, Portfolio } from '../../domain/entities/stock.entity';
import { StockDataSource } from '../datasources/stock.datasource';

export class StockRepositoryImpl implements StockRepository {
  constructor(private dataSource: StockDataSource) {}

  async fetchStocks(): Promise<Stock[]> {
    const models = await this.dataSource.fetchStocks();
    return models.map(model => ({
      id: model.id,
      symbol: model.symbol,
      name: model.name,
      price: model.price,
      change: model.change,
      changePercent: model.changePercent,
      quantity: model.quantity,
    }));
  }

  async fetchPortfolio(): Promise<Portfolio> {
    const model = await this.dataSource.fetchPortfolio();
    return {
      totalAmount: model.totalAmount,
      investedAmount: model.investedAmount,
      profitLoss: model.profitLoss,
      profitLossPercent: model.profitLossPercent,
      stocks: model.stocks.map(stock => ({
        id: stock.id,
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        quantity: stock.quantity,
      })),
    };
  }

  async buyStock(stockId: string, quantity: number): Promise<boolean> {
    return this.dataSource.buyStock(stockId, quantity);
  }

  async sellStock(stockId: string, quantity: number): Promise<boolean> {
    return this.dataSource.sellStock(stockId, quantity);
  }
}
