'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StakingEvent extends Model {
  static get table() {
    return 'staking_events';
  }
}

module.exports = StakingEvent
