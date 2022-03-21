import React, { useCallback, useEffect, useState, useMemo } from 'react'
import clsx from 'clsx'
import { getTimelineOfPool } from '@/utils/pool'
import { formatHumanReadableTime, isImageFile, isVideoFile, shortenAddress } from '@/utils/index'
import useKyc from '@/hooks/useKyc'
import { HashLoader } from 'react-spinners'
import { ObjectType } from '@/utils/types'
import { ButtonBase } from '@/components/Base/Buttons'
import CountDownTimeV1, { CountDownTimeType as CountDownTimeTypeV1 } from '@/components/Base/CountDownTime'
import { TIERS } from '@/utils/constants'
import Erc20Abi from '@/components/web3/abis/ERC20.json'
import AuctionBoxModal from '@/components/Pages/Auction/AuctionBoxModal'
import AuctionPoolAbi from '@/components/web3/abis/AuctionPool.json'
import useAuctionBox from '@/hooks/useAuctionBox'
import { utils, constants, BigNumber } from 'ethers'
import isNumber from 'is-number'
import { useMyWeb3 } from '@/components/web3/context'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import { useAppContext } from '@/context'
import { Table, TableCellHead, TableHead, TableRow, TableBody, TableCell } from '@/components/Base/Table'
import PoolDetail from '@/components/Base/PoolDetail'
import DialogTxSubmitted from '@/components/Base/DialogTxSubmitted'
import Pagination from '@/components/Base/Pagination'
import { useLibraryDefaultFlexible, useTokenAllowance, useTokenApproval } from '@/components/web3/utils'
import { Contract } from '@ethersproject/contracts'
import { getNetworkByAlias, Token as TokenType } from '@/components/web3'
import toast from 'react-hot-toast'
import SerieContent from './SerieContent'
import RuleIntroduce from './RuleIntroduce'
import DetailPoolItem from './DetailPoolItem'

