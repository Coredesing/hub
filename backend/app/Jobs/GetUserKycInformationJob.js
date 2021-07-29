'use strict'

const UserModel = use('App/Models/User')
const requests = require("request")
const Const = use('App/Common/Const');

class GetUserKycInformationJob {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return 'GetUserKycInformationJob-job'
  }

  // This is where the work is done.
  async handle(data) {
    console.log('GetUserKycInformationJob-job started')

    try {
      await GetUserKycInformationJob.doUpdateUserKycInformation()
    } catch (e) {
      console.log('GetUserKycInformationJob has error', e)
      throw e;
    }
  }

  static async doUpdateUserKycInformation() {
    try {
      const url = process.env.BLOCK_PASS_API_URL.replace('CLIENT_ID', process.env.BLOCK_PASS_CLIENT_ID)
        .replace('recordId/RECORDID', 'applicants/approved')

      let _limit = 20
      let _total = 0
      let _page = 0

      do {
        if (!_total) {
          console.log(`Fetching records of total unkown`)
        } else {
          console.log(`Fetching records ${_page * _limit} - ${_total < (_page * _limit + _limit - 1) ? _total : (_page * _limit + _limit - 1)} of total ${_total}`)
        }

        const options = {
          url: url,
          method: 'GET',
          qs: {
            limit: _limit,
            skip: _page * _limit
          },
          headers: {
            'Authorization': process.env.BLOCK_PASS_API_KEY
          }
        }

        const response = await new Promise((resolve, reject) => {
          requests(options, function (error, response, body) {
            if (error) reject(error)
            else resolve(response)
          })
        })

        if (!response || response.statusCode !== 200) {
          throw `Failed when fetching list kyc information from BlockPass`
        }

        const res = JSON.parse(response.body)
        if (!res || !res.data || !res.data.total) {
          throw `Failed when fetching list kyc information from BlockPass`
        }

        if (!res.data.total) {
          throw `No data when fetching list kyc information from BlockPass`
        }

        if (_total !== res.data.total) {
          _total = res.data.total
        }

        if (_limit !== res.data.limit) {
          _limit = res.data.limit
        }

        for (const el of res.data.records) {
          let user = await UserModel.query().where('wallet_address', el.identities.crypto_address_eth.value)
            .andWhere('email', el.identities.email.value).first()

          if (!user) {
            user = await UserModel.query().where('record_id', el.recordId).first()
          }

          if (!user) {
            // console.log(`not found user `, email , ' - address ', el.identities.crypto_address_eth.value);
            continue
          }

          let country = JSON.parse(el.identities.address.value).country;
          if (el.identities.passport_issuing_country != null) {
            country = el.identities.passport_issuing_country.value;
          } else if (el.identities.national_id_issuing_country != null ) {
            country = el.identities.national_id_issuing_country.value;
          } else if (el.driving_license_issuing_country != null) {
            country = el.identities.driving_license_issuing_country.value;
          }

          if (user.record_id === el.recordId &&
            user.national_id_issuing_country === country &&
            user.is_kyc == Const.KYC_STATUS.APPROVED &&
            user.address_country === JSON.parse(el.identities.address.value).country) {
            console.log('Dont update user');
            continue
          }

          user.record_id = el.recordId
          user.ref_id = el.refId;
          user.is_kyc = Const.KYC_STATUS.APPROVED
          user.address_country = JSON.parse(el.identities.address.value).country;
          user.national_id_issuing_country = country;
          await user.save()

          console.log(`Updated user who has wallet: ${user.wallet_address}, email: ${user.email}`);
        }

        _page += 1
      } while (_page * _limit < _total)

      return

    } catch (e) {
      console.error(e);
      throw (e)
    }
  }
}

module.exports = GetUserKycInformationJob

