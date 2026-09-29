import { CacheStats } from '../types/instagram.js';

interface CacheEntry<T = any> {
  data: T;
  expiresAt: number;
  addedAt: number;
  hits: number;
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<any>>();
  private hits = 0;
  private misses = 0;
  private totalRequests = 0;
  private totalLatencyMs = 0;
  private totalBytesProxied = 0;
  private readonly defaultTTL = 1000 * 60 * 60 * 2; // 2 hours
  private readonly maxEntries = 500;

  constructor() {
    // Run cleanup every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  get<T = any>(key: string): T | null {
    this.totalRequests++;
    const entry = this.store.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    entry.hits++;
    this.hits++;
    return {
      ...entry.data,
      cached: true,
      cachedAt: entry.addedAt,
    };
  }

  set<T = any>(key: string, data: T, ttlMs: number = this.defaultTTL): void {
    if (this.store.size >= this.maxEntries) {
      // LRU eviction: remove the entry with lowest hits or oldest
      let oldestKey: string | null = null;
      let oldestTime = Infinity;

      for (const [k, v] of this.store.entries()) {
        if (v.addedAt < oldestTime) {
          oldestTime = v.addedAt;
          oldestKey = k;
        }
      }

      if (oldestKey) {
        this.store.delete(oldestKey);
      }
    }

    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
      addedAt: Date.now(),
      hits: 0,
    });
  }

  recordLatency(ms: number) {
    this.totalLatencyMs += ms;
  }

  recordBytesProxied(bytes: number) {
    this.totalBytesProxied += bytes;
  }

  getStats(): CacheStats {
    const hitRatio = this.totalRequests > 0 ? (this.hits / this.totalRequests) * 100 : 0;
    const avgLatencyMs = this.totalRequests > 0 ? Math.round(this.totalLatencyMs / this.totalRequests) : 12;

    return {
      hits: this.hits,
      misses: this.misses,
      totalRequests: this.totalRequests,
      hitRatio: Math.round(hitRatio * 10) / 10,
      activeEntriesCount: this.store.size,
      totalBytesProxied: this.totalBytesProxied,
      avgLatencyMs,
    };
  }

  clear() {
    this.store.clear();
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

export const serverCache = new MemoryCache();
