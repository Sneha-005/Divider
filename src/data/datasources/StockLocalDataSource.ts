import { Stock, Portfolio, TradeOrder } from '../../domain/entities/Stock';

// Mock stock data simulating Indian stock market options
const MOCK_STOCKS: Stock[] = [
  {
    id: '1',
    name: 'RELIANCE-CE-2900',
    price: 44.57,
    changePercent: 1.44,
    isPositive: true,
  },
  {
    id: '2',
    name: 'HDFC-PE-1400',
    price: 12.26,
    changePercent: 4.57,
    isPositive: true,
  },
  {
    id: '3',
    name: 'INFY-CE-1500',
    price: 57.54,
    changePercent: 0.44,
    isPositive: true,
  },
  {
    id: '4',
    name: 'TCS-PE-3800',
    price: 89.30,
    changePercent: 2.15,
    isPositive: false,
  },
  {
    id: '5',
    name: 'BAJFINANCE-CE-7000',
    price: 125.75,
    changePercent: 3.22,
    isPositive: true,
  },
  {
    id: '6',
    name: 'SBIN-PE-600',
    price: 8.45,
    changePercent: 1.87,
    isPositive: false,
  },
  {
    id: '7',
    name: 'NIFTY-CE-22000',
    price: 210.60,
    changePercent: 0.95,
    isPositive: true,
  },
  {
    id: '8',
    name: 'BANKNIFTY-PE-48000',
    price: 340.25,
    changePercent: 1.12,
    isPositive: false,
  },
];

export class StockLocalDataSource {
  private stocks: Stock[] = [...MOCK_STOCKS];
  private portfolioBalance: number = 125750.50;

  async getStocks(): Promise<Stock[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate live price fluctuation
    return this.stocks.map(stock => ({
      ...stock,
      price: +(stock.price + (Math.random() - 0.5) * 2).toFixed(2),
      changePercent: +(stock.changePercent + (Math.random() - 0.5) * 0.5).toFixed(2),
    }));
  }

  async getPortfolio(): Promise<Portfolio> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalAmount: this.portfolioBalance,
      holdings: [],
    };
  }

  async executeTrade(order: TradeOrder): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalCost = order.price * order.quantity;

    if (order.type === 'BUY') {
      if (totalCost > this.portfolioBalance) {
        return { success: false, message: 'Insufficient balance' };
      }
      this.portfolioBalance -= totalCost;
    } else {
      this.portfolioBalance += totalCost;
    }

    return {
      success: true,
      message: `${order.type} order executed: ${order.quantity} units at ₹${order.price}`,
    };
  }
}
