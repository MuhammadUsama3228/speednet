# SpeedNet

A modern, professional internet speed test web app built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and React Hot Toast.

## Features

- 🚀 Auto-starts speed test on page load
- 📊 Measures download (10MB), upload (5MB), and ping (unloaded/loaded)
- 🎨 Beautiful animated circular gauge with real-time progress
- 🌙 Dark mode support with smooth transitions
- 📱 Fully responsive design (mobile-first)
- 🎯 Accessible with ARIA labels and keyboard navigation
- ⚡ Fast performance with streaming downloads
- 🎨 Modern UI with gradients, shadows, and Inter font
- 📋 Share results with one click
- 🌐 Client IP detection
- 🔍 SEO optimized with meta tags, structured data, and social sharing
- 🐳 Docker containerization ready
- 📱 PWA features with manifest and service worker support

## SEO Features

- ✅ Comprehensive meta tags (title, description, keywords)
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card support
- ✅ Structured data (JSON-LD) for rich snippets
- ✅ Sitemap and robots.txt
- ✅ PWA manifest for mobile app-like experience
- ✅ Optimized for search engine crawling

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Custom SVG icons
- **Fonts**: Inter (Google Fonts)

## Setup

1. **Clone and install**:
   ```bash
   git clone <repo>
   cd speednet
   npm install
   ```

2. **Configure environment** (optional):
   Create `.env.local`:
   ```
   NEXT_PUBLIC_APP_NAME=SpeedNet
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Deployment

### Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_APP_NAME=SpeedNet
   ```
3. **Deploy automatically** - Vercel will detect Next.js and deploy

### Docker
Build and run with Docker:

```bash
# Build and run with Docker Compose (recommended)
docker-compose up --build

# Or build manually
docker build -t speednet .
docker run -p 3000:3000 speednet
```

### Other Platforms
Deploy to Netlify, Railway, Render, or any Node.js hosting platform. The app is optimized for static generation where possible.

## Architecture

- **App Router**: Uses Next.js 13+ App Router for modern routing
- **API Routes**: Serverless functions for ping, download, and upload tests
- **Streaming**: Download uses ReadableStream for efficient large file transfer
- **Client Detection**: Fetches public IP for client info
- **Error Handling**: Graceful fallbacks and user-friendly toasts

## Performance

- Minimal bundle size (~100KB gzipped)
- Streaming downloads prevent memory issues
- Optimized animations with Framer Motion
- Dark mode without flash

## SEO & Search Optimization

SpeedNet is optimized for search engines with comprehensive SEO features:

### Target Keywords
- Internet speed test
- Speed test online
- Download speed test
- Upload speed test
- Ping test
- Bandwidth test
- Fast.com alternative
- Speedtest.net alternative

### SEO Features Included
- Meta tags (title, description, keywords)
- Open Graph for Facebook/LinkedIn sharing
- Twitter Cards for Twitter sharing
- Structured data (JSON-LD) for Google rich snippets
- Sitemap.xml for search engine crawling
- Robots.txt for crawler control
- PWA manifest for mobile SEO
- Optimized page speed and performance

### Search Rankings Goals
The app is designed to rank highly for speed test related searches by providing:
- Fast, accurate results
- Mobile-friendly design
- Rich structured data
- Social sharing capabilities
- Clean, professional UI

## Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push and create PR

## License

MIT License - see LICENSE file for details.

```
npm run dev
```

Deploy

Deploy to Vercel — this project uses Next.js and should work out of the box.

Notes

- This project intentionally keeps dependencies minimal. Tailwind requires the PostCSS setup provided.
- The download route streams a 10MB buffer generated server-side.
