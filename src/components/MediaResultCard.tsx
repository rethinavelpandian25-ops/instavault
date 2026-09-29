import React, { useState, useRef } from 'react';
import {
  Download,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  QrCode,
  Archive,
  ExternalLink,
  Sparkles,
  Zap,
  CheckCircle2,
  Film,
  Music,
  Image as ImageIcon
} from 'lucide-react';
import JSZip from 'jszip';
import { InstagramMediaData, MediaResolution } from '../types/instagram';

interface MediaResultCardProps {
  data: InstagramMediaData;
  onSaveToHistory?: (data: InstagramMediaData) => void;
}

export const MediaResultCard: React.FC<MediaResultCardProps> = ({ data, onSaveToHistory }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainerRef.current.requestFullscreen().catch((err) => console.warn('Fullscreen error:', err));
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleCopyCaption = () => {
    if (!data.caption) return;
    navigator.clipboard.writeText(data.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const currentItem = data.items[currentSlideIndex] || data.items[0];
  const totalSlides = data.items.length;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const triggerDownload = async (resolution: MediaResolution) => {
    setDownloadingId(resolution.id);

    try {
      const ext = resolution.format;
      const cleanAuthor = data.author.username.replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `instavault_${cleanAuthor}_${data.shortcode}_${resolution.id}.${ext}`;
      const downloadProxyUrl = `/api/download?url=${encodeURIComponent(resolution.url)}&filename=${encodeURIComponent(filename)}`;

      // Fetch blob and trigger system file download
      const res = await fetch(downloadProxyUrl);
      if (!res.ok) throw new Error('Download failed from proxy');

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      if (onSaveToHistory) {
        onSaveToHistory(data);
      }
    } catch (err) {
      console.error('Download error, falling back to direct tab:', err);
      window.open(resolution.url, '_blank');
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  const handleDownloadAllZip = async () => {
    if (totalSlides <= 1) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder(`instavault_${data.author.username}_${data.shortcode}`);

      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        const res = item.resolutions[0]; // best quality
        const resUrl = `/api/download?url=${encodeURIComponent(res.url)}&filename=item_${i + 1}.${res.format}`;
        
        try {
          const fetchRes = await fetch(resUrl);
          const blob = await fetchRes.blob();
          folder?.file(`slide_${i + 1}_${res.quality.replace(/[^a-zA-Z0-9]/g, '_')}.${res.format}`, blob);
        } catch (itemErr) {
          console.warn(`Error bundling slide ${i + 1}`, itemErr);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `instavault_${data.author.username}_collection.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(zipUrl);
    } catch (zipErr) {
      console.error('Zip generation failed:', zipErr);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatNumber = (num?: number) => {
    if (!num) return null;
    return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xl overflow-hidden">
        {/* Top Status Banner */}
        <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-950/60 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1 font-semibold text-rose-500 uppercase tracking-wider">
              {data.mediaType === 'reel' && <Film className="w-3.5 h-3.5" />}
              {data.mediaType === 'carousel' && <ImageIcon className="w-3.5 h-3.5" />}
              {data.mediaType === 'story' && <Sparkles className="w-3.5 h-3.5" />}
              {data.mediaType}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-neutral-500">ID: {data.shortcode}</span>
          </div>

          <div className="flex items-center gap-3">
            {data.cached ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Zap className="w-3 h-3 fill-emerald-500" /> Edge Cache Hit ({data.fetchLatencyMs ?? 4}ms)
              </span>
            ) : (
              <span className="text-neutral-500 font-mono">
                Fetched in {data.fetchLatencyMs ?? 45}ms
              </span>
            )}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Media Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div ref={videoContainerRef} className="relative w-full aspect-[9/16] max-h-[500px] bg-neutral-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group">
              {currentItem.type === 'video' ? (
                <>
                  <video
                    ref={videoRef}
                    src={currentItem.resolutions[0]?.url}
                    poster={currentItem.previewUrl}
                    playsInline
                    loop
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain"
                  />
                  {/* Floating Video Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 bg-black/60 rounded-lg p-0.5 pointer-events-auto">
                        {[1, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                              playbackSpeed === speed ? 'bg-rose-500 text-white' : 'text-white/70 hover:text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pointer-events-auto">
                        <button
                          onClick={toggleMute}
                          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={handleFullscreen}
                          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        onClick={togglePlay}
                        className="p-4 rounded-full bg-rose-500/90 text-white hover:bg-rose-500 pointer-events-auto transition-transform hover:scale-110 cursor-pointer shadow-lg"
                      >
                        {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>{currentItem.duration ? `${currentItem.duration}s` : 'HD'}</span>
                      <span className="font-mono">1080p 60fps</span>
                    </div>
                  </div>
                </>
              ) : currentItem.type === 'audio' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-950/60 to-neutral-950 text-white text-center">
                  <div className="relative mb-6">
                    <img
                      src={currentItem.previewUrl}
                      alt={data.title}
                      className="w-36 h-36 rounded-2xl object-cover shadow-2xl border border-white/10"
                    />
                    <div className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-purple-600 text-white shadow-lg">
                      <Music className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  <h4 className="font-bold text-base text-neutral-100 line-clamp-1 mb-1">{data.title}</h4>
                  <p className="text-xs text-neutral-400 mb-6">Original Audio Track · 320kbps MP3</p>

                  {/* Audio Visualizer Waves Simulation */}
                  <div className="flex items-end justify-center gap-1.5 h-10 w-full max-w-[200px]">
                    {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-purple-500 to-rose-400 rounded-full"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <img
                  src={currentItem.previewUrl}
                  alt={data.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              )}

              {/* Multi-slide carousel controls */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1))}
                    aria-label="Previous slide"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0))}
                    aria-label="Next slide"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 rounded-full">
                    {data.items.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          currentSlideIndex === idx ? 'w-5 bg-rose-500' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Carousel thumbnail strip if multiple slides */}
            {totalSlides > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                {data.items.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`relative w-12 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      currentSlideIndex === idx ? 'border-rose-500 scale-105' : 'border-neutral-200 dark:border-neutral-800 opacity-60'
                    }`}
                  >
                    <img
                      src={item.previewUrl}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Author Details & Multiple Resolution Download Options */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Author Lockup */}
              <div className="flex items-center justify-between pb-5 border-b border-neutral-100 dark:border-neutral-800 mb-5">
                <div className="flex items-center gap-3">
                  <img
                    src={data.author.avatarUrl}
                    alt={data.author.username}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-neutral-900 dark:text-neutral-50 hover:underline">
                        @{data.author.username}
                      </span>
                      {data.author.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {data.author.fullName}
                    </p>
                  </div>
                </div>

                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                >
                  <span>Open Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Engagement Metrics (tabular-nums applied) */}
              {(data.metrics.likes || data.metrics.views || data.metrics.comments) && (
                <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-neutral-600 dark:text-neutral-400 mb-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                  {data.metrics.views && (
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                        {formatNumber(data.metrics.views)}
                      </span>{' '}
                      views
                    </div>
                  )}
                  {data.metrics.likes && (
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                        {formatNumber(data.metrics.likes)}
                      </span>{' '}
                      likes
                    </div>
                  )}
                  {data.metrics.comments && (
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                        {formatNumber(data.metrics.comments)}
                      </span>{' '}
                      comments
                    </div>
                  )}
                </div>
              )}

              {/* Caption with clean expand */}
              {data.caption && (
                <div className="mb-6 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-sm text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Caption</span>
                    <button
                      onClick={handleCopyCaption}
                      className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer transition-colors"
                    >
                      {copiedCaption ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <span>Copy Text</span>
                      )}
                    </button>
                  </div>
                  <p className={captionExpanded ? '' : 'line-clamp-2 leading-relaxed'}>
                    {data.caption}
                  </p>
                  {data.caption.length > 90 && (
                    <button
                      onClick={() => setCaptionExpanded(!captionExpanded)}
                      className="mt-1 text-xs font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      {captionExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}

              {/* Multi-Resolution Download Options Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span>Available Resolutions</span>
                  {totalSlides > 1 && (
                    <span className="text-xs font-normal text-neutral-500 lowercase">
                      (Slide {currentSlideIndex + 1} of {totalSlides})
                    </span>
                  )}
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQrModal(true)}
                    title="Scan QR to download directly on smartphone"
                    className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Phone QR</span>
                  </button>

                  {totalSlides > 1 && (
                    <button
                      onClick={handleDownloadAllZip}
                      disabled={isZipping}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>{isZipping ? 'Zipping...' : 'Download All (.ZIP)'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Resolution List */}
              <div className="space-y-2.5 mb-6">
                {currentItem.resolutions.map((res) => {
                  const isDownloading = downloadingId === res.id;
                  const isAudio = res.format === 'mp3' || res.format === 'm4a';

                  return (
                    <div
                      key={res.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        res.isRecommended
                          ? 'border-rose-500/50 bg-rose-500/5 dark:bg-rose-500/10 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isAudio
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300'
                              : res.isRecommended
                              ? 'bg-rose-500 text-white'
                              : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200'
                          }`}
                        >
                          {isAudio ? <Music className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                              {res.quality}
                            </span>
                            {res.isRecommended && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                            <span>{res.resolution}</span>
                            <span aria-hidden="true">·</span>
                            <span>{res.format.toUpperCase()}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                              ~{res.estimatedSize}
                            </span>
                            {res.bitrate && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{res.bitrate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerDownload(res)}
                        disabled={isDownloading}
                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
                          res.isRecommended
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                            : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900'
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Anti-Slop Zero-Pill Assurance */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 flex items-center justify-between">
              <span>Direct uncompressed stream · No watermarks</span>
              <span>100% Free Forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Phone Downloading */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-sm w-full p-6 text-center border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Scan to Download on Mobile
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-5">
              Open your camera app on iPhone or Android to save directly to camera roll.
            </p>

            <div className="p-4 bg-white rounded-xl inline-block shadow-inner border border-neutral-200 mb-4">
              {/* Dynamic QR API with the download link */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  currentItem.resolutions[0]?.url || data.url
                )}`}
                alt="QR Code"
                className="w-44 h-44"
              />
            </div>

            <p className="text-[11px] font-mono text-neutral-500 mb-5 break-all">
              {data.shortcode}
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
