import React from 'react';
import { Copy, Sliders, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Copy the Link',
      desc: 'Open the Instagram app or website on any post, reel, story, or highlight. Tap the share icon and select "Copy Link".',
      icon: Copy,
    },
    {
      num: '02',
      title: 'Paste into InstaVault',
      desc: 'Paste the copied URL into the search box above. InstaVault automatically parses the link and prepares all stream resolutions.',
      icon: Sliders,
    },
    {
      num: '03',
      title: 'Save to Device',
      desc: 'Choose your preferred quality (1080p, 720p, 480p, or MP3 audio). Hit download to save directly without ads or watermarks.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-2 block">
          Simple 3-Step Process
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight [text-wrap:balance]">
          How to download Instagram content in seconds
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-neutral-300 dark:text-neutral-700">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400">
                Works on iOS, Android, macOS & Windows
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
