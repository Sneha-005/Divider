import { TradeOrder } from '../entities/Stock';
import { StockRepository } from '../repositories/StockRepository';

export class ExecuteTradeUseCase {
  private repository: StockRepository;

  constructor(repository: StockRepository) {
    this.repository = repository;
  }

  async execute(order: TradeOrder): Promise<{ success: boolean; message: string }> {
    if (order.quantity <= 0) {
      return { success: false, message: 'Quantity must be greater than 0' };
    }
    if (order.price <= 0) {
      return { success: false, message: 'Price must be greater than 0' };
    }
    return this.repository.executeTrade(order);
  }
}
