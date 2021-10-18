'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectInformationSchema extends Schema {
  up () {
    this.create('project_informations', (table) => {
      table.increments('id')
      table.integer('game_id')
      table.text('roadmap')
      table.text('technologist')
      table.text('investors')
      table.string('discord_link')
      table.string('facebook_link')
      table.string('instagram_link')
      table.string('official_telegram_link')
      table.string('official_website')
      table.string('tiktok_link')
      table.string('twitch_link')
      table.string('twitter_link')
      table.string('youtube_link')
      table.string('reddit_link')
      table.timestamps()
    })
  }

  down () {
    this.drop('project_informations')
  }
}

module.exports = ProjectInformationSchema
