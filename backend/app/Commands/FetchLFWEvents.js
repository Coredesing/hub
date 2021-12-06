'use strict'

const { Command } = require('@adonisjs/ace');
const FetchLFWEventJob = use('App/Jobs/FetchLFWEventJob');

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class FetchLFWEvents extends Command {
  static get signature () {
    return 'fetch:events:lfw'
  }

  static get description () {
    return 'Fetch events of marketplace'
  }

  async handle (args, options) {
    this.info('Implementation for fetch:events:lfw command');

    FetchLFWEventJob.doDispatch({from: 14712800})

    await sleep(5000)
    process.exit(0);
  }
}

module.exports = FetchLFWEvents;
