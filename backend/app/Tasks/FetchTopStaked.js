'use strict'

const Task = use('Task')
const StakingEventService = use('App/Services/StakingEventService');
const startTime = process.env.EVENT_START_TIME
const endTime = process.env.EVENT_END_TIME
const limit = process.env.EVENT_LIMIT || 10

class FetchTopStaked extends Task {
  isRunning = false;
  oneMinute = 60 * 1000;

  static get schedule () {
    console.log('[FetchTopStaked] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // return '*/15 * * * * *';
      return '*/30 * * * * *';
    } else {
      return '*/30 * * * * *';
    }
  }

  async handle () {
    if (this.isRunning) {
      console.log('stop')
      return
    }
    try {
      this.isRunning = true
      const now = (new Date().getTime()) / 1000

      // Don't update after 1 minutes
      if (now < startTime || now > endTime + this.oneMinute) {
        return
      }

      await (new StakingEventService).queryTop({
        start_time: startTime,
        end_time: endTime,
        top: 10,
        limit: limit,
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
