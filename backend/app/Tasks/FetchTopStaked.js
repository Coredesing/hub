'use strict'

const Task = use('Task')
const StakingEventService = use('App/Services/StakingEventService');
const startTime = process.env.EVENT_START_TIME
const endTime = process.env.EVENT_END_TIME

class FetchTopStaked extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[FetchTopStaked] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // return '*/15 * * * * *';
      return '*/20 * * * * *';
    } else {
      return '0 */1 * * * *';
    }
  }

  async handle () {
    if (this.isRunning) {
      console.log('stop')
      return
    }
    try {
      this.isRunning = true

      console.log('Task FetchTopStaked handle');
      await (new StakingEventService).queryTop({
        start_time: startTime,
        end_time: endTime,
        top: 10,
        limit: 20,
        min_tier: 0
      });
    }
    catch (e) {
      console.log('error', e)
    }
    finally {
      this.isRunning = false
    }
  }
}

module.exports = FetchTopStaked;
