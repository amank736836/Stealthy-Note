import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/app",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/app/(app)/dashboard",
        permanent: true,
      },
      {
        source: "/u/:username",
        destination: "/app/(app)/u/:username",
        permanent: true,
      },
      {
        source: "/sign-in",
        destination: "/app/(auth)/sign-in",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/app/(auth)/sign-up",
        permanent: true,
      },
      {
        source: "/verify/:username",
        destination: "/app/(auth)/verify/:username",
        permanent: true,
      },
      {
        source: "/verify/:username/:verifyCode",
        destination: "/app/(auth)/verify/:username/:verifyCode",
        permanent: true,
      },
      {
        source: "/*",
        destination: "/app",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/app/api/:path*",
      },
    ];
  },
  images: {
    domains: ["example.com", "cdn.example.com"],
  },
  i18n: {
    locales: ["en", "fr", "es"],
    defaultLocale: "en",
  },
};

export default nextConfig;
