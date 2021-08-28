"use strict";

const ErrorFactory = use('App/Common/ErrorFactory');
const BLOCK_PASS_SECRET_KEY = process.env.BLOCK_PASS_SECRET_KEY;
const {createHmac} = use('crypto');

class CheckBlockPassSignature {
  async handle({request}, next) {
    try {
      const body = request.post();
      if (!body) {
        return ErrorFactory.unauthorizedInputException("Access denied!");
      }
      const signature = request.headers()['x-hub-signature'];
      const hash = createHmac('sha256', BLOCK_PASS_SECRET_KEY).update(JSON.stringify(body)).digest("hex");
      if (!signature || signature !== hash) {
        return ErrorFactory.unauthorizedInputException("Access denied!");
      }
    } catch (e) {
      console.log(e);
      return ErrorFactory.internal('Internal error !')
    }
    await next();
  }
}

module.exports = CheckBlockPassSignature;
