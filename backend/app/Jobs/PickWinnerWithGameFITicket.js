'use strict'

const kue = use('Kue');
const Const = use('App/Common/Const');
const CampaignModel = use('App/Models/Campaign');
const TierModel = use('App/Models/Tier');
const UserModel = use('App/Models/User');
const WinnerListUserModel = use('App/Models/WinnerListUser');

const priority = 'critical'; // Priority of job, can be low, normal, medium, high or critical
const attempts = 5; // Number of times to attempt job if it fails
const remove = true; // Should jobs be automatically removed on completion
const jobFn = job => { // Function to be run on the job before it is saved
  job.backoff()
};

class PickWinnerWithGameFITicket {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 5
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return Const.JOB_KEY.PICKUP_RANDOM_WINNER;
  }

  // This is where the work is done.
  static async handle(data) {
    console.log('PickWinnerWithGameFITicket-job started', data);
    try {
      // pickup winner
      await PickWinnerWithGameFITicket.doPickupWinner(data);
    } catch (e) {
      console.log('Pickup winner has error', e);
      throw e;
    }
  }

  static async doPickupWinner(data) {
    // delete old winner
    const campaignUpdated = await CampaignModel.query().where('id', data.campaign_id).first();
    await campaignUpdated.winners().delete();

    let users = await UserModel.query().where('is_kyc', 1).where('status', 1).fetch();
    users = JSON.parse(JSON.stringify(users));

    const winners = users.map(u => {
      const winnerModel = new WinnerListUserModel();
      winnerModel.fill({
        email: u.email,
        wallet_address: u.wallet_address,
        campaign_id: data.campaign_id,
        level: 0,
        lottery_ticket: 1,
      });
      return winnerModel;
    })

    await campaignUpdated.winners().saveMany(winners);
  }

  // Dispatch
  static doDispatch(data) {
    console.log('Dispatch pickup random winner with data : ', data);
    kue.dispatch(this.key, data, { priority, attempts, remove, jobFn });
  }
}

module.exports = PickWinnerWithGameFITicket

