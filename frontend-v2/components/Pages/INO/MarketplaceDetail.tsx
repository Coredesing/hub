import clsx from 'clsx'
import { ObjectType } from 'common/types'
import PoolDetail from 'components/Base/PoolDetail'
import { TabPanel, Tabs } from 'components/Base/Tabs'
import { MARKETPLACE_CONTRACT, useWeb3Default } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { formatNumber, shortenAddress } from 'utils'
import BannerImagePool from './BannerImagePool'
import styles from './MarketplaceDetail.module.scss'
import SellNFTModal from './SellNFTModal'
import TransferNFTModal from './TransferNFTModal'
import MakeOfferModal from './MakeOfferModal'
import WrapperPoolDetail from './WrapperPoolDetail'
import ERC721ABI from 'components/web3/abis/Erc721.json'
import MarketplaceABI from 'components/web3/abis/Marketplace.json'
import ERC20ABI from 'components/web3/abis/ERC20.json'
import { Contract } from '@ethersproject/contracts'
import toast from 'react-hot-toast'
import { BigNumber, constants, utils } from 'ethers'
import ButtonBase from 'components/Base/Buttons/ButtonBase'
import DialogTxSubmitted from 'components/Base/DialogTxSubmitted'
import { currencyNative, useTokenAllowance, useTokenApproval } from 'components/web3/utils'
import axios from 'utils/axios'
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
    if (!libraryDefaultTemporary) return;
    const erc721Contract = new Contract(projectInfo.token_address, ERC721ABI, libraryDefaultTemporary)
    return erc721Contract
  }, [projectInfo.token_adress, libraryDefaultTemporary])

  const MarketplaceContract = useMemo(() => {
    if (!libraryDefaultTemporary || !MARKETPLACE_CONTRACT) return;
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

  const getAddresssOwnerNFT = useCallback(async () => {
    if (!ERC721Contract) {
      return
    }
    const addressOwnerNFT = await ERC721Contract.ownerOf(tokenInfo.id)
    setAddressOwnerNFT(addressOwnerNFT)
  }, [ERC721Contract])

  const getTokenOnSale = useCallback(async () => {
    if (!MarketplaceContract) return
    try {
      const tokenOnSale = await MarketplaceContract.tokensOnSale(projectInfo.token_address, tokenInfo.id);
      const info = {
        owner: tokenOnSale.tokenOwner,
        currency: tokenOnSale.currency,
        price: tokenOnSale.price.toString(),
        symbol: null,
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
      console.log('er', error)
    }
  }, [MarketplaceContract, libraryDefaultTemporary])

  useEffect(() => {
    if (tokenOnSale.currency) {
      axios.get(`/marketplace/offers/${projectInfo.slug}/${tokenInfo.id}?event_type=TokenOffered`).then(async (res) => {
        let offers = res.data?.data || []
        console.log('offers', offers)
        const offerList: ObjectType<any>[] = []
        await Promise.all(offers.map((item: any) => new Promise(async (res) => {
          if (item.currency === tokenOnSale.currency) {
            if (!currencies[item.currency]) {
              const erc20Contract = new Contract(item.currency, ERC20ABI, libraryDefaultTemporary);
              item.currencySymbol = await erc20Contract.symbol()
            } else {
              item.currencySymbol = currencyNative(projectInfo.network)?.symbol
            }
            offerList.push(item)
          }
          res('')
        })));
        setOfferList(offerList)
      }).catch(err => {
        console.log('err', err)
      })
    }
  }, [tokenOnSale])

  useEffect(() => {
    if (offerList.length && account) {
      const myLastOffer = offerList.find(item => item.buyer === account);
      setLastOffer(myLastOffer as any);
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
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (isAllowBuyOffer && tokenOnSale.currency && account) {
      checkAllowance()
    }
  }, [isAllowBuyOffer, tokenOnSale, account, checkAllowance])

  const handleOpenModalAuctionNFT = () => {
    setOpenSellNFTModal(true);
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
    lock: false,
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
    const result = await tx.wait(1);
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
    ].includes(action as string)) {
      getTokenOnSale();
      getAddresssOwnerNFT()
    }
    // if (action === onOfferNFT.name) {
    //     setTimeout(() => {
    //         setReloadOfferList(true);
    //     }, 2000)
    //     setReloadBalance(true);
    // }
    // if (action === onRejectOffer.name) {
    //     setTimeout(() => {
    //         setReloadOfferList(true);
    //     }, 2000)
    // }
    // if (action === onApproveToMarketplace.name) {
    //     checkApproveMarketplace();
    // }
    setLockingAction({ action: '', lock: false })
    return true
  }

  const handleCallContract = async (action: string, fnCallContract: Function) => {
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
    if (!ERC721ContractSigner) return;
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
    if (!ERC721ContractSigner) return;
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
      options.value = utils.parseEther(tokenOnSale.price);
    }
    return handleCallContract(onBuyNFT.name, () => MarketplaceContractSigner.buy(tokenInfo.id, projectInfo.token_address, tokenOnSale.price, tokenOnSale.currency, options))
  }

  const onAcceptOffer = async (item: ObjectType<any>) => {
    // handleCallContract(onAcceptOffer.name, () => MarketplaceContractSigner.takeOffer(id, projectAddress, new BigNumber(item.raw_amount).toFixed(), addressCurrencyToBuy, item.buyer));
  }

  const onRejectOffer = async () => {
    // handleCallContract(onRejectOffer.name, () => MarketplaceContractSigner.cancelOffer(id, projectAddress));
  }

  const onApproveToMarketplace = async () => {
    if (!ERC721ContractSigner) return;
    const ok = await handleCallContract(onApproveToMarketplace.name, () => ERC721ContractSigner.setApprovalForAll(MARKETPLACE_CONTRACT, true))
    if (ok) {
      setApprovedMarketplace(true)
    }
    return ok
  }

  const [isApprovedMarketplace, setApprovedMarketplace] = useState(false)
  const checkApproveMarketplace = useCallback(async () => {
    try {
      if (!ERC721ContractSigner) return;
      const isApproved = await ERC721ContractSigner.isApprovedForAll(account, MARKETPLACE_CONTRACT);
      setApprovedMarketplace(isApproved)
    } catch (error) {
      console.log('err', error)
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
                `p-px`,
                {
                  'bg-gamefiGreen-900 text-gamefiGreen-900 hover:bg-gamefiGreen-900 hover:text-gamefiGreen-900 cursor-not-allowed': !isApprovedToken,
                  'cursor-pointer bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700': isApprovedToken
                }
              )}>
              <div className={clsx(styles.btn, styles.btnClipPathBottomLeft, "bg-gamefiDark-900 h-9 text-13px flex justify-center items-center rounded-sm font-bold uppercase")}>
                Make Offer
              </div>
            </button>
            {
              !isApprovedToken ?
                <ButtonBase
                  noneStyle
                  isLoading={loadingApproveToken || loadingAllowance}
                  disabled={loadingApproveToken || loadingAllowance}
                  color='green'
                  className={clsx(styles.btnClipPathTopRight, styles.btn, 'uppercase h-9 rounded-sm text-13px font-bold text-black bg-gamefiGreen-700')}
                  onClick={onApproveToken}
                >
                  {loadingAllowance ? 'Checking Approval' : 'Approve to Buy'}
                </ButtonBase> :
                <ButtonBase
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
                  `cursor-pointer p-px bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700`,

                )}>
                <div className={clsx(styles.btn, styles.btnClipPathBottomLeft, "bg-gamefiDark-900 h-9 text-13px flex justify-center items-center rounded-sm font-bold uppercase")}>
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
                  `cursor-pointer p-px mb-4 bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700`,
                )}>
                <div className={clsx(styles.btn, styles.btnClipPathTopRightBottomLeft, "bg-gamefiDark-900 h-9 text-13px flex justify-center items-center rounded-sm font-bold uppercase")}>
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
            'Offers',
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
        </div>

      </>}
    />
  </WrapperPoolDetail>;
};

export default MarketplaceDetail;
