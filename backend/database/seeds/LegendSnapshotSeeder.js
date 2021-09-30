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
const LegendSnapshotModel = use('App/Models/LegendSnapshot')

class LegendSnapshotSeeder {
  async run () {
    const snapshots = [
      {wallet_address: '0x5E9feE15038CA8333e80F3A4725a2320b4ce62AE', amount: '3158.2186815', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x996131EEd1fc6f83F8245602c8D171227311ceAf', amount: '2846.8574667', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x3C69e20E4Ec8bb4148378f1e5Dfc1d6EA94AA22C', amount: '2402', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x539edd96b903c6bfDA5A54a28A74a85432309a88', amount: '2401.0507427', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x16CdDd6e47661DC4D709804A7f7f687CFa6eFca6', amount: '2363.7942695', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x61E98B202DD547665951cB6468C2bDB3D880efC1', amount: '2333.0915827', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0xaC6dE9f16c7b9B44C4e5C9073C3a10fA45aB4d5a', amount: '2247.35', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x57a36E40A540FB1744cC30D47D2C7E5888110C5D', amount: '2219.3609099', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x9bA4C6e0594118bA0B9DfF300FaE795Bb1037311', amount: '2150.0043355', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x0C5D8C995C19af7d5691082cB5Cca2622b2cFa42', amount: '2132.3120265', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0xF91fec621564d1D9179Ce8d3FA47a80a3Bb4B0FD', amount: '1971', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },
      {wallet_address: '0x3506e5f79754e8aAd83152b8E6189b6c5508AAD4', amount: '1965', snapshot_at: '1632315917', campaign_id: 11, raw_amount: '',  },

      {wallet_address: '0x5E9feE15038CA8333e80F3A4725a2320b4ce62AE', amount: '3158.2186815', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x996131EEd1fc6f83F8245602c8D171227311ceAf', amount: '2846.8574667', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x539edd96b903c6bfDA5A54a28A74a85432309a88', amount: '2503.0507427', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x3C69e20E4Ec8bb4148378f1e5Dfc1d6EA94AA22C', amount: '2402', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x16CdDd6e47661DC4D709804A7f7f687CFa6eFca6', amount: '2363.7942695', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x61E98B202DD547665951cB6468C2bDB3D880efC1', amount: '2333.0915827', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0xaC6dE9f16c7b9B44C4e5C9073C3a10fA45aB4d5a', amount: '2247.35', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x57a36E40A540FB1744cC30D47D2C7E5888110C5D', amount: '2219.3609099', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x9bA4C6e0594118bA0B9DfF300FaE795Bb1037311', amount: '2150.0043355', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x0C5D8C995C19af7d5691082cB5Cca2622b2cFa42', amount: '2132.3120265', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0xF91fec621564d1D9179Ce8d3FA47a80a3Bb4B0FD', amount: '1971', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
      {wallet_address: '0x3506e5f79754e8aAd83152b8E6189b6c5508AAD4', amount: '1965', snapshot_at: '1632321050', campaign_id: 13, raw_amount: '',  },
    ];
    for (let i = 0; i < snapshots.length; i++) {
      try {
        let data = new LegendSnapshotModel();
        data.wallet_address = snapshots[i].wallet_address;
        data.campaign_id = snapshots[i].campaign_id;
        data.raw_amount = snapshots[i].raw_amount || '';
        data.amount = snapshots[i].amount;
        data.snapshot_at = snapshots[i].snapshot_at;
        await data.save();
      }
      catch (e) {}
    }
  }
}

module.exports = LegendSnapshotSeeder
