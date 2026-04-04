// Domain layer - Pure business logic

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  quantity?: number;
}

export interface Portfolio {
  totalAmount: number;
  investedAmount: number;
  profitLoss: number;
  profitLossPercent: number;
  stocks: Stock[];
}
