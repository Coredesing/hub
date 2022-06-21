import { fetcher, printNumber, useFetch } from '@/utils'
import Tippy from '@tippyjs/react'
import Image from 'next/image'
import { API_CMS_URL } from '@/utils/constants'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

const EventLeaderboard = ({ event }: { event: string }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewMore, setViewMore] = useState(false)

  const fetchData = useCallback(() => {
    return fetch(`/api/hub/events/${event}`).then(res => res.json())
  }, [event])

  useEffect(() => {
    setLoading(true)
    fetchData().then(res => {
      if (!res) {
        setLoading(false)
        return
      }

      setData(res.data || [])
      setLoading(false)
    }).catch(e => {
      toast.error(e?.message || 'Cannot get leaderboard data')
      setLoading(false)
    })
  }, [fetchData])

  return (
    <div className="mb-6 rounded pt-4 xl:pt-6" style={{ background: 'linear-gradient(180deg, #2F323A 24.73%, #1D1F25 100%)' }}>
      <div className="flex justify-center mb-3 md:text-lg 2xl:text-2xl items-center px-2 xl:px-4">
        <div className="font-bold uppercase flex items-center gap-2">
          Leaderboard
          <Tippy
            content={<span>
              <div>Performance point = Like + Rate + Review</div>
              <div>1 Like = 1 point</div>
              <div>1 Rate = 1 point</div>
              <div>1 Review = 5 points</div>
            </span>}
            className="font-casual text-sm leading-5 text-gamefiDark-100 bg-black opacity-100 p-3"
            placement="bottom"
          >
            <button><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#858689" />
            </svg></button>
          </Tippy>
        </div>
      </div>
      <div className="w-full grid grid-cols-3 font-casual text-[12px] px-2 xl:px-4">
        <div className="flex flex-col gap-3 justify-end">
          {
            !!data[1] && !loading && <a href={`/hub/${data[1]?.aggregator?.project?.slug}`} target="_blank" rel="noreferrer noopenner" className="flex flex-col m-2">
              <img src={data[1]?.aggregator?.verticalThumbnail?.url} className="aspect-[3/4] object-cover rounded-sm" alt=""></img>
              <h4 className="font-bold text-center mt-2 whitespace-nowrap text-ellipsis overflow-hidden">{data[1]?.aggregator?.project?.name}</h4>
              <div className="text-gamefiDark-200 font-semibold text-center">{printNumber(data[1]?.activePoint || 0)} pts</div>
            </a>
          }
          {
            loading && <div className="flex items-center justify-center">
              <Image src={require('@/assets/images/icons/spinner.svg')} alt=""></Image>
            </div>
          }
          <Image src={require('@/assets/images/aggregator/silver.png')} alt=""></Image>
        </div>
        <div className="flex flex-col gap-3 justify-end">
          {
            !!data[0] && !loading && <a href={`/hub/${data[0]?.aggregator?.project?.slug}`} target="_blank" rel="noreferrer noopenner" className="flex flex-col m-2">
              <img src={data[0]?.aggregator?.verticalThumbnail?.url} className="aspect-[3/4] object-cover rounded-sm" alt=""></img>
              <h4 className="font-bold text-center mt-2 whitespace-nowrap text-ellipsis overflow-hidden">{data[0]?.aggregator?.project?.name}</h4>
              <div className="text-gamefiDark-200 font-semibold text-center">{printNumber(data[0]?.activePoint || 0)} pts</div>
            </a>
          }
          {
            loading && <div className="flex items-center justify-center">
              <Image src={require('@/assets/images/icons/spinner.svg')} alt=""></Image>
            </div>
          }
          <Image src={require('@/assets/images/aggregator/gold.png')} alt=""></Image>
        </div>
        <div className="flex flex-col gap-3 justify-end">
          {
            !!data[2] && !loading && <a href={`/hub/${data[2]?.aggregator?.project?.slug}`} target="_blank" rel="noreferrer noopenner" className="flex flex-col m-2">
              <img src={data[2]?.aggregator?.verticalThumbnail?.url} className="aspect-[3/4] object-cover rounded-sm" alt=""></img>
              <h4 className="font-bold text-center mt-2 whitespace-nowrap text-ellipsis overflow-hidden">{data[2]?.aggregator?.project?.name}</h4>
              <div className="text-gamefiDark-200 font-semibold text-center">{printNumber(data[2]?.activePoint || 0)} pts</div>
            </a>
          }
          {
            loading && <div className="flex items-center justify-center">
              <Image src={require('@/assets/images/icons/spinner.svg')} alt=""></Image>
            </div>
          }
          <Image src={require('@/assets/images/aggregator/bronze.png')} alt=""></Image>
        </div>
      </div>
      {
        !loading && data?.length > 3 && <div className={`${viewMore ? 'h-[600px]' : 'h-[400px]'} overflow-y-scroll pt-2`} style={{ background: 'linear-gradient(180deg, #2F323A 24.73%, #1D1F25 100%)' }}>
          {data.slice(3, data.length < 10 || viewMore ? data.length : 10).map((item, index) => <a href={`/hub/${data[1]?.aggregator?.project?.slug}`} target="_blank" rel="noreferrer noopenner" key={`leaderboard-${item?.id}`} className="w-full flex items-center px-2 xl:px-4 py-2">
            <div className="font-semibold text-sm text-gamefiDark-200 w-3">{4 + index}</div>
            {item?.verticalThumbnail?.url ? <div className="ml-2"><img src={item?.verticalThumbnail?.url} className="w-8 h-8 rounded-sm" alt=""></img></div> : <div className="w-8 h-8 ml-2"></div>}
            <div className="ml-2 text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{item?.aggregator?.project?.name}</div>
            <div className="ml-auto font-semibold text-sm text-gamefiDark-200">{printNumber(item?.activePoint || 0)} pts</div>
          </a>)}
          {
            data.length > 10 && <button
              className="text-gamefiGreen-700 hover:text-gamefiGreen-200 px-2 xl:px-4 py-2 leading-5 font-semibold text-sm"
              onClick={() => {
                setViewMore(!viewMore)
              }}
            >
              { viewMore ? 'View Less' : 'View More' }
            </button>
          }
        </div>
      }
      {
        loading && <div className={`${viewMore ? 'h-[400px]' : 'h-[200px] xl:h-[150px]'} flex items-center justify-center`} style={{ background: 'linear-gradient(180deg, #2F323A 24.73%, #1D1F25 100%)' }}>
          <Image src={require('@/assets/images/icons/spinner.svg')} alt=""></Image>
        </div>
      }
    </div>
  )
}

export default EventLeaderboard
