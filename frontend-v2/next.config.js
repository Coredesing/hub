/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/require-await */
const path = require('path')

let config = {
  distDir: process.env.BUILD_DIR || '.next',
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'utils', 'hooks', 'context', 'graphql']
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'node_modules')]
  },
  images: {
    domains: ['i.imgur.com', 'gamefi-public.s3.amazonaws.com', 'imgur.com', 'images.ctfassets.net', 's2.coinmarketcap.com', 's3.coinmarketcap.com', 'gamefi.ghost.io']
  },
  redirects () {
    return [
      {
        source: '/unstaking',
        destination: '/staking?u',
        permanent: false
      },
      {
        source: '/game/:slug*',
        destination: '/hub/:slug*',
        permanent: true
      },
      {
        source: '/press',
        destination: '/press-kit',
        permanent: false
      }
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glsl/,
      type: 'asset/source'
    })
    return config
  }
}

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
  })

  config = withBundleAnalyzer(config)
}

module.exports = config
