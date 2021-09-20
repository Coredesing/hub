'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ExportUser extends Model {
    static get table() {
        return 'export_users';
    }
}

module.exports = ExportUser
