/* eslint-disable @typescript-eslint/require-await */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  distDir: process.env.BUILD_DIR || '.next',
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['pages', 'components', 'utils', 'hooks', 'context']
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
      }
    ]
  }
}
