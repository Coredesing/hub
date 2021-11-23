'use strict'

const { Command } = require('@adonisjs/ace');
const StakingEventService = use('App/Services/StakingEventService');
const STAKING_START_BLOCK_NUMBER = process.env.START_BLOCK

class FetchStakingEvents extends Command {
  static get signature () {
    return 'fetch:events:staking'
  }

  static get description () {
    return 'Fetch events of staking'
  }

  async handle (args, options) {
    this.info('Implementation for fetch:events:staking command');
    await (new StakingEventService).forceRun(STAKING_START_BLOCK_NUMBER || 14303384);

    process.exit(0);
  }
}

module.exports = FetchStakingEvents;
