'use strict'

const Task = use('Task')
const PoolService = use('App/Services/PoolService');

class UpdatePoolInformationTask extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[UpdatePoolInformationTask] - ACTIVE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // return '*/15 * * * * *';
      return '0 */1 * * * *';
      // return '0 */5000 * * * *';  // 5 minutes
      // return '0 */350 * * * *';
    } else {
      return '0 */5 * * * *';
    }
  }

  async handle () {
    if (this.isRunning) {
      console.log('stop UpdatePoolInformationTask')
      return
    }

    try {
      this.isRunning = true
      console.log('Task UpdatePoolInformationTask handle');
      (new PoolService).runUpdatePoolStatus();
    }
    catch (e) {
      console.log('UpdatePoolInformationTask error', e)
    }
    finally {
      this.isRunning = false
    }
  }
}

module.exports = UpdatePoolInformationTask;
