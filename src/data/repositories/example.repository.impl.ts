/**
 * Example Repository Implementation
 * Combines remote and local data sources
 */

import { IExampleRepository } from "@domain/repositories/example.repository";
import { ExampleRemoteDataSource } from "@data/datasources/remote/example.remote.datasource";
import { ExampleLocalDataSource } from "@data/datasources/local/example.local.datasource";

export class ExampleRepositoryImpl implements IExampleRepository {
  constructor(
    private remoteDataSource: ExampleRemoteDataSource,
    private localDataSource: ExampleLocalDataSource
  ) {}

  // Implement repository methods
  // Example: try to get from cache first, if not available fetch from remote
}
