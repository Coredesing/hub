"use strict";

const ForbiddenException = use('App/Exceptions/ForbiddenException');
const sigUtil = require('eth-sig-util')
const Web3 = require('web3')
const Const = use('App/Common/Const');
const web3 = new Web3();
const Utils = use('App/Common/HelperUtils');
const MaskEmailAndWallet = use ('App/Middleware/MaskEmailAndWallet');

class MaskInfoNonAuthorized {
  async handle({request, response, view}, next) {
    let maskEmailFlag = false;
    try {
      const params = request.all();
      const headers = request.headers();
      const signature = headers.signature;
      const message = headers.msgsignature;

      let recover = await web3.eth.accounts.recover(message, signature);
      const recoverConvert = Web3.utils.toChecksumAddress(recover);
      const wallet_address = Web3.utils.toChecksumAddress(params.wallet_address);

      if (recoverConvert && recoverConvert !== wallet_address) {
        maskEmailFlag = true;
      }
    } catch (e) {
      maskEmailFlag = true;
    } finally {
      await next();
      if (maskEmailFlag) {
        const data = response._lazyBody && response._lazyBody.content && response._lazyBody.content.data;
        const mask = new MaskEmailAndWallet();
        mask.doMask(data, ['email', 'wallet', 'wallet_address', 'user_twitter', 'user_telegram']);
      }
    }
  }
}

module.exports = MaskInfoNonAuthorized;
