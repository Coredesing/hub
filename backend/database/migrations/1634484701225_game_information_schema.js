'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameInformationSchema extends Schema {
  up () {
    this.create('game_informations', (table) => {
      table.increments('id')
      table.string('category')
      table.string('developer')
      table.string('hashtags')
      table.string('game_name')
      table.string('language')
      table.text('system_require')
      table.text('game_intro')
      table.text('game_features')
      table.string('android_link')
      table.string('display_area')
      table.string('game_pc_link')
      table.string('intro_video')
      table.string('ios_link')
      table.string('screen_shots_1')
      table.string('screen_shots_2')
      table.string('screen_shots_3')
      table.string('screen_shots_4')
      table.string('screen_shots_5')
      table.string('top_favourite_link')
      table.string('upload_video')
      table.string('verified')
      table.string('web_game_link')
      table.string('accept_currency')
      table.dateTime('ido_date')
      table.string('ido_image')
      table.string('ido_type')
      table.string('network_available')
      table.string('token_price')
      table.timestamps()
    })
  }

  down () {
    this.drop('game_informations')
  }
}

module.exports = GameInformationSchema
