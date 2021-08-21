"use strict";

const ErrorFactory = use('App/Common/ErrorFactory');

class CheckJwtWebhook {
  async handle({ request,  }, next) {
    const headers = request.headers();

    const webhookToken = headers.webhooktoken;
    const webhookTokenEnv = process.env.WEBHOOK_API_TOKEN;
    if (!webhookToken || webhookToken !== webhookTokenEnv) {
      return  ErrorFactory.unauthorizedInputException("UnauthorizedInputException: Incorrect Token");
    }
    await next();
  }
}

module.exports = CheckJwtWebhook;
