'use strict'

const kue = use('Kue');
const Const = use('App/Common/Const');
const CampaignModel = use('App/Models/Campaign');
const WinnerListUserModel = use('App/Models/WinnerListUser');
const UserBalanceSnapshotService = use('App/Services/UserBalanceSnapshotService');

const priority = 'critical'; // Priority of job, can be low, normal, medium, high or critical
const attempts = 5; // Number of times to attempt job if it fails
const remove = true; // Should jobs be automatically removed on completion
const jobFn = job => { // Function to be run on the job before it is saved
  job.backoff()
};

class PickWinnerBaseOnSnapshot {
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
    console.log('PickWinnerBaseOnSnapshot-job started', data);
    try {
      // pickup random winner after snapshot all whitelist user balance
      await PickWinnerBaseOnSnapshot.doPickupRandomWinner(data);
    } catch (e) {
      console.log('Pickup winner has error', e);
      throw e;
    }
  }

  static async doPickupRandomWinner(data) {
    // delete old winner
    const campaignUpdated = await CampaignModel.query().where('id', data.campaign_id).first();
    await campaignUpdated.winners().delete();
    const userSnapshotService = new UserBalanceSnapshotService();

    let userSnapshots = await userSnapshotService.getAllSnapshotByFilters({campaign_id: data.campaign_id});
    userSnapshots = JSON.parse(JSON.stringify(userSnapshots));

    const winners = userSnapshots.map(u => {
      const winnerModel = new WinnerListUserModel();
      winnerModel.fill({
        email: u.email,
        wallet_address: u.wallet_address,
        campaign_id: data.campaign_id,
        level: 0,
        lottery_ticket: u.winner_ticket,
      });
      return winnerModel;
    })

    await campaignUpdated.winners().saveMany(winners);
  }

  // Dispatch
  static doDispatch(data) {
    console.log('Dispatch pickup winner with data: ', data);
    kue.dispatch(this.key, data, { priority, attempts, remove, jobFn });
  }
}

module.exports = PickWinnerBaseOnSnapshot

