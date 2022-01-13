'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CampaignsIsFeaturedSchema extends Schema {
  up () {
    this.table('campaigns', (table) => {
      // alter table
      table.bool('is_featured').default(false);
    })
  }

  down () {
    this.table('campaigns', (table) => {
      table.dropColumn('is_featured');
    })
  }
}

module.exports = CampaignsIsFeaturedSchema
