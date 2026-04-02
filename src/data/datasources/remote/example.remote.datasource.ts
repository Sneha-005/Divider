/**
 * Remote Data Source
 * Handles API calls and external data fetching
 */

export class ExampleRemoteDataSource {
  // Example method
  async fetchFromAPI(endpoint: string): Promise<any> {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch from ${endpoint}`);
    }
  }
}
