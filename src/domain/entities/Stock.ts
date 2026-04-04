export interface Stock {
  id: string;
  name: string;
  price: number;
  changePercent: number;
  isPositive: boolean;
}

export interface Portfolio {
  totalAmount: number;
  holdings: StockHolding[];
}

export interface StockHolding {
  stock: Stock;
  quantity: number;
  averagePrice: number;
}

export interface TradeOrder {
  stockId: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
}
