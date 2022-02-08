import clsx from 'clsx'
import { ObjectType } from '@/utils/types'
import PoolDetail from '@/components/Base/PoolDetail'
import { TabPanel, Tabs } from '@/components/Base/Tabs'
import { MARKETPLACE_CONTRACT, useWeb3Default } from '@/components/web3'
import { useMyWeb3 } from '@/components/web3/context'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { formatHumanReadableTime, formatNumber, shortenAddress } from '@/utils'
import BannerImagePool from './BannerImagePool'
import styles from './MarketplaceDetail.module.scss'
import SellNFTModal from './SellNFTModal'
import TransferNFTModal from './TransferNFTModal'
import MakeOfferModal from './MakeOfferModal'
import WrapperPoolDetail from './WrapperPoolDetail'
import ERC721ABI from '@/components/web3/abis/Erc721.json'
import MarketplaceABI from '@/components/web3/abis/Marketplace.json'
import ERC20ABI from '@/components/web3/abis/ERC20.json'
import { Contract } from '@ethersproject/contracts'
import toast from 'react-hot-toast'
import { BigNumber, constants, utils } from 'ethers'
import ButtonBase from '@/components/Base/Buttons/ButtonBase'
import DialogTxSubmitted from '@/components/Base/DialogTxSubmitted'
import { currencyNative, useTokenAllowance, useTokenApproval } from '@/components/web3/utils'
import axios from '@/utils/axios'
import BuyNowModal from './MarketBuyNowModal'

type Props = {
  projectInfo: ObjectType;
  tokenInfo: ObjectType;
} & ObjectType;

