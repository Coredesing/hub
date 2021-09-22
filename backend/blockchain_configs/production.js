module.exports = {
  // WEB3_API_URL: 'https://mainnet.infura.io/v3/8eceb668320143dca7b05395869bde7e',
  // WEB3_BSC_API_URL: 'https://bsc-dataseed.binance.org',
  // WEB3_POLYGON_API_URL: 'https://rpc-mainnet.maticvigil.com/',
  WEB3_API_URL: 'https://aged-polished-cloud.quiknode.pro/c3f04c3566969b1abf35082e43565e17c0691df3/',
  WEB3_BSC_API_URL: 'https://shy-muddy-log.bsc.quiknode.pro/de9022e6dfc8f7c6b5701a71c5878cdf2c327ade/',
  WEB3_POLYGON_API_URL: 'https://icy-ancient-brook.matic.quiknode.pro/5eb31582ef99f82659c5fd8da161aa230f4307b9/',
  AVERAGE_BLOCK_TIME: 15000,
  REQUIRED_CONFIRMATION: 3,
  CHAIN_ID: 1,
  contracts: {
    CampaignFactory: {
      CONTRACT_DATA: require('./contracts/Normal/CapaignFactory.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/CapaignFactory.json'),
      CONTRACT_ADDRESS: '0xb3CCE3Bc96AF9fe32ae0E1185F07a25074b0f1e4',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    Campaign: {
      CONTRACT_DATA: require('./contracts/Normal/Campaign.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/Campaign.json'),
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    StakingContest: {
      CONTRACT_DATA: require('./contracts/Normal/StakingContest.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/Campaign.json'),
      CONTRACT_ADDRESS: '',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    StakingPool: {
      CONTRACT_DATA: require('./contracts/Normal/StakingPool.json'),
      CONTRACT_CLAIMABLE: require('./contracts/Claim/Campaign.json'),
      BONUS: require('./contracts/Ranking/Bonus'),
      CONTRACT_ADDRESS: '',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    EthLink: {
      CONTRACT_DATA: require('./contracts/Normal/EthLink.json'),
      CONTRACT_ADDRESS: '0xdf7986c3C00A08967285382A3f1476Cbe7e91ba0',
      FIRST_CRAWL_BLOCK: 745,
      BLOCK_NUM_IN_ONE_GO: 100,
      BREAK_TIME_AFTER_ONE_GO: 1000,
      NEED_NOTIFY_BY_WEBHOOK: true
    },
    Legend: {
      CONTRACT_ADDRESS: '0x9a524692087707fdb0b64f1409FcC1907Ef083b8',
      CONTRACT_DATA: require('./contracts/Erc721.json'),
      DATA: require('./contracts/Ranking/Legends.json')
    }
  }
};
