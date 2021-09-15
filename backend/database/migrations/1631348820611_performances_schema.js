'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PerformancesSchema extends Schema {
  up () {
    this.create('performances', (table) => {
      table.increments()
      table.timestamps()
      table.string('logo')
      table.string('name')
      table.string('symbol')
      table.string('price')
      table.string('ath')
      table.string('volume')
      table.unique('symbol')
    })
  }

  down () {
    this.drop('performances')
  }
}

module.exports = PerformancesSchema
