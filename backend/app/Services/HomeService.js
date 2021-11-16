'use strict'

const CampaignModel = use('App/Models/Campaign');
const RedisUtils = use('App/Common/RedisUtils');
const BigNumber = use('bignumber.js');

class HomeService {
  async getPerformances() {
    let builder = CampaignModel.query();
    let pools = await builder.where('token_type', 'erc20')
      .where('is_deploy', 1)
      .whereNotNull('slug')
      .with('tokenomic')
      .fetch()

    pools = JSON.parse(JSON.stringify(pools))
    pools = pools.filter((data) => data.tokenomic)
    let specialItem = {}

    let result = pools.map((data) => {
      const name = `${data.slug.split('-').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ')} (${data.tokenomic.ticker})`
      const idoPrice = new BigNumber(data.token_conversion_rate)
      const price = new BigNumber(data.tokenomic.price)
      let roi = price.dividedBy(idoPrice)
      let performace = {
        rank: data.tokenomic.cmc_rank,
        name: name,
        price: price.toFixed(),
        price_change_24h: data.tokenomic.price_change_24h,
        price_change_7d: data.tokenomic.price_change_7d,
        market_cap: data.tokenomic.market_cap,
        volume_24h: data.tokenomic.volume_24h,
        ido_price: idoPrice.toFixed(),
        ido_roi: roi.toFixed()
      }

      if (data.tokenomic.ticker.toLowerCase() === 'gafi') {
        specialItem = performace
      }

      return performace
    })

    result = result.sort(function(a, b) {
      if (a.rank === b.rank) {
        return a.price > b.price
      }

      return a.rank < b.rank
    })

    let data = {
      gamefi: specialItem,
      performances: result
    }

    // Cache data
    await RedisUtils.setRedisPerformanceDetail(data);
    return data
  }
}

module.exports = HomeService;
