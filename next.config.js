// Set by `npm run dev:emulators` (scripts/dev-emulators.sh) only.
const useEmulators = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root: there is a stray package-lock.json in the parent
  // directory tree, and without this Turbopack warns about inferring the root
  // from it instead of from this repo.
  turbopack: { root: __dirname },
  // Sign-up is Google-only now, and the first Google sign-in creates the
  // account, so /register no longer exists. Keep old links working, including
  // CMS content (the home page hero's ctaLink) that may still point at it.
  async redirects() {
    return [{ source: '/register', destination: '/login', permanent: true }];
  },
  images: {
    // Emulator mode serves uploads from the local Storage emulator
    // (http://127.0.0.1:9199), which Next 16 refuses to optimise as a local
    // IP. Serving images as-is avoids that without dangerouslyAllowLocalIP.
    unoptimized: useEmulators,
    // `images.domains` was removed in Next 16 in favour of remotePatterns.
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "assets-api.kathmandupost.com" },
      { protocol: "https", hostname: "scontent.fbir5-1.fna.fbcdn.net" },
      { protocol: "https", hostname: "images.saymedia-content.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "cdn.sanity.io" }
    ]
  }
};

module.exports = nextConfig;
