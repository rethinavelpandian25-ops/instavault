import React, { useState } from 'react';
import { ArrowRight, Clipboard, X, Sparkles, Film, Image as ImageIcon, History, Music, ShieldCheck, Layers, User } from 'lucide-react';

interface HeroSectionProps {
  onExtract: (url: string) => void;
  isLoading: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenBatchModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExtract,
  isLoading,
  selectedCategory,
  onSelectCategory,
  onOpenBatchModal,
  onOpenProfileModal,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [clipboardError, setClipboardError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onExtract(urlInput.trim());
  };

  const handlePaste = async () => {
    try {
      setClipboardError(null);
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
        onExtract(text);
      }
    } catch {
      setClipboardError('Clipboard access denied. Please paste manually into the input box.');
      setTimeout(() => setClipboardError(null), 3500);
    }
  };

  const handleSample = (sampleKey: string) => {
    setUrlInput(sampleKey);
    onExtract(sampleKey);
  };

  const categoryPlaceholders: Record<string, string> = {
    all: 'Paste any Instagram link (Reel, Post, Story, Highlight, Audio, or Profile)...',
    reels: 'Paste Instagram Reel link (e.g. instagram.com/reel/C8qXkLMv09z/)...',
    posts: 'Paste Instagram Post or Carousel link (e.g. instagram.com/p/DB7xk9aO03z/)...',
    stories: 'Paste Instagram Story link (e.g. instagram.com/stories/username/123/)...',
    highlights: 'Paste Instagram Highlight link (e.g. instagram.com/s/aGlnaGxpZ2h0...)...',
    audio: 'Paste Instagram Audio or Reel link to extract MP3...',
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-500/10 via-purple-500/10 to-amber-500/10 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Anti-Slop Discipline: Clean unboxed metadata separator without pill enclosures */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-4">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Ad-Free
          </span>
          <span aria-hidden="true">·</span>
          <span>Lifetime Free</span>
          <span aria-hidden="true">·</span>
          <span>1080p Full HD</span>
          <span aria-hidden="true">·</span>
          <span>No Account Required</span>
        </div>

        {/* Display Headline with text-wrap: balance */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 [text-wrap:balance] mb-6">
          Save Instagram Content in{' '}
          <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 bg-clip-text text-transparent">
            Original Master Quality
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 dark:text-neutral-400 [text-wrap:balance] mb-8 leading-relaxed">
          Fast, private downloader for Instagram Reels, Posts, Stories, and Highlights. Multiple resolutions, audio MP3 extraction, and edge-cached downloads without watermarks.
        </p>

        {/* Interactive Segmented Filter Tabs & Power Tools */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-full">
          <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-x-auto">
            {[
              { id: 'all', label: 'All Content' },
              { id: 'reels', label: 'Reels' },
              { id: 'posts', label: 'Posts & Carousel' },
              { id: 'stories', label: 'Stories' },
              { id: 'highlights', label: 'Highlights' },
              { id: 'audio', label: 'Audio MP3' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {onOpenBatchModal && (
            <button
              onClick={onOpenBatchModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Batch (Multi-Link)</span>
            </button>
          )}

          {onOpenProfileModal && (
            <button
              onClick={onOpenProfileModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>HD Profile DP</span>
            </button>
          )}
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-5">
          <div className="relative flex flex-col sm:flex-row items-stretch rounded-2xl bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 focus-within:border-rose-500 dark:focus-within:border-rose-500 shadow-xl shadow-neutral-200/40 dark:shadow-none transition-all p-1.5">
            <div className="relative flex-1 flex items-center min-w-0">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={categoryPlaceholders[selectedCategory] || categoryPlaceholders.all}
                className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-transparent text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
              />

              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  aria-label="Clear input"
                  className="p-1.5 mr-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="flex items-center gap-1 px-3 py-1.5 mr-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="mt-2 sm:mt-0 flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-rose-500/25 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Download</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {clipboardError && (
            <p className="mt-2 text-xs text-rose-500 dark:text-rose-400">{clipboardError}</p>
          )}
        </form>

        {/* Quick Instant Test Samples */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-medium mr-1">Instant Demo:</span>
          <button
            type="button"
            onClick={() => handleSample('reel_cinematic')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-400 dark:hover:border-rose-500 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
          >
            <Film className="w-3.5 h-3.5 text-rose-500" />
            <span>Try Reel (1080p 60fps)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSample('post_carousel')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-purple-400 dark:hover:border-purple-500 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
            <span>Try Carousel (3 Slides)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSample('story_live')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-500 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Story</span>
          </button>
          <button
            type="button"
            onClick={() => handleSample('highlight_collection')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 dark:hover:border-emerald-500 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Try Highlight</span>
          </button>
          <button
            type="button"
            onClick={() => handleSample('https://www.instagram.com/reels/audio/123456789/')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-purple-400 dark:hover:border-purple-500 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
          >
            <Music className="w-3.5 h-3.5 text-purple-500" />
            <span>Try Audio MP3</span>
          </button>
          {onOpenProfileModal && (
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-rose-400 dark:hover:border-rose-500 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-rose-500" />
              <span>Try Profile DP</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
