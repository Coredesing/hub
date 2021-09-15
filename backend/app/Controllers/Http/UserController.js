'use strict'

const requests = require("request");
const BigNumber = use('bignumber.js');
const randomString = use('random-string');

const Const = use('App/Common/Const');
const Env = use('Env');
const Hash = use('Hash');
const Event = use('Event')
const Database = use('Database');
const ErrorFactory = use('App/Common/ErrorFactory');

const PoolService = use('App/Services/PoolService');
const WhitelistService = use('App/Services/WhitelistUserService');
const WhitelistSubmissionService = use('App/Services/WhitelistSubmissionService');
const UserService = use('App/Services/UserService');

const TierService = use('App/Services/TierService');
const ReservedListService = use('App/Services/ReservedListService');
const UserModel = use('App/Models/User');
const TierModel = use('App/Models/Tier');
const ConfigModel = use('App/Models/Config');
const BlockpassApprovedModel = use('App/Models/BlockPassApproved');
const WinnerModel = use('App/Models/WinnerListUser');
const PasswordResetModel = use('App/Models/PasswordReset');
const BlockPassModel = use('App/Models/BlockPass');

const HelperUtils = use('App/Common/HelperUtils');
const RedisUtils = use('App/Common/RedisUtils');
const SendForgotPasswordJob = use('App/Jobs/SendForgotPasswordJob');

class UserController {
  async userList({ request }) {
    try {
      const params = request.only(['limit', 'page']);
      const searchQuery = request.input('searchQuery');
      const limit = params.limit || Const.DEFAULT_LIMIT;
      const page = params.page || 1;

      const userService = new UserService();
      let userQuery = userService.buildQueryBuilder(params);
      if (searchQuery) {
        userQuery = userService.buildSearchQuery(userQuery, searchQuery);
      }

      userQuery = userQuery
        .leftOuterJoin('whitelist_submissions', (query) => {
          query
            .on('whitelist_submissions.wallet_address', '=', 'users.wallet_address')
            // .andOnNotNull('whitelist_submissions.whitelist_user_id')
            .andOn('whitelist_submissions.id', '=', Database.raw('(select MAX(id) from whitelist_submissions where whitelist_submissions.wallet_address = users.wallet_address)'))
        })
        .select('users.*')
        .select('whitelist_submissions.user_telegram')

      let userList = JSON.parse(JSON.stringify(await userQuery.fetch()));
      const userAdditionInfoPromises = userList.map(async (u) => {
        const tierInfo = await HelperUtils.getUserTierSmart(u.wallet_address);
        return { tier: tierInfo[0], total_pkf: tierInfo[1], staked_pkf: tierInfo[2], ksm_bonus_pkf: tierInfo[3] }
      });

      const response = await Promise.all(userAdditionInfoPromises);
      for (let i = 0; i < userList.length; i++) {
        userList[i].tier = Number(response[i] && response[i].tier) || 0;
        userList[i].total_pkf = Number(response[i] && response[i].total_pkf) || 0;
        userList[i].staked_pkf = Number(response[i] && response[i].staked_pkf) || 0;
        userList[i].ksm_bonus_pkf = Number(response[i] && response[i].ksm_bonus_pkf) || 0;
      }
      // users.data = userList;

      return HelperUtils.responseSuccess(userList);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: get user list fail !');
    }
  }

