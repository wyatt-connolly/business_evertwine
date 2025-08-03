import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "**.firebase.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.firebaseapp.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
