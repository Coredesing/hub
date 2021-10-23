'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldSlugToGameInformationSchema extends Schema {
  up () {
    this.table('game_informations', (table) => {
      // alter table
      table.string('slug').unique()
      table.index('category')
      table.index('is_show')
      table.index('hashtags')
    })
  }

  down () {
    this.table('game_informations', (table) => {
      // reverse alternations
      table.dropColumn('slug')
      table.dropIndex('category')
      table.dropIndex('is_show')
      table.dropIndex('hashtags')
    })
  }
}

module.exports = AddFieldSlugToGameInformationSchema
