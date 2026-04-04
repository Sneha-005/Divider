import { Stock } from '../entities/Stock';
import { StockRepository } from '../repositories/StockRepository';

export class GetStocksUseCase {
  private repository: StockRepository;

  constructor(repository: StockRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Stock[]> {
    return this.repository.getStocks();
  }
}
