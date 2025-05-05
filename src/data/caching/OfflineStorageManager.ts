import { DataResponse } from '@/utils/types';

export interface OfflineStorageOptions {
  storageKey?: string;
  maxAge?: number;
  maxItems?: number;
}

export interface OfflineStorageItem {
  category: string;
  data: any;
  metadata: Record<string, any>;
}

/**
 * Manages offline storage of health data for resilience
 * against source outages or compromised data
 */
export class OfflineStorageManager {
  private storageKey: string;
  private maxAge: number;
  private maxItems: number;

  constructor(options: OfflineStorageOptions = {}) {
    this.storageKey = options.storageKey || 'health_data_offline_storage';
    this.maxAge = options.maxAge || 30 * 24 * 60 * 60 * 1000; // 30 days default
    this.maxItems = options.maxItems || 100;
  }
  
  /**
   * Store data for a category
   */
  async storeData(category: string, data: any, metadata: Record<string, any>): Promise<boolean> {
    try {
      const storage = this.getStorage();
      
      // Create storage item
      const item: OfflineStorageItem = {
        category,
        data,
        metadata: {
          ...metadata,
          storedAt: new Date().toISOString()
        }
      };
      
      // Get category storage
      const categoryStorage = storage[category] || [];
      
      // Add new item (keeping most recent first)
      categoryStorage.unshift(item);
      
      // Limit number of items
      if (categoryStorage.length > this.maxItems) {
        categoryStorage.length = this.maxItems;
      }
      
      // Update storage
      storage[category] = categoryStorage;
      
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(storage));
      
      return true;
    } catch (error) {
      console.error('Failed to store offline data:', error);
      return false;
    }
  }
  
  /**
   * Retrieve data for a category
   */
  async retrieveData(category: string, options: { source?: string; ignoreAge?: boolean } = {}): Promise<OfflineStorageItem | null> {
    try {
      const storage = this.getStorage();
      
      // Get category storage
      const categoryStorage = storage[category] || [];
      
      if (categoryStorage.length === 0) {
        return null;
      }
      
      // Get most recent item by default
      let item = categoryStorage[0];
      
      // Filter by source if specified
      if (options.source) {
        const sourceItem = categoryStorage.find(
          item => item.metadata.sources && item.metadata.sources.includes(options.source)
        );
        
        if (sourceItem) {
          item = sourceItem;
        }
      }
      
      // Check if item is too old
      const storedAt = new Date(item.metadata.storedAt).getTime();
      const now = Date.now();
      
      if (now - storedAt > this.maxAge && !options.ignoreAge) {
        console.warn(`Offline data for ${category} is older than max age`);
        return null;
      }
      
      return item;
    } catch (error) {
      console.error('Failed to retrieve offline data:', error);
      return null;
    }
  }
  
  /**
   * Get all stored data
   */
  getStorage(): Record<string, OfflineStorageItem[]> {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      
      if (!storedData) {
        return {};
      }
      
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Failed to parse offline storage:', error);
      return {};
    }
  }
  
  /**
   * Clear all stored data
   */
  clearStorage(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  /**
   * Clear data for a specific category
   */
  clearCategory(category: string): boolean {
    try {
      const storage = this.getStorage();
      
      delete storage[category];
      
      localStorage.setItem(this.storageKey, JSON.stringify(storage));
      
      return true;
    } catch (error) {
      console.error('Failed to clear category:', error);
      return false;
    }
  }
}