  async tierInfo({ request }) {
    try {
      const params = request.all();
      const wallet_address = params.wallet_address;

      if (await RedisUtils.checkExistRedisUserTierBalance(wallet_address)) {
        const cached = JSON.parse(await RedisUtils.getRedisUserTierBalance(wallet_address));

        return HelperUtils.responseSuccess({
          tier: cached.data[0],
          stakedInfo: {
            tokenStaked: new BigNumber(cached.data[2]).toFixed(4),
            uniStaked: new BigNumber(0).toFixed(4)
          },
        });
      }

      const tierInfo = await HelperUtils.getUserTierSmart(wallet_address);
      RedisUtils.createRedisUserTierBalance(wallet_address, tierInfo);

      return HelperUtils.responseSuccess({
        tier: tierInfo[0],
        stakedInfo: {
          tokenStaked: new BigNumber(tierInfo[2]).toFixed(4),
          uniStaked: new BigNumber(0).toFixed(4)
        },
      });
    } catch (e) {
      console.log('tierInfo error', e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async profile({ request }) {
    try {
      const params = request.all();
      const wallet_address = params.wallet_address;
      const findedUser = await UserModel.query().where('wallet_address', wallet_address).first();
      if (!findedUser) {
        return HelperUtils.responseNotFound();
      }
      const whitelistSubmission = JSON.parse(JSON.stringify(
        await (new WhitelistSubmissionService).findSubmission({ wallet_address })
      ));

      return HelperUtils.responseSuccess({
        user: {
          email: findedUser.email,
          id: findedUser.id,
          status: findedUser.status,
          is_kyc: findedUser.is_kyc,
          user_twitter: whitelistSubmission && whitelistSubmission.user_twitter,
          user_telegram: whitelistSubmission && whitelistSubmission.user_telegram,
        }
      });
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async updateProfile({ request }) {
    try {
      const userService = new UserService();
      const params = request.only(['user_twitter', 'user_telegram']);
      const wallet_address = request.header('wallet_address');
      const user = await userService.buildQueryBuilder({ wallet_address }).first();
      if (!user) {
        return HelperUtils.responseNotFound('User Not Found');
      }

      const whitelistSubmission = JSON.parse(JSON.stringify(
        await (new WhitelistSubmissionService).findSubmission({ wallet_address })
      ));

      if (whitelistSubmission) {
        await (new WhitelistSubmissionService).buildQueryBuilder({ wallet_address }).update(params);
      } else {
        await (new WhitelistSubmissionService).createWhitelistSubmissionAccount({
          ...params,
          wallet_address,
        });
      }

      return HelperUtils.responseSuccess({
        user: {
          ...params,
          id: user.id,
          wallet_address: user.wallet_address,
        }
      }, 'Update Success');
    } catch (e) {
      console.log(e);
      return ErrorFactory.internal('ERROR: Update profile fail!');
    }
  }

  async uploadAvatar({request}) {
    const validationOptions = {
      types: ['image'],
      size: Const.FILE_SITE,
      extnames: Const.FILE_EXT
    };

    const profilePic = request.file('avatar', validationOptions);
    const timeStamp = Date.now();
    const fileName = timeStamp + '_' + (profilePic.clientName || '').replace(/\s/g, '_');
    await profilePic.move(Helpers.tmpPath('uploads'), {
      name: fileName,
      overwrite: true
    });
    if (!profilePic.moved()) {
      return profilePic.error()
    }

    return HelperUtils.responseSuccess({ fileName });
  }

  async forgotPassword({ request }) {
    try {
      const params = request.all();
      const role = request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
      const userService = new UserService();
      const user = await userService.findUser({
        email: params.email,
        wallet_address: params.wallet_address,
        role,
      });
      if (!user) {
        console.error('user not found.')
        return HelperUtils.responseSuccess();
      }
      const token = await userService.resetPasswordEmail(params.email, role);
      const mailData = {};
      mailData.username = user.username;
      mailData.email = user.email;
      mailData.token = token;

      const isAdmin = request.params.type === Const.USER_TYPE_PREFIX.ICO_OWNER;
      const baseUrl = isAdmin ? Env.get('FRONTEND_ADMIN_APP_URL') : Env.get('FRONTEND_USER_APP_URL');
      mailData.url = baseUrl + '/#/reset-password/' + (isAdmin ? 'user/' : 'investor/') + token;

      SendForgotPasswordJob.doDispatch(mailData);

      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async checkToken({ request }) {
    try {
      const token = request.params.token;
      const role = request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
      const userService = new UserService();
      const checkToken = await userService.checkToken(token, role);
      return HelperUtils.responseSuccess({
        data: checkToken,
        status: 200,
      });
    } catch (e) {
      console.log('ERROR: ', e);
      if (e.status === 400) {
        return HelperUtils.responseNotFound(e.message);
      } else {
        return HelperUtils.responseErrorInternal();
      }
    }
  }

  async resetPassword({ request, auth }) {
    try {
      const params = request.all();
      const wallet_address = params.wallet_address;
      const token = request.params.token;
      const role = request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
      const userService = new UserService();
      const checkToken = await userService.checkToken(token, role);

      if (checkToken) {
        const token = randomString({ length: 40 });
        const user = await (new UserService()).findUser({
          email: checkToken.email,
          wallet_address: wallet_address,
          role
        });
        if (user) {
          user.password = params.password;
          user.token_jwt = token;
          await user.save();
          const tokenPassword = await PasswordResetModel.query()
            .where('email', checkToken.email)
            .where('role', role)
            .delete();

          return HelperUtils.responseSuccess()
        } else {
          return ErrorFactory.badRequest('Reset password failed!')
        }
      }

    } catch (e) {
      console.log('ERROR: ', e);
      if (e.status === 400) {
        return HelperUtils.responseBadRequest(e.message);
      } else if (e.status === 404) {
        return HelperUtils.responseNotFound(e.message);
      } else {
        return HelperUtils.responseErrorInternal('Server Error: Reset password fail');
      }
    }
  }

  async changePassword({ request, auth }) {
    const param = request.all();
    const passwordOld = param.password_old;
    const passwordNew = param.password_new;
    const role = request.params.type == Const.USER_TYPE_PREFIX.ICO_OWNER ? Const.USER_ROLE.ICO_OWNER : Const.USER_ROLE.PUBLIC_USER;
    const user = auth.user;

    if (await Hash.verify(passwordOld, user.password)) {
      const token = randomString({ length: 40 });
      const userService = new UserService();
      const userFind = await userService.findUser({
        email: user.email,
        role,
      });
      userFind.password = passwordNew;
      userFind.token_jwt = token;
      await userFind.save();
      return HelperUtils.responseSuccess(userFind, 'Change password successfully!');
    } else {
      return HelperUtils.responseErrorInternal('Old password does not match current password.');
    }
  }

  async confirmEmail({ request }) {
    try {
      const token = request.params.token;
      const userService = new UserService();
      const checkToken = await userService.confirmEmail(token);
      if (!checkToken) {
        return HelperUtils.responseErrorInternal('Active account link has expried.');
      }
      return HelperUtils.responseSuccess(checkToken);
    } catch (e) {
      console.log('ERROR: ', e);
      if (e.status === 400) {
        return HelperUtils.responseNotFound(e.message);
      } else {
        return HelperUtils.responseErrorInternal('ERROR: Confirm email fail !');
      }
    }
  }

  async changeType({ request }) {
    try {
      const param = request.all();
      if (param.basic_token != process.env.JWT_BASIC_AUTH) {
        return ErrorFactory.unauthorizedInputException('Basic token error!', '401');
      }
      if (param.type == Const.USER_TYPE.WHITELISTED) {
        Event.fire('new:createWhitelist', param)
      }
      const type = param.type == Const.USER_TYPE.WHITELISTED ? Const.USER_TYPE.WHITELISTED : Const.USER_TYPE.REGULAR
      const findUser = await UserModel.query()
        .where('email', param.email)
        .where('role', Const.USER_ROLE.PUBLIC_USER)
        .first();
      if (!findUser) {
        return HelperUtils.responseSuccess()
      }
      const token = randomString({ length: 40 });
      findUser.type = type
      findUser.token_jwt = token
      await findUser.save();
      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Change user type fail !');
    }
  }

  async checkEmailVerified({ request }) {
    try {
      const inputParams = request.only(['email']);
      const findUser = await UserModel.query()
        .where('email', inputParams.email)
        .where('status', Const.USER_STATUS.ACTIVE)
        .first();
      if (!findUser) {
        return HelperUtils.responseNotFound('User is unverified !')
      }
      return HelperUtils.responseSuccess('User is verified !');
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Check email verify fail !');
    }
  }

  async checkUserActive({ request }) {
    try {
      const params = request.all();
      console.log(`Check user active with params ${params}`);
      const userService = new UserService();
      // get user active by wallet_address
      const user = userService.findUser({ 'wallet_address': params.wallet_address });
      // check exist user or not and return result
      return HelperUtils.responseSuccess(user == null);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async getCurrentTier({ request, params }) {
    try {
      const formatDataPrivateWinner = (new TierService).formatDataPrivateWinner;
      const { walletAddress, campaignId } = params;
      const filterParams = {
        wallet_address: walletAddress,
        campaign_id: campaignId,
      };

      // Check Public Winner Status
      const poolService = new PoolService;
      const poolExist = await poolService.getPoolById(campaignId);

      if (!poolExist) {
        return HelperUtils.responseSuccess({
          min_buy: 0,
          max_buy: 0,
          start_time: 0,
          end_time: 0,
          level: 0,
        });
      }
      const isPublicWinner = (poolExist.public_winner_status === Const.PUBLIC_WINNER_STATUS.PUBLIC);

      // FREE BUY TIME: Check if current time is free to buy or not
      const camp = await poolService.buildQueryBuilder({ id: campaignId }).with('freeBuyTimeSetting').first();
      const { maxBonus, isFreeBuyTime, existWhitelist } = await poolService.getFreeBuyTimeInfo(camp, walletAddress);
      const isKYCRequired = process.env.REACT_APP_APP_KYC_REQUIRED === true || process.env.REACT_APP_APP_KYC_REQUIRED === 'true'
      let maxTotalBonus = 0;
      if (isFreeBuyTime) {
        if (!!existWhitelist) {
          maxTotalBonus = maxBonus;
        }

        if (!isKYCRequired) {
          maxTotalBonus = maxBonus
        }
      }

      // Check user is in reserved list
      const reserve = await (new ReservedListService).buildQueryBuilder(filterParams).first();
      if (reserve) {
        const tier = {
          min_buy: reserve.min_buy,
          max_buy: new BigNumber(reserve.max_buy).plus(maxTotalBonus).toFixed(),
          start_time: reserve.start_time,
          end_time: reserve.end_time,
          level: 0
        };
        return HelperUtils.responseSuccess(formatDataPrivateWinner(tier, isPublicWinner));
      } else {
        // Get Tier in smart contract
        const userTier = (await HelperUtils.getUserTierSmart(walletAddress))[0];
        const tierDb = await TierModel.query().where('campaign_id', campaignId).where('level', userTier).first();
        if (!tierDb) {
          return HelperUtils.responseSuccess(formatDataPrivateWinner({
            min_buy: 0,
            max_buy: new BigNumber(maxTotalBonus).toFixed(),
            start_time: 0,
            end_time: 0,
            level: 0,
          }, isPublicWinner));
        }
        // get lottery ticket from winner list
        const winner = await WinnerModel.query().where('campaign_id', campaignId).where('wallet_address', walletAddress).first();
        if (winner) {
          const tier = await TierModel.query().where('campaign_id', campaignId).where('level', winner.level).first();
          if (!tier) {
            return HelperUtils.responseBadRequest();
          }

          return HelperUtils.responseSuccess(formatDataPrivateWinner({
            min_buy: tier.min_buy,
            max_buy: new BigNumber(
              new BigNumber(tier.max_buy).multipliedBy(winner.lottery_ticket)
            ).plus(maxTotalBonus).toFixed(),
            start_time: tier.start_time,
            end_time: tier.end_time,
            level: userTier
          }, isPublicWinner));
        }

        // user not winner
        if (isKYCRequired) {
          const tier = {
            min_buy: 0,
            max_buy: new BigNumber(maxTotalBonus).toFixed(),
            start_time: tierDb.start_time,
            end_time: tierDb.end_time,
            level: userTier
          }
          return HelperUtils.responseSuccess(formatDataPrivateWinner(tier, isPublicWinner));
        }
        // user not winner
        return HelperUtils.responseBadRequest();
      }
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal();
    }
  }

  async activeKyc({ request, params }) {
    const inputParams = request.only([
      'wallet_address',
      'email',
    ]);
    try {
      const userService = new UserService();
      const userFound = await userService.findUser(inputParams);

      if (!userFound) {
        return HelperUtils.responseNotFound('User Not found');
      }
      if (!userFound.is_kyc) {
        const user = await userService.buildQueryBuilder({ id: userFound.id }).update({ is_kyc: Const.KYC_STATUS.APPROVED });
      }

      return HelperUtils.responseSuccess({
        ...inputParams,
        id: userFound.id,
      });
    } catch (e) {
      console.log('[activeKyc] - Error: ', e);
      return HelperUtils.responseErrorInternal('Error: Can not active KYC');
    }
  }

  async kycUpdateStatus({ request }) {
    const params = request.only(['guid', 'status', 'clientId', 'event', 'recordId', 'refId', 'submitCount',
      'blockPassID', 'inreviewDate', 'waitingDate', 'approvedDate', 'env']);
    try {
      // call to api to get user info
      const url = process.env.BLOCK_PASS_API_URL.replace('CLIENT_ID', process.env.BLOCK_PASS_CLIENT_ID)
        .replace('RECORDID', params.recordId);
      console.log(url);
      const options = {
        url: url,
        method: 'GET',
        headers: {
          'Authorization': process.env.BLOCK_PASS_API_KEY
        }
      }
      const response = await new Promise((resolve, reject) => {
        requests(options, function (error, response, body) {
          if (error) reject(error)
          else resolve(response)
        })
      })

      if (!response || response.statusCode !== 200) {
        return HelperUtils.responseBadRequest();
      }

      const body = JSON.parse(response.body)
      // get user info
      const email = body.data.identities.email.value;
      const wallet = body.data.identities.crypto_address_eth.value;
      const kycStatus = body.data.status;

      const address_country = JSON.parse(body.data.identities.address.value).country;
      let passport_issuing_country = address_country;

      if (body.data.identities.passport_issuing_country != null) {
        passport_issuing_country = body.data.identities.passport_issuing_country.value;
      } else if (body.data.identities.national_id_issuing_country != null) {
        passport_issuing_country = body.data.identities.national_id_issuing_country.value;
      } else if (body.data.driving_license_issuing_country != null) {
        passport_issuing_country = body.data.identities.driving_license_issuing_country.value;
      }

      // save to db to log
      const blockPassObj = new BlockPassModel();
      blockPassObj.fill({
        client_id: params.clientId,
        guid: params.guid,
        status: params.status,
        event: params.event,
        record_id: params.recordId,
        ref_id: params.refId,
        submit_count: params.submitCount,
        block_pass_id: params.blockPassID,
        in_review_date: params.inreviewDate,
        waiting_date: params.waitingDate,
        approved_date: params.approvedDate,
        email: email,
        wallet_address: wallet,
        env: params.env
      });
      blockPassObj.save();

      if (Const.KYC_STATUS[kycStatus.toString().toUpperCase()] === Const.KYC_STATUS.APPROVED) {
        const approvedRecord = await BlockpassApprovedModel.query().where('record_id', params.recordId).first();
        if (!approvedRecord) {
          const blockpassApproved = new BlockpassApprovedModel();
          blockpassApproved.fill({
            client_id: params.clientId,
            guid: params.guid,
            status: params.status,
            record_id: params.recordId,
            ref_id: params.refId,
            submit_count: params.submitCount,
            block_pass_id: params.blockPassID,
            in_review_date: params.inreviewDate,
            waiting_date: params.waitingDate,
            approved_date: params.approvedDate,
            email: email,
            wallet_address: wallet,
            env: params.env
          });
          blockpassApproved.save();
        } else {
          approvedRecord.merge({
            client_id: params.clientId,
            guid: params.guid,
            status: params.status,
            record_id: params.recordId,
            ref_id: params.refId,
            submit_count: params.submitCount,
            block_pass_id: params.blockPassID,
            in_review_date: params.inreviewDate,
            waiting_date: params.waitingDate,
            approved_date: params.approvedDate,
            email: email,
            wallet_address: wallet,
            env: params.env
          });
          approvedRecord.save();
        }
      }

      if (!email || !wallet) {
        console.log(`Do not found user with email ${email} and wallet ${wallet}`);
        return HelperUtils.responseBadRequest();
      }

      let user = await UserModel.query().where('email', email).first();

      if (!user) {
        user = new UserModel();
        user.fill({
          email,
          is_kyc: Const.KYC_STATUS.APPROVED,
          wallet_address: wallet,
          record_id: params.recordId,
          ref_id: params.refId,
          status: Const.USER_STATUS.ACTIVE,
          username: email,
          signature: email,
          national_id_issuing_country: passport_issuing_country,
          address_country: address_country
        });
        await user.save();
      } else {
        const userModel = new UserModel();
        userModel.fill({
          ...JSON.parse(JSON.stringify(user)),
          wallet_address: wallet,
          is_kyc: Const.KYC_STATUS[kycStatus.toString().toUpperCase()],
          record_id: params.recordId,
          ref_id: params.refId,
          national_id_issuing_country: passport_issuing_country,
          address_country: address_country
        });
        await UserModel.query().where('id', user.id).update(userModel);
      }

      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('KYC update status failed !');
    }
  }

  async getEPkfBonusBalance({ request }) {
    const inputParams = request.only(['address']);
    const wallet_address = inputParams.address;
    const config = await ConfigModel.query().where('key', wallet_address).first();

    return {
      code: 200,
      message: 'Success',
      data: (new BigNumber((config && config.value) || 0)).multipliedBy(Math.pow(10, 18)).toFixed(),
    }
  }


  async kycUserList({request}) {
    try {
      const params = request.only(['limit', 'page']);
      const searchQuery = request.input('searchQuery');
      const limit = params.limit || Const.DEFAULT_LIMIT;
      const page = params.page || 1;

      const userService = new UserService();
      let userQuery = userService.buildQueryBuilder(params);
      if (searchQuery) {
        userQuery = userService.buildSearchQuery(userQuery, searchQuery);
      }
      const admins = await userQuery.orderBy('id', 'DESC').paginate(page, limit);
      return HelperUtils.responseSuccess(admins);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: get user list fail !');
    }
  }

  async kycUserDetail({request, params}) {
    try {
      const id = params.id;
      const userService = new UserService();
      const users = await userService.findUser({id});
      return HelperUtils.responseSuccess(users);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: get user detail fail !');
    }
  }

  async kycUserCreate({request}) {
    try {
      const inputs = request.only(['email', 'wallet_address', 'is_kyc',  'national_id_issuing_country']);
      inputs.password = request.input('password');
      console.log('Create Admin with params: ', inputs);

      const userService = new UserService();
      const isExistUser = await userService.findUser({
        wallet_address: inputs.wallet_address,
      });
      if (isExistUser) {
        return HelperUtils.responseBadRequest('Wallet is used');
      }

      const user = new UserModel();
      user.fill(inputs);
      user.signature = randomString(15);  // TODO: Fill any string
      user.status = Const.USER_STATUS.ACTIVE;
      const res = await user.save();

      return HelperUtils.responseSuccess(res);
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: create user fail !');
    }
  }

  async kycUserUpdate({request, params}) {
    try {
      const inputs = request.only(['email', 'wallet_address', 'is_kyc',  'national_id_issuing_country']);
      const password = request.input('password');

      const userService = new UserService();
      const user = await userService.findUser({id: params.id});
      if (!user) {
        return HelperUtils.responseNotFound();
      }

      const updateInputs = inputs;
      if (password) {
        updateInputs.password = await Hash.make(password);
      }
      await userService.buildQueryBuilder({id: params.id}).update(updateInputs);

      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: Update user fail !');
    }
  }

  async kycUserChangeIsKyc({request, auth, params}) {
    const inputParams = request.only(['is_kyc']);

    const userId = params.id;
    try {
      const userService = new UserService();
      const user = await userService.findUser({id: userId});
      if (!user) {
        return HelperUtils.responseNotFound('Pool not found');
      }
      await UserModel.query().where('id', userId).update({
        is_kyc: inputParams.is_kyc,
      });

      return HelperUtils.responseSuccess();
    } catch (e) {
      console.log(e)
      return HelperUtils.responseErrorInternal();
    }
  }

  async getKycStatusByErc20Address({request}) {
    const params = request.only(['address']);
    const address = params.address
    try {
      const userService = new UserService();
      const user = await userService.findUser({wallet_address: address});
      if (!user) {
        return HelperUtils.responseSuccess(false)
      }

      return HelperUtils.responseSuccess(user.is_kyc === 1)
    } catch (e) {
      return HelperUtils.responseErrorInternal();
    }
  }
}

module.exports = UserController;
