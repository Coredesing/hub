'use strict'

const AggregatorService = require("../../Services/AggregatorService");
const GameInformation = use('App/Models/GameInformation');
const GameFavourite = use('App/Models/GameFavourite');
const ProjectInformation = use('App/Models/ProjectInformation');
const Tokenomic = use('App/Models/Tokenomic');
const HelperUtils = use('App/Common/HelperUtils');
const CONFIGS_FOLDER = '../../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);
const Web3 = require('web3');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);

class AggregatorController {
  async setShowStatus({ request }) {
    try {
      const params = request.all();
      const status = params.status
      const game_id = request.params.id
      if (!game_id) {
        return HelperUtils.responseBadRequest('Invalid data');
      }
      const game = await GameInformation.find(game_id)
      if (!game) {
        return HelperUtils.responseBadRequest('Game not found');
      }
      game.is_show = status
      await game.save()
      return HelperUtils.responseSuccess('','Update successfully');
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async setFavourite({request}) {
    try {
      const params = request.all();
      const signature = params.signature
      let address = params.address
      let status = params.status
      if (!signature || !address) {
        return HelperUtils.responseBadRequest('Invalid data');
      }
      address = address.toLowerCase()
      if (address) {
        let verified = false;
        try {
          verified = await web3.eth.accounts.recover('GameFi User Message', `0x${signature.replace("0x", "")}`);
        } catch (e) {
          console.log(e)
        }

        if (!verified || String(verified).toLowerCase() !== address) {
          return HelperUtils.responseBadRequest('Invalid signature or address');
        }
      }
      const gameFavouriteBuilder = GameFavourite.query()
      gameFavouriteBuilder.where('game_id', request.params.id).where('user_address', address)
      let gameFavourite = await gameFavouriteBuilder.first()
      if (!!gameFavourite) {
        gameFavourite.status = status
        await gameFavourite.save()
        return HelperUtils.responseSuccess('', 'update status successfully')
      }
      gameFavourite = new GameFavourite()
      gameFavourite.game_id = request.params.id
      gameFavourite.user_address = address
      gameFavourite.status = 1
      await gameFavourite.save()
      return HelperUtils.responseSuccess('', 'update status successfully')
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async getLikeById({ request }) {
    try {
      const params = request.all();
      const game_ids = params.ids ? params.ids.split(',') : []
      let gameCount = GameFavourite.query()
      if (game_ids.length > 0) {
        gameCount.where('game_id', 'IN', game_ids)
      }
      gameCount.select('game_id')
      gameCount.count('game_id as total_like')
      gameCount.groupBy('game_id')
      gameCount.orderBy('total_like', 'desc')

      const rs = await gameCount.fetch()
      return HelperUtils.responseSuccess(rs);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async getLikeByAddress({ request }) {
    try {
      const address = request.params.address
      if (!address) {
        return HelperUtils.responseErrorInternal('invalid address!');
      }
      let gameCount = GameFavourite.query()
      gameCount.select('game_id')
      gameCount = gameCount.where('user_address', address)
      gameCount = gameCount.where('status', 1)

      const rs = await gameCount.fetch()
      return HelperUtils.responseSuccess(rs);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async aggregatorCreate({request}) {
    try {
      const params = request.all();
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setGame(params, false, 0)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }
  async aggregatorUpdate({ request }) {
    try {
      const params = request.all();
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setGame(params, true, request.params.id)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async tokenomicsUpdate({request}) {
    try {
      const params = request.all();
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setTokenomic(request.params.id, params, true)
      return aggregator
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async projectUpdate({request}) {
    try {
      const params = request.all();
      console.log(params)
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setProjectInfo(request.params.id, params, true)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async tokenomicsInsert({request}) {
    try {
      const params = request.all();
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setTokenomic(request.params.id, params, false)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async projectInsert({ request}) {
    try {
      const params = request.all();
      console.log(params)
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setProjectInfo(request.params.id, params, false)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async getAggregatorAdmin({request}) {
    try {
      const params = request.all();
      const page = params?.page ? parseInt(params?.page) : 1
      const perPage = params?.per_page ? parseInt(params?.per_page) : 10
      const category = params?.category
      const display_area = params?.display_area
      const verified = params?.verified
      let builder = GameInformation.query()
      if (category) {
        builder = builder.where(`category`, 'like', `%${category}%`)
      }
      if (display_area) {
        builder = builder.where('display_area', 'like', `%${display_area}%`)
      }
      if (verified) {
        builder = builder.where('verified', verified)
      }

      builder = builder.orderBy('created_at', 'DESC')
      const list = await builder.paginate(page, perPage)
      return list
    }catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async getAggregator({request}) {
    try {
      const params = request.all();
      const page = params?.page ? parseInt(params?.page) : 1
      const perPage = params?.per_page ? parseInt(params?.per_page) : 10
      const category = params?.category
      const display_area = params?.display_area
      const verified = params?.verified
      const ido_type = params?.ido_type
      const price = params?.price

      let builder = GameInformation.query()
      if (category) {
        builder = builder.where(`category`, 'like', `%${category}%`)
      }
      if (display_area) {
        builder = builder.where('display_area', 'like', `%${display_area}%`)
      }
      if (verified) {
        builder = builder.where('verified', verified)
      }
      if (ido_type) {
        builder = builder.where('ido_type', ido_type)
      }
      if (price) {
        builder = builder.with('tokenomic')
      }

      builder = builder.where('is_show', true)
      const list = await builder.paginate(page, perPage)
      return list
    }catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async findAggregator({request}) {
    try {
      let game = await GameInformation.find(request.params.id)
      return game
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async findAggregatorBySlug({request}) {
    try {
      let game = await GameInformation.query()
        .where('slug', request.params.slug)
        .with('tokenomic')
        .with('projectInformation')
        .first()
      if (!game) {
        return HelperUtils.responseNotFound();
      }

      return game
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async findProject({request}) {
    try {
      let project = await ProjectInformation.findBy('game_id',request.params.id)
      return project
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async findTokenomic({request}) {
    try {
      let tokenomic = await Tokenomic.findBy('game_id',request.params.id)
      return tokenomic
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async removeGame({request}) {
    try {
      const token = await Tokenomic.findBy('game_id', request.params.id)
      if (token) await token.delete()
      const project = await ProjectInformation.findBy('game_id', request.params.id)
      if (project) await project.delete()
      const game = await GameInformation.findBy('id', request.params.id)
      if (game) game.delete()
      return HelperUtils.responseSuccess();
    }catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }
}

module.exports = AggregatorController;
