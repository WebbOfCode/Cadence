/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['openai'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...config.externals,
        'canvg': 'canvg',
      };
    }
    return config;
  },
};

module.exports = nextConfig;
