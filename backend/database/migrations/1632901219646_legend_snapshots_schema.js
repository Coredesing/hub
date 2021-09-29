'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LegendSnapshotsSchema extends Schema {
  up () {
    this.create('legend_snapshots', (table) => {
      table.increments()
      table.timestamps()
      table.string('wallet_address');
      table.integer('campaign_id').unsigned().nullable();
      table.string('raw_amount').notNullable();
      table.float('amount');
      table.integer('snapshot_at').notNullable().defaultTo(0);

      table.foreign('campaign_id').references('campaigns.id');
      table.index('wallet_address');
      table.index('campaign_id');
      table.index('snapshot_at');
      table.unique(['campaign_id', 'wallet_address']);
    })
  }

  down () {
    this.drop('legend_snapshots')
  }
}

module.exports = LegendSnapshotsSchema
