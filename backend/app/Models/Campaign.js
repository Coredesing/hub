/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Campaign extends Model {
  static get table() {
    return 'campaigns';
  }

  transaction() {
    return this.hasMany('App/Models/Transaction', 'id', 'campaign_id');
  }

  affiliateCampaign() {
    return this.hasMany('App/Models/AffiliateCampaign', 'id', 'campaign_id');
  }

  tiers() {
    return this.hasMany('App/Models/Tier')
  }

  winners() {
    return this.hasMany('App/Models/WinnerListUser')
  }

  whitelistUsers() {
    return this.hasMany('App/Models/WhitelistUser')
  }

  userBalanceSnapshots() {
    return this.hasMany('App/Models/UserBalanceSnapshot')
  }

  campaignClaimConfig() {
    return this.hasMany('App/Models/CampaignClaimConfig')
  }

  whitelistBannerSetting() {
    return this.hasOne('App/Models/WhitelistBannerSetting')
  }

  userBalanceSnapshotsPre() {
    return this.hasMany('App/Models/UserBalanceSnapshotPre')
  }

  socialNetworkSetting() {
    return this.hasOne('App/Models/SocialNetworkSetting')
  }

  socialRequirement() {
    return this.hasOne('App/Models/CampaignSocialRequirement')
  }

  whitelistSubmissions() {
    return this.hasMany('App/Models/UserWhitelistSubmission')
  }

  winnerlistUsers() {
    return this.hasMany('App/Models/WinnerListUser')
  }

  freeBuyTimeSetting() {
    return this.hasOne('App/Models/FreeBuyTimeSetting')
  }

  seriesContentConfig() {
    return this.hasMany('App/Models/SeriesContent')
  }

  boxTypesConfig() {
    return this.hasMany('App/Models/BoxType')
  }

  acceptedTokensConfig() {
    return this.hasMany('App/Models/AcceptedToken')
  }

  tokenomic() {
    return this.hasOne('App/Models/Tokenomic', 'slug', 'slug')
  }
}

module.exports = Campaign;
