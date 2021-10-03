'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SeriesContent extends Model {
  static get table() {
    return 'series_contents';
  }
}

module.exports = SeriesContent;
