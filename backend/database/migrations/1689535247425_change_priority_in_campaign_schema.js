'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChangePriorityInCampaignSchema extends Schema {
  up() {
    this.table('campaigns', (table) => {
      // alter table
      table.integer('priority').nullable().default(1).alter();
    })
  }

  down() {
    this.table('campaigns', (table) => {
      table.integer('priority').nullable().default(0).alter();
    })
  }
}

module.exports = ChangePriorityInCampaignSchema
