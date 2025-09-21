/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // ブラウザ環境でのfallback設定
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    // 重いパッケージをサーバーサイドのみで除外
    if (isServer) {
      config.externals = [...(config.externals || []),
        'puppeteer',
        'puppeteer-core',
        '@xenova/transformers',
        'sharp',
        'onnxruntime-node'
      ];
    }

    return config;
  },
};

export default nextConfig;