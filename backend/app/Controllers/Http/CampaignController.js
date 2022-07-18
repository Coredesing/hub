'use strict'

const CampaignModel = use('App/Models/Campaign');
const CampaignService = use('App/Services/CampaignService');
const RefundService = use('App/Services/RefundService');
const PoolService = use('App/Services/PoolService');
const WalletService = use('App/Services/WalletAccountService');
const TierService = use('App/Services/TierService');
const WinnerListService = use('App/Services/WinnerListUserService');
const WhitelistService = use('App/Services/WhitelistUserService');
const WhitelistSubmissionService = use('App/Services/WhitelistSubmissionService');
const CampaignClaimConfigService = use('App/Services/CampaignClaimConfigService');
const ReCaptchaService = use("App/Services/ReCaptchaService");
const RedisUserUtils = use('App/Common/RedisUserUtils');
const bs58 = require('bs58');
const nacl = require('tweetnacl');

const UserService = use('App/Services/UserService');
const Const = use('App/Common/Const');
const HelperUtils = use('App/Common/HelperUtils');
const ConvertDateUtils = use('App/Common/ConvertDateUtils');
const RedisUtils = use('App/Common/RedisUtils');
const BigNumber = use('bignumber.js')
BigNumber.config({ EXPONENTIAL_AT: 50 });

const CONFIGS_FOLDER = '../../../blockchain_configs/';
const NETWORK_CONFIGS = require(`${CONFIGS_FOLDER}${process.env.NODE_ENV}`);

const Web3 = require('web3');
const web3 = new Web3(NETWORK_CONFIGS.WEB3_API_URL);
const Config = use('Config');

class CampaignController {
  async campaignList({ request }) {
    try {
      const param = request.all();
      const limit = param.limit ? param.limit : Config.get('const.limit_default');
      const page = param.page ? param.page : Config.get('const.page_default');
      const filter = {};
      let listData = CampaignModel.query().orderBy('id', 'DESC');
      if (param.title) {
        listData = listData.where(builder => {
          builder.where('title', 'like', '%' + param.title + '%')
            .orWhere('symbol', 'like', '%' + param.title + '%')
          if ((param.title).toLowerCase() == Config.get('const.suspend')) {
            builder.orWhere('is_pause', '=', 1)
          }
          if ((param.title).toLowerCase() == Config.get('const.active')) {
            builder.orWhere('is_pause', '=', 0)
          }
        })
      }
      if (param.start_time && !param.finish_time) {
        listData = listData.where('start_time', '>=', param.start_time)
      }
      if (param.finish_time && !param.start_time) {
        listData = listData.where('finish_time', '<=', param.finish_time)
      }
      if (param.finish_time && param.start_time) {
        listData = listData.where('finish_time', '<=', param.finish_time)
          .where('start_time', '>=', param.start_time)
      }
      if (param.registed_by) {
        listData = listData.where('registed_by', '=', param.registed_by)
      }
      listData = await listData.paginate(page, limit);
      return HelperUtils.responseSuccess(listData);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Get campaign list fail !');
    }
  }

  async campaignShow(request) {
    try {
      const campaign_value = request.params.campaign
      const campaigns = await CampaignModel.query().with('transaction').where(function () {
        this.where('campaign_hash', "=", campaign_value)
          .orWhere('id', '=', campaign_value)
      }).first();
      if (!campaigns) {
        return HelperUtils.responseBadRequest('Campaign not found');
      } else {
        const data = JSON.parse(JSON.stringify(campaigns));
        return HelperUtils.responseSuccess(data);
      }
    } catch (e) {
      return HelperUtils.responseErrorInternal('ERROR: show campaign fail !');
    }
  }

  async campaignNew() {
    try {
      const campaigns = await CampaignModel.query().whereNotNull('campaign_hash').with('transaction').orderBy('created_at', 'desc').first();
      return HelperUtils.responseSuccess(campaigns);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Create campaign fail !');
    }
  }

  async campaignLatestActive() {
    try {
      const campaigns = await CampaignModel.query().whereNotNull('campaign_hash').with('transaction')
        .where('is_pause', Const.ACTIVE).orderBy('created_at', 'desc').first();
      return HelperUtils.responseSuccess(campaigns);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Get campaign latest fail !');
    }
  }

  async campaignCreate({ request }) {
    try {
      const params = request.all();
      const findCampaign = await CampaignModel.query().where('transaction_hash', '=', params.transactionHash).first();
      const CampaignSv = new CampaignService();
      if (findCampaign) {
        const campaignChange = await CampaignSv.changeCampaign(params)
        return campaignChange;
      } else {
        const campaign = await CampaignSv.addCampaign(params)
        return campaign;
      }
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: create campaign fail !');
    }
  }

