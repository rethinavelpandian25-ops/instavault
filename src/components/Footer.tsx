import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white">
              <Zap className="w-3.5 h-3.5 fill-white" />
            </span>
            <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Insta<span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">Vault</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Ad-Free Guarantee
            </span>
            <span aria-hidden="true">·</span>
            <span>No Account Required</span>
            <span aria-hidden="true">·</span>
            <span>Edge Caching Enabled</span>
            <span aria-hidden="true">·</span>
            <span>Fair Personal Use Only</span>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-500">
          <p>© {new Date().getFullYear()} InstaVault. Free tool for personal media archiving.</p>
          <p className="max-w-md text-center md:text-right text-[11px] text-neutral-400 dark:text-neutral-600">
            Disclaimer: InstaVault is an independent web utility and is not affiliated with, endorsed, or sponsored by Instagram or Meta Platforms, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};
