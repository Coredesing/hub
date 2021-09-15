'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Performance = use('App/Models/Performance')

class PerformanceSeeder {
  async run () {
    const performances = [
      {logo: 'https://ipfs.icetea.io/gateway/ipfs/QmVgYNupb1PzyBDGrRqV2KvMjWeZd6qPAfbipgMNZ5kEPz', name: 'Kaby Arena', symbol: 'KABY', price: '$0.007', ath: '$0.175', volume: '$8,102,799' },
      {logo: '/images/partnerships/drace.png', name: 'Death Road', symbol: 'DRACE', price: '$0.006', ath: '$0.308', volume: '$5,551,422' },
      {logo: '/images/partnerships/gamefi.png', name: 'GameFi', symbol: 'GAFI', price: '$1.00', ath: '$76', volume: '$7,290,525' },
      {logo: '/images/partnerships/mechmaster.png', name: 'Mech Master', symbol: 'MECH', price: 'N/A', ath: 'N/A', volume: 'N/A' },
    ];
    for (let i = 0; i < performances.length; i++) {
      try {
        let data = new Performance();
        data.logo = performances[i].logo;
        data.name = performances[i].name;
        data.symbol = performances[i].symbol;
        data.price = performances[i].price;
        data.ath = performances[i].ath;
        data.volume = performances[i].volume;
        await data.save();
      }
      catch (e) {}
    }
  }
}

module.exports = PerformanceSeeder
