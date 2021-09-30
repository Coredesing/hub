'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LegendSnapshot extends Model {
  static get table() {
    return 'legend_snapshots';
  }
}

module.exports = LegendSnapshot
