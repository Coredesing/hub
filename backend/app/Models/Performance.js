'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Performance extends Model {
  static get table() {
    return 'performances'
  }
}

module.exports = Performance
