'use strict'

const AggregatorService = require("../../Services/AggregatorService");
const GameInformation = use('App/Models/GameInformation');
const GameFavourite = use('App/Models/GameFavourite');
const ProjectInformation = use('App/Models/ProjectInformation');
const Tokenomic = use('App/Models/Tokenomic');
const HelperUtils = use('App/Common/HelperUtils');
const RedisAggregatorUtils = use('App/Common/RedisAggregatorUtils');
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

      if (game.slug) {
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(game.slug)
      }
      return HelperUtils.responseSuccess('','Update successfully');
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    } finally {
      await RedisAggregatorUtils.deleteAllRedisAggregators()
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
    } finally {
      await RedisAggregatorUtils.deleteAllRedisAggregators()
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
      const aggregator = await aggregatorService.setGame(params, false, 0)

      if (!aggregator) {
        return HelperUtils.responseNotFound();
      }

      if (aggregator && aggregator.slug) {
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(aggregator.slug)
      }
      return HelperUtils.responseSuccess(aggregator);
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

      if (!aggregator) {
        return HelperUtils.responseNotFound();
      }

      if (aggregator && aggregator.slug) {
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(aggregator.slug)
      }
      return HelperUtils.responseSuccess(aggregator);
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

      if (!aggregator) {
        return HelperUtils.responseNotFound();
      }

      if (aggregator && aggregator.slug) {
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(aggregator.slug)
      }
      return HelperUtils.responseSuccess(aggregator);
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

      if (!aggregator) {
        return HelperUtils.responseNotFound();
      }

      if (aggregator && aggregator.slug) {
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(aggregator.slug)
      }
      return HelperUtils.responseSuccess(aggregator);
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

      if (!aggregator) {
        return HelperUtils.responseNotFound();
      }

      if (aggregator && aggregator.slug) {
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(aggregator.slug)
      }
      return HelperUtils.responseSuccess(aggregator);
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

      if (!aggregator) {
        return HelperUtils.responseNotFound();
      }

      if (aggregator && aggregator.slug) {
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(aggregator.slug)
      }
      return HelperUtils.responseSuccess(aggregator);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async getAggregatorAdmin({request}) {
    try {
      const params = request.all();
      const page = params?.page ? parseInt(params?.page) : 1
      const perPage = params?.per_page ? parseInt(params?.per_page) : 10
      const category = params?.category
      const search = params?.search
      const display_area = params?.display_area
      const verified = params?.verified
      let builder = GameInformation.query()
      if (search) {
        builder = builder.where((q) => {
          q.where('category', 'like', `%${search}%`)
            .orWhere('game_name', 'like', `%${search}%`)
            .orWhere('hashtags', 'like', `%${search}%`);
        })
      }
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
      return HelperUtils.responseSuccess(list);
    }catch (e) {
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
      const gameLaunchStatus = params?.game_launch_status
      const sort_by = params?.sort_by ? params?.sort_by : 'cmc_rank'
      const sort_order = params?.sort_order ? params?.sort_order.toUpperCase() : 'ASC'
      const cacheKey = { page, perPage, display_area, ido_type, category, gameLaunchStatus, sort_by, sort_order }
      const selectColumn = [
        'game_informations.id',
        'category',
        'developer',
        'hashtags',
        'game_name',
        'language',
        'system_require',
        'game_intro',
        'game_features',
        'android_link',
        'game_pc_link',
        'ios_link',
        'display_area',
        'intro_video',
        'screen_shots_1',
        'screen_shots_2',
        'screen_shots_3',
        'screen_shots_4',
        'screen_shots_5',
        'web_game_link',
        'top_favourite_link',
        'upload_video',
        'verified',
        'accept_currency',
        'ido_date',
        'ido_image',
        'ido_type',
        'network_available',
        'token_price',
        'short_description',
        'icon_token_link',
        'redkite_ido_link',
        'gamefi_ido_link',
        'slug',
        'game_launch_status',
        'price',
        'price_change_24h',
        'price_change_7d',
        'volume_24h',
        'market_cap',
        'coinmarketcap_slug',
        'cmc_id',
        'token_address',
        'game_informations.created_at',
        'discord_link',
        'official_telegram_link',
        'official_website',
        'twitter_link',
        'medium_link'
      ];

      const aliasCol = [
        'id',
        'created_at',
        'roi',
        'cmc_rank'
      ];
      const sortByAllowance = aliasCol.concat(selectColumn);

      if (!sortByAllowance.includes(sort_by) || !['ASC', 'DESC'].includes(sort_order)) {
        return HelperUtils.responseBadRequest();
      }

      if (await RedisAggregatorUtils.checkExistRedisAggregators(cacheKey)) {
        const cachedList = await RedisAggregatorUtils.getRedisAggregators(cacheKey)
        return HelperUtils.responseSuccess(JSON.parse(cachedList))
      }

      let builder = GameInformation.query()
      if (category) {
        let categorySplit = params.category.split(',');
        builder = builder.where((group) => this.categorySearch(group, categorySplit));
      }
      if (display_area) {
        builder = builder.where('display_area', 'like', `%${display_area}%`)
        if (display_area === 'Top Favorite' || display_area === 'Top Favourite') {
          selectColumn.push(builder.db.knex.raw('(select count(*) from game_favourites where game_id = `game_informations`.`id`) AS like_count'));
          builder.orderBy('like_count', 'DESC');
        }
      }
      if (verified) {
        builder = builder.where('verified', verified)
      }
      if (ido_type) {
        builder = builder.where('ido_type', ido_type)
      }
      if (gameLaunchStatus) {
        builder = builder.where('game_launch_status', gameLaunchStatus);
      }

      builder.orderBy(sort_by, sort_order);
      builder.orderBy('game_informations.id', 'DESC');
      builder = builder.where('is_show', true)

      builder = builder.join('tokenomics as token', 'game_informations.id', 'token.game_id')
      builder = builder.join('project_informations as project', 'game_informations.id', 'project.game_id')

      builder = builder.select(selectColumn);
      builder = builder.select(builder.db.knex.raw('price / token_price as roi'));
      builder = builder.select(builder.db.knex.raw('COALESCE(cmc_rank, 999999) as cmc_rank'));

      const list = await builder.paginate(page, perPage)

      // cache data
      if (page <= 2) {
        await RedisAggregatorUtils.setRedisAggregators(cacheKey, list)
      }
      return HelperUtils.responseSuccess(list);
    }catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  categorySearch(builder, categories) {
    categories.forEach(function(value, index, categories) {
      builder.orWhere('category', 'like', `%${value}%`);
    });
    return builder;
  }

  async findAggregator({request}) {
    try {
      let info = await GameInformation.find(request.params.id)
      if (!info) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(info);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async findAggregatorBySlug({request}) {
    try {
      const slug = request.params.slug
      if (!slug) {
        return HelperUtils.responseNotFound();
      }

      if (await RedisAggregatorUtils.checkExistRedisAggregatorDetail(slug)) {
        return HelperUtils.responseSuccess(JSON.parse(await RedisAggregatorUtils.getRedisAggregatorDetail(slug)));
      }

      const info = await GameInformation.query()
        .where('slug', slug)
        .with('tokenomic')
        .with('projectInformation')
        .first()

      if (!info) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(info);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async findProject({request}) {
    try {
      const project = await ProjectInformation.findBy('game_id',request.params.id)

      if (!project) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(project);
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }

  async findTokenomic({request}) {
    try {
      const tokenomic = await Tokenomic.findBy('game_id',request.params.id)
      if (!tokenomic) {
        return HelperUtils.responseNotFound();
      }

      return HelperUtils.responseSuccess(tokenomic);
    } catch (e) {
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

      if (game && game.slug) {
        await RedisAggregatorUtils.deleteRedisAggregatorDetail(game.slug)
      }
      return HelperUtils.responseSuccess();
    }catch (e) {
      return HelperUtils.responseErrorInternal();
    } finally {
      await RedisAggregatorUtils.deleteAllRedisAggregators()
    }
  }
}

module.exports = AggregatorController;
