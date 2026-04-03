// Data layer - Models

export interface StockModel {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  quantity?: number;
}

export interface PortfolioModel {
  totalAmount: number;
  investedAmount: number;
  profitLoss: number;
  profitLossPercent: number;
  stocks: StockModel[];
}

// Mock data for development
export const mockStocks: StockModel[] = [
  {
    id: '1',
    symbol: 'RELIANCE-CE-2900',
    name: 'Reliance',
    price: 44.57,
    change: 0.62,
    changePercent: 1.44,
  },
  {
    id: '2',
    symbol: 'HDFC-PE-1400',
    name: 'HDFC Bank',
    price: 12.26,
    change: 0.56,
    changePercent: 4.57,
  },
  {
    id: '3',
    symbol: 'INFY-CE-1500',
    name: 'Infosys',
    price: 57.54,
    change: 0.25,
    changePercent: 0.44,
  },
  {
    id: '4',
    symbol: 'TCS-CE-4500',
    name: 'Tata Consultancy',
    price: 89.23,
    change: -1.45,
    changePercent: -1.60,
  },
  {
    id: '5',
    symbol: 'ITC-PE-2800',
    name: 'ITC Limited',
    price: 32.10,
    change: -0.78,
    changePercent: -2.38,
  },
];

export const mockPortfolio: PortfolioModel = {
  totalAmount: 50000,
  investedAmount: 42500,
  profitLoss: 7500,
  profitLossPercent: 17.65,
  stocks: mockStocks.slice(0, 3),
};
