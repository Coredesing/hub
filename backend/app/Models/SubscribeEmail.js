'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SubscribeEmail extends Model {
  static get hidden () {
    return ['id']
  }

  static get table() {
    return 'subscribe_emails';
  }
}

module.exports = SubscribeEmail
