/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "localhost",
      "www.gambrillspartners.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/entcarepat.appspot.com/o/**",
      },
    ],
  },
  // ... other config options
};

export default nextConfig;
