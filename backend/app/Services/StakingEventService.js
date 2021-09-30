'use strict'

const HelperUtils = use('App/Common/HelperUtils');
const StakingEventModel = use('App/Models/StakingEvent');
const BigNumber = use('bignumber.js');
const RedisUtils = use('App/Common/RedisUtils')
const RedisStakingPoolUtils = use('App/Common/RedisStakingPoolUtils')
const RedisLegendSnapshotUtils = use('App/Common/RedisLegendSnapshotUtils')
const LINEAR_DEPOSIT_EVENT = 'LinearDeposit'
const LINEAR_WITHDRAW_EVENT = 'LinearPendingWithdraw'
const DEFAULT_FROM = process.env.START_BLOCK || 12304325
const STEP = 5000

class StakingEventService {
  async queryTop(param) {
    try {
      let data = await StakingEventModel.query()
        .whereBetween('dispatch_at', [param.start_time, param.end_time])
        .select('wallet_address')
        .sum('amount as amount')
        .max('dispatch_at as last_time')
        .groupBy('wallet_address')
        .orderBy('amount', 'desc')
        .orderBy('last_time', 'asc')
        .limit(param.limit)

      const min_tier = param.min_tier ? param.min_tier : 0
      data = JSON.parse(JSON.stringify(data))
      data = data.filter(u => u.amount > min_tier)
      const cachedData = {
        start_time: param.start_time,
        end_time: param.end_time,
        limit: param.top ? param.top : param.limit,
        top: data,
      }

      await RedisStakingPoolUtils.setRedisTopUsersStaking(cachedData)
    }
    catch (e) {
      console.log('error', e)
    }
  }

  async runLegendStaking() {
    try {
      const legends = await HelperUtils.getLegendData()
      let data = []
      for (let index = 0; index < legends.length; index++) {
        const item = legends[index]
        if (!item.valid) {
          data.push({
            wallet_address: item.wallet_address,
            amount: 0
          })
          break
        }

        try {
          const tier = await HelperUtils.getUserTierSmart(item.wallet_address)
          let last_time = 0

          if (await RedisLegendSnapshotUtils.existRedisLegendLastTime(item.wallet_address)) {
            last_time = await RedisLegendSnapshotUtils.getRedisLegendLastTime(item.wallet_address)
          }

          if (last_time < 1) {
            const stakingEventData = await StakingEventModel.query()
              .where('wallet_address', item.wallet_address)
              .orderBy('dispatch_at', 'desc')
              .limit(1).first()

            if (stakingEventData && stakingEventData.dispatch_at) {
              last_time = stakingEventData.dispatch_at
              await RedisLegendSnapshotUtils.setRedisLegendLastTime(item.wallet_address, last_time)
            }
          }

          data.push({
            wallet_address: item.wallet_address,
            amount: tier[1],
            last_time: parseInt(last_time),
          })
        }
        catch (e) {
          data.push({
            wallet_address: item.wallet_address,
            amount: 0,
            last_time: 0
          })
        }
      }

      data.sort((a, b) => {
        const amountA = new BigNumber(a.amount)
        const amountB = new BigNumber(b.amount)
        if (amountA.eq(amountB)) {
          return a.last_time > b.last_time ? -1 : 1;
        }

        return amountA.gte(amountB) ? -1 : 1;
      });

      await RedisLegendSnapshotUtils.setRedisLegendCurrentStaked(data)
    }
    catch (e) {}
  }

  async runAll() {
    try {
      const provider = await HelperUtils.getStakingProvider()
      const latestBlockNumber = (await provider.eth.getBlockNumber()) - 1
      let from = {
        deposit: DEFAULT_FROM,
        withdraw: DEFAULT_FROM,
      }
      try {
        if (await RedisStakingPoolUtils.checkExistStakingLastBlockNumber()) {
          from = JSON.parse(await RedisStakingPoolUtils.getRedisStakingLastBlockNumber())
        }
      }
      catch (e) {
        from = {
          deposit: DEFAULT_FROM,
          withdraw: DEFAULT_FROM,
        }
      }

      // fetch staking
      for (let index = from.deposit; index < latestBlockNumber; index += STEP) {
        let to = index + STEP
        if (to >= latestBlockNumber) {
          to = latestBlockNumber
        }

        await this.run(provider, LINEAR_DEPOSIT_EVENT, index, to)
      }

      // fetch withdraw
      for (let index = from.withdraw; index < latestBlockNumber; index += STEP) {
        let to = index + STEP
        if (to > latestBlockNumber) {
          to = latestBlockNumber
        }
        await this.run(provider, LINEAR_WITHDRAW_EVENT, index, to)
      }

      await RedisStakingPoolUtils.setRedisStakingLastBlockNumber({deposit: latestBlockNumber, withdraw: latestBlockNumber})
    }
    catch (e) {}
  }

  async run(provider, event_type, from, to) {
    console.log(`fetch ${event_type} from ${from} to ${to}`)
    const instance = await HelperUtils.getStakingPoolInstance()
    const ONE_UNIT = new BigNumber(1e9).multipliedBy(new BigNumber(1e9))
    let sign = event_type === LINEAR_DEPOSIT_EVENT ? 1 : -1;

    const depositEvents = await instance.getPastEvents(event_type, {
      fromBlock: from,
      toBlock: to,
    })
    for (const event of depositEvents) {
      try {
        const blockData = await provider.eth.getBlock(event.blockNumber)

        let data = new StakingEventModel();
        data.transaction_hash = event.transactionHash;
        data.transaction_index = event.transactionIndex;
        data.wallet_address = event.returnValues.account;
        data.event_type = event_type;
        data.block_number = event.blockNumber;
        data.dispatch_at = blockData.timestamp;
        data.raw_amount = event.returnValues.amount;
        data.amount = parseFloat(new BigNumber(data.raw_amount).dividedBy(ONE_UNIT).toFixed(6)) * sign;

        await data.save();

        const tierInfo = await HelperUtils.getUserTierSmart(event.returnValues.account);
        await RedisUtils.createRedisUserTierBalance(event.returnValues.account, tierInfo);

        if (HelperUtils.getLegendIdByOwner(event.returnValues.account)) {
          await RedisLegendSnapshotUtils.setRedisLegendLastTime(event.returnValues.account, blockData.timestamp);
        }
      }
      catch (e) {}
    }
  }
}

module.exports = StakingEventService