const AuctionDetail = ({ poolInfo }: any) => {
  const tiersState = useAppContext()?.$tiers
  const { account: connectedAccount, chainID } = useMyWeb3()
  const [currencyPool, setCurrencyPool] = useState<TokenType & ObjectType<any> | undefined>()
  const [lastBidder, setLastBidder] = useState<null | { wallet: string; amount: string; currency: string }>(null)
  const [resetLastBidder, setResetLastBidder] = useState(true)
  const [rateEachBid, setRateEachBid] = useState<string>('')

  const { provider: libraryDefaultTemporary } = useLibraryDefaultFlexible(poolInfo?.network_available)

  const contractAuctionPool = useMemo(() => {
    if (!poolInfo?.campaign_hash || !libraryDefaultTemporary) {
      return
    }

    return new Contract(poolInfo?.campaign_hash, AuctionPoolAbi, libraryDefaultTemporary)
  }, [poolInfo, libraryDefaultTemporary])
  const contractToken = useMemo(() => {
    if (!poolInfo?.acceptedTokensConfig?.[0]?.address || !libraryDefaultTemporary) {
      return
    }

    return new Contract(poolInfo?.acceptedTokensConfig?.[0]?.address, Erc20Abi, libraryDefaultTemporary)
  }, [poolInfo, libraryDefaultTemporary])

  const getTotalBidHistories = useCallback(async () => {
    try {
      const totalNumberBid = await contractAuctionPool.numberOfBid()
      setTotalBidHistories(+totalNumberBid)
      const totalVolume = await contractAuctionPool.totalBid()
      setTotalTotalVolume(utils.formatEther(totalVolume))
    } catch (error) {
      console.debug('error', error)
    }
  }, [contractAuctionPool])

  const [countdown, setCountdown] = useState<CountDownTimeTypeV1 & { title: string;[k: string]: any }>({ date1: 0, date2: 0, title: '' })
  const { checkingKyc, isKYC } = useKyc(connectedAccount, (isNumber(poolInfo?.kyc_bypass) && !poolInfo?.kyc_bypass))
  const [allowNetwork, setAllowNetwork] = useState<{ ok: boolean;[k: string]: any }>({ ok: false })
  const [boxTypeSelected, setSelectBoxType] = useState<{ [k: string]: any }>({})
  useEffect(() => {
    const networkInfo = getNetworkByAlias(poolInfo?.network_available)
    const ok = chainID === networkInfo?.id
    setAllowNetwork(
      {
        ok,
        ...networkInfo
      }
    )
  }, [poolInfo, chainID])

  useEffect(() => {
    if (!connectedAccount) return
    tiersState.actions.getUserTier(connectedAccount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAccount])

  const onSetCountdown = useCallback(() => {
    if (poolInfo) {
      const timeLine = getTimelineOfPool(poolInfo)
      if (timeLine.startBuyTime > Date.now()) {
        setCountdown({ date1: timeLine.startBuyTime, date2: Date.now(), title: 'Auction Starts In', isUpcomingAuction: true })
      } else if (timeLine.finishTime > Date.now()) {
        setCountdown({ date1: timeLine.finishTime, date2: Date.now(), title: 'Auction Ends In', isAuction: true })
      } else {
        setCountdown({ date1: 0, date2: 0, title: 'Auction Ended', isFinished: true })
      }
    }
  }, [poolInfo])

  useEffect(() => {
    if (poolInfo) {
      onSetCountdown()
    }
  }, [poolInfo, onSetCountdown])

  useEffect(() => {
    if (poolInfo?.acceptedTokensConfig?.length) {
      const handleSetToken = async () => {
        try {
          const infoToken = poolInfo.acceptedTokensConfig[0]
          infoToken.neededApprove = !(BigNumber.from(infoToken.address).isZero())
          if (infoToken.neededApprove) {
            const erc20Contract = contractToken
            const decimals = erc20Contract ? await erc20Contract.decimals() : null
            infoToken.decimals = decimals
          }
          setCurrencyPool(infoToken)
        } catch (error) {
          console.debug('error', error)
        }
      }
      handleSetToken()
    }
  }, [poolInfo, contractToken])

  useEffect(() => {
    if (contractAuctionPool && resetLastBidder) {
      const getLastBidder = async () => {
        try {
          const result = await contractAuctionPool.lastBidder()
          if (!BigNumber.from(result.wallet).isZero()) {
            setLastBidder({
              wallet: result.wallet,
              currency: result.token,
              amount: utils.formatEther(result.amount)
            })
          }
          setResetLastBidder(false)
        } catch (error) {

        }
      }
      getLastBidder()
    }
  }, [contractAuctionPool, resetLastBidder])

  useEffect(() => {
    if (contractAuctionPool) {
      contractAuctionPool.minBidIncrementPerMile().then((num: any) => {
        setRateEachBid(`${+((+num / 1000).toFixed(2))}`)
      }).catch(err => {
        console.debug(err)
      })
    }
  }, [contractAuctionPool])

  // const [subBoxes, setSubBoxes] = useState<{ [k: string]: any }[]>([]);

  useEffect(() => {
    if (poolInfo && poolInfo.boxTypesConfig?.length) {
      const boxes = poolInfo.boxTypesConfig.map((b: any, subBoxId: number) => ({ ...b, subBoxId }))
      setSelectBoxType(boxes[0])
      // setSubBoxes(boxes)
    }
  }, [poolInfo])

  const [openModalPlaceBidBox, setOpenModalPlaceBidBox] = useState(false)
  const [openModalTx, setOpenModalTx] = useState(false)
  const onShowModalPlaceBidBox = () => {
    setOpenModalPlaceBidBox(true)
  }
  const onCloseModalPlaceBidBox = useCallback(() => {
    setOpenModalPlaceBidBox(false)
  }, [])

  const { auctionBox, auctionLoading, auctionSuccess, auctionTxHash } = useAuctionBox({
    poolId: poolInfo.id,
    poolAddress: poolInfo.campaign_hash,
    currencyInfo: currencyPool,
    subBoxId: boxTypeSelected?.subBoxId as number
  })

  useEffect(() => {
    if (auctionTxHash) {
      setOpenModalTx(true)
    }
  }, [auctionTxHash])
  useEffect(() => {
    if (auctionSuccess) {
      onCloseModalPlaceBidBox()
      setResetLastBidder(true)
      getTotalBidHistories()
    }
  }, [getTotalBidHistories, auctionSuccess, onCloseModalPlaceBidBox])

  const onPlaceBid = useCallback((numberBox: number, captcha: string) => {
    auctionBox(numberBox, captcha)
  }, [auctionBox])

  const [isApprovedToken, setTokenApproved] = useState<boolean | null>(null)
  const { approve, loading: loadingApproveToken } = useTokenApproval(currencyPool, poolInfo.campaign_hash)
  const { allowance, load: getAllowance, loading: loadingAllowance } = useTokenAllowance(currencyPool, connectedAccount, poolInfo.campaign_hash, poolInfo.network_available)
  useEffect(() => {
    if (currencyPool && connectedAccount) {
      getAllowance()
    }
  }, [getAllowance, currencyPool, connectedAccount])
  useEffect(() => {
    if (!allowance) {
      setTokenApproved(null)
    } else {
      setTokenApproved(!BigNumber.from(allowance).isZero())
    }
  }, [allowance])
  const handleApproveToken = () => {
    approve(constants.MaxUint256)
      .then(ok => {
        if (ok) {
          toast.success('Successfully Approved Your $GAFI')
          setTokenApproved(true)
        }
      })
  }

  const perPageBidHistory = 10
  const [filterBidHistory, setFilterBidHistory] = useState<{ from?: number; page?: number; perPage: number }>({ perPage: perPageBidHistory, page: 1 })
  const [bidHistores, setBidHistories] = useState<ObjectType<any>[]>([])
  const [cachedSymbolCurrency, setCachedSymbolCurrency] = useState<ObjectType<string>>({})
  const [totalBidHistories, setTotalBidHistories] = useState(0)
  const [totalVolumeBid, setTotalTotalVolume] = useState('')
  const [loadingGetBidHistory, setLoadingBidHistory] = useState(false)
  useEffect(() => {
    if (totalBidHistories) {
      if (totalBidHistories <= perPageBidHistory) {
        setFilterBidHistory({ from: 0, page: 1, perPage: perPageBidHistory })
      } else {
        setFilterBidHistory({ from: totalBidHistories - perPageBidHistory, page: 1, perPage: perPageBidHistory })
      }
    }
  }, [totalBidHistories])
  const getListBidHistories = useCallback(async () => {
    try {
      if (!filterBidHistory) return
      setLoadingBidHistory(true)
      const result = await contractAuctionPool.bidHistory(filterBidHistory.from, filterBidHistory.perPage)
      const leng = result[0].length
      const arr: ObjectType<any>[] = []
      const keys = ['address', 'currency', 'amount', 'created_at']
      for (let i = leng - 1; i >= 0; i--) {
        const obj: ObjectType<any> = {}
        for (const prop in result) {
          obj[keys[prop as unknown as number]] = result[prop][i].toString()
          if (+prop === 1) {
            if (!cachedSymbolCurrency[obj.currency]) {
              // const networkInfo = getNetworkByAlias(poolInfo.network_available)
              try {
                const contractToken = new Contract(obj.currency, Erc20Abi, libraryDefaultTemporary)
                const symbol = await contractToken.symbol()
                obj.symbol = symbol
                setCachedSymbolCurrency(s => ({ ...s, [obj.currency]: symbol }))
              } catch (error) {
              }
            } else {
              obj.symbol = cachedSymbolCurrency[obj.currency]
            }
          }
        }
        arr.push(obj)
      }
      setBidHistories(arr)
      setLoadingBidHistory(false)
    } catch (error) {
      console.debug('error', error)
      setLoadingBidHistory(false)
    }
  }, [contractAuctionPool, filterBidHistory, cachedSymbolCurrency, libraryDefaultTemporary])
  useEffect(() => {
    if (!contractAuctionPool || !poolInfo || !('from' in filterBidHistory)) return
    getListBidHistories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAuctionPool, filterBidHistory, poolInfo])

  useEffect(() => {
    if (!contractAuctionPool || !poolInfo) return
    getTotalBidHistories()
  }, [getTotalBidHistories, contractAuctionPool, poolInfo])

  const onChangePageBidHistory = (page: number) => {
    if (filterBidHistory?.page === page) return
    let from = totalBidHistories - (perPageBidHistory * page)
    let perPage = perPageBidHistory
    if (from < 0) {
      perPage = perPage + from
      from = 0
    }
    setFilterBidHistory({ page, from, perPage })
  }

  const [currentTab, setCurrentTab] = useState(0)
  const onChangeTab = (val: any) => {
    setCurrentTab(val)
  }

  const disabledBuyNow = !allowNetwork.ok || !isKYC || loadingAllowance || auctionLoading || !connectedAccount || tiersState?.state?.loading || !isNumber(tiersState?.state?.data?.tier) || (poolInfo?.min_tier > 0 && (tiersState?.state?.data?.tier < poolInfo.min_tier))
  const isShowBtnApprove = allowNetwork.ok && countdown?.isAuction && connectedAccount && isApprovedToken !== null && !isApprovedToken && currencyPool?.neededApprove
  const isShowBtnBuy = connectedAccount && !checkingKyc && countdown.isAuction && isApprovedToken

  return (
    <>
      <DialogTxSubmitted
        transaction={auctionTxHash}
        open={openModalTx}
        onClose={() => setOpenModalTx(false)}
        networkName={allowNetwork.shortName}
      />
      <AuctionBoxModal
        open={openModalPlaceBidBox}
        onClose={onCloseModalPlaceBidBox}
        onClick={onPlaceBid}
        poolInfo={poolInfo}
        token={currencyPool}
        auctionLoading={auctionLoading}
        lastBidder={lastBidder}
        rateEachBid={rateEachBid}
        currencyPool={currencyPool}
      />
      <PoolDetail
        bodyBannerContent={<>
          {isImageFile(poolInfo.banner) && <img className="w-full h-full object-contain" src={poolInfo.banner} alt='banner' />}
          {isVideoFile(poolInfo.banner) && <>
            <div className="wrapperVideo">
              <div className="uncontrol"></div>
              <div className="onload">
                <HashLoader loading={true} color={'#72F34B'} />
              </div>
              <div className="video">
                <video
                  preload="auto"
                  autoPlay
                  loop
                  muted
                >
                  <source src={poolInfo.banner} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </>
          }
        </>}
        bodyDetailContent={<>
          <h2 className="font-semibold text-4xl mb-2 uppercase">{poolInfo.title || poolInfo.name}</h2>
          <div className="creator flex items-center gap-1">
            <img src={poolInfo.token_images} className="icon rounded-full w-5 -h-5" alt="" />
            <span className="text-white/70 uppercase text-sm">{poolInfo.symbol}</span>
          </div>
          <div className="divider bg-white/20 w-full mt-3 mb-8" style={{ height: '1px' }}></div>
          <div>
            <div className="flex gap-8 mb-8">
              <DetailPoolItem label='NETWORK'
                icon={require(`assets/images/icons/${poolInfo.network_available}.svg`)}
                value={poolInfo.network_available} />
              <DetailPoolItem label='Min Rank'
                value={poolInfo.min_tier > 0 ? TIERS[poolInfo.min_tier].name : 'Not Required'} />
            </div>
            <div className="grid grid-cols-2">
              {
                !lastBidder && <div className="grid gap-1">
                  <span className="font-semibold text-white text-base uppercase">starting price</span>
                  <div className="flex items-center gap-2">
                    {(currencyPool?.icon || currencyPool?.name) && <img src={currencyPool?.icon || `/images/icons/${(currencyPool.name || '').toLowerCase()}.png`} className="icon rounded-full w-5 -h-5" alt="" />}
                    <span className="uppercase font-bold text-white text-2xl">{+currencyPool?.price || ''} {currencyPool?.name}</span>
                  </div>
                </div>
              }

              {
                lastBidder && <div className="grid gap-1">
                  <span className="font-semibold text-white text-base uppercase">Highest Bid</span>
                  <div className="flex items-center gap-2">
                    {(currencyPool?.icon || currencyPool?.name) && <img src={currencyPool?.icon || `/images/icons/${(currencyPool.name || '').toLowerCase()}.png`} className="icon rounded-full w-5 -h-5" alt="" />}
                    <span className="uppercase font-bold text-white text-2xl">{+lastBidder?.amount || ''} {currencyPool?.name}</span>
                  </div>
                </div>
              }

            </div>
            <div>
              <div className="mt-10">
                {!countdown.isFinished && countdown.date1 && countdown.date2 &&
                  <CountDownTimeV1 time={countdown} onFinish={onSetCountdown} title={countdown.title} />}
              </div>
              {
                isShowBtnApprove &&
                <ButtonBase
                  color="green"
                  isLoading={loadingApproveToken}
                  disabled={loadingApproveToken}
                  onClick={handleApproveToken}
                  className={clsx('w-full mt-4')}
                >
                  Approve
                </ButtonBase>
              }
              {
                isShowBtnBuy &&
                <ButtonBase
                  color="green"
                  isLoading={auctionLoading}
                  disabled={disabledBuyNow}
                  onClick={onShowModalPlaceBidBox}
                  className={clsx('w-full mt-4')}>
                  Place a Bid
                </ButtonBase>
              }
              {
                countdown.isFinished &&
                <ButtonBase
                  color="grey"
                  className={clsx('w-full mt-4')}>
                  Auction End
                </ButtonBase>
              }
            </div>

          </div>
        </>}
        footerContent={<>
          <Tabs
            titles={[
              'Rule Introduction',
              'Box Infomation',
              'Series Content',
              'Bid History'
            ]}
            currentValue={currentTab}
            onChange={onChangeTab}
          />
          <div className="mt-6 mb-10">
            <TabPanel value={currentTab} index={0}>
              <RuleIntroduce poolInfo={poolInfo} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>

            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <SerieContent poolInfo={poolInfo} />

            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <div className="w-full flex gap-20 mb-8" >
                <div>
                  <span className="block uppercase font-light text-base mb-1">AUCTION ENTRIES</span>
                  <h3 className="font-bold text-3xl">{totalBidHistories}</h3>
                </div>
                <div>
                  <span className="block uppercase font-light text-base mb-1">TOTAL VOLUME</span>
                  <h3 className="font-bold text-3xl">{totalVolumeBid} {currencyPool?.name}</h3>
                </div>
              </div>
              <Table className="mb-3">
                <TableHead>
                  <TableRow>
                    <TableCellHead>
                      BID Activities
                    </TableCellHead>
                    <TableCellHead>
                      Price
                    </TableCellHead>
                    <TableCellHead>
                      Date
                    </TableCellHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    bidHistores.map((b, id) => <TableRow key={id}>
                      <TableCell>
                        <span className="font-semibold text-sm">
                          {shortenAddress(b.address, '*', 6)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {utils.formatEther(b.amount)} {b.symbol}
                      </TableCell>
                      <TableCell>
                        {formatHumanReadableTime(+b.created_at * 1000, Date.now())}
                      </TableCell>
                    </TableRow>)
                  }
                </TableBody>
              </Table>
              <Pagination
                totalPage={Math.ceil(totalBidHistories / perPageBidHistory)}
                currentPage={filterBidHistory.page}
                onChange={onChangePageBidHistory}
              />

            </TabPanel>
          </div>
        </>}
      />
    </>
  )
}

export default AuctionDetail
