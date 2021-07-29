'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Const = use('App/Common/Const');

class AddActualFinishTimeToCampaignsSchema extends Schema {
  up() {
    this.table('campaigns', (table) => {
      // alter table
      table.string('actual_finish_time').nullable();
    })
  }

  down() {
    this.table('campaigns', (table) => {
    })
  }
}

module.exports = AddActualFinishTimeToCampaignsSchema;
