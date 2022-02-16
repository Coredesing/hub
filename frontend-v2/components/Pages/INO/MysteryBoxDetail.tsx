import React, { useCallback, useEffect, useState, useMemo } from 'react'
import PoolDetail from '@/components/Base/PoolDetail'
import clsx from 'clsx'
import styles from './MysteryBoxDetail.module.scss'
import { ButtonBase } from '@/components/Base/Buttons'
import CountDownTimeV1, { CountDownTimeType } from '@/components/Base/CountDownTime'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import PresaleBoxAbi from '@/components/web3/abis/PreSaleBox.json'
import Erc721Abi from '@/components/web3/abis/Erc721.json'
import { Contract, BigNumber, constants } from 'ethers'
import { ObjectType } from '@/utils/types'
import TokenItem from './TokenItem'
import BoxTypeItem from './BoxTypeItem'
import DetailPoolItem from './DetailPoolItem'
import RuleIntroduce from './RuleIntroduce'
import SerieContent from './SerieContent'
import { useMyWeb3 } from '@/components/web3/context'
import { useLibraryDefaultFlexible, useMyBalance, useTokenAllowance, useTokenApproval } from '@/components/web3/utils'
import { fetcher } from '@/utils'
import { API_BASE_URL, TIERS } from '@/utils/constants'
import { useCheckJoinPool, useJoinPool } from '@/hooks/useJoinPool'
import Alert from '@/components/Base/Alert'
import InfoBoxOrderItem from './InfoBoxOrderItem'
import BannerImagePool from './BannerImagePool'
import AscDescAmount from './AscDescAmount'
import TimeLine from './TimeLine'
import { getTimelineOfPool } from '@/utils/pool'
import { useAppContext } from '@/context'
import PlaceOrderModal from './PlaceOrderModal'
import toast from 'react-hot-toast'
import BuyBoxModal from './BuyBoxModal'
import stylesBoxType from './BoxTypeItem.module.scss'
import BoxInformation from './BoxInformation'
import WrapperPoolDetail from './WrapperPoolDetail'
import isNumber from 'is-number'
import Link from 'next/link'
import { getNetworkByAlias } from '@/components/web3'
import Collection from './Collection'

const MysteryBoxDetail = ({ poolInfo }: any) => {
  const eventId = 0
  const tiersState = useAppContext()?.$tiers
  const userTier = tiersState?.state?.data?.tier || 0
  const { account, chainID } = useMyWeb3()
  const [boxTypes, setBoxTypes] = useState<any[]>([])
  const [boxSelected, setBoxSelected] = useState<ObjectType>({})
  const [currencySelected, setCurrencySelected] = useState<ObjectType>({})
  const [myBoxOrdered, setMyBoxOrdered] = useState(0)
  const [currentTab, setCurrentTab] = useState(0)
  const [amountBoxBuy, setAmountBoxBuy] = useState(0)
  const [countdown, setCountdown] = useState<CountDownTimeType & { title: string;[k: string]: any }>({ date1: 0, date2: 0, title: '' })
  const [timelinePool, setTimelinePool] = useState<ObjectType>({})
  const [timelines, setTimelines] = useState<ObjectType<{
    title: string;
    desc: string;
    current?: boolean;
  }>>({})
  const [openPlaceOrderModal, setOpenPlaceOrderModal] = useState(false)
  const [openBuyBoxModal, setOpenBuyBoxModal] = useState(false)
  const [loadingCollection, setLoadingCollection] = useState(false)
  const [collections, setCollections] = useState<ObjectType[]>([])
  const [ownedBox, setOwnedBox] = useState(0)
  const balanceInfo = useMyBalance(currencySelected as any, poolInfo.network_available)
  const networkPool = useMemo(() => {
    const network = getNetworkByAlias(poolInfo.network_available)
    return network
  }, [poolInfo])

  const isValidChain = useMemo(() => {
    return networkPool?.id === chainID
  }, [networkPool, chainID])

  useEffect(() => {
    if (!account) return
    tiersState.actions.getUserTier(account)
  }, [account])
  const { provider: libraryDefaultTemporary } = useLibraryDefaultFlexible(poolInfo?.network_available)
  const [presaleContract, setPresaleContract] = useState<any>(null)
  const [myBoxThisPool, setMyBoxThisPool] = useState(0)
  const erc721Contract = useMemo(() => {
    if (!libraryDefaultTemporary || !poolInfo.token) return
    const contract = new Contract(poolInfo.token, Erc721Abi, libraryDefaultTemporary)
    return contract
  }, [libraryDefaultTemporary, poolInfo])
  const maxBoxCanBuy = useMemo(() => {
    const currentTier = poolInfo.tiers.find(t => t.level === userTier)
    return currentTier?.ticket_allow || 0
  }, [poolInfo, userTier])

  const getMyBoxThisPool = useCallback(async () => {
    try {
      const myBox = await presaleContract.userBought(eventId, account)
      setMyBoxThisPool(myBox.toNumber())
    } catch (error) {
      console.debug('er', error)
    }
  }, [presaleContract, account])

  const getMyNumBox = useCallback(async () => {
    try {
      const myNumBox = await erc721Contract.balanceOf(account)
      setOwnedBox(myNumBox.toString() || 0)
    } catch (error) {
      console.log(error)
    }
  }, [erc721Contract, account])

  useEffect(() => {
    if (!presaleContract || !account) {
      setMyBoxThisPool(0)
      return
    }
    getMyBoxThisPool()
  }, [presaleContract, account, getMyBoxThisPool])

  const onCloseBuyBoxModal = useCallback((isReset?: boolean) => {
    setOpenBuyBoxModal(false)
    if (isReset) {
      getMyBoxThisPool()
      getMyNumBox()
    }
  }, [getMyBoxThisPool, getMyNumBox])

  const onSetCountdown = useCallback(() => {
    if (poolInfo) {
      const isAccIsBuyPreOrder = userTier >= poolInfo.pre_order_min_tier
      const timeLine = getTimelineOfPool(poolInfo)
      setTimelinePool(timeLine)
      const timeLinesInfo: { [k: string]: any } = {
        1: {
          title: 'UPCOMING',
          desc: 'Stay tuned and prepare to APPLY WHITELIST.'
        },
        2: {
          title: 'WHITELIST',
          desc: 'Click the [APPLY WHITELIST] button to register for Phase 1.'
        }
      }
      if (timeLine.freeBuyTime) {
        timeLinesInfo[3] = {
          title: 'BUY PHASE 1',
          desc: 'Whitelist registrants will be given favorable dealings to buy Mystery Boxes in phase 1, on a FCFS basis.'
        }
        timeLinesInfo[4] = {
          title: 'BUY PHASE 2',
          desc: 'The whitelist of phase 2 will be started right after phase 1 ends. Remaining boxes left in phase 1 will be transferred to phase 2.'
        }
        timeLinesInfo[5] = {
          title: 'END',
          desc: 'Thank you for watching.'
        }
      } else {
        timeLinesInfo[3] = {
          title: 'BUY PHASE 1',
          desc: 'Whitelist registrants will be given favorable dealings to buy Mystery Boxes in phase 1, on a FCFS basis.'
        }
        timeLinesInfo[4] = {
          title: 'END',
          desc: 'Thank you for watching.'
        }
      }
      const startBuyTime = isAccIsBuyPreOrder && timeLine.startPreOrderTime ? timeLine.startPreOrderTime : timeLine.startBuyTime
      const soldOut = false
      const currentTime = Date.now()
      if (soldOut) {
        setCountdown({ date1: 0, date2: 0, title: 'This pool is over. See you in the next pool.', isFinished: true })
        timeLine.freeBuyTime ? (timeLinesInfo[5].current = true) : (timeLinesInfo[4].current = true)
      } else if (timeLine.startJoinPooltime > currentTime) {
        setCountdown({ date1: timeLine.startJoinPooltime, date2: currentTime, title: 'Whitelist Opens In', isUpcoming: true })
        timeLinesInfo[1].current = true
      } else if (timeLine.endJoinPoolTime > currentTime) {
        if (isAccIsBuyPreOrder && startBuyTime < currentTime) {
          timeLinesInfo[3].current = true
          setCountdown({ date1: timeLine?.freeBuyTime || timeLine?.finishTime, date2: currentTime, title: 'Phase 1 Ends In', isSale: true, isPhase1: true })
        } else {
          setCountdown({ date1: timeLine.endJoinPoolTime, date2: currentTime, title: 'Whitelist Closes In', isWhitelist: true })
          timeLinesInfo[2].current = true
        }
      } else if (startBuyTime > currentTime) {
        timeLinesInfo[2].current = true
        if (timeLine.freeBuyTime) {
          setCountdown({ date1: startBuyTime, date2: currentTime, title: 'Sale Phase 1 Starts In', isUpcomingSale: true, isMultiPhase: true })
        } else {
          setCountdown({ date1: startBuyTime, date2: currentTime, title: 'Sale Starts In', isUpcomingSale: true })
        }
      } else if (timeLine.freeBuyTime && timeLine.freeBuyTime > currentTime) {
        timeLinesInfo[3].current = true
        setCountdown({ date1: timeLine.freeBuyTime, date2: currentTime, title: 'Phase 1 Ends In', isSale: true, isPhase1: true })
      } else if (timeLine.finishTime > currentTime) {
        if (timeLine.freeBuyTime) {
          timeLinesInfo[4].current = true
          setCountdown({ date1: timeLine.finishTime, date2: currentTime, title: 'Phase 2 Ends In', isSale: true, isPhase2: true })
        } else {
          timeLinesInfo[3].current = true
          setCountdown({ date1: timeLine.finishTime, date2: currentTime, title: 'Sale Ends In', isSale: true, isPhase1: true })
        }
      } else {
        setCountdown({ date1: 0, date2: 0, title: 'Finished', isFinished: true })
        timeLine.freeBuyTime ? (timeLinesInfo[5].current = true) : (timeLinesInfo[4].current = true)
      }
      setTimelines(timeLinesInfo)
    }
  }, [poolInfo, userTier])

  useEffect(() => {
    onSetCountdown()
  }, [onSetCountdown])

  const listTokens = useMemo(() => {
    if (!boxSelected.currency_ids) {
      return []
    }
    const currencyIds = boxSelected.currency_ids.split(',').map(id => +id)
    const listCurrencies = (poolInfo.acceptedTokensConfig || [])
      .filter((c, id) => currencyIds.includes(id))
      .map(token => {
        if (token.address && !BigNumber.from(token.address).isZero()) {
          token.neededApprove = true
        }
        return token
      })
    const token = listCurrencies[0] || {}
    setCurrencySelected(token)
    return listCurrencies
  }, [poolInfo, boxSelected])

  useEffect(() => {
    const boxes = poolInfo.boxTypesConfig || []
    if (poolInfo.campaign_hash && libraryDefaultTemporary) {
      const contractPresale = new Contract(poolInfo.campaign_hash, PresaleBoxAbi, libraryDefaultTemporary)
      setPresaleContract(contractPresale)
      Promise
        .all(boxes.map((b, subBoxId) => new Promise(async (resolve, reject) => {
          try {
            const response = await contractPresale.subBoxes(eventId, subBoxId)
            const result = {
              maxSupply: response.maxSupply ? response.maxSupply.toNumber() : 0,
              totalSold: response.totalSold ? response.totalSold.toNumber() : 0
            }
            resolve({ ...b, subBoxId, ...result })
          } catch (error) {
            reject(error)
          }
        })))
        .then((boxes) => {
          setBoxTypes(boxes)
          setBoxSelected(boxes[0])
        })
        .catch(err => {
          console.debug('err', err)
        })
    } else {
      const _boxes = boxes.map((b, subBoxId) => ({ ...b, subBoxId }))
      setBoxTypes(_boxes)
      setBoxSelected(_boxes[0])
    }
  }, [poolInfo, libraryDefaultTemporary])

  const onSelectCurrency = (t: ObjectType) => {
    if (t.address === currencySelected.address) return
    setCurrencySelected(t)
  }

  const onSelectBoxType = (b: ObjectType) => {
    if (b.id === boxSelected.id) return
    setBoxSelected(b)
  }

  const onChangeTab = (val: any) => {
    setCurrentTab(val)
  }

  const getBoxOrderd = useCallback(async () => {
    if (!account) {
      setMyBoxOrdered(0)
      return
    }
    try {
      const res = await fetcher(`${API_BASE_URL}/pool/${poolInfo?.id}/nft-order?wallet_address=${account}`)
      const amount = res.data?.amount
      setMyBoxOrdered(amount)
    } catch (error) {
      console.debug('error', error)
    }
  }, [account, poolInfo])

  useEffect(() => {
    getBoxOrderd()
  }, [getBoxOrderd])
  const { isJoinPool, loading: loadingCheckJPool } = useCheckJoinPool(poolInfo?.id, account)
  const { joinPool, loading: loadingJPool, success: isJoinSuccess } = useJoinPool(poolInfo?.id, account)

  const onChangeNumBuyBox = (num: number) => {
    setAmountBoxBuy(num)
  }

  const [isApprovedToken, setTokenApproved] = useState<boolean | null>(null)
  const { approve, loading: loadingApproveToken, error: approvalError } = useTokenApproval(currencySelected as any, poolInfo.campaign_hash)
  const { allowance, load: getAllowance, loading: loadingAllowance } = useTokenAllowance(currencySelected as any, account, poolInfo.campaign_hash, poolInfo.network_available)
  useEffect(() => {
    if (currencySelected && account) {
      getAllowance()
    }
  }, [getAllowance, currencySelected, account])
  useEffect(() => {
    if (!allowance) {
      setTokenApproved(null)
    } else {
      setTokenApproved(!BigNumber.from(allowance).isZero())
    }
  }, [allowance])
  useEffect(() => {
    if (approvalError) {
      approvalError?.message && toast.error(approvalError?.message)
    }
  }, [approvalError])
  const handleApproveToken = async () => {
    const ok = await approve(constants.MaxUint256)
    if (ok) {
      toast.success('Approve token succesfully')
      setTokenApproved(true)
    }
  }

  const onJoinCompetition = (link: string) => {
    window.open(link)
  }

  useEffect(() => {
    if (!account || !erc721Contract) {
      setOwnedBox(0)
      return
    }
    getMyNumBox()
  }, [account, erc721Contract, getMyNumBox])

  const handleSetCollections = useCallback(async (ownedBox: number) => {
    if (!presaleContract) return
    setLoadingCollection(true)
    setCollections([])
    try {
      if (!erc721Contract) return
      const isCallDefaultCollection = poolInfo.campaign_hash === poolInfo.token
      const arrCollections = []
      if (!account) return
      const callWithExternalApi = !!poolInfo.use_external_api
      const handleInfoTokenExternal = async (collectionId: number, collection: ObjectType) => {
        const tokenURI = await erc721Contract.tokenURI(collectionId)
        collection.collectionId = collectionId
        let infoBoxType = await fetcher(tokenURI)
        infoBoxType = infoBoxType?.data || {}
        Object.assign(collection, infoBoxType)
        return collection
      }
      if (callWithExternalApi) {
        const result = await fetcher(`${API_BASE_URL}/pool/owner/${poolInfo.token}?wallet=${account}&limit=100`)
        const arr = result.data.data?.data || []
        for (let i = 0; i < arr.length; i++) {
          const collectionId = arr[i]?.token_id
          const collection: ObjectType = {
            collectionId
          }
          try {
            handleInfoTokenExternal(collectionId, collection)
          } catch (error) {
            console.log('err', error)
          }
          arrCollections.push(collection)
        }
      } else {
        for (let id = 0; id < ownedBox; id++) {
          if (isCallDefaultCollection) {
            const collection: ObjectType = {}
            try {
              const collectionId = await presaleContract.tokenOfOwnerByIndex(account, id)
              collection.collectionId = collectionId.toNumber()
              const boxType = await presaleContract.boxes(collectionId.toNumber())
              const idBoxType = boxType.subBoxId.toNumber()
              const infoBox = boxTypes.find((b, subBoxId) => subBoxId === idBoxType)
              infoBox && Object.assign(collection, infoBox)
              collection.collectionId = collectionId
            } catch (error) {
              console.log('error', error)
            }
            arrCollections.push(collection)
          } else {
            const collection: ObjectType = {}
            try {
              const collectionId = await erc721Contract.tokenOfOwnerByIndex(account, id)
              handleInfoTokenExternal(collectionId.toNumber(), collection)
              arrCollections.push(collection)
            } catch (error) {
              console.log('error', error)
            }
          }
        }
      }
      setCollections(arrCollections)
    } catch (error) {
      console.log('error', error)
      console.error('Something went wrong when show collections')
    } finally {
      setLoadingCollection(false)
    }
  }, [presaleContract, erc721Contract, boxTypes, poolInfo, account])

  useEffect(() => {
    if (+ownedBox > 0 && boxTypes.length) {
      handleSetCollections(ownedBox)
    }
  }, [ownedBox, boxTypes.length, handleSetCollections])
  const onClaimAllNFT = async () => {
    try {
      const tx = await presaleContract.claimAllNFT()
      // setShowModalTx(true)
      // setTxHash(tx.hash)
      toast.loading('Request is processing!', { duration: 2000 })
      const result = await tx.wait(1)
      if (+result?.status === 1) {
        toast.success('Request is completed!')
        getMyNumBox()
      } else {
        toast.error('Request Failed')
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error?.data?.message || error.message)
    }
  }
  const onClaimNFT = async (boxId: number) => {
    try {
      const tx = await presaleContract.claimNFT(boxId)
      // setShowModalTx(true)
      // setTxHash(tx.hash)
      toast.loading('Request is processing!', { duration: 2000 })
      const result = await tx.wait(1)
      if (+result?.status === 1) {
        toast.success('Request is completed!')
        getMyNumBox()
      } else {
        toast.error('Request Failed')
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error?.data?.message || error.message)
    }
  }

  const isAppliedWhitelist = isJoinPool || isJoinSuccess
  const isDepoyedPool = !!+poolInfo.is_deploy
  const isShowBtnApprove = !!account && isDepoyedPool && currencySelected.neededApprove && !isApprovedToken && ((countdown.isPhase1 && isAppliedWhitelist) || countdown.isPhase2)
  const isShowBtnBuy = !!account && isDepoyedPool && ((countdown.isPhase1 && isAppliedWhitelist) || countdown.isPhase2) && countdown.isSale && (!currencySelected.neededApprove || (currencySelected.neededApprove && isApprovedToken))
  const isAllowedJoinCompetive = (countdown.isWhitelist || countdown.isUpcoming) && +poolInfo.is_private === 3 && poolInfo.socialRequirement?.gleam_link && !isAppliedWhitelist

  const renderMsg = () => {
    if (!account) {
      return <Alert type="danger">
        Please connect your wallet
      </Alert>
    }
    if (!isValidChain && networkPool && account) {
      return <Alert type="danger">
        Please switch to <b>{networkPool.name}</b>
      </Alert>
    }
    if (
      account && poolInfo.min_tier > 0 && isNumber(userTier) && (userTier < poolInfo.min_tier)
    ) {
      return <Alert>
        <span>{`You haven't achieved min rank (${TIERS[poolInfo.min_tier]?.name}) to apply for Whitelist yet. To upgrade your Rank, please click`} <Link href="/staking"><a className="font-semibold link">here</a></Link></span></Alert>
    }
    if (isAppliedWhitelist && countdown.isWhitelist) {
      return <Alert type="info">
        You have successfully applied whitelist.
        {timelinePool.freeBuyTime ? <>&nbsp;Please stay tuned, you can buy from Phase 1 <b>Phase 1</b></> : ' Please stay tuned and wait until time to buy Mystery boxes'}
      </Alert>
    }
    if (isAppliedWhitelist && (countdown.isSale || countdown.isUpcomingSale)) {
      return <Alert type="info">
        Congratulations! You have successfully applied whitelist and can buy Mystery boxes
      </Alert>
    }
    if (((!loadingCheckJPool && !loadingJPool) && account && (countdown.isSale || countdown.isUpcomingSale)) && !countdown.isPhase2 && !isAppliedWhitelist) {
      return <Alert type="danger">
        You have not applied whitelist.
        {(timelinePool.freeBuyTime && !countdown.isPhase2) ? ' Please stay tuned, you can buy from Phase 2' : ' Please stay tuned and join other pools'}
      </Alert>
    }
  }

  return (<WrapperPoolDetail>
    <PlaceOrderModal open={openPlaceOrderModal} onClose={() => setOpenPlaceOrderModal(false)} poolId={poolInfo.id} getBoxOrderd={getBoxOrderd} />
    <BuyBoxModal
      open={openBuyBoxModal}
      onClose={onCloseBuyBoxModal}
      amountBoxBuy={amountBoxBuy}
      boxTypeBuy={boxSelected}
      currencyInfo={currencySelected}
      poolInfo={poolInfo}
      eventId={eventId}
      isValidChain={isValidChain}
      balanceInfo={balanceInfo}
    />
    <div className={clsx('rounded mb-5', styles.headPool)}>
      {
        <div className='mb-10'>{renderMsg()}</div>
      }
      <div className={'grid lg:grid-cols-2'}>
        <div className={clsx('flex', styles.headInfoBoxOrder)}>
          <InfoBoxOrderItem label='Registered Users' value={poolInfo.totalOrder || 0} />
          <InfoBoxOrderItem label='Ordered Boxes' value={poolInfo.totalRegistered || 0} />
          <InfoBoxOrderItem label='Your Ordered' value={myBoxOrdered} />
        </div>
        <div className={clsx('bg-black flex justify-center items-center gap-2', styles.headCountdown)} >
          <div className={clsx('font-bold text-sm uppercase', styles.titleCountdown)}>
            {countdown.title}
          </div>
          <div className={clsx(styles.countdown)} >
            {countdown.date2 !== 0 && !countdown.isFinished && <CountDownTimeV1 time={countdown} className="bg-transparent" background='bg-transparent' onFinish={onSetCountdown} />}
          </div>
        </div>
      </div>
    </div>
    <PoolDetail
      bodyBannerContent={<BannerImagePool src={boxSelected.banner} />}
      bodyDetailContent={<>
        <h2 className="font-semibold text-4xl mb-2 uppercase">{poolInfo.title || poolInfo.name}</h2>
        <div className="creator flex items-center gap-1">
          <img src={poolInfo.token_images} className="icon rounded-full w-5 -h-5" alt="" />
          <span className="text-white/70 uppercase text-sm">{poolInfo.symbol}</span>
        </div>
        <div className="divider bg-white/20 w-full mt-3 mb-8" style={{ height: '1px' }}></div>
        <div className='mb-4'>
          <div className="grid gap-1">
            <div className="flex items-center gap-2">
              <img src={currencySelected?.icon} className="icon rounded-full w-5 -h-5" alt="" />
              <span className="uppercase font-bold text-white text-2xl">{Number(currencySelected?.price) || ''} {currencySelected?.name}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 mb-8">
          <DetailPoolItem label='TOTAL SALE' value={`${poolInfo.total_sold_coin} Boxes`} />
          <DetailPoolItem label='SUPPORTED'
            icon={require(`assets/images/icons/${poolInfo.network_available}.svg`)}
            value={poolInfo.network_available} />
          <DetailPoolItem label='Min Rank'
            value={poolInfo.min_tier > 0 ? TIERS[poolInfo.min_tier].name : 'No Required'} />
        </div>
        <div className='mb-8'>
          <div> <h4 className='font-bold text-base mb-1 uppercase'>Currency</h4> </div>
          <div className='flex gap-1'>
            {listTokens.map((t) => <TokenItem key={t.address} item={t} onClick={onSelectCurrency} selected={currencySelected?.address === t.address} />)}
          </div>
        </div>
        <div className='mb-8'>
          <div> <h4 className='font-bold text-base mb-1 uppercase'>Type</h4></div>
          <div className={clsx('gap-2', stylesBoxType.boxTypes)}>
            {boxTypes.map((b) => <BoxTypeItem key={b.id} item={b} onClick={onSelectBoxType} selected={boxSelected.id === b.id} />)}
          </div>
        </div>
        {
          countdown.isSale &&
          <div className='mb-8'>
            <AscDescAmount
              disabled={!isShowBtnBuy}
              value={amountBoxBuy}
              maxBuy={maxBoxCanBuy}
              bought={myBoxThisPool}
              onChangeValue={onChangeNumBuyBox}
              poolInfo={poolInfo}
              currencyInfo={currencySelected}
              balanceInfo={balanceInfo}
            />
          </div>
        }
        <div>
          {isAllowedJoinCompetive && <ButtonBase color="red"
            onClick={() => onJoinCompetition(poolInfo.socialRequirement.gleam_link)}
            className={clsx('w-full mt-4 uppercase')}>
            Join Competition
          </ButtonBase>
          }
          {
            !isAppliedWhitelist && countdown.isWhitelist && <ButtonBase
              color={'green'}
              isLoading={loadingJPool || loadingCheckJPool}
              disabled={loadingCheckJPool || loadingJPool}
              onClick={joinPool}
              className={clsx('w-full mt-4 uppercase')}>
              Apply Whitelist
            </ButtonBase>
          }
          {
            isAppliedWhitelist && countdown.isWhitelist &&
            <ButtonBase
              color={'green'}
              onClick={() => setOpenPlaceOrderModal(true)}
              className={clsx('w-full mt-4 uppercase')}>
              Place Order
            </ButtonBase>
          }
          {
            isShowBtnApprove &&
            <ButtonBase
              color={'green'}
              isLoading={loadingApproveToken || loadingAllowance}
              disabled={loadingApproveToken || loadingAllowance || !isValidChain}
              onClick={handleApproveToken}
              className={clsx('w-full mt-4 uppercase')}>
              {loadingAllowance ? 'Checking Approval' : 'Approve'}
            </ButtonBase>
          }
          {
            isShowBtnBuy &&
            <ButtonBase
              color={'green'}
              disabled={+amountBoxBuy < 1 || !isValidChain}
              onClick={() => setOpenBuyBoxModal(true)}
              className={clsx('w-full mt-4 uppercase')}>
              Buy Box
            </ButtonBase>
          }
        </div>
      </>}
      footerContent={<>
        <Tabs
          titles={[
            'Rule Introduction',
            boxSelected?.description ? 'Box Infomation' : undefined,
            'Series Content',
            'TimeLine',
            `Collection ${ownedBox ? `(${ownedBox})` : ''}`
          ]}
          currentValue={currentTab}
          onChange={onChangeTab}
        />
        <div className="mt-6 mb-10">
          <TabPanel value={currentTab} index={0}>
            <RuleIntroduce poolInfo={poolInfo} />
          </TabPanel>
          {
            boxSelected?.description && <TabPanel value={currentTab} index={1}>
              <BoxInformation boxes={boxTypes} />
            </TabPanel>
          }
          <TabPanel value={currentTab} index={2}>
            <SerieContent poolInfo={poolInfo} />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <TimeLine timelines={timelines} />
          </TabPanel>
          <TabPanel value={currentTab} index={4}>
            <Collection
              poolInfo={poolInfo}
              collections={collections}
              loading={loadingCollection}
              onClaimAllNFT={onClaimAllNFT}
              onClaimNFT={onClaimNFT}
            />
          </TabPanel>
        </div>
      </>}
    />
  </WrapperPoolDetail>
  )
}

export default MysteryBoxDetail
