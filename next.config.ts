// next.config.ts

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.physna.com",
      },
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com", //
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3100",
        pathname: "/media/**",
      },
    ],
  },
// webpackDevMiddleware: (config) => {
//    config.watchOptions = {
//      poll: 1000,            // 毎秒ポーリング
//      aggregateTimeout: 300, // debounce
//    };
//    return config;
//  },
};