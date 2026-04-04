// Domain layer - Use Cases

import { Stock, Portfolio } from '../entities/stock.entity';
import { StockRepository } from '../repositories/stock.repository';

export class GetStocksUseCase {
  constructor(private stockRepository: StockRepository) {}

  async execute(): Promise<Stock[]> {
    return this.stockRepository.fetchStocks();
  }
}

export class GetPortfolioUseCase {
  constructor(private stockRepository: StockRepository) {}

  async execute(): Promise<Portfolio> {
    return this.stockRepository.fetchPortfolio();
  }
}

export class BuyStockUseCase {
  constructor(private stockRepository: StockRepository) {}

  async execute(stockId: string, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    return this.stockRepository.buyStock(stockId, quantity);
  }
}

export class SellStockUseCase {
  constructor(private stockRepository: StockRepository) {}

  async execute(stockId: string, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    return this.stockRepository.sellStock(stockId, quantity);
  }
}
