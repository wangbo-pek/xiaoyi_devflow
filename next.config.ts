import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ["pino", "pino-pretty"],
    experimental: {
        turbopackFileSystemCacheForDev: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.freepik.com",
                port: "",
            },
        ],
    },
};

export default nextConfig;
