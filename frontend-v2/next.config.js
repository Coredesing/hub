const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  images: {
    domains: ['i.imgur.com', 'gamefi-public.s3.amazonaws.com', 'imgur.com', 'images.ctfassets.net', 's3.coinmarketcap.com']
  }
}
