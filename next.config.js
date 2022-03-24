/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.ibb.co",
      "assets-api.kathmandupost.com",
      "scontent.fbir5-1.fna.fbcdn.net",
      "images.saymedia-content.com"
    ]
  }
};

module.exports = nextConfig;
