export type MediaType = 'reel' | 'post' | 'carousel' | 'story' | 'highlight' | 'audio' | 'profile';

export interface MediaResolution {
  id: string;
  quality: string; // e.g. '1080p FHD', '720p HD', '480p SD', 'Audio MP3'
  resolution: string; // e.g. '1080x1920', '720x1280', 'Audio Only'
  fps?: number;
  format: 'mp4' | 'jpg' | 'mp3' | 'm4a' | 'webp';
  url: string;
  estimatedSize: string; // e.g. '18.4 MB'
  bitrate?: string;
  isRecommended?: boolean;
}

export interface MediaItem {
  id: string;
  type: 'video' | 'image' | 'audio';
  previewUrl: string;
  resolutions: MediaResolution[];
  aspectRatio?: string;
  duration?: number; // seconds
}

export interface InstagramMediaData {
  id: string;
  url: string;
  shortcode: string;
  mediaType: MediaType;
  title: string;
  caption: string;
  author: {
    username: string;
    fullName: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  metrics: {
    likes?: number;
    views?: number;
    comments?: number;
    shares?: number;
    duration?: number;
  };
  date: string;
  items: MediaItem[];
  cached?: boolean;
  cachedAt?: number;
  fetchLatencyMs?: number;
}

export interface InstagramProfileData {
  username: string;
  fullName: string;
  avatarUrl: string;
  avatarHdUrl: string;
  avatarUltraHdUrl: string;
  isVerified: boolean;
  isPrivate: boolean;
  biography: string;
  externalUrl?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  cached?: boolean;
  fetchLatencyMs?: number;
  samplePosts: {
    id: string;
    shortcode: string;
    thumbnailUrl: string;
    mediaType: 'image' | 'video';
    likes: number;
    comments: number;
    url: string;
  }[];
}

export interface BatchItemResult {
  url: string;
  status: 'success' | 'error';
  data?: InstagramMediaData;
  error?: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  hitRatio: number;
  activeEntriesCount: number;
  totalBytesProxied: number;
  avgLatencyMs: number;
}
