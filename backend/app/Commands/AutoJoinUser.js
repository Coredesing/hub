'use strict'

const { Command } = require('@adonisjs/ace');

class AutoJoinUser extends Command {
  static get signature () {
    return 'auto:join:user {campaign: Campaign ID}'
  }

  static get description () {
    return 'Command to join user by Campaign Id'
  }

  async handle (args, options) {
    this.info('Dummy implementation for auto:join:user command');
    process.exit(0);
  }
}

module.exports = AutoJoinUser;
