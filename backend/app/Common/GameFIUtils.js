'use strict'

const getGameFIPool = async (CampaignModel) => {
  try {
    let pool = await CampaignModel.query()
      .with('whitelistBannerSetting')
      .where('token_type', 'erc721')
      .where('min_tier', 0)
      .where('is_display', 1)
      .where('symbol', 'Ticket')
      .last();

    if (!pool) {
      return null;
    }

    return JSON.parse(JSON.stringify(pool));
  }
  catch (e) {
    console.log('Get GameFI Pool error', e)
    return null
  }
}

module.exports = {
  getGameFIPool,
};
