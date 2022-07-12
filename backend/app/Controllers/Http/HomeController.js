'use strict'

const RedisUtils = use('App/Common/RedisUtils');
const HelperUtils = use('App/Common/HelperUtils');
const SubscribeEmailService = use('App/Services/SubscribeEmailService');
const HomeService = use('App/Services/HomeService');
const GameFiVestingService = use('App/Services/GameFiVestingService');
const NFTDetailUtils = use('App/Common/NFTDetailUtils');

class HomeController {
  async subscribe({request}) {
    try {
      const param = request.all()
      const email = param.email
      if (!email) {
        return HelperUtils.responseBadRequest("Email is invalid");
      }

      const subscribeService = new SubscribeEmailService();
      const data = await subscribeService.createRecord(email)
      if (!data) {
        return HelperUtils.responseErrorInternal('Subscribe email error');
      }

      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPerformance({request}) {
    try {
      const param = request.all();
      const limit = param.limit ? param.limit : 10;
      const page = param.page ? param.page : 1;

      // TODO: pagination
      if (await RedisUtils.checkExistV1PerformanceDetail()) {
        const result = await RedisUtils.getRedisV1PerformanceDetail()
        if (result) {
          return HelperUtils.responseSuccess(JSON.parse(result))
        }
      }

      const homeService = new HomeService()
      let data = await homeService.getPerformances()
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getPerformances({request}) {
    try {
      const param = request.all();
      const limit = param.limit ? param.limit : 10;
      const page = param.page ? param.page : 1;

      // TODO: pagination
      if (await RedisUtils.checkExistPerformanceDetail()) {
        const result = await RedisUtils.getRedisPerformanceDetail()
        if (result) {
          return HelperUtils.responseSuccess(JSON.parse(result))
        }
      }

      const homeService = new HomeService()
      let data = await homeService.getPerformances(symbols)
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getLegendImages({ request, auth, params }) {
    try {
      const nftId = parseInt(params.campaignId);
      const LEGEND = HelperUtils.getLegendData()

      if (!LEGEND) {
        return HelperUtils.responseErrorInternal('ERROR: Fetch API error');
      }

      const nft = LEGEND.filter(data => data.id === nftId)
      let image = 'https://gamefi-public.s3.amazonaws.com/legend-valid.png';

      if (nft.valid === false) {
        image = 'https://gamefi-public.s3.amazonaws.com/legend-expired.png'
      }

      return {
        image: image,
        external_url: image,
        description: 'GameFi NFT Legend',
        name: 'Legend',
      };
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }
  // headers: cf-connecting-ip
  // headers: x-forwarded-for

  async getNFTBox({ request, auth, params }) {
    const image = 'https://gamefi-public.s3.amazonaws.com/box.png'
    return {
      image: image,
      external_url: image,
      description: 'GameFi Box',
      name: 'GameFi-Box',
    };
  }

  async getNFTDetail({ request, auth, params }) {
    const nft = request.params.nft
    const param = request.all();

    let image = ''
    let data = {}

    switch (nft) {
      case 'kingdomquest':
        image = 'https://gamefi-public.s3.amazonaws.com/aggregator/optimized/kingdom-quest/Bundle.png'
        break
      case 'befitter':
        image = 'https://gamefi-public.s3.amazonaws.com/aggregator/optimized/befitter/beFITTER_s_Mystery_Shoe_Box_160x160.png'
        break
      case 'kingdomquest-chest':
        const rarity = parseInt(param.rarity) || 0
        image = NFTDetailUtils.getKingdomQuestNFTDetail(rarity)
        data.name = `KingdomQuest Chest`
        data.description = `KingdomQuest Mystery Chest`
        data.rarity = rarity
        break
      case 'epicwar-ticket':
        image = NFTDetailUtils.getEpicWarNFTDetail()
        data.name = `Epic War Gamer ticket`
        data.description = `Epic War Gamer ticket`
        break
      case 'monsterra-ticket':
        image = NFTDetailUtils.getMonsterraNFTDetail()
        data.name = `Monsterra Gamer ticket`
        data.description = `Monsterra Gamer ticket`
        break
      case 'befitter-ticket':
        image = 'https://gamefi-public.s3.amazonaws.com/aggregator/optimized/befitter/ticket.png'
        break
      default:
        return {}
    }
    data.image = image
    data.external_url = image
    if (!data.description) {
      data.description = `GameFi-${nft} Box`
    }
    if (!data.name) {
      data.name = `GameFi-${nft} Box`
    }

    return data
  }

  async getMetaGodTicketDetail({ request, auth, params }) {
    try {
      const nftId = parseInt(request.params.id)
      if (isNaN(nftId) || nftId < 0) {
        return HelperUtils.responseNotFound()
      }

      const data = NFTDetailUtils.getMetagodNFTDetail(nftId)
      if (!data) {
        return HelperUtils.responseNotFound()
      }

      return data
    } catch (e) {
      return HelperUtils.responseErrorInternal()
    }
  }

  async getVestingOption({request}) {
    try {
      const wallet = request.params.address

      const service = new GameFiVestingService()
      let data = await service.getWallet(wallet)
      if (!data) {
        return HelperUtils.responseNotFound()
      }

      return HelperUtils.responseSuccess(data)
    } catch (e) {
      return HelperUtils.responseErrorInternal()
    }
  }

  async createVestingOption({request}) {
    try {
      const wallet = request.header('wallet_address')
      const param = request.all();

      const service = new GameFiVestingService()
      let instance = await service.getWallet(wallet)
      if (instance) {
        return HelperUtils.responseBadRequest(`You can't change vesting option`)
      }

      const data = await service.insertOption({
        wallet: wallet,
        option: param.option,
        pools: param.pools
      })

      return HelperUtils.responseSuccess(data)
    } catch (e) {
      return HelperUtils.responseErrorInternal()
    }
  }

  async getTokenomics({request}) {
    try {
      const param = request.all();
      const limit = param.limit ? param.limit : 10;
      const page = param.page ? param.page : 1;
      const tickers = param.tickers ? param.tickers.split(',') : [];

      // TODO: pagination, cache

      const homeService = new HomeService()
      let data = await homeService.getTokenomics(tickers)
      return HelperUtils.responseSuccess(data);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }
}

module.exports = HomeController
