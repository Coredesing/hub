'use strict'
const kue = use('Kue');
const { Parser, transforms: { unwind } } = require('json2csv');
const fs = require('fs')

const UserModel = use('App/Models/User')
const ExportUserModel = use('App/Models/ExportUser')
const Database = use('Database');
const HelperUtils = use('App/Common/HelperUtils')

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
  async handle(fileName) {
    try {
      console.log('ExportUsers-job started')

      const userQuery = UserModel.query()
        .leftOuterJoin('whitelist_submissions', (query) => {
          query
            .on('whitelist_submissions.wallet_address', '=', 'users.wallet_address')
            // .andOnNotNull('whitelist_submissions.whitelist_user_id')
            .andOn('whitelist_submissions.id', '=', Database.raw('(select MAX(id) from whitelist_submissions where whitelist_submissions.wallet_address = users.wallet_address)'))
        })
        .select('users.*')
        .select('whitelist_submissions.user_telegram')

      const userList = JSON.parse(JSON.stringify(await userQuery.fetch()))

      // console.log({ userList })

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
      const fields = ['id', 'wallet_address', 'tier', 'ksm_bonus_pkf', 'total_pkf', 'user_telegram', 'email'];
      const transforms = [unwind({ paths: ['ID', 'Wallet Address', 'Tier', 'KSM Bonus PKF', 'Total PKF', 'Telegram', 'Email'], blankOut: true })];

      const json2csvParser = new Parser({ fields, transforms });
      const csv = json2csvParser.parse(userList);

      fs.writeFileSync(HelperUtils.getPathExportUsers(fileName), csv);

      await ExportUserModel.query().where('file_name', fileName).update({ status: 'success' })
    } catch (error) {
      await ExportUserModel.query().where('file_name', fileName).update({ status: 'fail' })
      throw error
    }
  }

  // Dispatch
  static doDispatch(data) {
    console.log('Dispatch ExportUser: ', data);
    kue.dispatch(this.key, data, { priority, attempts, remove, jobFn });
  }
}

module.exports = ExportUsers

