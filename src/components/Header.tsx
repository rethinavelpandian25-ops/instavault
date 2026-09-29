import React from 'react';
import { Sun, Moon, Cpu, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onOpenCacheStats: () => void;
  onSelectCategory: (category: string) => void;
  onOpenBatchModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCacheStats,
  onSelectCategory,
  onOpenBatchModal,
  onOpenProfileModal,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="flex items-center gap-2 group text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 fill-white" />
          </span>
          <span>Insta<span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">Vault</span></span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => onSelectCategory('reels')}
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            Reels
          </button>
          <button
            onClick={() => onSelectCategory('posts')}
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            Posts & Carousel
          </button>
          <button
            onClick={() => onSelectCategory('stories')}
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            Stories
          </button>
          <button
            onClick={() => onSelectCategory('audio')}
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            Audio MP3
          </button>
          {onOpenBatchModal && (
            <button
              onClick={onOpenBatchModal}
              className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors cursor-pointer"
            >
              Batch Mode
            </button>
          )}
          {onOpenProfileModal && (
            <button
              onClick={onOpenProfileModal}
              className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              HD Profile DP
            </button>
          )}
          <a
            href="#features"
            className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            Features
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCacheStats}
            title="View Real-Time Edge Cache Metrics"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200/60 dark:border-neutral-800 transition-colors cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Cache Status</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
