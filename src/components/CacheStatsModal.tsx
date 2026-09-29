import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Cpu, Activity, Database, HardDrive, Zap } from 'lucide-react';
import { CacheStats } from '../types/instagram';

interface CacheStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CacheStatsModal: React.FC<CacheStatsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cache/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching cache stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 sm:p-7 border border-neutral-200 dark:border-neutral-800 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                Server Cache Metrics
              </h3>
              <p className="text-xs text-neutral-500">In-Memory Edge Accelerator</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchStats}
              disabled={isLoading}
              title="Refresh"
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {stats ? (
          <div className="space-y-4">
            {/* Top Stat: Hit Ratio */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500 font-medium">Cache Hit Efficiency</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                  {stats.hitRatio}%
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 font-medium">Avg Latency</span>
                <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">
                  {stats.avgLatencyMs} ms
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cache Hits</span>
                </div>
                <span className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {stats.hits}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  <span>Total Queries</span>
                </div>
                <span className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {stats.totalRequests}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                  <Database className="w-3.5 h-3.5 text-purple-500" />
                  <span>Cached Items</span>
                </div>
                <span className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {stats.activeEntriesCount} entries
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
                  <HardDrive className="w-3.5 h-3.5 text-rose-500" />
                  <span>Data Proxied</span>
                </div>
                <span className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {formatBytes(stats.totalBytesProxied)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center pt-2">
              In-memory cache automatically refreshes stream tokens and evicts stale entries after 2 hours.
            </p>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-neutral-400">Loading cache status...</div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