  async joinCampaign({ request }) {
    // get request params
    const campaign_id = request.input('campaign_id');
    const wallet_address = request.header('wallet_address');
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Invalid campaign');
    }
    try {
      // check campaign
      const campaignService = new CampaignService();
      const camp = await campaignService.findByCampaignId(campaign_id);
      if (!camp || camp.buy_type !== Const.BUY_TYPE.WHITELIST_LOTTERY) {
        return HelperUtils.responseBadRequest("Invalid campaign")
      }
      const currentDate = ConvertDateUtils.getDatetimeNowUTC();
      // check time to join campaign
      if (camp.start_join_pool_time > currentDate || camp.end_join_pool_time < currentDate) {
        return HelperUtils.responseBadRequest("Invalid time");
      }
      let email = ''
      const userService = new UserService();

      const userParams = {
        'wallet_address': wallet_address
      }
      const user = await userService.findUser(userParams);

      if (!camp.kyc_bypass) {
        // get user info
        if (!user || !user.email) {
          return HelperUtils.responseBadRequest("User not found");
        }
        if (user.is_kyc !== Const.KYC_STATUS.APPROVED) {
          return HelperUtils.responseBadRequest("Your KYC status is not verified");
        }
        email = user.email
      }

      const solana_address = request.input('solana_address');
      if (camp.airdrop_network === 'solana') {
        const solana_signature = request.input('solana_signature');
        if (!solana_address || !solana_signature) {
          return HelperUtils.responseBadRequest('Invalid Solana Signature or address!');
        }
        const signatureUint8 = bs58.decode(solana_signature);
        const nonceUint8 = new TextEncoder().encode(process.env.MESSAGE_INVESTOR_SIGNATURE);
        const pubKeyUint8 = bs58.decode(solana_address);
        const verified = nacl.sign.detached.verify(nonceUint8, signatureUint8, pubKeyUint8)
        if (!verified) {
          return HelperUtils.responseBadRequest('Invalid Signature!');
        }
        const checkAddress = await userService.buildQueryBuilder({ solana_address }).first();
        if (!!checkAddress && checkAddress?.wallet_address !== wallet_address) {
          return HelperUtils.responseBadRequest('Duplicate solana address with another user!');
        }

        if (user && user.solana_address !== solana_address) {
          user.solana_address = solana_address
          await user.save()
          await RedisUserUtils.deleteRedisUserProfile(wallet_address)
        }
      }

      // check if user submitted the whitelist form
      const whitelistSubmissionService = new WhitelistSubmissionService();
      const submissionParams = {
        'wallet_address': wallet_address,
        'campaign_id': campaign_id,
      }
      const whitelistSubmission = whitelistSubmissionService.findSubmission(submissionParams)
      if (!whitelistSubmission) {
        return HelperUtils.responseBadRequest("Whitelist submission not found");
      }
      // check user tier
      const userTier = (await HelperUtils.getUserTierSmartWithCached(wallet_address))[0];
      // check user tier with min tier of campaign
      if (camp.min_tier > userTier) {
        return HelperUtils.responseBadRequest("You need to achieve a higher rank for applying whitelist");
      }
      // call to db to get tier info
      const tierService = new TierService();
      const tierParams = {
        'campaign_id': campaign_id,
        'level': userTier
      };
      const tier = await tierService.findByLevelAndCampaign(tierParams);
      if (!tier) {
        return HelperUtils.responseBadRequest("Ranking not found");
      }
      // call to join campaign
      await campaignService.joinCampaign(campaign_id, wallet_address, solana_address, email);
      return HelperUtils.responseSuccess(null, "Apply Whitelist successful");
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async depositBox({ request }) {
    // get all request params
    const params = request.all();
    const campaign_id = params.campaign_id;
    const userWalletAddress = request.header('wallet_address') ? request.header('wallet_address') : params.wallet_address;
    const amount = params.amount;
    const token = params.token ? params.token : '0x0000000000000000000000000000000000000000';
    const subBoxId = params.sub_box_id;
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }

    try {
      if(!userWalletAddress) {
        return HelperUtils.responseBadRequest("Wallet address not found");
      }

      // call to db get campaign info
      const campaignService = new PoolService();
      let camp = null
      try {
        if (await RedisUtils.checkExistRedisPoolDetail(campaign_id)) {
          const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(campaign_id);
          camp = JSON.parse(cachedPoolDetail)
        }
      } catch (e) {
        camp = null
      }

      if (!camp || !camp.freeBuyTimeSetting || !Array.isArray(camp.tiers)) {
        camp = await campaignService.buildQueryBuilder({ id: campaign_id })
          .with('freeBuyTimeSetting')
          .with('tiers')
          .first();

        camp = JSON.parse(JSON.stringify(camp))
      }

      if (!camp) {
        return HelperUtils.responseBadRequest("Do not found campaign");
      }

      if (camp.token_type !== Const.TOKEN_TYPE.MYSTERY_BOX) {
        return HelperUtils.responseBadRequest("Cannot buy");
      }

      const captchaService = new ReCaptchaService()
      const verifiedData = await captchaService.Verify(params.captcha_token, userWalletAddress, camp.start_time, camp.start_pre_order_time)
      if (!verifiedData.status) {
        return HelperUtils.responseBadRequest(`reCAPTCHA verification failed: ${verifiedData.message}`);
      }

      if (!camp.kyc_bypass) {
        // get user info
        const userService = new UserService();
        const user = await userService.findUser({wallet_address: userWalletAddress});
        if (!user || !user.email) {
          return HelperUtils.responseBadRequest("User not found");
        }
        if (user.is_kyc !== Const.KYC_STATUS.APPROVED) {
          return HelperUtils.responseBadRequest("Your KYC status is not verified");
        }
      }

      const current = ConvertDateUtils.getDatetimeNowUTC();
      const { isFreeBuyTime, existWhitelist } = await campaignService.getFreeBuyTimeInfo(camp, userWalletAddress);

      if (!existWhitelist && !isFreeBuyTime) {
        return HelperUtils.responseBadRequest("You are not allowed to buy this time");
      }

      // check user tier if user not in reserved list
      // get realtime tier from SC
      const currentTier = (await HelperUtils.getUserTierSmartWithCached(userWalletAddress))[0];
      const isInPreOrderTime = HelperUtils.checkIsInPreOrderTime(camp, currentTier);

      // get user tier from winner table which snapshot user balance and pickup random winner
      // check user tier with min tier of campaign
      if (camp.min_tier > currentTier) {
        return HelperUtils.responseBadRequest("You need to achieve a higher rank for buying tokens");
      }

      // call to db to get tier info
      let tier = camp.tiers.find(t => t.level === currentTier)

      // check time start buy for tier
      if (!isFreeBuyTime && !isInPreOrderTime) {
        if (tier.start_time > current) {
          return HelperUtils.responseBadRequest('Please wait for your tier time');
        }
        if (tier.end_time < current) {
          return HelperUtils.responseBadRequest("Tier timeout");
        }
      }

      // get private key for campaign from db
      const walletService = new WalletService();
      const wallet = await walletService.findByCampaignId({campaign_id: campaign_id});
      if (!wallet) {
        return HelperUtils.responseErrorInternal();
      }

      // get message hash
      const eventId = 0
      const messageHash = web3.utils.soliditySha3(userWalletAddress, eventId, token, amount, subBoxId);
      const privateKey = wallet.private_key;
      // create signature
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const accAddress = account.address;
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = accAddress;
      const signature = await web3.eth.sign(messageHash, accAddress);
      return HelperUtils.responseSuccess({signature: signature, eventId: eventId, token: token, amount: amount, subBoxId: subBoxId});
    } catch (e) {
      console.log('Deposit box', e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async auctionBox({ request }) {
    // get all request params
    const params = request.all();
    const campaign_id = params.campaign_id;
    const userWalletAddress = request.header('wallet_address');
    const amount = params.amount;
    const token = params.token ? params.token : '0x0000000000000000000000000000000000000000';
    const subBoxId = params.sub_box_id;
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }

    try {
      // call to db get campaign info
      const campaignService = new PoolService();
      let camp = null
      try {
        if (await RedisUtils.checkExistRedisPoolDetail(campaign_id)) {
          const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(campaign_id);
          camp = JSON.parse(cachedPoolDetail)
        }
      } catch (e) {
        camp = null
      }

      if (!camp || !camp.freeBuyTimeSetting || !Array.isArray(camp.tiers)) {
        camp = await campaignService.buildQueryBuilder({ id: campaign_id })
          .with('freeBuyTimeSetting')
          .with('tiers')
          .first();

        camp = JSON.parse(JSON.stringify(camp))
      }

      if (!camp) {
        return HelperUtils.responseBadRequest("Do not found campaign");
      }

      if (camp.token_type !== Const.TOKEN_TYPE.MYSTERY_BOX && camp.process !== Const.PROCESS.ONLY_AUCTION) {
        return HelperUtils.responseBadRequest("Cannot bid");
      }

      const captchaService = new ReCaptchaService()
      const verifiedData = await captchaService.Verify(params.captcha_token, userWalletAddress, camp.start_time, camp.start_pre_order_time)
      if (!verifiedData.status) {
        return HelperUtils.responseBadRequest(`reCAPTCHA verification failed: ${verifiedData.message}`);
      }

      if (!camp.kyc_bypass) {
        // get user info
        const userService = new UserService();
        const user = await userService.findUser({wallet_address: userWalletAddress});
        if (!user || !user.email) {
          return HelperUtils.responseBadRequest("User not found");
        }
        if (user.is_kyc !== Const.KYC_STATUS.APPROVED) {
          return HelperUtils.responseBadRequest("Your KYC status is not verified");
        }
      }

      const current = ConvertDateUtils.getDatetimeNowUTC();
      const { isFreeBuyTime, existWhitelist } = await campaignService.getFreeBuyTimeInfo(camp, userWalletAddress);

      if (!existWhitelist && !isFreeBuyTime) {
        return HelperUtils.responseBadRequest("You are not allowed to buy this time");
      }

      // check user tier if user not in reserved list
      // get realtime tier from SC
      const currentTier = (await HelperUtils.getUserTierSmartWithCached(userWalletAddress))[0];
      const isInPreOrderTime = HelperUtils.checkIsInPreOrderTime(camp, currentTier);

      // get user tier from winner table which snapshot user balance and pickup random winner
      // check user tier with min tier of campaign
      if (camp.min_tier > currentTier) {
        return HelperUtils.responseBadRequest("You need to achieve a higher rank for bidding");
      }

      // call to db to get tier info
      let tier = camp.tiers.find(t => t.level === currentTier)

      // check time start buy for tier
      if (!isFreeBuyTime && !isInPreOrderTime) {
        if (tier.start_time > current) {
          return HelperUtils.responseBadRequest('Please wait for your tier time');
        }
        if (tier.end_time < current) {
          return HelperUtils.responseBadRequest("Tier timeout");
        }
      }

      // get private key for campaign from db
      const walletService = new WalletService();
      const wallet = await walletService.findByCampaignId({campaign_id: campaign_id});
      if (!wallet) {
        return HelperUtils.responseErrorInternal();
      }

      // get message hash
      const messageHash = web3.utils.soliditySha3(userWalletAddress, token, amount, subBoxId);
      const privateKey = wallet.private_key;
      // create signature
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const accAddress = account.address;
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = accAddress;
      const signature = await web3.eth.sign(messageHash, accAddress);
      return HelperUtils.responseSuccess({signature: signature, token: token, amount: amount, subBoxId: subBoxId});
    } catch (e) {
      console.log('Deposit box', e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async deposit({ request }) {
    // get all request params
    const params = request.all();
    const campaign_id = params.campaign_id;
    const userWalletAddress = request.header('wallet_address');
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }

    try {
      // check campaign info
      const filterParams = {
        'campaign_id': campaign_id
      };
      // call to db get campaign info
      const campaignService = new PoolService();
      let camp = null
      try {
        if (await RedisUtils.checkExistRedisPoolDetail(campaign_id)) {
          const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(campaign_id);
          camp = JSON.parse(cachedPoolDetail)
        }
      } catch (e) {
        camp = null
      }

      if (!camp || !camp.freeBuyTimeSetting || !Array.isArray(camp.tiers)) {
        camp = await campaignService.buildQueryBuilder({ id: campaign_id })
          .with('freeBuyTimeSetting')
          .with('tiers')
          .first();

        camp = JSON.parse(JSON.stringify(camp))
      }

      if (!camp) {
        return HelperUtils.responseBadRequest("Do not found campaign");
      }

      if (camp.process === Const.PROCESS.ONLY_CLAIM || camp.token_type === Const.TOKEN_TYPE.MYSTERY_BOX) {
        return HelperUtils.responseBadRequest("Cannot buy");
      }

      const captchaService = new ReCaptchaService()
      const verifiedData = await captchaService.Verify(params.captcha_token, userWalletAddress, camp.start_time, camp.start_pre_order_time)
      if (!verifiedData.status) {
        return HelperUtils.responseBadRequest(`reCAPTCHA verification failed: ${verifiedData.message}`);
      }

      if (!camp.kyc_bypass) {
        // get user info
        const userService = new UserService();
        const user = await userService.findUser({wallet_address: userWalletAddress});
        if (!user || !user.email) {
          return HelperUtils.responseBadRequest("User not found");
        }
        if (user.is_kyc !== Const.KYC_STATUS.APPROVED) {
          return HelperUtils.responseBadRequest("Your KYC status is not verified");
        }
      }

      let minBuy = 0, maxBuy = 0;
      let winner;
      const current = ConvertDateUtils.getDatetimeNowUTC();
      const currentTier = (await HelperUtils.getUserTierSmartWithCached(userWalletAddress))[0];
      if (currentTier < camp.min_tier) {
        return HelperUtils.responseBadRequest("You need to achieve a higher rank for buying tokens");
      }

      // FREE BUY TIME:
      const { maxBonus, isFreeBuyTime, existWhitelist } = await campaignService.getFreeBuyTimeInfo(camp, userWalletAddress);

      // check user winner or reserved lis if campaign is lottery
      if (camp.buy_type === Const.BUY_TYPE.WHITELIST_LOTTERY) {
        // check if exist in winner list
        winner = await (new WinnerListService()).findOneByFilters({ wallet_address: userWalletAddress, campaign_id: campaign_id, forceWinner: true });

        // if user not in winner list then check on reserved list
        if (!isFreeBuyTime && !winner) {
          return HelperUtils.responseBadRequest("You did not win this time");
        }
      }
      // check user tier if user not in reserved list
      if (winner) {
        // get realtime tier from SC
        const isInPreOrderTime = HelperUtils.checkIsInPreOrderTime(camp, currentTier);

        // if user decrement their tier then they can not buy token
        if (currentTier < winner.level) {
          if (!isFreeBuyTime) {
            return HelperUtils.responseBadRequest('You have decreased your rank which led you cannot buy tokens');
          }
        }
        // get user tier from winner table which snapshot user balance and pickup random winner
        // check user tier with min tier of campaign
        if (camp.min_tier > winner.level) {
          if (!isFreeBuyTime) {
            return HelperUtils.responseBadRequest("You need to achieve a higher rank for buying tokens");
          }
        }

        // call to db to get tier info
        let tier = camp.tiers.find(t => t.level === winner.level)
        if (!tier) {
          tier = await (new TierService()).findByLevelAndCampaign({ campaign_id, level: winner.level });
        }
        if (!tier) {
          if (!isFreeBuyTime) {
            return HelperUtils.responseBadRequest("You are not allowed to join this campaign");
          }
        } else {
          // check time start buy for tier
          if (!isFreeBuyTime && !isInPreOrderTime) {
            if (tier.start_time > current) {
              return HelperUtils.responseBadRequest('Please wait for your tier time');
            }
            if (tier.end_time < current) {
              return HelperUtils.responseBadRequest("Tier timeout");
            }
          }
          // set min, max buy amount of user
          minBuy = tier.min_buy;
          maxBuy = tier.max_buy * winner.lottery_ticket;
        }
      }

      // get private key for campaign from db
      const walletService = new WalletService();
      const wallet = await walletService.findByCampaignId(filterParams);
      if (!wallet) {
        return HelperUtils.responseErrorInternal();
      }
      // call to SC to get convert rate token erc20 -> our token
      const receipt = await HelperUtils.getOfferCurrencyInfo(camp);
      const rate = new BigNumber(receipt[0]);
      const decimal = receipt[1];
      const unit = receipt[2];

      // FREE BUY TIME: Check if current time is free to buy or not
      if (isFreeBuyTime) {
        console.log('[CampaignController::deposit] - maxBuy-maxBonus:', maxBuy, maxBonus, !!existWhitelist);
        if (!!existWhitelist || winner) {
          maxBuy = new BigNumber(maxBuy).plus(maxBonus).toNumber();
        }
      }

      // calc min, max token user can buy
      const maxTokenAmount = new BigNumber(maxBuy).multipliedBy(rate).dividedBy(Math.pow(10, Number(decimal))).multipliedBy(Math.pow(10, unit)).toFixed(0);
      const minTokenAmount = new BigNumber(minBuy).multipliedBy(rate).dividedBy(Math.pow(10, Number(decimal))).multipliedBy(Math.pow(10, unit)).toFixed(0);
      // get message hash
      const messageHash = web3.utils.soliditySha3(userWalletAddress, maxTokenAmount, minTokenAmount);
      const privateKey = wallet.private_key;
      // create signature
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const accAddress = account.address;
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = accAddress;
      const signature = await web3.eth.sign(messageHash, accAddress);
      console.log(`signature ${signature}`);
      const response = {
        'max_buy': maxTokenAmount,
        'min_buy': minTokenAmount,
        'signature': signature
      }
      return HelperUtils.responseSuccess(response);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal("Deposit has internal server error !");
    }
  }

  async depositAdmin({ request }) {
    const requestParams = request.only(['minBuy', 'maxBuy', 'userWalletAddress', 'campaignId']);
    console.log('requestParams: ', requestParams);
    const campaignId = requestParams.campaignId;
    const minTokenAmount = requestParams.minBuy || 0;
    const maxTokenAmount = requestParams.maxBuy;
    const userWalletAddress = requestParams.userWalletAddress;

    const filterParams = {
      'campaign_id': campaignId,
    };
    // get private key for campaign from db
    const walletService = new WalletService();
    const wallet = await walletService.findByCampaignId(filterParams);
    if (!wallet) {
      console.log(`Do not found wallet for campaign ${campaign_id}`);
      return HelperUtils.responseBadRequest("Do not found wallet for campaign");
    }

    console.log('Wallet: ', wallet);
    const privateKey = wallet.private_key;
    console.log('privateKey: ', privateKey);
    const messageHash = web3.utils.soliditySha3(userWalletAddress, maxTokenAmount, minTokenAmount);
    console.log('messageHash: ', messageHash);

    // create signature
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log('account: ', account);

    const accAddress = HelperUtils.checkSumAddress(account.address);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = accAddress;
    const signature = await web3.eth.sign(messageHash, accAddress);
    console.log(`signature ${signature}`);

    const response = {
      'max_buy': maxTokenAmount,
      'min_buy': minTokenAmount,
      'signature': signature
    };

    return HelperUtils.responseSuccess(response);
  }

  async countingJoinedCampaign({ request }) {
    const campaignId = request.params.campaignId;
    try {
      // get from redis cached
      // let redisKey = 'counting_' + campaignId;
      // if (await Redis.exists(redisKey)) {
      //   console.log(`existed key ${redisKey} on redis`);
      //   const cachedWL = await Redis.get(redisKey);
      //   return HelperUtils.responseSuccess(JSON.parse(cachedWL));
      // }
      // if not existed on redis then get from db
      const wlService = new WhitelistService();
      let noOfParticipants = await wlService.countByCampaignId(campaignId);
      if (!noOfParticipants) {
        noOfParticipants = 0;
      }
      // save to redis
      // await Redis.set(redisKey, JSON.stringify(noOfParticipants));
      return HelperUtils.responseSuccess(noOfParticipants);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal("Counting join campaign has internal server error !");
    }
  }

  async checkJoinedCampaign({ request, auth }) {
    const campaignId = request.params.campaignId
    // get user wallet
    const userWalletAddress = request.input('wallet_address')
    if (!userWalletAddress) {
      return HelperUtils.responseBadRequest("invalid wallet")
    }

    const campaignService = new PoolService()
    const camp = await campaignService.getPoolWithFreeBuySettingById(campaignId)
    if (!camp) {
      return HelperUtils.responseBadRequest("Do not found campaign")
    }

    if (!camp.start_join_pool_time && !camp.end_join_pool_time) {
      return HelperUtils.responseSuccess(true)
    }

    try {
      const wlService = new WhitelistService()
      const existed = await wlService.checkExisted(userWalletAddress, campaignId)
      return HelperUtils.responseSuccess(existed)
    } catch (e) {
      return HelperUtils.responseErrorInternal()
    }
  }

  async refundIDOToken({ request, params }) {
    try {
      const params = request.all()
      const campaign_id = params.campaign_id
      const userWalletAddress = request.header('wallet_address')
      const reason = params.reason

      if (!campaign_id) {
        return HelperUtils.responseBadRequest('Bad request with campaign_id')
      }

      // call to db get campaign info
      const campaignService = new PoolService();
      let camp = null
      try {
        if (await RedisUtils.checkExistRedisPoolDetail(campaign_id)) {
          const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(campaign_id);
          camp = JSON.parse(cachedPoolDetail)
        }
      } catch (e) {
        camp = null
      }

      if (!camp) {
        camp = await campaignService.buildQueryBuilder({ id: campaign_id })
          .with('freeBuyTimeSetting')
          .with('tiers')
          .first();

        camp = JSON.parse(JSON.stringify(camp))
      }

      if (!camp) {
        return HelperUtils.responseBadRequest("Do not found campaign")
      }

      // check type of pool

      // call to SC to get amount token purchased of user
      // const campaignClaimSC = await HelperUtils.getContractClaimInstance(camp);
      // const [userPurchased, userClaimed] = await Promise.all([
      //   campaignClaimSC.methods.userPurchased(userWalletAddress).call(),
      //   campaignClaimSC.methods.userClaimed(userWalletAddress).call(),
      // ]);

      const now = Date.now() / 1000
      if (!camp.start_refund_time || !camp.end_refund_time || now < +camp.start_refund_time || now > +camp.end_refund_time) {
        return HelperUtils.responseBadRequest("Can not refund at this time")
      }

      // Check user claimed & user purchased
      // if (userClaimed > 0 || userPurchased === 0) {
      //   return HelperUtils.responseBadRequest("Can not refund");
      // }

      const refundService = new RefundService()
      await refundService.createRefundRequest(campaign_id, userWalletAddress, reason)

      const currency = HelperUtils.getCurrencyAddress(camp.network_available, camp.accept_currency)
      const deadline = camp.end_refund_time
      const messageHash = web3.utils.soliditySha3(userWalletAddress, currency, deadline)

      // get private key for campaign from db
      const walletService = new WalletService()
      const wallet = await walletService.findByCampaignId({campaign_id: campaign_id})
      if (!wallet) {
        return HelperUtils.responseBadRequest("Do not found wallet for campaign")
      }
      const privateKey = wallet.private_key
      // create signature
      const account = web3.eth.accounts.privateKeyToAccount(privateKey)
      const accAddress = account.address
      web3.eth.accounts.wallet.add(account)
      web3.eth.defaultAccount = accAddress
      const signature = await web3.eth.sign(messageHash, accAddress)
      return HelperUtils.responseSuccess({
        signature: signature,
        currency,
        deadline
      });
    } catch (e) {
      return HelperUtils.responseErrorInternal('Refund error')
    }
  }

  async claimRefundIDOToken({ request, params }) {
    try {
      const params = request.all()
      const campaign_id = params.campaign_id
      const userWalletAddress = request.header('wallet_address')

      if (!campaign_id) {
        return HelperUtils.responseBadRequest('Bad request with campaign_id')
      }
      const campaignService = new PoolService()
      let camp = null
      try {
        if (await RedisUtils.checkExistRedisPoolDetail(campaign_id)) {
          const cachedPoolDetail = await RedisUtils.getRedisPoolDetail(campaign_id)
          camp = JSON.parse(cachedPoolDetail)
        }
      } catch (e) {
        camp = null
      }

      if (!camp) {
        camp = await campaignService.buildQueryBuilder({ id: campaign_id }).first()
        camp = JSON.parse(JSON.stringify(camp))
      }

      if (!camp) {
        return HelperUtils.responseBadRequest("Do not found campaign")
      }

      // check type of pool

      // call to SC to get amount token purchased of user
      // const campaignClaimSC = await HelperUtils.getContractClaimInstance(camp);
      // const [userRefundToken, tokenSold] = await Promise.all([
      //   campaignClaimSC.methods.userRefundToken(userWalletAddress).call(),
      //   HelperUtils.getTokenSoldSmartContract(camp)
      // ]);
      // Check claim refund
      // if (userRefundToken.isClaimed || userRefundToken.currencyAmount == 0) {
      //   return HelperUtils.responseBadRequest("Can not to claim refund");
      // }

      const currency = HelperUtils.getCurrencyAddress(camp.network_available, camp.accept_currency)
      const messageHash = web3.utils.soliditySha3(userWalletAddress, currency)
      const walletService = new WalletService()
      const wallet = await walletService.findByCampaignId({campaign_id: campaign_id})
      if (!wallet) {
        return HelperUtils.responseBadRequest("Do not found wallet for campaign")
      }
      const privateKey = wallet.private_key
      // create signature
      const account = web3.eth.accounts.privateKeyToAccount(privateKey)
      const accAddress = account.address
      web3.eth.accounts.wallet.add(account)
      web3.eth.defaultAccount = accAddress
      const signature = await web3.eth.sign(messageHash, accAddress)
      return HelperUtils.responseSuccess({
        signature: signature,
        currency
      })
    } catch (error) {
      return HelperUtils.responseErrorInternal('Claim refund error')
    }
  }

  async claim({ request }) {
    // get all request params
    const params = request.all();
    const campaign_id = params.campaign_id;
    const userWalletAddress = request.header('wallet_address');
    if (!campaign_id) {
      return HelperUtils.responseBadRequest('Bad request with campaign_id');
    }

    // blacklist
    if (!userWalletAddress || userWalletAddress.toLowerCase() === '0xbc28a600176f8c529d7b186c014d97bdce5d6b8f') {
      return HelperUtils.responseBadRequest("Wallet not found");
    }

    try {
      // check campaign info
      const filterParams = {
        'campaign_id': campaign_id
      };
      // call to db get campaign info
      const campaignService = new PoolService();
      const camp = await campaignService.getPoolWithFreeBuySettingById(campaign_id);
      if (!camp) {
        return HelperUtils.responseBadRequest("Do not found campaign");
      }
      if (camp.pool_type !== Const.POOL_TYPE.CLAIMABLE) {
        return HelperUtils.responseBadRequest("Campaign is not claimable!");
      }

      if (camp.process === Const.PROCESS.ONLY_BUY
        || camp.token_type === Const.TOKEN_TYPE.MYSTERY_BOX
        || (camp.token_type === Const.TOKEN_TYPE.ERC721 && camp.process === Const.PROCESS.ALL)) {
        return HelperUtils.responseBadRequest("Cannot claim");
      }

      // Force user min tier from campaign_id 81. (MetaGod)
      if (camp.id >= 81) {
        const currentTier = (await HelperUtils.getUserTierSmartWithCached(userWalletAddress))[0];
        if (currentTier < camp.min_tier) {
          return HelperUtils.responseBadRequest("You need to increase your rank to claim tokens");
        }
      }

      // get campaign claim config from db
      const claimParams = {
        'campaign_id': campaign_id,
        'current_time': ConvertDateUtils.getDatetimeNowUTC()
      };
      const claimConfigService = new CampaignClaimConfigService();
      const claimConfig = await claimConfigService.findLastClaimPhase(claimParams);
      if (!claimConfig) {
        return HelperUtils.responseBadRequest("You can not claim token at current time!");
      }

      let maxTokenClaim = new BigNumber(0);
      if (camp.token_type === Const.TOKEN_TYPE.ERC721 && camp.process === Const.PROCESS.ONLY_CLAIM) {
        const winnerListService = new WinnerListService();
        let winner = await winnerListService.findOneByFilters({'wallet_address': userWalletAddress, 'campaign_id': campaign_id});
        if (!winner || !winner.lottery_ticket || winner.lottery_ticket < 1) {
          return HelperUtils.responseBadRequest("you are not allowed to claim ticket");
        }
        const now = new Date().getTime();
        if (camp.freeBuyTimeSetting && camp.freeBuyTimeSetting.start_buy_time &&
          now >= Number(camp.freeBuyTimeSetting.start_buy_time) * 1000) {
          winner.lottery_ticket++
        }

        maxTokenClaim = new BigNumber(winner.lottery_ticket);
      } else {
        // call to SC to get amount token purchased of user
        const campaignClaimSC = await HelperUtils.getContractClaimInstance(camp);
        const received = await Promise.all([
          campaignClaimSC.methods.userPurchased(userWalletAddress).call(),
          campaignClaimSC.methods.userClaimed(userWalletAddress).call()
        ]);
        const tokenPurchased = received[0];
        // calc max token that user can claimable
        maxTokenClaim = new BigNumber(claimConfig.max_percent_claim).dividedBy(100).multipliedBy(tokenPurchased)
          .decimalPlaces(0, BigNumber.ROUND_DOWN).toFixed(0, BigNumber.ROUND_DOWN);

        // Hardcode for MITA pool
        if (campaign_id === 99 || campaign_id === '99' || campaign_id === 100 || campaign_id === '100') {
          maxTokenClaim = new BigNumber(claimConfig.max_percent_claim).dividedBy(100).dividedBy(10 ** 10).multipliedBy(tokenPurchased)
            .decimalPlaces(0, BigNumber.ROUND_DOWN).toFixed(0, BigNumber.ROUND_DOWN);
        }
      }

      console.log(`max token claim ${maxTokenClaim}`);

      // get message hash
      const messageHash = web3.utils.soliditySha3(userWalletAddress, maxTokenClaim);

      // get private key for campaign from db
      const walletService = new WalletService();
      const wallet = await walletService.findByCampaignId(filterParams);
      if (wallet == null) {
        return HelperUtils.responseBadRequest("Do not found wallet for campaign");
      }
      const privateKey = wallet.private_key;
      // create signature
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const accAddress = account.address;
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = accAddress;
      const signature = await web3.eth.sign(messageHash, accAddress);
      console.log(`signature ${signature}`);
      const response = {
        'amount': maxTokenClaim,
        'signature': signature
      }
      return HelperUtils.responseSuccess(response);
    } catch (e) {
      console.log('claim error', e);
      return HelperUtils.responseErrorInternal();
    }
  }
}

module.exports = CampaignController;
