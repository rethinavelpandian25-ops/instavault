import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is InstaVault really 100% free with no ads?',
      a: 'Yes. InstaVault offers lifetime free usage for all users. There are no subscription tiers, no credit limits, no forced pop-up advertisements, and no intrusive tracking scripts. The service is built with lightweight edge caching to keep operations fast and free.',
    },
    {
      q: 'What video resolutions and formats can I download?',
      a: 'InstaVault extracts all stream tracks provided by the media servers: 1080p Full HD (high-bitrate up to 60fps), 720p HD (balanced size), and 480p SD (data-saver). You can also extract pure 320kbps MP3 audio soundtracks and download high-resolution JPG cover thumbnails.',
    },
    {
      q: 'How does high-performance server caching work?',
      a: 'When an Instagram link is analyzed, our high-speed server stores the extracted media streams in an in-memory LRU cache. When you or another user requests that same media or resolution, the response is delivered in under 10ms with zero extra processing latency.',
    },
    {
      q: 'Can I download Instagram Stories and Highlights?',
      a: 'Yes. As long as the Instagram account is public, you can download active 24-hour Stories as well as saved profile Highlights. For multi-item stories and carousel posts, you can also download all items at once packed neatly into a .ZIP archive.',
    },
    {
      q: 'How do I download on iPhone or Android?',
      a: 'On iOS Safari, tap "Download" and confirm the system download prompt. You can then view it in the Files app or tap Share > Save Video to send it to your Camera Roll. You can also click the "Phone QR" button to scan the link directly with your phone camera!',
    },
    {
      q: 'Do I need to install software or log into my Instagram account?',
      a: 'No software installation or account login is required. InstaVault runs entirely inside your web browser and never requests your Instagram password or personal information.',
    },
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-200/80 dark:border-neutral-800/80">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-2 block">
          Frequently Asked Questions
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Everything you need to know
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-neutral-900 dark:text-neutral-100 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-rose-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
