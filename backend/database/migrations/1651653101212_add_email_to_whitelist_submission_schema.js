'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddEmailToWhitelistSubmissionSchema extends Schema {
  up () {
    this.table('whitelist_submissions', (table) => {
      // alter table
      table.string('email').nullable()
    })
  }

  down () {
    this.table('whitelist_submissions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddEmailToWhitelistSubmissionSchema
