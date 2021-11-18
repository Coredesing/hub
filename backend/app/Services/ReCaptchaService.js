'use strict'

const axios = use('axios');
const CaptchaWhitelist = use('App/Models/CaptchaWhitelist');
const RedisCaptchaWhitelistUser = use('App/Common/RedisCaptchaWhitelistUser');

class ReCaptchaService {
  async Verify(captchaToken, address, start_time, start_preorder_time) {
    let status = false
    let message = ''
    if (!address) {
      return {
        status: false,
        message: 'address not found'
      }
    }

    const isWhitelist = await this.isAllowRecaptcha(address)
    if (isWhitelist) {
      return {
        status: true,
        message: ''
      }
    }

    if (!captchaToken) {
      return {
        status: false,
        message: 'token not found'
      }
    }

    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
    if (SECRET_KEY == null || !SECRET_KEY.length) return true;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captchaToken}`;
    await axios.post(url)
      .then((response) => {
        if (!response.data) {
          message = 'request error'
          return
        }

        // check with pool without preorder (first for community)
        const ts = Date.parse(response.data.challenge_ts)
        let loadingCaptchaTime = start_time
        if ((isNaN(start_preorder_time) || start_preorder_time < 1) && !isNaN(loadingCaptchaTime) && ts < (loadingCaptchaTime * 1000)) {
          message = 'load recaptcha before running time'
          return
        }

        if (response.data.success === true) {
          status = true
        } else {
          status = false
          message = 'status failed'
        }
      })
      .catch((error) => {
        console.log(error);
        message = 'internal server error'
      });

    return {
      status: status,
      message: message
    }
  }

  async isAllowRecaptcha(wallet_address) {
    try {
      if (!wallet_address) {
        return false
      }

      let users = []
      if (await RedisCaptchaWhitelistUser.checkExistRedisWhitelistCaptcha()) {
        users = JSON.parse(await RedisCaptchaWhitelistUser.getRedisWhitelistCaptcha())
        if (!Array.isArray(users)) {
          return false
        }

        return users.filter(u => u.address.toLowerCase() === wallet_address.toLowerCase()).length > 0
      }

      const data = await CaptchaWhitelist.query().select('address').fetch()
      users = JSON.parse(JSON.stringify(data))
      if (!Array.isArray(users)) {
        return false
      }

      await RedisCaptchaWhitelistUser.setRedisWhitelistCaptcha(users)
      return users.filter(u => u.address.toLowerCase() === wallet_address.toLowerCase()).length > 0
    }
    catch (e) {
      return false
    }
  }
}

module.exports = ReCaptchaService
