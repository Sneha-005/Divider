/**
 * Local Data Source
 * Handles local storage, AsyncStorage, SQLite, etc.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export class ExampleLocalDataSource {
  // Example method
  async saveToLocal(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      throw new Error(`Failed to save to local storage`);
    }
  }

  async getFromLocal(key: string): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw new Error(`Failed to retrieve from local storage`);
    }
  }
}
