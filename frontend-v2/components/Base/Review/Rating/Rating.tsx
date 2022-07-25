import { useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { fetcher } from '@/utils'
import useConnectWallet from '@/hooks/useConnectWallet'
import ReviewRatingAction from '@/components/Base/Review/Rating/Action'
import ReviewStar from '@/components/Base/Review/Star'
import styles from '@/components/Base/Review/Rating/Rating.module.scss'

const STAR_LEVEL = [5, 4, 3, 2, 1]

function StarsWithBar ({ level, percent }) {
  return (
    <div className='flex w-full mb-2'>
      <div className='flex items-center gap-1'>
        {
          STAR_LEVEL.map(curLevel => <ReviewStar key={`star_${curLevel}`} selected={level >= curLevel} size={'8px'} activeColor="white" inactiveColor="transparent" />)
        }
      </div>
      <div className='flex-1 md:w-[180px] xl:w-[276px] md:flex-none h-[7px] p-0 ml-4 relative items-center'>
        <div className={`${styles.rating_col} w-full h-full`}></div>
        <div className={`${styles.rating_col_active} h-full absolute z-10 top-0 rounded-full bg-white`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}

type Rate = {
  level: number;
  percent: string;
}

type ReviewRatingProps = {
  overall: string;
  id: string;
  totalCount: number;
  rates: Array<Rate>;
  currentRate: number;
  setCurrentRate: (v: number) => any;
  currentResource?: 'guilds' | 'hub';
}

const ReviewRating = ({ overall, totalCount, rates, currentRate, setCurrentRate, id, currentResource = 'hub' }: ReviewRatingProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { connectWallet } = useConnectWallet()
  const handleSetCurrentRate = (rate) => () => {
    setLoading(true)
    connectWallet().then((res: any) => {
      if (res.error) {
        console.debug(res.error)
        toast.error('Could not rate')
        return
      }
      handleCreateRate(res, rate)
    }).catch(err => {
      setLoading(false)
      console.debug(err)
    })
  }

  const handleCreateRate = (response, rate) => {
    const { walletAddress, signature } = response
    const createRateUrl = '/api/hub/reviews/createRate'

    const createRateBody: {
      rate: number;
      guild?: string;
      aggregator?: string;
    } = {
      rate
    }
    switch (currentResource) {
    case 'guilds':
      createRateBody.guild = id
      break
    case 'hub':
      createRateBody.aggregator = id
      break
    }

    fetcher(createRateUrl, {
      method: 'POST',
      body: JSON.stringify(createRateBody),
      headers: {
        'X-Signature': signature,
        'X-Wallet-Address': walletAddress
      }
    }).then(({ err }) => {
      setLoading(false)
      if (err) {
        toast.error('Could not create rate')
      } else {
        setCurrentRate(rate)
        router.replace(router.asPath)
      }
    }).catch((err) => {
      setLoading(false)
      toast.error('Could not create rate')
      console.debug('err', err)
    })
  }

  return (
    <div className={`${styles.rating_container} flex flex-col md:flex-row w-full h-fit`}>
      <div className={`${styles.rating_overall} p-2 xl:p-8 rounded flex sm:flex-row flex-col flex-2`}>
        <div className='flex flex-col justify-center'>
          <div className='font-mechanic tracking-[0.004em] text-[13px] font-bold leading-[150%] text-white opacity-50 uppercase not-italic'>Rating</div>
          <div className='flex mt-[10px] flex-1'>
            <div className={`${styles.text} mr-[10px] md:w-[100px]`}>{overall}</div>
            <div className='flex flex-row w-full gap-6'>
              <div className='flex flex-col justify-end mb-2 opacity-50 font-normal text-sm leading-[150%] text-white'>
                Out of 5
              </div>
              <div className='flex flex-col justify-end mb-2 font-normal text-sm leading-[150%] text-white'>
                {`${totalCount} Rating${totalCount > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.rating_chart} flex w-full m-auto sm:ml-8 flex-1`}>
          <div className='flex-col w-full m-auto'>
            {rates.map((e, i) => {
              return <StarsWithBar key={`star_${i}`} level={e.level} percent={e.percent} />
            })}
          </div>
        </div>
      </div>
      <div className={`${styles.rating_action} flex justify-center flex-1 md:p-0 pb-4 pt-8`}>
        <div className="text-[13px] flex items-center justify-center flex-col">
          <div className="font-bold text-center sm:text-left">RATE THIS PROJECT</div>
          <div className="font-casual text-white/30 hidden sm:block mb-3">Click to rate</div>
          <ReviewRatingAction rate={currentRate} callBack={handleSetCurrentRate} disabled={loading} />
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default ReviewRating
