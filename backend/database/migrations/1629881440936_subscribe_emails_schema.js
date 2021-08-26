'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubscribeEmailsSchema extends Schema {
  up () {
    this.create('subscribe_emails', (table) => {
      table.increments()
      table.timestamps()
      table.string('email')
      table.unique('email')
    })
  }

  down () {
    this.drop('subscribe_emails')
  }
}

module.exports = SubscribeEmailsSchema
