'use strict'

const Task = use('Task')
const HomeService = use('App/Services/HomeService');

class UpdateTokenPrice extends Task {
  // 30 minutes
  static get schedule () {
    return '2 */30 * * * *'
  }

  async handle () {
    try {
      console.log(`start get performances`)
      const homeService = new HomeService()
      await homeService.getPerformances()
    } catch (e) {
      console.log(`Craw token price failed`, e)
    }
  }
}

module.exports = UpdateTokenPrice
