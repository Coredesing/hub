'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IndexesSchema extends Schema {
  up () {
    this.table('admins', (table) => {table.unique('wallet_address')})
    this.table('block_pass_approved', (table) => {table.unique('guid'); table.unique(['email', 'wallet_address']); table.index('wallet_address')})
    this.table('campaign_claim_config', (table) => {table.foreign('campaign_id').references('campaigns.id')})
    this.table('campaigns', (table) => {table.index('token_type'); table.index('campaign_status'); table.index('is_private'); table.index('is_display')})
    this.table('reserved_list', (table) => {
      table.unique(['campaign_id', 'wallet_address']); table.foreign('campaign_id').references('campaigns.id');
      table.index('wallet_address')
    })
    this.table('social_network_settings', (table) => {table.foreign('campaign_id').references('campaigns.id')})
    this.table('tiers', (table) => {table.foreign('campaign_id').references('campaigns.id')})
    this.table('user_balance_snapshot', (table) => {
      table.unique(['campaign_id', 'wallet_address']); table.foreign('campaign_id').references('campaigns.id');
      table.index('wallet_address')
    })
    this.table('users', (table) => {
      table.unique('email'); table.unique('wallet_address');
      table.index('status'); table.index('is_kyc')
    })
    this.table('wallet_accounts', (table) => {table.unique('wallet_address'); table.foreign('campaign_id').references('campaigns.id')})
    this.table('whitelist_banner_settings', (table) => {table.foreign('campaign_id').references('campaigns.id')})
    this.table('whitelist_users', (table) => {table.index('wallet_address'); table.foreign('campaign_id').references('campaigns.id')})
    this.table('winner_list', (table) => {
      table.unique(['campaign_id', 'wallet_address']); table.foreign('campaign_id').references('campaigns.id');
      table.index('wallet_address')
    })

  }

  down () {
    this.table('admins', (table) => {table.dropUnique('wallet_address')})
    this.table('block_pass_approved', (table) => {table.dropUnique('guid'); table.dropUnique(['email', 'wallet_address']); table.dropIndex('wallet_address')})
    this.table('campaign_claim_config', (table) => {table.dropForeign('campaign_id')})
    this.table('campaigns', (table) => {table.dropIndex('token_type'); table.dropIndex('campaign_status'); table.dropIndex('is_private'); table.dropIndex('is_display')})
    this.table('reserved_list', (table) => {
      table.dropForeign('campaign_id'); table.dropUnique(['campaign_id', 'wallet_address']);
      table.dropIndex('wallet_address')
    })
    this.table('social_network_settings', (table) => {table.dropForeign('campaign_id')})
    this.table('tiers', (table) => {table.dropForeign('campaign_id')})
    this.table('user_balance_snapshot', (table) => {
      table.dropForeign('campaign_id'); table.dropUnique(['campaign_id', 'wallet_address']);
      table.dropIndex('wallet_address')
    })
    this.table('users', (table) => {
      table.dropUnique('email'); table.dropUnique('wallet_address');
      table.dropIndex('status'); table.dropIndex('is_kyc')
    })
    this.table('wallet_accounts', (table) => {table.dropForeign('campaign_id'); table.dropUnique('wallet_address')})
    this.table('whitelist_banner_settings', (table) => {table.dropForeign('campaign_id')})
    this.table('whitelist_users', (table) => {table.dropForeign('campaign_id'); table.dropIndex('wallet_address')})
    this.table('winner_list', (table) => {
      table.dropForeign('campaign_id'); table.dropUnique(['campaign_id', 'wallet_address']);
      table.dropIndex('wallet_address')
    })

  }
}

module.exports = IndexesSchema
