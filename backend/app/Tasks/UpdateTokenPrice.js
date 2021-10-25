'use strict'

const Task = use('Task')
const Tokenomic = use('App/Models/Tokenomic');
const axios = use('axios');
const RedisAggregatorUtils = use('App/Common/RedisAggregatorUtils');

class UpdateTokenPrice extends Task {
  static get schedule () {
    return '0 0 * * * *'
  }

  async handle () {
    try {
      console.log(`start craw token price`)
      const list_token_builder = Tokenomic.query()
      const BTCQuote = await this.getQuote('bitcoin')
      const ETHQuote = await this.getQuote('ethereum')
      const token_list = await list_token_builder.fetch()
      token_list.rows.map(async row => {
        if (!row.coinmarketcap_slug) {
          return
        }
        const symbol = row.coinmarketcap_slug
        console.log(`getting ${symbol} price`)
        const tokenQuote = await this.getQuote(symbol)
        const tokenRecord = await Tokenomic.findBy('game_id', row.game_id)
        if (!tokenRecord || !tokenQuote) {
          return
        }
        tokenRecord.price = tokenQuote.price
        tokenRecord.price_change_24h = tokenQuote.percent_change_24h
        tokenRecord.market_cap = tokenQuote.market_cap
        tokenRecord.price_btc = (tokenQuote.price / BTCQuote.price)
        tokenRecord.price_btc_change_24h = (tokenQuote.percent_change_24h - BTCQuote.percent_change_24h)
        tokenRecord.price_eth = (tokenQuote.price / ETHQuote.price)
        tokenRecord.price_eth_change_24h = (tokenQuote.percent_change_24h - ETHQuote.percent_change_24h)
        await tokenRecord.save()

        // coinmarketcap_slug
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(row.coinmarketcap_slug)
      })
    } catch (e) {
      console.log(e)
      console.log(`Craw token price failed`)
    }
  }
  async getQuote(symbol) {
    const cmc_api_token = process.env.CMC_PRO_API_KEY
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=${symbol}`;
    const response = await axios.get(url, {headers: {'X-CMC_PRO_API_KEY': cmc_api_token, Accept: 'application/json'}})
    let data
    Object.entries(response?.data?.data).forEach(([key, value]) => {
      data = value
    })
    return data?.quote.USD
  }
}

module.exports = UpdateTokenPrice
