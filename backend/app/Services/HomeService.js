'use strict'

const CampaignModel = use('App/Models/Campaign');
const TokenomicModel = use('App/Models/Tokenomic');
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
    pools = pools.filter((data) => data.tokenomic && data.tokenomic.ticker)
    let specialItem = {}

    let result = pools.map((data) => {
      const name = `${data.slug.split('-').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ')} (${data.tokenomic.ticker})`
      const idoPrice = new BigNumber(data.token_conversion_rate)
      const price = new BigNumber(data.tokenomic.price)
      let roi = price.dividedBy(idoPrice)
      let performace = {
        rank: data.tokenomic.cmc_rank,
        name: name,
        ticker: data.tokenomic.ticker,
        price: price.toFixed(),
        price_change_24h: data.tokenomic.price_change_24h,
        price_change_7d: data.tokenomic.price_change_7d,
        market_cap: data.tokenomic.market_cap,
        volume_24h: data.tokenomic.volume_24h,
        volume_change_24h: data.tokenomic.volume_change_24h,
        ido_price: idoPrice.toFixed(),
        ido_roi: roi.toFixed(),
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${data.tokenomic.cmc_id}.png`
      }

      if (data.tokenomic.ticker.toLowerCase() === 'gafi') {
        specialItem = performace
        specialItem.raised = '$250K'
      }

      return performace
    })

    result = result.sort(function(a, b) {
      let roi_a = new BigNumber(a.ido_roi)
      let roi_b = new BigNumber(b.ido_roi)

      if (roi_a.gt(roi_b)) {
        return -1
      }

      if (roi_a.lt(roi_b)) {
        return 1
      }

      return a.rank - b.rank
    })

    let data = {
      gamefi: specialItem,
      performances: result
    }

    // Cache data
    await RedisUtils.setRedisPerformanceDetail(data);
    return data
  }

  async getTokenomics(tickers) {
    let builder = TokenomicModel.query();
    let pools = await builder.whereIn('ticker', tickers).fetch().catch(e => console.log(e))

    pools = JSON.parse(JSON.stringify(pools))

    // let result = pools

    // result = result.sort(function(a, b) {
    //   let roi_a = new BigNumber(a.ido_roi)
    //   let roi_b = new BigNumber(b.ido_roi)

    //   if (roi_a.gt(roi_b)) {
    //     return -1
    //   }

    //   if (roi_a.lt(roi_b)) {
    //     return 1
    //   }

    //   return a.rank - b.rank
    // })

    // Cache data
    // await RedisUtils.setRedisPerformanceDetail(data);
    return pools
  }
}

module.exports = HomeService;
