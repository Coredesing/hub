'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BoxType extends Model {
  static get table() {
    return 'box_types';
  }
}

module.exports = BoxType;
