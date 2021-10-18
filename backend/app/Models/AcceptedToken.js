'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AcceptedToken extends Model {
  static get table() {
    return 'accepted_tokens';
  }
}

module.exports = AcceptedToken;
