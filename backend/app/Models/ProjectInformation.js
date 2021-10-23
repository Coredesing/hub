'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProjectInformation extends Model {
  static get table() {
    return 'project_informations';
  }
}

module.exports = ProjectInformation
