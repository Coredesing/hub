'use strict'
const HelperUtils = use('App/Common/HelperUtils')
const ReputationLogModel = use('App/Models/ReputationLog')
const RateSettingModel = use('App/Models/RateSetting')
const UserService = use('App/Services/UserService')
const BigNumber = use('bignumber.js')
const PKF_SMART_CONTRACT_ADDRESS = process.env.PKF_SMART_CONTRACT_ADDRESS
const UNI_LP_PKF_SMART_CONTRACT_ADDRESS = process.env.UNI_LP_PKF_SMART_CONTRACT_ADDRESS

class ReputationService {
    async indexStakeInfo(event, params, txHash) {
        const contractTier = await HelperUtils.getTierSmartContractInstance()
        const [stakedEvents, unstakedEvents] = await Promise.all([
            HelperUtils.getEventSmartContract({ contract: contractTier, eventName: 'StakedERC20', filter: { user: params.user } }),
            HelperUtils.getEventSmartContract({ contract: contractTier, eventName: 'WithdrawnERC20', filter: { user: params.user } })
        ])

        await this.insertDataReputationLog({ address: params.user, stakedEvents, unstakedEvents })
    }
    async getReputationPoint(walletAddress) {
        const [reputationLog, rateSetting] = await Promise.all([
            ReputationLogModel.query().where('wallet_address', HelperUtils.checkSumAddress(walletAddress)).first(),
            RateSettingModel.query().first()
        ])
        const stakedTokenToRatePKF = {
            [HelperUtils.checkSumAddress(UNI_LP_PKF_SMART_CONTRACT_ADDRESS)]: rateSetting ? rateSetting.lp_pkf_rate : 800,
            [HelperUtils.checkSumAddress(PKF_SMART_CONTRACT_ADDRESS)]: 1
        }

        return !reputationLog ? 0 : (JSON.parse(reputationLog.staking_history).filter(his => his.balance > 0).reduce((reputation, log) => {
            return reputation.plus(this.getPoint({ amount: log.balance, stakedAt: log.stakedAt, ratePKF: stakedTokenToRatePKF[HelperUtils.checkSumAddress(log.token)] || 0 }))
        }, new BigNumber(0))).toNumber()
    }
    async getReputationHistory({ walletAddress, page, pageSize, hideZeroTx }) {
        const valueToBool = {
            "true": true,
            "false": false
        }

        const [reputationLog, rateSetting, rkpFromKSM] = await Promise.all([
            ReputationLogModel.query().where('wallet_address', HelperUtils.checkSumAddress(walletAddress)).first(),
            RateSettingModel.query().first(),
            new Promise(async (resolve, reject) => {
                try {
                    const result = await HelperUtils.getEPkfBonusBalance(HelperUtils.checkSumAddress(walletAddress))
                    resolve(result.data && result.data.data ? +result.data.data : 0)
                } catch (error) {
                    reject(error)
                }
            })
        ])
        const stakedTokenToRatePKF = {
            [HelperUtils.checkSumAddress(UNI_LP_PKF_SMART_CONTRACT_ADDRESS)]: rateSetting ? rateSetting.lp_pkf_rate : 800,
            [HelperUtils.checkSumAddress(PKF_SMART_CONTRACT_ADDRESS)]: 1
        }

        let rkpHistories = !reputationLog ? [] : JSON.parse(reputationLog.staking_history).map(his => {
            return {
                // token: his.token,
                staked: {
                    tx: his.staked.txHash,
                    amount: his.staked.amount
                },
                unstaked: his.unstaked.map(unstaked => {
                    return {
                        tx: unstaked.txHash,
                        calculatedAmount: unstaked.calculatedAmount,
                        unstakedAmount: unstaked.unstakedAmount,
                        remainingAmount: new BigNumber(unstaked.unstakedAmount).minus(new BigNumber(unstaked.calculatedAmount)).toNumber()
                    }
                }),
                balance: his.balance,
                percent: this.getPercentReputation(this.getStakedDay(his.stakedAt)),
                days: this.getStakedDay(his.stakedAt),
                points: this.getPoint({ amount: his.balance, stakedAt: his.stakedAt, ratePKF: stakedTokenToRatePKF[HelperUtils.checkSumAddress(his.token)] || 0 }).toNumber(),
                stakedAt: his.stakedAt
            }
        })

        if (valueToBool[hideZeroTx]) {
            rkpHistories = rkpHistories.filter(his => his.balance)
        }

        const rkpFromStaked = rkpHistories.filter(his => his.balance).reduce((reputation, his) => {
            return reputation.plus(his.points)
        }, new BigNumber(0)).toNumber()

        return {
            rkpFromStaked: rkpFromStaked,
            rkpFromKSM: rkpFromKSM,
            totalEarned: new BigNumber(rkpFromStaked).plus(new BigNumber(rkpFromKSM)).toNumber(),
            rkpHistories: HelperUtils.paginationArray(rkpHistories , page, pageSize)
        }
    }
    getStakedDay(stakedAt) {
        return Math.floor((Date.now() / 1000 - stakedAt) / (24 * 60 * 60))
    }
    getPercentReputation(stakedDay) {
        const dayToPercent = {
            60: 2,
            30: 1.5,
            1: 1,
            0: 0
        }
        return dayToPercent[Object.keys(dayToPercent).map(day => +day).sort((a, b) => b - a).find(day => stakedDay >= day)]
    }
    getPoint({ amount, stakedAt, ratePKF }) {
        const stakedDay = this.getStakedDay(stakedAt)
        const stakedAge = stakedDay > 90 ? 90 : stakedDay
        const percent = this.getPercentReputation(stakedDay)
        return new BigNumber(stakedAge).times(new BigNumber(amount)).times(new BigNumber(percent)).times(new BigNumber(ratePKF)).dividedBy(100)
    }
    async insertDataReputationLog({ address, stakedEvents, unstakedEvents }) {
        const checkSumAddress = HelperUtils.checkSumAddress(address);
        const tokens = [...new Set(stakedEvents.map(event => event.returnValues.token))].filter(token => token)

        const tokenToDecimals = (await Promise.all(tokens.map(token => HelperUtils.getDecimalsByTokenAddress({ address: token }))))
            .reduce((obj, decimal) => {
                return { ...obj, ...decimal }
            }, {})

        const formatStakedEvents = this.formatEvents({ events: stakedEvents, tokenToDecimals })
        let formatUnstakedEvents = this.formatEvents({ events: unstakedEvents, tokenToDecimals })

        const stakedHistories = formatStakedEvents.map(event => {
            formatUnstakedEvents = this.mutateUnstakedTx({ amount: event.amount, token: event.token, unstakedEvents: formatUnstakedEvents })
            const unstakeds = formatUnstakedEvents.filter(x => event.token == x.token && x.calculatedAmount)
            return {
                blockNumber: event.blockNumber,
                token: event.token,
                staked: {
                    txHash: event.txHash,
                    amount: event.amount.toNumber()
                },
                unstaked: unstakeds.map(unstaked => {
                    return {
                        txHash: unstaked.txHash,
                        calculatedAmount: unstaked.calculatedAmount.toNumber(),
                        unstakedAmount: unstaked.unstakedAmount.toNumber()
                    }
                }),
                balance: event.amount.minus(unstakeds.reduce((totalUnstaked, unstaked) => totalUnstaked.plus(unstaked.calculatedAmount), new BigNumber(0))).toNumber()
            }
        })

        const [reputationExist, userStaking, blockNumberToTimeStamp] = await Promise.all([
            ReputationLogModel.query().where('wallet_address', checkSumAddress).first(),
            (new UserService).findUser({ wallet_address: checkSumAddress }),
            new Promise(async (resolve, reject) => {
                try {
                    const blockInfos = await Promise.all(stakedHistories.map(his => HelperUtils.getBlockInfo(his.blockNumber)))
                    resolve(blockInfos.reduce((blockNumberToTime, info) => {
                        return {
                            ...blockNumberToTime,
                            [info.number]: info.timestamp
                        }
                    }, {}))
                } catch (error) {
                    reject(error)
                }
            })
        ])

        const reputationLog = reputationExist || new ReputationLogModel
        reputationLog.wallet_address = checkSumAddress
        reputationLog.user_id = userStaking ? userStaking.id : null;
        reputationLog.staking_history = JSON.stringify(stakedHistories.map(his => {
            return {
                ...his,
                stakedAt: blockNumberToTimeStamp[his.blockNumber]
            }
        }))

        await reputationLog.save()
    }
    formatEvents({ events, tokenToDecimals }) {
        return events.map(event => {
            return {
                blockNumber: event.blockNumber,
                user: event.returnValues.user,
                token: event.returnValues.token,
                amount: new BigNumber(event.returnValues.amount || 0).dividedBy(Math.pow(10, tokenToDecimals[HelperUtils.checkSumAddress(event.returnValues.token)])),
                txHash: event.transactionHash,
                unstakedAmount: new BigNumber(event.returnValues.amount || 0).dividedBy(Math.pow(10, tokenToDecimals[HelperUtils.checkSumAddress(event.returnValues.token)]))
            }
        })
    }
    mutateUnstakedTx({ amount, token, unstakedEvents }) {
        return unstakedEvents.map(event => {
            if (event.amount.eq(0)) return
            if (amount.eq(0) || token != event.token) return event

            let newAmount = new BigNumber(0)
            let calculatedAmount = event.amount
            if (amount.lt(event.amount)) {
                newAmount = event.amount.minus(amount)
                calculatedAmount = amount
                amount = new BigNumber(0)
            } else {
                amount = amount.minus(event.amount)
            }

            return {
                ...event,
                calculatedAmount,
                amount: newAmount
            }
        }).filter(event => event)
    }
}

module.exports = ReputationService