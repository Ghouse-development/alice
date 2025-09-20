/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 必要な時だけ最小限の transpilePackages を残す
  transpilePackages: ['html2canvas', 'jspdf'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // ブラウザバンドルから除外
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        sharp: false,
        'onnxruntime-node': false,
        '@xenova/transformers': false,
        canvas: false,
        fs: false,
        path: false,
      };
      // 念のため外部扱いにも
      config.externals = [...(config.externals || []), 'sharp', 'onnxruntime-node', '@xenova/transformers'];
    }
    return config;
  },
};

export default nextConfig;