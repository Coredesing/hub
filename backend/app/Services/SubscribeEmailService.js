'use strict'

const SubscribeEmailModel = use('App/Models/SubscribeEmail');

class SubscribeEmailService {
  async createRecord(email) {
    const sub = new SubscribeEmailModel();
    sub.email = email
    await sub.save();
    return sub;
  }
}

module.exports = SubscribeEmailService;
