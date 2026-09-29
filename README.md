# InstaVault — Professional Instagram Downloader & Media Vault

A high-performance, ad-free Instagram content extractor and downloader for Reels, Posts, Carousels, Stories, Highlights, Audio/Soundtracks, and HD Profile Avatars (DP).

## 🚀 Features

- **Full-Resolution Downloads**: Master quality 1080p 60fps MP4, 4K Carousel images, 320kbps MP3 audio tracks.
- **Batch Multi-Link Downloader**: Download up to 10 Instagram links simultaneously and export them all as a single `.zip` file.
- **HD Profile Picture (DP) Downloader**: View and download full-resolution 2048px / 1080px avatars by typing `@username`.
- **Audio & Soundtrack Extractor**: Interactive waveform preview player and direct MP3 audio downloader.
- **Built-In Streaming Proxy**: Bypasses Instagram CDN CORS/Hotlink restrictions for 1-click downloads across desktop and mobile browsers.
- **High-Performance In-Memory Cache**: Sub-10ms response times for repeat requests.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, JSZip
- **Backend**: Node.js, Express, TSX, In-Memory LRU Cache
- **Build Tool**: Vite

## 📦 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the full-stack dev server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`.

## 🌐 Deploying to Render (Free Lifetime Hosting)

1. Push this repository to your **GitHub** account.
2. Sign in to [render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Click **Create Web Service**. Render will deploy your website to a live public HTTPS URL!
