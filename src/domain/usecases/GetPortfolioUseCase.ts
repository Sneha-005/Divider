import { Portfolio } from '../entities/Stock';
import { StockRepository } from '../repositories/StockRepository';

export class GetPortfolioUseCase {
  private repository: StockRepository;

  constructor(repository: StockRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Portfolio> {
    return this.repository.getPortfolio();
  }
}
