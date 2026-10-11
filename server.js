// server.js - Production-Ready Secure Server for Shree Ji Stone Murty
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// 1. Trust proxy (essential for rate limiting behind reverse proxies/load balancers)
app.set('trust proxy', 1);

// 2. Hide technology stack information
app.disable('x-powered-by');

// 3. Security Headers via Helmet (Cross-Origin and Localhost Safe)
app.use(helmet({
  contentSecurityPolicy: false, // Prevents blocking frontend CDNs and avoids forcing HTTPS on localhost
  hsts: false, // Handled conditionally below to allow localhost HTTP and clear any cached HSTS
  crossOriginOpenerPolicy: false, // Prevents iframe/cross-origin resource isolation issues
  crossOriginResourcePolicy: false,
  originAgentCluster: false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xContentTypeOptions: true,
  xFrameOptions: { action: "sameorigin" }
}));

// 4. Custom Permissions Policy, XSS Defense & Dynamic HSTS Management
app.use((req, res, next) => {
  // If running in production over HTTPS, enforce strict transport security
  if (isProd && (req.secure || req.headers['x-forwarded-proto'] === 'https')) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  } else {
    // In local development / HTTP, tell the browser to immediately clear any cached HSTS for localhost
    res.setHeader('Strict-Transport-Security', 'max-age=0');
  }
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 5. Global Rate Limiter (DDoS & Brute-Force Protection)
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Up to 200 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP. Please try again in a minute.'
  }
});
app.use(globalLimiter);

// 6. API-Specific Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many API requests. Please try again shortly.'
  }
});

// 7. CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'OPTIONS']
}));

// 8. High-Performance Gzip/Brotli Compression
app.use(compression({
  threshold: 1024
}));

// 9. CRITICAL SECURITY GATEWAY: Block Sensitive Files, Dotfiles, Server Code & Scripts
app.use((req, res, next) => {
  const reqPath = decodeURIComponent(req.path).toLowerCase();

  // Allow standard RFC .well-known directory (e.g. security.txt)
  if (reqPath.startsWith('/.well-known/')) {
    return next();
  }

  // Block any hidden files/folders (e.g. .git, .env, .DS_Store)
  if (reqPath.startsWith('/.') || reqPath.includes('/.')) {
    return res.status(403).send('403 Forbidden: Access Denied');
  }

  // Block server source code and internal scripts/configs from being served
  const forbiddenPatterns = [
    /^\/server(\.min)?\.js$/i,
    /^\/package(\-lock)?\.json$/i,
    /\.py$/i,
    /\.json$/i,
    /\.md$/i,
    /\.sh$/i,
    /\.log$/i,
    /\.lock$/i
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(reqPath)) {
      return res.status(404).sendFile(path.join(__dirname, '404.html'));
    }
  }

  next();
});

// 10. Static File Serving with Production Caching Strategy
app.use(express.static(path.join(__dirname), {
  dotfiles: 'deny',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // HTML pages: fresh cache validation
    if (filePath.endsWith('.html') || filePath.endsWith('/')) {
      res.setHeader('Cache-Control', 'public, no-cache, must-revalidate');
    }
    // Static assets (images, css, js, fonts): 7-day browser caching
    else if (filePath.match(/\.(jpg|jpeg|png|webp|svg|ico|gif|mp4|webm|woff|woff2|ttf|otf|css|js)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
  }
}));

// 11. API Endpoints
app.get('/api/products', apiLimiter, (req, res) => {
  res.json([
    {
      id: 1,
      name: "Ganesh murty",
      image: "product_ganesh_1787762900664.jpg",
      price: "₹12,999"
    },
    {
      id: 2,
      name: "Radha‑Krishna murty",
      image: "product_radha_krishna_1787762913821.jpg",
      price: "₹9,499"
    },
    {
      id: 3,
      name: "Pink Sandstone Temple",
      image: "product_temple_1787762926904.jpg",
      price: "₹22,750"
    }
  ]);
});

// 12. Security Policy (RFC 9116)
app.get('/.well-known/security.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '.well-known', 'security.txt'), { dotfiles: 'allow' }, (err) => {
    if (err) {
      res.type('text/plain').send('Contact: mailto:shreejistonemurty@gmail.com\nExpires: 2027-12-31T23:59:59.000Z\nPreferred-Languages: en, hi\n');
    }
  });
});

// 13. Sitemap & Robots
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').sendFile(path.join(__dirname, 'robots.txt'));
});

// 14. Secure 404 Handler for Unmatched Routes
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: 'Not Found', status: 404 });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// 15. Global Error Handler (Prevents stack trace exposure)
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err.message);
  res.status(500);
  if (req.accepts('html')) {
    res.send('<!DOCTYPE html><html><head><title>500 Error</title></head><body style="font-family:sans-serif;text-align:center;padding:5rem;"><h1>500 - Server Error</h1><p>We are experiencing a temporary error. Please try again shortly.</p></body></html>');
  } else {
    res.json({ error: 'Internal Server Error', status: 500 });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🛡️ Production-secured server running at http://localhost:${PORT}`);
});

// Graceful Termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received: Closing HTTP server gracefully');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('SIGINT received: Closing HTTP server gracefully');
  server.close(() => process.exit(0));
});