const MarketplaceDetail = ({ tokenInfo, projectInfo }: Props) => {
  const { account, library } = useMyWeb3()
  const { library: libraryDefaultTemporary } = useWeb3Default()
  const [openTransferModal, setOpenTransferModal] = useState(false)
  const [openSellNFTModal, setOpenSellNFTModal] = useState(false)
  const [openMakeOfferModal, setOpenMakeOfferModal] = useState(false)
  const [openBuyNowModal, setOpenBuyNowModal] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [addressOwnerNFT, setAddressOwnerNFT] = useState('')
  const [txHash, setTxHash] = useState('')
  const [openTxModal, setOpenTxModal] = useState(false)
  const [methodSellNFT, setMethodSellNFT] = useState('')
  const [reloadOfferList, setReloadOfferList] = useState(true)
  const [offerList, setOfferList] = useState<ObjectType<any>[]>([])
  const [lastOffer, setLastOffer] = useState<ObjectType<any> | null>(null)
  const [tokenOnSale, setTokenOnSale] = useState<ObjectType>({})
  // user approve token to buy or offer
  const [isApprovedToken, setApproveToken] = useState(false)
  const isAllowedTransfer = !!account && account === addressOwnerNFT
  const isAllowedDelist = !!account && account === tokenOnSale.owner
  const isAllowedSell = !!account && account === addressOwnerNFT
  const isAllowBuyOffer = !!account && tokenOnSale.owner && account !== addressOwnerNFT && account !== tokenOnSale.owner && !BigNumber.from(tokenOnSale.owner).isZero()

  const currencies = useMemo(() => {
    return projectInfo.accepted_tokens
  }, [projectInfo])

  const ERC721Contract = useMemo(() => {
    if (!libraryDefaultTemporary) return
    const erc721Contract = new Contract(projectInfo.token_address, ERC721ABI, libraryDefaultTemporary)
    return erc721Contract
  }, [projectInfo.token_address, libraryDefaultTemporary])

  const MarketplaceContract = useMemo(() => {
    if (!libraryDefaultTemporary || !MARKETPLACE_CONTRACT) return
    const contract = new Contract(MARKETPLACE_CONTRACT, MarketplaceABI, libraryDefaultTemporary)
    return contract
  }, [libraryDefaultTemporary])

  const ERC721ContractSigner = useMemo(() => {
    if (!ERC721Contract || !library || !account) return
    const contractSigner = ERC721Contract.connect(library.getSigner(account).connectUnchecked())
    return contractSigner
  }, [ERC721Contract, account, library])

  const MarketplaceContractSigner = useMemo(() => {
    if (!MarketplaceContract || !library || !account) return
    const contractSigner = MarketplaceContract.connect(library.getSigner(account).connectUnchecked())
    return contractSigner
  }, [MarketplaceContract, account, library])

  const formatTraitType = (item: any) => {
    let traitType = item.trait_type || item.traitType || ''
    traitType = typeof traitType === 'string' ? traitType : ''
    let formatted = ''

    formatted = traitType.split('_').map((w: string) => (w[0].toUpperCase() + w.slice(1))).join(' ')
    return formatted
  }

  const formatValueAttribute = (item: any) => {
    if (typeof item?.value !== 'object') {
      return item.value
    }
    return ''
  }

  const [attrLinks, setAttrLinks] = useState<ObjectType<any>>({})
  const attributes = useMemo(() => {
    const attrLinks: ObjectType<any> = {}
    const arr = (tokenInfo.attributes || []).reduce((arr: any[], item: any) => {
      const strValue = (item.value || '').toString()
      if (strValue.includes('https://') || strValue.includes('http://')) {
        const propName = formatTraitType(item)
        attrLinks[propName] = item.value
      } else {
        arr.push(item)
      }
      return arr
    }, [])
    setAttrLinks(attrLinks)
    return arr
  }, [tokenInfo.attributes])

  const getAddresssOwnerNFT = useCallback(async () => {
    if (!ERC721Contract) {
      return
    }
    const addressOwnerNFT = await ERC721Contract.ownerOf(tokenInfo.id)
    setAddressOwnerNFT(addressOwnerNFT)
  }, [ERC721Contract, tokenInfo.id])

  const getTokenOnSale = useCallback(async () => {
    if (!MarketplaceContract) return
    try {
      const tokenOnSale = await MarketplaceContract.tokensOnSale(projectInfo.token_address, tokenInfo.id)
      const info = {
        owner: tokenOnSale.tokenOwner,
        currency: tokenOnSale.currency,
        price: tokenOnSale.price.toString(),
        symbol: null
      }
      if (!BigNumber.from(info.price).isZero()) {
        if (BigNumber.from(info.currency).isZero()) {
          info.symbol = currencyNative(projectInfo.network)?.symbol
        } else {
          const erc20Contract = new Contract(info.currency, ERC20ABI, libraryDefaultTemporary)
          info.symbol = await erc20Contract.symbol()
        }
      }
      setTokenOnSale(info)
    } catch (error) {
      console.debug('er', error)
    }
  }, [MarketplaceContract, libraryDefaultTemporary, projectInfo, tokenInfo])

  useEffect(() => {
    if (reloadOfferList && tokenOnSale.currency) {
      axios.get(`/marketplace/offers/${projectInfo.slug}/${tokenInfo.id}?event_type=TokenOffered`).then(async (res) => {
        const offers = res.data?.data || []
        const offerList: ObjectType<any>[] = []
        await Promise.all(offers.map((item: any) => new Promise(async (resolve) => {
          if (item.currency === tokenOnSale.currency) {
            if (!currencies[item.currency]) {
              const erc20Contract = new Contract(item.currency, ERC20ABI, libraryDefaultTemporary)
              item.currencySymbol = await erc20Contract.symbol()
            } else {
              item.currencySymbol = currencyNative(projectInfo.network)?.symbol
            }
            offerList.push(item)
          }
          resolve('')
        })))
        setOfferList(offerList)
        setReloadOfferList(false)
      }).catch(err => {
        console.debug('err', err)
      })
    }
  }, [tokenOnSale, reloadOfferList, libraryDefaultTemporary, projectInfo, tokenInfo, currencies])

  useEffect(() => {
    if (offerList.length && account) {
      const myLastOffer = offerList.find(item => item.buyer === account)
      setLastOffer(myLastOffer as any)
    }
  }, [offerList, account])

  useEffect(() => {
    getAddresssOwnerNFT()
  }, [getAddresssOwnerNFT])

  useEffect(() => {
    getTokenOnSale()
  }, [getTokenOnSale])

  const token = useMemo(() => {
    return { address: tokenOnSale.currency }
  }, [tokenOnSale])

  const { load: checkAllowance, loading: loadingAllowance, allowance } = useTokenAllowance(token as any, account, MARKETPLACE_CONTRACT, projectInfo.network)
  const { approve, loading: loadingApproveToken } = useTokenApproval(token as any, MARKETPLACE_CONTRACT)

  useEffect(() => {
    if (!allowance) {
      setApproveToken(false)
    } else {
      setApproveToken(BigNumber.from(allowance).gt(0))
    }
  }, [allowance])

  const onApproveToken = async () => {
    try {
      toast.loading('Approval is progressing', { duration: 3000 })
      const ok = await approve(constants.MaxInt256)
      if (ok) {
        toast.success('Approval successfully')
        setApproveToken(true)
      } else {
        toast.error('Approval failed')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isAllowBuyOffer && tokenOnSale.currency && account) {
      checkAllowance()
    }
  }, [isAllowBuyOffer, tokenOnSale, account, checkAllowance])

  const handleOpenModalAuctionNFT = () => {
    setOpenSellNFTModal(true)
    setMethodSellNFT('auction')
  }

  const handleOpenModalFixPriceNFT = () => {
    setOpenSellNFTModal(true)
    setMethodSellNFT('fixed-price')
  }

  const handleError = (error: any) => {
    const msgError = error?.data?.message || error?.message
    toast.error(msgError)
    setLockingAction({ action: '', lock: false })
  }
  const [lockingAction, setLockingAction] = useState({
    action: '',
    lock: false
  })
  const checkFnIsLoading = (fnName: string): boolean => {
    return lockingAction.action === fnName && lockingAction.lock
  }

  const handleTx = async (tx: any, action?: string) => {
    setTxHash(tx.hash)
    setOpenTxModal(true)
    if (action === onTransferNFT.name) {
      setOpenTransferModal(false)
    }
    const result = await tx.wait(1)
    if (+result?.status !== 1) {
      toast.error('Request Failed')
      return
    }
    toast.success('Request Successfuly')
    if ([
      onListingNFT.name,
      onDelistNFT.name,
      onTransferNFT.name,
      onBuyNFT.name,
      onAcceptOffer.name
    ].includes(action)) {
      getTokenOnSale()
      getAddresssOwnerNFT()
    }
    if (action === onOfferNFT.name || action === onRejectOffer.name) {
      setTimeout(() => {
        setReloadOfferList(true)
      }, 2000)
    }
    setLockingAction({ action: '', lock: false })
    return true
  }

  const handleCallContract = async (action: string, fnCallContract: () => Promise<any>) => {
    try {
      setLockingAction({ action, lock: true })
      toast.loading('Request is processing!', { duration: 5000 })
      const tx = await fnCallContract()
      return handleTx(tx, action)
    } catch (error) {
      handleError(error)
    }
  }

  const onListingNFT = (price: string, tokenAddress: string) => {
    if (!ERC721ContractSigner) return
    handleCallContract(
      onListingNFT.name,
      () => MarketplaceContractSigner.list(tokenInfo.id, projectInfo.token_address, utils.parseEther(price + ''), tokenAddress)
    )
  }

  const onDelistNFT = () => {
    handleCallContract(
      onDelistNFT.name,
      () => MarketplaceContractSigner.delist(tokenInfo.id, projectInfo.token_address)
    )
  }

  const onTransferNFT = (receiverAddress: string) => {
    if (!ERC721ContractSigner) return
    handleCallContract(onTransferNFT.name, () => ERC721ContractSigner.transferFrom(account, receiverAddress, tokenInfo.id))
  }

  const onOfferNFT = async (offerPrice: string, value: string) => {
    const options: ObjectType<any> = {}
    if (BigNumber.from(tokenOnSale.currency).isZero()) {
      options.value = value
    }
    return handleCallContract(onOfferNFT.name, () => MarketplaceContractSigner.offer(tokenInfo.id, projectInfo.token_address, offerPrice, tokenOnSale.currency, options))
  }
  const onBuyNFT = () => {
    const options: ObjectType<any> = {}
    if (BigNumber.from(tokenOnSale.currency).isZero()) {
      options.value = utils.parseEther(tokenOnSale.price)
    }
    return handleCallContract(onBuyNFT.name, () => MarketplaceContractSigner.buy(tokenInfo.id, projectInfo.token_address, tokenOnSale.price, tokenOnSale.currency, options))
  }

  const onAcceptOffer = async (item: ObjectType<any>) => {
    // handleCallContract(onAcceptOffer.name, () => MarketplaceContractSigner.takeOffer(id, projectAddress, new BigNumber(item.raw_amount).toFixed(), addressCurrencyToBuy, item.buyer));
  }

  const onRejectOffer = () => {
    handleCallContract(onRejectOffer.name, () => MarketplaceContractSigner.cancelOffer(tokenInfo.id, projectInfo.token_address))
  }

  const onApproveToMarketplace = async () => {
    if (!ERC721ContractSigner) return
    const ok = await handleCallContract(onApproveToMarketplace.name, () => ERC721ContractSigner.setApprovalForAll(MARKETPLACE_CONTRACT, true))
    if (ok) {
      setApprovedMarketplace(true)
    }
    return ok
  }

  const [isApprovedMarketplace, setApprovedMarketplace] = useState(false)
  const checkApproveMarketplace = useCallback(async () => {
    try {
      if (!ERC721ContractSigner) return
      const isApproved = await ERC721ContractSigner.isApprovedForAll(account, MARKETPLACE_CONTRACT)
      setApprovedMarketplace(isApproved)
    } catch (error) {
      console.debug('err', error)
    }
  }, [account, ERC721ContractSigner])

  useEffect(() => {
    if (isAllowedSell) {
      checkApproveMarketplace()
    }
  }, [isAllowedSell, checkApproveMarketplace])

  const onChangeTab = (val: any) => {
    setCurrentTab(val)
  }

  return <WrapperPoolDetail>
    <DialogTxSubmitted
      transaction={txHash}
      open={openTxModal}
      onClose={() => setOpenTxModal(false)}
      networkName={projectInfo.network}
    />
    <TransferNFTModal
      open={openTransferModal}
      onClose={() => setOpenTransferModal(false)}
      onSubmit={onTransferNFT}
      isLoadingButton={checkFnIsLoading(onTransferNFT.name)}
      disabledButton={lockingAction.lock}
    />
    <SellNFTModal
      open={openSellNFTModal}
      onClose={() => setOpenSellNFTModal(false)}
      method={methodSellNFT}
      currencies={currencies}
      projectInfo={projectInfo}
      onListingNFT={onListingNFT}
      isLoadingButton={checkFnIsLoading(onListingNFT.name)}
      disabledButton={lockingAction.lock || !isAllowedSell}
      isApprovedMarketplace={isApprovedMarketplace}
      onApproveMarket={onApproveToMarketplace}
    />
    <MakeOfferModal
      open={openMakeOfferModal}
      onClose={() => setOpenMakeOfferModal(false)}
      onSubmit={onOfferNFT}
      isLoadingButton={checkFnIsLoading(onOfferNFT.name)}
      disabledButton={lockingAction.lock}
      tokenOnSale={tokenOnSale}
      projectInfo={projectInfo}
      lastOffer={lastOffer}
    />
    <BuyNowModal
      open={openBuyNowModal}
      onClose={() => setOpenBuyNowModal(false)}
      onSubmit={onBuyNFT}
      isLoadingButton={checkFnIsLoading(onBuyNFT.name)}
      disabledButton={lockingAction.lock}
      tokenOnSale={tokenOnSale}
      projectInfo={projectInfo}
    />
    <PoolDetail
      bodyBannerContent={<BannerImagePool src={tokenInfo.image} />}
      bodyDetailContent={<>
        <h2 className="font-semibold text-4xl mb-2 uppercase"> {tokenInfo.title || tokenInfo.name || `#${formatNumber(tokenInfo.id, 3)}`}</h2>
        <div className="divider bg-white/20 w-full mt-3 mb-8" style={{ height: '1px' }}></div>
        <div className='grid grid-cols-2 gap-3 mb-10'>
          <div className='flex gap-2 items-center'>
            <img src={projectInfo.logo} alt="" className='w-11 h-11 rounded-full bg-black' />
            <div>
              <label htmlFor="" className="block font-bold text-white/50 text-13px uppercase">Creator</label>
              <span className="block text-base font-casual">{projectInfo.name}</span>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <img src={projectInfo.logo} alt="" className='w-11 h-11 rounded-full bg-black' />
            <div>
              <label htmlFor="" className="block font-bold text-white/50 text-13px uppercase">Owner</label>
              <span className="block text-base font-casual">{addressOwnerNFT && shortenAddress(addressOwnerNFT, '.', 6)}</span>
            </div>
          </div>
        </div>
        {
          tokenOnSale.price && BigNumber.from(tokenOnSale.price).gt(0) && <div className='mb-4'>
            <div>
              <label htmlFor="" className='font-bold text-base uppercase mb-2'>Listing price</label>
              <div className='flex items-center '>
                <img src="" alt="" className='w-5 h-5 rounded-full' />
                <span className='block ml-2 font-bold text-2xl'>{utils.formatEther(tokenOnSale.price)} {tokenOnSale.symbol}</span>
                {
                  isAllowedDelist && <div
                    onClick={!lockingAction.lock ? onDelistNFT : undefined}
                    className={clsx('ml-4 px-4 py-1 flex items-center gap-1 rounded ', {
                      'bg-red-600 cursor-pointer': !lockingAction.lock,
                      'bg-white/25 cursor-not-allowed': lockingAction.lock
                    })}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%, 0 0)' }}>
                    <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 1L0.5 8" stroke="#15171E" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M0.5 1L7.5 8" stroke="#15171E" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className='uppercase text-black font-bold text-13px'>Delist</span>
                  </div>
                }
              </div>
            </div>
          </div>
        }
        {
          isAllowBuyOffer && <div className='grid grid-cols-2 gap-2 justify-center'>
            <button
              disabled={!isApprovedToken}
              onClick={() => setOpenMakeOfferModal(true)}
              className={clsx(
                styles.btnClipPathBottomLeft,
                'p-px',
                {
                  'bg-gamefiGreen-900 text-gamefiGreen-900 hover:bg-gamefiGreen-900 hover:text-gamefiGreen-900 cursor-not-allowed': !isApprovedToken,
                  'cursor-pointer bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700': isApprovedToken
                }
              )}>
              <div className={clsx(styles.btn, styles.btnClipPathBottomLeft, 'bg-gamefiDark-900 h-9 text-13px flex justify-center items-center rounded-sm font-bold uppercase')}>
                Make Offer
              </div>
            </button>
            {
              !isApprovedToken
                ? <ButtonBase
                  noneStyle
                  isLoading={loadingApproveToken || loadingAllowance}
                  disabled={loadingApproveToken || loadingAllowance}
                  color='green'
                  className={clsx(styles.btnClipPathTopRight, styles.btn, 'uppercase h-9 rounded-sm text-13px font-bold text-black bg-gamefiGreen-700')}
                  onClick={onApproveToken}
                >
                  {loadingAllowance ? 'Checking Approval' : 'Approve to Buy'}
                </ButtonBase>
                : <ButtonBase
                  noneStyle
                  isLoading={loadingApproveToken || loadingAllowance}
                  disabled={loadingApproveToken || loadingAllowance}
                  color='green'
                  className={clsx(styles.btnClipPathTopRight, styles.btn, 'uppercase h-9 rounded-sm text-13px font-bold text-black bg-gamefiGreen-700')}
                  onClick={() => setOpenBuyNowModal(true)}
                >
                  Buy Now
                </ButtonBase>
            }

          </div>
        }
        {
          isAllowedSell && <div className={clsx('px-5 py-4 mb-2', styles.box, styles.boxCPTopRight)}>
            <h3 className='text-center text-sm font-casual mb-4'>Sell the item at a fixed price or as an auction</h3>
            <div className='flex gap-2 justify-center'>
              <button
                onClick={handleOpenModalAuctionNFT}
                className={clsx(
                  styles.btnClipPathBottomLeft,
                  'cursor-pointer p-px bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700'

                )}>
                <div className={clsx(styles.btn, styles.btnClipPathBottomLeft, 'bg-gamefiDark-900 h-9 text-13px flex justify-center items-center rounded-sm font-bold uppercase')}>
                  Auction
                </div>
              </button>
              {/* <button
                className={clsx(styles.btnClipPathTopRight, styles.btn, 'uppercase h-9 rounded-sm text-13px font-bold text-black bg-gamefiGreen-700')}
                onClick={handleOpenModalFixPriceNFT}
              >
                Fixed Price
              </button> */}
            </div>
          </div>
        }
        {
          isAllowedTransfer && <div className={clsx('px-5 py-4', styles.box, styles.boxCPBottomLeft)}>
            <h3 className='text-center text-sm font-casual mb-4'>Or you can send the item to another wallet</h3>
            <div className='flex justify-center'>
              <button
                disabled={lockingAction.lock}
                // isLoading={checkFnIsLoading(onTransferNFT.name)}
                onClick={() => setOpenTransferModal(true)}
                className={clsx(
                  styles.btnClipPathTopRightBottomLeft,
                  'cursor-pointer p-px mb-4 bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700'
                )}>
                <div className={clsx(styles.btn, styles.btnClipPathTopRightBottomLeft, 'bg-gamefiDark-900 h-9 text-13px flex justify-center items-center rounded-sm font-bold uppercase')}>
                  Transfer
                </div>
              </button>
            </div>
          </div>
        }
      </>}
      footerContent={<>
        <Tabs
          titles={[
            'Information',
            'Attributes',
            `Offers ${offerList.length ? `(${offerList.length})` : ''}`,
            'Activities'
          ]}
          currentValue={currentTab}
          onChange={onChangeTab}
        />
        <div className='pt-8'>
          <TabPanel value={currentTab} index={0}>
            <div className='grid gap-2'>
              <div className='grid gap-2' style={{ gridTemplateColumns: '170px auto' }}>
                <label htmlFor="" className='font-bold text-sm font-casual'>Contract Address</label>
                <div className='font-casual text-sm text-gamefiGreen-700'>
                  {projectInfo.token_address}
                </div>
              </div>
              <div className='grid gap-2' style={{ gridTemplateColumns: '170px auto' }}>
                <label htmlFor="" className='font-bold text-sm font-casual'>Token ID</label>
                <div className='font-casual text-sm'>
                  #{formatNumber(tokenInfo.id, 3)}
                </div>
              </div>
              <div className='grid gap-2' style={{ gridTemplateColumns: '170px auto' }}>
                <label htmlFor="" className='font-bold text-sm font-casual'>Description</label>
                <div className='font-casual text-sm'>
                  {tokenInfo.description}
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            {tokenInfo.description &&
              <div className='mb-4'>
                <p className="font-casual text-sm">{tokenInfo.description}</p>
              </div>
            }
            <div className={styles.attributes}>
              {attributes.map((row: any, idx: number) => (
                <div key={idx}>
                  <label className="font-bold font-casual text-sm" htmlFor="">{formatTraitType(row)}</label>
                  <span className="font-casual text-sm">{formatValueAttribute(row)}</span>
                </div>
              ))}
            </div>
            <div className='mb-8'>
              {
                Object.keys(attrLinks).map(key => <div key={key}>
                  <a style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px', alignItems: 'center', width: 'fit-content' }}
                    href={attrLinks[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="font-casual text-sm text-gamefiGreen-700">
                    {key}
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="path-1-inside-1_410_33686" fill="white">
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.1147 0.200811C0.859705 -0.0669364 0.446277 -0.0669373 0.191283 0.200811C-0.0637118 0.468558 -0.0637113 0.902662 0.191283 1.17041L3.42281 4.56355L0.191246 7.95672C-0.0637486 8.22447 -0.0637486 8.65857 0.191246 8.92632C0.446241 9.19407 0.859668 9.19407 1.11466 8.92632L4.78775 5.06953C4.79473 5.06281 4.8016 5.0559 4.80837 5.0488C4.94373 4.90666 5.00724 4.71764 4.99888 4.53152C4.99168 4.36674 4.92816 4.20416 4.80833 4.07833C4.80187 4.07156 4.79532 4.06495 4.78867 4.05852L1.1147 0.200811ZM5.1147 0.200811C4.85971 -0.0669364 4.44628 -0.0669373 4.19128 0.200811C3.93629 0.468558 3.93629 0.902662 4.19128 1.17041L7.42281 4.56355L4.19125 7.95672C3.93625 8.22447 3.93625 8.65857 4.19125 8.92632C4.44624 9.19407 4.85967 9.19407 5.11466 8.92632L8.78775 5.06953C8.79473 5.06281 8.8016 5.0559 8.80837 5.0488C8.94373 4.90666 9.00724 4.71764 8.99888 4.53152C8.99168 4.36674 8.92816 4.20416 8.80833 4.07833C8.80187 4.07156 8.79532 4.06495 8.78867 4.05852L5.1147 0.200811Z" />
                      </mask>
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.1147 0.200811C0.859705 -0.0669364 0.446277 -0.0669373 0.191283 0.200811C-0.0637118 0.468558 -0.0637113 0.902662 0.191283 1.17041L3.42281 4.56355L0.191246 7.95672C-0.0637486 8.22447 -0.0637486 8.65857 0.191246 8.92632C0.446241 9.19407 0.859668 9.19407 1.11466 8.92632L4.78775 5.06953C4.79473 5.06281 4.8016 5.0559 4.80837 5.0488C4.94373 4.90666 5.00724 4.71764 4.99888 4.53152C4.99168 4.36674 4.92816 4.20416 4.80833 4.07833C4.80187 4.07156 4.79532 4.06495 4.78867 4.05852L1.1147 0.200811ZM5.1147 0.200811C4.85971 -0.0669364 4.44628 -0.0669373 4.19128 0.200811C3.93629 0.468558 3.93629 0.902662 4.19128 1.17041L7.42281 4.56355L4.19125 7.95672C3.93625 8.22447 3.93625 8.65857 4.19125 8.92632C4.44624 9.19407 4.85967 9.19407 5.11466 8.92632L8.78775 5.06953C8.79473 5.06281 8.8016 5.0559 8.80837 5.0488C8.94373 4.90666 9.00724 4.71764 8.99888 4.53152C8.99168 4.36674 8.92816 4.20416 8.80833 4.07833C8.80187 4.07156 8.79532 4.06495 8.78867 4.05852L5.1147 0.200811Z" fill="#72F34B" />
                      <path d="M0.191283 0.200811L1.09646 1.06288L1.09646 1.06287L0.191283 0.200811ZM1.1147 0.200811L2.01988 -0.661254L2.01988 -0.661254L1.1147 0.200811ZM0.191283 1.17041L-0.713894 2.03247L0.191283 1.17041ZM3.42281 4.56355L4.32799 5.42561L5.14899 4.56355L4.32799 3.70148L3.42281 4.56355ZM0.191246 7.95672L1.09642 8.81879L0.191246 7.95672ZM0.191246 8.92632L-0.713933 9.78838L-0.71393 9.78839L0.191246 8.92632ZM1.11466 8.92632L2.01984 9.78838H2.01984L1.11466 8.92632ZM4.78775 5.06953L3.92051 4.16932L3.90113 4.18799L3.88258 4.20747L4.78775 5.06953ZM4.80837 5.0488L3.90319 4.18673L3.90316 4.18676L4.80837 5.0488ZM4.99888 4.53152L3.75007 4.58608L3.75014 4.58758L4.99888 4.53152ZM4.80833 4.07833L3.90314 4.94039L3.90315 4.9404L4.80833 4.07833ZM4.78867 4.05852L3.88349 4.92058L3.90119 4.93916L3.91963 4.957L4.78867 4.05852ZM4.19128 0.200811L5.09646 1.06288L5.09646 1.06287L4.19128 0.200811ZM5.1147 0.200811L6.01988 -0.661254V-0.661254L5.1147 0.200811ZM4.19128 1.17041L3.28611 2.03247L4.19128 1.17041ZM7.42281 4.56355L8.32798 5.42561L9.14899 4.56355L8.32798 3.70148L7.42281 4.56355ZM4.19125 7.95672L3.28607 7.09466L3.28607 7.09466L4.19125 7.95672ZM4.19125 8.92632L3.28607 9.78838L3.28607 9.78839L4.19125 8.92632ZM5.11466 8.92632L4.20949 8.06425L4.20948 8.06426L5.11466 8.92632ZM8.78775 5.06953L7.92051 4.16932L7.90113 4.18799L7.88258 4.20747L8.78775 5.06953ZM8.80837 5.0488L7.90319 4.18674L7.90316 4.18676L8.80837 5.0488ZM8.99888 4.53152L7.75007 4.58608L7.75014 4.58758L8.99888 4.53152ZM8.80833 4.07833L9.71351 3.21627L9.71345 3.21621L8.80833 4.07833ZM8.78867 4.05852L7.88349 4.92058L7.9012 4.93918L7.91966 4.95703L8.78867 4.05852ZM1.09646 1.06287C0.858842 1.31238 0.447138 1.31237 0.209523 1.06287L2.01988 -0.661254C1.27227 -1.44625 0.0337131 -1.44625 -0.713895 -0.661252L1.09646 1.06287ZM1.09646 0.308344C1.30123 0.523354 1.30123 0.847864 1.09646 1.06288L-0.713893 -0.661254C-1.42865 0.0892511 -1.42865 1.28197 -0.713894 2.03247L1.09646 0.308344ZM4.32799 3.70148L1.09646 0.308344L-0.713894 2.03247L2.51763 5.42561L4.32799 3.70148ZM1.09642 8.81879L4.32799 5.42561L2.51763 3.70148L-0.713931 7.09466L1.09642 8.81879ZM1.09642 8.06426C1.30119 8.27927 1.30119 8.60378 1.09642 8.81879L-0.713931 7.09466C-1.42869 7.84516 -1.42869 9.03788 -0.713933 9.78838L1.09642 8.06426ZM0.209486 8.06425C0.447101 7.81476 0.858803 7.81475 1.09642 8.06425L-0.71393 9.78839C0.033678 10.5734 1.27224 10.5734 2.01984 9.78838L0.209486 8.06425ZM3.88258 4.20747L0.209485 8.06425L2.01984 9.78838L5.69293 5.9316L3.88258 4.20747ZM3.90316 4.18676C3.90877 4.18087 3.91456 4.17505 3.92051 4.16932L5.655 5.96975C5.67491 5.95057 5.69443 5.93093 5.71357 5.91084L3.90316 4.18676ZM3.75014 4.58758C3.74429 4.45721 3.78802 4.30766 3.90319 4.18673L5.71354 5.91086C6.09945 5.50566 6.27019 4.97807 6.24762 4.47545L3.75014 4.58758ZM3.90315 4.9404C3.80132 4.83347 3.7552 4.70331 3.75007 4.58608L6.24769 4.47695C6.22817 4.03016 6.05501 3.57485 5.7135 3.21627L3.90315 4.9404ZM3.91963 4.957C3.91398 4.95153 3.90848 4.94599 3.90314 4.94039L5.71351 3.21628C5.69527 3.19712 5.67666 3.17837 5.65771 3.16004L3.91963 4.957ZM0.209523 1.06287L3.88349 4.92058L5.69385 3.19646L2.01988 -0.661254L0.209523 1.06287ZM5.09646 1.06287C4.85884 1.31238 4.44714 1.31237 4.20952 1.06287L6.01988 -0.661254C5.27227 -1.44625 4.03371 -1.44625 3.2861 -0.661252L5.09646 1.06287ZM5.09646 0.308344C5.30123 0.523353 5.30123 0.847864 5.09646 1.06288L3.28611 -0.661255C2.57135 0.0892513 2.57135 1.28197 3.28611 2.03247L5.09646 0.308344ZM8.32798 3.70148L5.09646 0.308344L3.28611 2.03247L6.51763 5.42561L8.32798 3.70148ZM5.09642 8.81879L8.32798 5.42561L6.51763 3.70148L3.28607 7.09466L5.09642 8.81879ZM5.09642 8.06426C5.30119 8.27927 5.30119 8.60378 5.09642 8.81879L3.28607 7.09466C2.57131 7.84516 2.57131 9.03788 3.28607 9.78838L5.09642 8.06426ZM4.20948 8.06426C4.4471 7.81475 4.8588 7.81475 5.09642 8.06425L3.28607 9.78839C4.03368 10.5734 5.27224 10.5734 6.01984 9.78838L4.20948 8.06426ZM7.88258 4.20747L4.20949 8.06425L6.01984 9.78838L9.69293 5.9316L7.88258 4.20747ZM7.90316 4.18676C7.90877 4.18087 7.91456 4.17505 7.92051 4.16932L9.655 5.96975C9.67491 5.95057 9.69443 5.93093 9.71357 5.91084L7.90316 4.18676ZM7.75014 4.58758C7.74429 4.45721 7.78802 4.30766 7.90319 4.18674L9.71354 5.91086C10.0994 5.50566 10.2702 4.97808 10.2476 4.47545L7.75014 4.58758ZM7.90315 4.94039C7.80132 4.83347 7.7552 4.70331 7.75007 4.58608L10.2477 4.47695C10.2282 4.03016 10.055 3.57486 9.71351 3.21627L7.90315 4.94039ZM7.91966 4.95703C7.91397 4.95152 7.90848 4.94599 7.90321 4.94045L9.71345 3.21621C9.69527 3.19712 9.67668 3.17838 9.65768 3.16001L7.91966 4.95703ZM4.20952 1.06287L7.88349 4.92058L9.69385 3.19646L6.01988 -0.661254L4.20952 1.06287Z" fill="#72F34B" mask="url(#path-1-inside-1_410_33686)" />
                    </svg>
                  </a>
                </div>)
              }
            </div>
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <div className={clsx(styles.offerList)}>
              {
                offerList.map((offer, k) => <div key={k} className={clsx(
                  'font-casual text-sm',
                  styles.offerItem
                )}>
                  <div className={styles.offerMaker}>
                    <div>
                      <b>{shortenAddress(offer.buyer, '*', 6)}</b> make an offer
                    </div>
                    <span className='text-white/50 text-13px'>
                      {formatHumanReadableTime(+offer.dispatch_at * 1000, Date.now())}
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <img src="" alt="" className='w-4 h-4 rounded-full' />
                    <span className='ml-2'>
                      {utils.formatEther(offer.raw_amount)} {offer.currencySymbol}
                    </span>
                    {
                      offer.buyer === account &&
                      <button onClick={onRejectOffer} className='border-0 outline-none text-13px text-gamefiGreen-700 ml-6'>
                        Cancel
                      </button>
                    }
                  </div>
                </div>)
              }
            </div>
          </TabPanel>
        </div>
      </>}
    />
  </WrapperPoolDetail>
}

export default MarketplaceDetail
