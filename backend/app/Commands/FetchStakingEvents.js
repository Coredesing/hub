'use strict'

const { Command } = require('@adonisjs/ace');
const StakingEventService = use('App/Services/StakingEventService');
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class FetchStakingEvents extends Command {
  static get signature () {
    return 'fetch:staking-events {from: from block} {to: to block}'
  }

  static get description () {
    return 'Fetch events of stacking. Usage: adonis fetch:staking-events {from} {to}'
  }

  async handle (args, options) {
    const from = args.from;
    const to = args.to;
    this.info('Implementation for fetch:staking-events command', from, to)

    await (new StakingEventService).forceRun(from, to)
    await sleep(3000)
    process.exit(0);
  }
}

module.exports = FetchStakingEvents;
