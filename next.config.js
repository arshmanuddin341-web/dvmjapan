/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
      { protocol: 'https', hostname: 'logo.clearbit.com', pathname: '/**' },
      { protocol: 'https', hostname: 'vl.imgix.net', pathname: '/**' },
      { protocol: 'https', hostname: 'flagcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'app.nobukojapan.com', pathname: '/**' },
      { protocol: 'https', hostname: 'nobukojapan.com', pathname: '/**' },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules', '**/.git', '**/pagefile.sys', '**/hiberfil.sys'],
      };
    }
    return config;
  },
};

module.exports = nextConfig;
