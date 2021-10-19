'use strict'

const GameInformation = use('App/Models/GameInformation');
const ProjectInformation = use('App/Models/ProjectInformation');
const Tokenomic = use('App/Models/Tokenomic');

class AggregatorService {
  async setGame(param, isUpdate, id) {
    let gameProject = new GameInformation()
    if (isUpdate) {
      gameProject = await GameInformation.find(id)
    }
    gameProject.game_name = param?.gameInfo?.game_name
    gameProject.category = param?.gameInfo?.category
    gameProject.developer = param?.gameInfo?.developer
    gameProject.language = param?.gameInfo?.language
    gameProject.hashtags = param?.gameInfo?.hashtags
    gameProject.game_features = param?.gameInfo?.game_features
    gameProject.game_intro = param?.gameInfo?.game_intro
    gameProject.system_require = param?.gameInfo?.system_require
    gameProject.android_link = param?.displaySettings?.android_link
    gameProject.display_area = param?.displaySettings?.display_area
    gameProject.game_pc_link = param?.displaySettings?.game_pc_link
    gameProject.intro_video = param?.displaySettings?.intro_video
    gameProject.ios_link = param?.displaySettings?.ios_link
    gameProject.screen_shots_1 = param?.displaySettings?.screen_shots_1
    gameProject.screen_shots_2 = param?.displaySettings?.screen_shots_2
    gameProject.screen_shots_3 = param?.displaySettings?.screen_shots_3
    gameProject.screen_shots_4 = param?.displaySettings?.screen_shots_4
    gameProject.screen_shots_5 = param?.displaySettings?.screen_shots_5
    gameProject.upload_video = param?.displaySettings?.upload_video
    gameProject.verified = param?.displaySettings?.verified
    gameProject.web_game_link = param?.displaySettings?.web_game_link
    gameProject.accept_currency = param?.upcomingIdo?.accept_currency
    gameProject.ido_date = new Date(param?.upcomingIdo?.ido_date)
    gameProject.ido_image = param?.upcomingIdo?.ido_image
    gameProject.ido_type = param?.upcomingIdo?.ido_type
    gameProject.network_available = param?.upcomingIdo?.network_available
    gameProject.token_price = param?.upcomingIdo?.token_price
    await gameProject.save();
    return gameProject;
  }
  async setProjectInfo(id, param, isUpdate) {
    let projectInfo = new ProjectInformation()
    if (isUpdate) {
      projectInfo = await ProjectInformation.findBy('game_id',id)
    }
    projectInfo.game_id = id
    projectInfo.roadmap = param.roadmap
    projectInfo.technologist = param.technologist
    projectInfo.investors = param.investors
    projectInfo.discord_link = param.discord_link
    projectInfo.facebook_link = param.facebook_link
    projectInfo.instagram_link = param.instagram_link
    projectInfo.official_telegram_link = param.official_telegram_link
    projectInfo.official_website = param.official_website
    projectInfo.tiktok_link = param.tiktok_link
    projectInfo.twitch_link = param.twitch_link
    projectInfo.twitter_link = param.twitter_link
    projectInfo.youtube_link = param.youtube_link
    projectInfo.reddit_link = param.reddit_link
    const insertStatus = await projectInfo.save()
    return insertStatus
  }
  async setTokenomic(id, param, isUpdate) {
    let tokenomic = new Tokenomic()
    if (isUpdate) {
      tokenomic = await Tokenomic.findBy('game_id',id)
    }
    tokenomic.game_id = id
    tokenomic.ticker = param.ticker
    tokenomic.network_chain = param.network_chain
    tokenomic.project_valuation = param.project_valuation
    tokenomic.initial_token_cir = param.initial_token_cir
    tokenomic.initial_token_market = param.initial_token_market
    tokenomic.token_supply = param.token_supply
    tokenomic.token_utilities = param.token_utilities
    tokenomic.token_economy = param.token_economy
    tokenomic.token_metrics = param.token_metrics
    tokenomic.token_distribution = param.token_distribution
    tokenomic.token_release = param.token_release
    const insertStatus = await tokenomic.save()
    return insertStatus
  }
}

module.exports = AggregatorService;
