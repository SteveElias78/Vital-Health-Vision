
/**
 * Manages storage of API keys
 */
export class KeyStorage {
  private keys: Map<string, string>;
  private storageKey = 'vital_health_api_keys';
  
  constructor() {
    this.keys = new Map();
    this.loadFromStorage();
  }
  
  /**
   * Load keys from localStorage
   */
  private loadFromStorage(): void {
    try {
      const storedKeys = localStorage.getItem(this.storageKey);
      
      if (storedKeys) {
        const parsedKeys = JSON.parse(storedKeys);
        
        // Convert object to Map
        Object.entries(parsedKeys).forEach(([source, key]) => {
          if (key && typeof key === 'string') {
            this.keys.set(source, key);
          }
        });
      }
    } catch (error) {
      console.error('Error loading API keys from storage:', error);
    }
  }
  
  /**
   * Save keys to localStorage
   */
  private saveToStorage(): void {
    try {
      // Convert Map to object for storage
      const keysObject: Record<string, string> = {};
      this.keys.forEach((key, source) => {
        keysObject[source] = key;
      });
      
      localStorage.setItem(this.storageKey, JSON.stringify(keysObject));
    } catch (error) {
      console.error('Error saving API keys to storage:', error);
    }
  }
  
  /**
   * Check if a key exists
   */
  public hasKey(source: string): boolean {
    return this.keys.has(source);
  }
  
  /**
   * Get API key
   */
  public getKey(source: string): string | undefined {
    return this.keys.get(source);
  }
  
  /**
   * Set API key
   */
  public setKey(source: string, key: string): void {
    this.keys.set(source, key);
    this.saveToStorage();
  }
  
  /**
   * Remove API key
   */
  public removeKey(source: string): void {
    this.keys.delete(source);
    this.saveToStorage();
  }
  
  /**
   * Clear all keys
   */
  public clearAllKeys(): void {
    this.keys.clear();
    this.saveToStorage();
  }
}
