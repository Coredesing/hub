'use strict'

const Task = use('Task')
const StakingEventService = use('App/Services/StakingEventService');

class FetchLegendsStaked extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[FetchLegendsStaked] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // return '*/15 * * * * *';
      return '*/15 * * * * *';
    } else {
      return '*/15 * * * * *';
    }
  }

  async handle () {
    if (this.isRunning) {
      console.log('stop FetchLegendsStaked')
      return
    }
    try {
      this.isRunning = true

      console.log('Task FetchLegendsStaked handle');
      await (new StakingEventService).runLegendStaking();
    }
    catch (e) {
      console.log('error', e)
    }
    finally {
      this.isRunning = false
    }
  }
}

module.exports = FetchLegendsStaked;
