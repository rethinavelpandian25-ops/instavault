import React from 'react';
import { Zap, ShieldCheck, Video, Music, Layers, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-500 mb-2">
          <span>Engineered for Speed</span>
          <span aria-hidden="true">·</span>
          <span>Zero Ads</span>
          <span aria-hidden="true">·</span>
          <span>100% Free Forever</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight [text-wrap:balance]">
          High-performance media architecture designed for uncompromising quality.
        </h2>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 1080p Multiple Resolutions (col-span-2) */}
        <div className="md:col-span-2 relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 overflow-hidden flex flex-col justify-between group">
          <div className="relative z-10 max-w-md">
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mb-2 block">
              01. Resolution Control
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Full HD 1080p, 720p, and Data-Saver 480p
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              Pick the exact video bitrate and resolution that suits your storage needs. From 60fps high-bitrate master files to lightweight 480p mobile formats.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md">1080x1920 (60fps)</span>
              <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md">720x1280 (30fps)</span>
              <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md">480x854 (SD)</span>
            </div>
          </div>

          <div className="mt-6 md:mt-0 md:absolute md:right-0 md:bottom-0 md:w-1/2 md:h-full overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
            <img
              src="/src/assets/images/reels_video_card_1790678176891.jpg"
              alt="Reels video showcase"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center rounded-xl md:rounded-l-xl md:rounded-r-none border border-neutral-200/50 dark:border-neutral-800"
            />
          </div>
        </div>

        {/* Card 2: Edge Server Caching (col-span-1) */}
        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mb-2 block">
              02. Latency Optimization
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              High-Speed Memory Caching
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every analyzed media link is cached in server memory with LRU eviction. Subsequent downloads return in under 10ms with zero wait time.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>Average Cache Latency</span>
            <span className="font-bold tabular-nums">~4 ms</span>
          </div>
        </div>

        {/* Card 3: Audio Soundtrack Extractor (col-span-1) */}
        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mb-2 block">
              03. Audio Extraction
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Extract Soundtracks to MP3
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Convert trending Reels audio and music tracks into crystal-clear 320kbps MP3 or M4A audio files for offline listening.
            </p>
          </div>

          <div className="mt-6">
            <img
              src="/src/assets/images/audio_extract_card_1790678200309.jpg"
              alt="Audio visualizer"
              referrerPolicy="no-referrer"
              className="w-full h-32 object-cover rounded-xl border border-neutral-200/50 dark:border-neutral-800"
            />
          </div>
        </div>

        {/* Card 4: Carousel & Multi-Story ZIP Bundler (col-span-2) */}
        <div className="md:col-span-2 relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 overflow-hidden flex flex-col justify-between group">
          <div className="relative z-10 max-w-md">
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mb-2 block">
              04. Carousel & Story Archiver
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              One-Click Carousel & Story ZIP Archiver
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              Never download carousel slides one by one. InstaVault packages all photos, video slides, and highlight chapters into an uncompressed .ZIP archive automatically.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                Original Master Resolution
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                No Lossy Compression
              </span>
            </div>
          </div>

          <div className="mt-6 md:mt-0 md:absolute md:right-0 md:bottom-0 md:w-1/2 md:h-full overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
            <img
              src="/src/assets/images/story_carousel_card_1790678188724.jpg"
              alt="Carousel collection showcase"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center rounded-xl md:rounded-l-xl md:rounded-r-none border border-neutral-200/50 dark:border-neutral-800"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
