
import { CachedResponse } from '../types';

export class CacheManager {
  private cacheEnabled: boolean;
  private cacheDuration: number; // milliseconds
  private cache: Map<string, CachedResponse>;

  constructor(cacheEnabled: boolean = true, cacheDuration: number = 3600000) {
    this.cacheEnabled = cacheEnabled;
    this.cacheDuration = cacheDuration; // 1 hour default
    this.cache = new Map<string, CachedResponse>();
  }

  public isCacheEnabled(): boolean {
    return this.cacheEnabled;
  }

  public getCacheDuration(): number {
    return this.cacheDuration;
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public get(key: string): CachedResponse | undefined {
    return this.cache.get(key);
  }

  public set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  public isValid(key: string): boolean {
    if (!this.cache.has(key)) {
      return false;
    }

    const cachedResponse = this.cache.get(key);
    if (!cachedResponse) {
      return false;
    }

    return Date.now() - cachedResponse.timestamp < this.cacheDuration;
  }

  public getCacheKey(url: string, params: any): string {
    return `${url}:${JSON.stringify(params || {})}`;
  }
}
