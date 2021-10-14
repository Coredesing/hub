'use strict'

const Task = use('Task')
const PoolService = use('App/Services/PoolService');

class UpdateClaimablePoolInformationTask extends Task {
  isRunning = false;

  static get schedule () {
    console.log('[UpdateClaimablePoolInformationTask] - CLAIMABLE - process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // return '*/5 * * * * *';  // 5 seconds
      return '0 */1 * * * *';  // 5 minutes
      // return '0 */5000 * * * *';  // 5 minutes
      // return '0 */350 * * * *';  // large
    } else {
      return '0 */5 * * * *';
    }
  }

  async handle () {
    if (this.isRunning) {
      console.log('stop UpdateClaimablePoolInformationTask')
      return
    }

    try {
      this.isRunning = true
      console.log('Task UpdateClaimablePoolInformationTask handle');
      (new PoolService).runUpdatePoolClaimableStatus();
    }
    catch (e) {
      console.log('UpdateClaimablePoolInformationTask error', e)
    }
    finally {
      this.isRunning = false
    }
  }
}

module.exports = UpdateClaimablePoolInformationTask;
