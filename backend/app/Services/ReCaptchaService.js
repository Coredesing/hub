'use strict'

const axios = use('axios');
const CaptchaWhitelist = use('App/Models/CaptchaWhitelist');
const RedisCaptchaWhitelistUser = use('App/Common/RedisCaptchaWhitelistUser');

class ReCaptchaService {
  async Verify(captchaToken, address) {
    let status = false
    if (!address) {
      return false;
    }

    const isWhitelist = await this.isAllowRecaptcha(address)
    if (isWhitelist) {
      return true
    }

    if (!captchaToken) {
      return false;
    }

    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
    if (SECRET_KEY == null || !SECRET_KEY.length) return true;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captchaToken}`;
    await axios.post(url)
      .then((response) => {
        if (response.data.success === true) {
          status = true
        } else {
          status = false
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return status
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
