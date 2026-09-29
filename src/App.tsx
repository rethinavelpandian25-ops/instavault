/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MediaResultCard } from './components/MediaResultCard';
import { RecentDownloads } from './components/RecentDownloads';
import { FeaturesBento } from './components/FeaturesBento';
import { HowItWorks } from './components/HowItWorks';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { CacheStatsModal } from './components/CacheStatsModal';
import { BatchDownloaderModal } from './components/BatchDownloaderModal';
import { ProfileViewerModal } from './components/ProfileViewerModal';
import { InstagramMediaData } from './types/instagram';
import { AlertCircle, Film, RefreshCw } from 'lucide-react';

export default function App() {
  const [mediaData, setMediaData] = useState<InstagramMediaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCacheStatsOpen, setIsCacheStatsOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [history, setHistory] = useState<InstagramMediaData[]>([]);

  const resultRef = useRef<HTMLDivElement | null>(null);

  // Load download history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('instavault_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Could not read history from localStorage', err);
    }
  }, []);

  const handleExtract = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract media. Please verify the URL.');
      }

      setMediaData(data);
      handleSaveToHistory(data);

      // Smooth scroll down to result card
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch Instagram media. Please verify the link is public.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToHistory = (item: InstagramMediaData) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id && h.shortcode !== item.shortcode);
      const updated = [item, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('instavault_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('instavault_history');
    } catch (err) {
      console.warn('Could not remove history from localStorage', err);
    }
  };

  const handleSelectFromHistory = (item: InstagramMediaData) => {
    setMediaData(item);
    setError(null);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-rose-500 selection:text-white transition-colors duration-200">
        <Header
          onOpenCacheStats={() => setIsCacheStatsOpen(true)}
          onOpenBatchModal={() => setIsBatchModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <main className="flex-1">
          <HeroSection
            onExtract={handleExtract}
            isLoading={isLoading}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenBatchModal={() => setIsBatchModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />

          {/* Error Message Card with Recovery */}
          {error && (
            <div className="max-w-2xl mx-auto px-4 mb-10">
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{error}</p>
                  <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">
                    Tips: Ensure the account is public (private accounts cannot be downloaded without direct login access), or test with our verified sample below.
                  </p>
                  <button
                    onClick={() => handleExtract('reel_cinematic')}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Try Verified 1080p Reel Demo</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media Result Container */}
          <div ref={resultRef}>
            {mediaData && (
              <MediaResultCard
                data={mediaData}
                onSaveToHistory={handleSaveToHistory}
              />
            )}
          </div>

          {/* Recent Downloads Gallery */}
          <RecentDownloads
            history={history}
            onSelect={handleSelectFromHistory}
            onClear={handleClearHistory}
          />

          {/* Features Bento Grid with generated assets */}
          <FeaturesBento />

          {/* 3-Step Guide */}
          <HowItWorks />

          {/* FAQ Accordion */}
          <FAQSection />
        </main>

        <Footer />

        {/* Technical Edge Cache Metrics Modal */}
        <CacheStatsModal
          isOpen={isCacheStatsOpen}
          onClose={() => setIsCacheStatsOpen(false)}
        />

        {/* Batch Multi-Link Downloader Modal */}
        <BatchDownloaderModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
        />

        {/* HD Profile Avatar (DP) Viewer Modal */}
        <ProfileViewerModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
