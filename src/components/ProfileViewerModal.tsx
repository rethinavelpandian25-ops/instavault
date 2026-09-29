import React, { useState } from 'react';
import { X, User, Download, CheckCircle, ExternalLink, ShieldCheck, Heart, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { InstagramProfileData } from '../types/instagram';

interface ProfileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileViewerModal: React.FC<ProfileViewerModalProps> = ({ isOpen, onClose }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<InstagramProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchProfile = async (targetUsername?: string) => {
    const raw = (targetUsername || usernameInput).replace(/^@/, '').trim();
    if (!raw) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: raw }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not find Instagram profile');
      }

      setProfileData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">HD Profile Picture (DP) Downloader</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                View & download full-resolution Instagram avatars and profile bios
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

        {/* Input */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFetchProfile();
            }}
            className="space-y-2"
          >
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Instagram Username or Profile URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-semibold">
                  @
                </span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. natgeo, creators, or zuck"
                  className="w-full pl-8 pr-3.5 py-3 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !usernameInput.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold text-sm transition-all cursor-pointer shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get DP'}
              </button>
            </div>

            {/* Quick Demo Handles */}
            <div className="flex items-center gap-2 pt-1 text-xs text-neutral-500">
              <span>Try:</span>
              {['creators', 'natgeo', 'nasa'].map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => {
                    setUsernameInput(handle);
                    handleFetchProfile(handle);
                  }}
                  className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  @{handle}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Profile Details Card */}
          {profileData && (
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="relative group shrink-0">
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.username}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-rose-500 shadow-md p-0.5"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <h4 className="font-bold text-lg text-neutral-900 dark:text-neutral-50">
                      @{profileData.username}
                    </h4>
                    {profileData.isVerified && (
                      <CheckCircle className="w-4 h-4 text-sky-500 fill-sky-500 text-white shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{profileData.fullName}</p>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {profileData.biography}
                  </p>

                  {/* Metrics */}
                  <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs font-semibold">
                    <div>
                      <span className="text-neutral-900 dark:text-neutral-100">
                        {profileData.postsCount.toLocaleString()}
                      </span>{' '}
                      <span className="text-neutral-500 font-normal">posts</span>
                    </div>
                    <div>
                      <span className="text-neutral-900 dark:text-neutral-100">
                        {profileData.followersCount.toLocaleString()}
                      </span>{' '}
                      <span className="text-neutral-500 font-normal">followers</span>
                    </div>
                    <div>
                      <span className="text-neutral-900 dark:text-neutral-100">
                        {profileData.followingCount.toLocaleString()}
                      </span>{' '}
                      <span className="text-neutral-500 font-normal">following</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Buttons for Avatar */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`/api/download?url=${encodeURIComponent(
                    profileData.avatarUltraHdUrl
                  )}&filename=${profileData.username}_avatar_2048p.jpg`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors text-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Ultra HD (2048px)</span>
                </a>
                <a
                  href={`/api/download?url=${encodeURIComponent(
                    profileData.avatarHdUrl
                  )}&filename=${profileData.username}_avatar_1080p.jpg`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors text-center"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Standard HD (1080px)</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
