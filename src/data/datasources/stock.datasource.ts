// Data layer - Data Source

import { StockModel, PortfolioModel, mockStocks, mockPortfolio } from '../models/stock.model';

export interface StockDataSource {
  fetchStocks(): Promise<StockModel[]>;
  fetchPortfolio(): Promise<PortfolioModel>;
  buyStock(stockId: string, quantity: number): Promise<boolean>;
  sellStock(stockId: string, quantity: number): Promise<boolean>;
}

// Mock implementation for development
export class MockStockDataSource implements StockDataSource {
  async fetchStocks(): Promise<StockModel[]> {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockStocks);
      }, 1000);
    });
  }

  async fetchPortfolio(): Promise<PortfolioModel> {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockPortfolio);
      }, 1000);
    });
  }

  async buyStock(stockId: string, quantity: number): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Bought ${quantity} of stock ${stockId}`);
        resolve(true);
      }, 1500);
    });
  }

  async sellStock(stockId: string, quantity: number): Promise<boolean> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sold ${quantity} of stock ${stockId}`);
        resolve(true);
      }, 1500);
    });
  }
}
