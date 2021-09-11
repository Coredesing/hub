'use strict'

const Performance = use('App/Models/Performance')

class PerformanceService {
  buildQueryBuilder(params) {
    let builder = Performance.query();
    return builder;
  }

  async findAll(params) {
    let builder = this.buildQueryBuilder(params);
    return builder.fetch();
  }
}

module.exports = PerformanceService
