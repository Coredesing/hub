'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SeriesContentSchema extends Schema {
  up () {
    this.create('series_contents', (table) => {
      table.increments()
      table.timestamps()

      table.integer('campaign_id').unsigned().index();
      table.string('name');
      table.integer('amount');
      table.float('rate');
      table.foreign('campaign_id').references('campaigns.id');
    })
  }

  down () {
    this.drop('series_contents')
  }
}

module.exports = SeriesContentSchema
