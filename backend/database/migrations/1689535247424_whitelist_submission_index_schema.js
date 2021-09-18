'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WhitelistSubmissionIndexSchema extends Schema {
  up () {
    this.table('whitelist_submissions', (table) => {
      table.index('self_twitter_status')
      table.index('self_group_status')
      table.index('self_channel_status')
      table.index('self_retweet_post_status')
      table.index('partner_twitter_status')
      table.index('partner_group_status')
      table.index('partner_channel_status')
      table.index('partner_retweet_post_status')
    })
  }

  down () {
    this.table('whitelist_submissions', (table) => {
      table.dropIndex('self_twitter_status')
      table.dropIndex('self_group_status')
      table.dropIndex('self_channel_status')
      table.dropIndex('self_retweet_post_status')
      table.dropIndex('partner_twitter_status')
      table.dropIndex('partner_group_status')
      table.dropIndex('partner_channel_status')
      table.dropIndex('partner_retweet_post_status')
    })
  }
}

module.exports = WhitelistSubmissionIndexSchema
