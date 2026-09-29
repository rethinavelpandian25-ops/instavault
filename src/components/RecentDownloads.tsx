import React from 'react';
import { History, Trash2, ArrowUpRight, Film, Image as ImageIcon } from 'lucide-react';
import { InstagramMediaData } from '../types/instagram';

interface RecentDownloadsProps {
  history: InstagramMediaData[];
  onSelect: (item: InstagramMediaData) => void;
  onClear: () => void;
}

export const RecentDownloads: React.FC<RecentDownloadsProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-rose-500" />
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Recent Downloads
          </h2>
          <span className="text-xs text-neutral-400 font-mono tabular-nums">
            ({history.length})
          </span>
        </div>

        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="relative aspect-[4/5] bg-neutral-950 overflow-hidden">
              <img
                src={item.items[0]?.previewUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-white uppercase flex items-center gap-1">
                {item.mediaType === 'reel' ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                <span>{item.mediaType}</span>
              </div>
            </div>

            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  @{item.author.username}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  {item.caption || item.title}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400">
                <span>{item.items[0]?.resolutions[0]?.quality || '1080p'}</span>
                <span className="flex items-center text-rose-500 group-hover:translate-x-0.5 transition-transform">
                  Download <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
