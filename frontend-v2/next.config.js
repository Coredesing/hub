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
    domains: ['gamefi-cms.s3.ap-southeast-1.amazonaws.com', 'i.imgur.com', 'gamefi-public.s3.amazonaws.com', 'imgur.com', 'images.ctfassets.net', 's2.coinmarketcap.com', 's3.coinmarketcap.com', 'gamefi.ghost.io', 'test-cms.gamefi.org', 'migration-cms.gamefi.org']
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
      },
      {
        source: '/guildhub/free-to-join',
        destination: '/guilds',
        permanent: false
      },
      {
        source: '/insight/gamefi-org-game-hub-a-steam-like-platform-bring-together-all-blockchain-games-and-gamified-projects',
        destination: '/insight/gamefi-org-game-hub-a-steam-like-platform-to-bring-together-all-blockchain-games-and-gamified-projects',
        permanent: true
      },
      {
        source: '/insight/game-hub-in-gamefi-org-improve-your-experience-to-overview-the-blockchain-gaming-world',
        destination: '/insight/gamefi-org-game-hub-a-steam-like-platform-to-bring-together-all-blockchain-games-and-gamified-projects',
        permanent: true
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
