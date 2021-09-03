'use strict'

const axios = use('axios');
const CaptchaWhitelist = use('App/Models/CaptchaWhitelist');

class ReCaptchaService {
  async Verify(captchaToken, address) {
    let status = false
    if (!address) {
      return false;
    }

    const isWhitelist = await CaptchaWhitelist.query().where('address', address.toLowerCase()).getCount()
    if (isWhitelist > 0) {
      return true
    }

    if (!captchaToken) {
      return false;
    }

    const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
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
}

module.exports = ReCaptchaService
