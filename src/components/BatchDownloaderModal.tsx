import React, { useState } from 'react';
import { X, Layers, Download, CheckCircle, AlertCircle, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { BatchItemResult } from '../types/instagram';
import JSZip from 'jszip';

interface BatchDownloaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchDownloaderModal: React.FC<BatchDownloaderModalProps> = ({ isOpen, onClose }) => {
  const [urlsInput, setUrlsInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BatchItemResult[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartBatch = async () => {
    const rawLines = urlsInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (rawLines.length === 0) return;

    const urls = rawLines.slice(0, 10);
    setIsProcessing(true);
    setResults([]);

    try {
      const res = await fetch('/api/batch-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });

      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (err: any) {
      console.error('Batch error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    const successfulItems = results.filter((r) => r.status === 'success' && r.data);
    if (successfulItems.length === 0) return;

    setIsZipping(true);
    setZipProgress(10);

    try {
      const zip = new JSZip();
      let completedCount = 0;

      for (let i = 0; i < successfulItems.length; i++) {
        const item = successfulItems[i].data!;
        const firstMedia = item.items[0];
        const bestRes = firstMedia?.resolutions[0];

        if (bestRes) {
          const downloadUrl = `/api/download?url=${encodeURIComponent(bestRes.url)}&filename=instavault_${item.shortcode}.${bestRes.format}`;
          try {
            const resp = await fetch(downloadUrl);
            const blob = await resp.blob();
            zip.file(`${i + 1}_${item.author.username}_${item.shortcode}.${bestRes.format}`, blob);
          } catch (e) {
            console.warn('Could not fetch file for zip:', e);
          }
        }
        completedCount++;
        setZipProgress(10 + Math.floor((completedCount / successfulItems.length) * 80));
      }

      setZipProgress(95);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const blobUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `instavault_batch_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to create batch zip:', err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  const successCount = results.filter((r) => r.status === 'success').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Batch Link Downloader</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Process and download up to 10 Instagram URLs at once
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              Instagram URLs (One link per line)
            </label>
            <textarea
              rows={4}
              value={urlsInput}
              onChange={(e) => setUrlsInput(e.target.value)}
              placeholder="https://www.instagram.com/reel/C8qXkLMv09z/&#10;https://www.instagram.com/p/DB7xk9aO03z/&#10;https://www.instagram.com/reel/C7pYxLmN45/"
              className="w-full p-3.5 text-xs sm:text-sm font-mono bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {urlsInput.split('\n').filter((l) => l.trim()).length} / 10 links entered
              </span>
              <button
                type="button"
                onClick={() => {
                  setUrlsInput(
                    'https://www.instagram.com/reel/C8qXkLMv09z/\nhttps://www.instagram.com/p/DB7xk9aO03z/\nhttps://www.instagram.com/reel/C3bXz7Qvx42/'
                  );
                }}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Insert Sample Batch
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStartBatch}
              disabled={isProcessing || !urlsInput.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting Media Batch...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Process Batch Links</span>
                </>
              )}
            </button>

            {results.length > 0 && (
              <button
                onClick={() => setResults([])}
                className="p-3 text-neutral-500 hover:text-rose-500 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-colors cursor-pointer"
                title="Clear Results"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results List */}
          {results.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <span>
                  Extracted {successCount} of {results.length} links successfully
                </span>
                {successCount > 0 && (
                  <button
                    onClick={handleDownloadZip}
                    disabled={isZipping}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    {isZipping ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating ZIP ({zipProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download All as .ZIP</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                {results.map((res, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-3 bg-white dark:bg-neutral-900/60">
                    {res.status === 'success' && res.data ? (
                      <>
                        <img
                          src={res.data.items[0]?.previewUrl || '/src/assets/images/reels_video_card_1790678176891.jpg'}
                          alt={res.data.shortcode}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-neutral-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs truncate">@{res.data.author.username}</span>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                              {res.data.mediaType}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {res.data.caption || res.data.title}
                          </p>
                        </div>
                        <a
                          href={`/api/download?url=${encodeURIComponent(
                            res.data.items[0]?.resolutions[0]?.url || ''
                          )}&filename=instavault_${res.data.shortcode}.mp4`}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-200 shrink-0 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </a>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs py-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="truncate">{res.error || 'Failed to extract link'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
