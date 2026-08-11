import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    optimizePackageImports: ["@fluentui/react-components"],
  },
  serverExternalPackages: ["knex"],
};

export default nextConfig;
