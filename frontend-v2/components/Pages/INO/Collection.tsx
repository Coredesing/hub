import CountDownTimeV1 from '@/components/Base/CountDownTime'
import LoadingOverlay from '@/components/Base/LoadingOverlay'
import { useMyWeb3 } from '@/components/web3/context'
import { formatNumber } from '@/utils'
import { ObjectType } from '@/utils/types'
import clsx from 'clsx'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './Collection.module.scss'
import { PropagateLoader } from 'react-spinners'

type Props = {
  poolInfo: ObjectType;
  collections: ObjectType[];
  loading?: boolean;
  onClaimAllNFT: () => any;
  onClaimNFT: (tokenId: number) => any;
}

const Collection = ({ poolInfo, collections, loading, onClaimAllNFT, onClaimNFT }: Props) => {
  const POOL_IDS_IS_CLAIMED_ONE_BY_ONE: any[] = useMemo(() => {
    try {
      return JSON.parse(process.env.NEXT_PUBLIC_POOL_IDS_IS_CLAIMED_ONE_BY_ONE || '')
    } catch (error) {
      return []
    }
  }, [])
  const { account } = useMyWeb3()
  const [isClaimed, setClaim] = useState(false)
  let timeClaim = poolInfo.campaignClaimConfig?.[0]?.start_time
  const claimType = poolInfo.campaignClaimConfig?.[0]?.claim_type
  const claimUrl = poolInfo.campaignClaimConfig?.[0]?.claim_url
  const isClaimedOnGF = !claimType || +claimType === 0
  const timeNow = Date.now()
  timeClaim = timeClaim ? +timeClaim * 1000 : 0
  useEffect(() => {
    if (timeClaim && timeClaim < timeNow) {
      setClaim(true)
    }
  }, [timeClaim, timeNow])
  const onFinishCountdown = () => {
    setClaim(true)
  }

  const handleClaimAllNFT = () => {
    if (!isClaimed) return
    onClaimAllNFT()
  }

  const handleClaimNFT = (tokenId: number) => {
    if (!isClaimed) return
    onClaimNFT(tokenId)
  }

  return (
    <div>
      {
        loading
          ? <div className='flex items-center w-full h-32 justify-center'><PropagateLoader color='#fff'></PropagateLoader></div>
          : !!collections.length && account
            ? <>
              <div className='flex gap-3 justify-between flex-wrap items-center mb-9'>
                <div className={clsx(styles.wrapperCountdown, 'items-center')}>
                  <div className='text-sm font-bold uppercase'>
                    {(timeClaim > timeNow) ? 'Claim starts in' : 'You can claim now'}
                  </div>
                  {!isClaimed && timeClaim > timeNow && <CountDownTimeV1 background='bg-transparent' time={{ date1: timeClaim, date2: timeNow }} onFinish={onFinishCountdown} />}
                </div>
                <div className='flex gap-2 flex-wrap'>
                  {
                    !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id) &&
                    <button
                      className={clsx(
                        styles.btnClaimAll,
                        'p-px cursor-pointer bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700 rounded-sm'
                      )}>
                      {
                        isClaimedOnGF
                          ? <div
                            onClick={isClaimed ? handleClaimAllNFT : undefined}
                            className={clsx(styles.btnClaimAll,
                              'bg-gamefiDark-900 w-40 text-13px flex justify-center items-center rounded-sm font-bold uppercase',
                              {
                                'cursor-not-allowed': !isClaimed
                              }
                            )}
                          >
                            Claim all on GameFi
                          </div>
                          : (claimUrl && <div
                            className={clsx(styles.btnClaimAll, 'bg-gamefiDark-900 w-40 text-13px flex justify-center items-center rounded-sm font-bold uppercase')}
                            onClick={() => window.open(claimUrl)}
                          >
                            Claim all on External
                          </div>)
                      }
                    </button>
                  }
                  {
                    (timeClaim < timeNow) && claimUrl && <button
                      className={clsx(styles.btnViewNft, 'text-black uppercase bg-gamefiGreen-700 font-bold text-13px h-9 w-40 rounded-sm')}
                      onClick={() => window.open(claimUrl)}
                    >
                      View your nft
                    </button>
                  }
                </div>
              </div>
              <div>
                <div className='flex flex-wrap gap-5 lg:justify-start justify-center'>
                  {
                    collections.map((b, id) => <div key={id} className={clsx(styles.collection, 'cursor-pointer')} style={{ background: '#23252B' }}>
                      <div className={clsx(styles.collectionImage, 'w-full')}>
                        <img src={b.image} className='w-full h-full object-cover bg-gamefiDark-900' alt="" />
                      </div>
                      <div className={clsx(styles.collectionDetail, 'w-full flex items-center')}>
                        <div className='w-2/5 font-casual text-13px text-center'>
                          #{formatNumber(b.collectionId, 3) || '-/-'}
                        </div>
                        <div
                          onClick={isClaimed ? () => handleClaimNFT(b.collectionId) : undefined}
                          className={clsx(styles.btnClaim,
                            'w-3/5 text-black font-bold text-13px text-center h-full flex items-center justify-center',
                            {
                              'bg-gamefiGreen-700': isClaimed && POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id),
                              'bg-gamefiDark-900': !isClaimed || !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(poolInfo.id)
                            }
                          )}>
                          {isClaimed ? 'Claim' : ''}
                        </div>
                      </div>
                    </div>)
                  }
                </div>
              </div>
            </>
            : <div className='flex items-center w-full h-32 justify-center'>
              <h1 className='uppercase text-4xl text-center font-bold'>No Box Found</h1>
            </div>
      }
    </div>
  )
}

export default Collection
