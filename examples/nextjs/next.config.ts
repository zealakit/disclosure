import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@zealakit/disclosure-react"],
  agentRules: false,
};

export default nextConfig;
