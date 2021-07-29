'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const HelperUtils = use('App/Common/HelperUtils');
const ReputationService = use('App/Services/ReputationService');

class ReputationLogSeeder {
  async run() {
    const contractTier = await HelperUtils.getTierSmartContractInstance()

    const [stakedEvents, unstakedEvents] = await Promise.all([
      HelperUtils.getEventSmartContract({ contract: contractTier, eventName: 'StakedERC20' }),
      HelperUtils.getEventSmartContract({ contract: contractTier, eventName: 'WithdrawnERC20' })
    ])

    const addresses = [...new Set(stakedEvents.map(event => event.returnValues.user))]

    for (let address of addresses) {
      await (new ReputationService).insertDataReputationLog({ address, stakedEvents: stakedEvents.filter(event => event.returnValues.user == address), unstakedEvents: unstakedEvents.filter(event => event.returnValues.user == address) })
    }
  }
}

module.exports = ReputationLogSeeder;