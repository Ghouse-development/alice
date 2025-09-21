/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 必要な時だけ最小限の transpilePackages を残す
  transpilePackages: ['html2canvas', 'jspdf'],
  webpack: (config, { isServer }) => {
    // ブラウザ・サーバー両方で除外
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'puppeteer': false,
      'puppeteer-core': false,
      '@xenova/transformers': false,
      'sharp': false,
      'onnxruntime-node': false,
      'canvas': false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    // 外部パッケージとして扱う
    config.externals = [...(config.externals || []),
      'puppeteer',
      'puppeteer-core',
      '@xenova/transformers',
      'sharp',
      'onnxruntime-node'
    ];

    return config;
  },
};

export default nextConfig;