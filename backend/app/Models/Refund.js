/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Refund extends Model {
  static get table() {
    return 'refunds';
  }
}

module.exports = Refund;
