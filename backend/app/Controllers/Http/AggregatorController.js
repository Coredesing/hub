'use strict'

const AggregatorService = require("../../Services/AggregatorService");
const GameInformation = use('App/Models/GameInformation');
const ProjectInformation = use('App/Models/ProjectInformation');
const Tokenomic = use('App/Models/Tokenomic');

class AggregatorController {
  async aggregatorCreate({request}) {
    try {
      const params = request.all();
      console.log(params)
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setGame(params, false, 0)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: create aggregator fail !');
    }
  }
  async aggregatorUpdate({ request }) {
    try {
      const params = request.all();
      console.log(params)
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setGame(params, true, request.params.id)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: create aggregator fail !');
    }
  }

  async tokenomicsUpdate({request}) {
    try {
      const params = request.all();
      console.log(params)
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setTokenomic(request.params.id, params, true)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: update tokenomics fail !');
    }
  }

  async projectUpdate({request}) {
    try {
      const params = request.all();
      console.log(params)
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setProjectInfo(request.params.id, params, true)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: update project information fail !');
    }
  }

  async tokenomicsInsert({request}) {
    try {
      const params = request.all();
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setTokenomic(request.params.id, params, false)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: update tokenomics fail !');
    }
  }

  async projectInsert({ request}) {
    try {
      const params = request.all();
      console.log(params)
      const aggregatorService = new AggregatorService()
      const aggregator = aggregatorService.setProjectInfo(request.params.id, params, false)
      return aggregator
    } catch (e) {
      console.log(e);
      return HelperUtils.responseErrorInternal('ERROR: update project information fail !');
    }
  }

  async getAggregator({request}) {
    const params = request.all();
    const page = params?.page ? parseInt(params?.page) : 1
    const perPage = params?.per_page ? parseInt(params?.per_page) : 10
    const category = params?.category
    let builder = GameInformation.query()
    if (category) {
      builder = builder.where('category', category)
    }
    const list =  await builder.paginate(page, perPage)
    return list
  }

  async findAggregator({request}) {
    let game = await GameInformation.find(request.params.id)
    return game
  }
  async findProject({request}) {
    let project = await ProjectInformation.findBy('game_id',request.params.id)
    return project
  }
  async findTokenomic({request}) {
    let tokenomic = await Tokenomic.findBy('game_id',request.params.id)
    return tokenomic
  }
}

module.exports = AggregatorController;
