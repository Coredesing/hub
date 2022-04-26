'use strict'
const kue = use('Kue');
const { Parser } = require('json2csv');
const fs = require('fs')
const BigNumber = use('bignumber.js');

const UserModel = use('App/Models/User')
const ExportUserModel = use('App/Models/ExportUser')
const WhitelistModel = use('App/Models/WhitelistUser')
const Database = use('Database');
const HelperUtils = use('App/Common/HelperUtils')
const Const = use('App/Common/Const')

const priority = 'normal'; // Priority of job, can be low, normal, medium, high or critical
const attempts = 1; // Number of times to attempt job if it fails
const remove = true; // Should jobs be automatically removed on completion
const jobFn = job => {
  job.backoff();
}; // Function to be run on the job before it is saved

class ExportUsers {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return 'ExportUsers-job'
  }

  // This is where the work is done.
  async handle({ type, filter, fileName }) {
    try {
      console.log('ExportUsers-job started')

      let userQuery

      switch (type) {
        case Const.EXPORT_USER_TYPE.USER_LIST:
          userQuery = UserModel.query()
            .leftOuterJoin('whitelist_submissions', (query) => {
              query
                .on('whitelist_submissions.wallet_address', '=', 'users.wallet_address')
                // .andOnNotNull('whitelist_submissions.whitelist_user_id')
                .andOn('whitelist_submissions.id', '=', Database.raw('(select MAX(id) from whitelist_submissions where whitelist_submissions.wallet_address = users.wallet_address)'))
            })
            .select('users.*')
            .select('whitelist_submissions.user_telegram')
          if (filter.searchEmail) userQuery.where('users.email', 'like', '%' + filter.searchEmail + '%')
          if (filter.searchTelegram) userQuery.where('whitelist_submissions.user_telegram', 'like', '%' + filter.searchTelegram + '%')
          break
        case Const.EXPORT_USER_TYPE.SNAPSHOT_WHITELIST:
          userQuery = WhitelistModel.query()
            .where('campaign_id', filter.poolId)
            .with('whitelistSubmission')
            .whereHas('whitelistSubmission', (query) => {
              query.where('self_twitter_status', Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
                .andWhere('self_group_status', Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
                .andWhere('self_channel_status', Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
                .andWhere('self_retweet_post_status', Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
                .andWhere('partner_twitter_status', Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
                .andWhere('partner_group_status', Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
                .andWhere('partner_channel_status', Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
                .andWhere('partner_retweet_post_status', Const.SOCIAL_SUBMISSION_STATUS.COMPLETED)
            });
          break
        default:
          throw new Error('Type not supported')
      }

      const userList = JSON.parse(JSON.stringify(await userQuery.fetch()))

      const userAdditionInfoPromises = userList.map(async (u) => {
        const tierInfo = await HelperUtils.getUserTierSmartWithCached(u.wallet_address);
        return { tier: tierInfo[0], total_gafi: tierInfo[1], staked_gafi: tierInfo[2] }
      });

      const response = await Promise.all(userAdditionInfoPromises);
      for (let i = 0; i < userList.length; i++) {
        userList[i].user_telegram = userList[i].user_telegram || (userList[i].whitelistSubmission && userList[i].whitelistSubmission.user_telegram)
        userList[i].tier = Number(response[i] && response[i].tier) || 0
        userList[i].total_gafi = Number(response[i] && response[i].total_gafi) || 0
        userList[i].solana_address = userList[i].solana_address ? (userList[i].whitelistSubmission ? userList[i].whitelistSubmission.solana_address : '') : ''
      }

      const fields = [{
        label: 'ID',
        value: 'id'
      }, {
        label: 'Wallet Address',
        value: 'wallet_address'
      }, {
        label: 'Tier',
        value: 'tier'
      }, {
        label: 'GAFI staked',
        value: 'total_gafi'
      }, {
        label: 'Telegram',
        value: 'user_telegram'
      }, {
        label: 'Email',
        value: 'email'
      }, {
        label: 'Solana Address',
        value: 'solana_address'
      }]

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(userList.sort((firstUser, secondUser) => this.compareNumber(secondUser.tier, firstUser.tier) || this.compareNumber(secondUser.total_gafi, firstUser.total_gafi)));

      fs.writeFileSync(HelperUtils.getPathExportUsers(fileName), csv);

      await ExportUserModel.query().where('file_name', fileName).update({ status: 'success' })
    } catch (error) {
      await ExportUserModel.query().where('file_name', fileName).update({ status: 'fail' })
      throw error
    } finally {
      console.log('export user done')
    }
  }

  compareNumber(firstNumber, secondNumber) {
    return new BigNumber(firstNumber).comparedTo(new BigNumber(secondNumber))
  }

  // Dispatch
  static doDispatch(data) {
    console.log('Dispatch ExportUser: ', data);
    kue.dispatch(this.key, data, { priority, attempts, remove, jobFn });
  }
}

module.exports = ExportUsers
