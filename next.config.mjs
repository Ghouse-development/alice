/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack互換性のための設定
  transpilePackages: ['html2canvas', 'jspdf'],

  // Webpack設定（Turbopack無効時）
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドのバンドル最適化
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },

  // 実験的機能は使用しない（Turbopack安定性のため）
  experimental: {},
};

export default nextConfig;