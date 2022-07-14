import { useEffect, useState, useRef, useMemo } from 'react'
import Flicking from '@egjs/react-flicking'
import '@egjs/flicking-plugins/dist/pagination.css'
import get from 'lodash.get'
import { fetcher } from '@/utils'
import arrowLeft from '@/assets/images/icons/arrow-left.png'
import arrowRight from '@/assets/images/icons/arrow-right.png'
import ItemCarousel from '@/components/Pages/Hub/HubHome/ItemCarousel'
import { WrapperSection } from '@/components/Pages/Hub/HubHome/StyleElement'
import isEmpty from 'lodash.isempty'
import useHubProfile from '@/hooks/useHubProfile'

export default function MoreLike ({ categories = [], slug = '' }) {
  const [data, setData] = useState([])
  const [chunkData, setChunkData] = useState([])
  const [loading, setLoading] = useState(true)
  const [listFavorite, setListFavorite] = useState([])
  const { accountHub } = useHubProfile()
  const refSlider = useRef(null)

  const names = useMemo(() => {
    return (categories || []).map(e => e?.attributes?.name).join(',')
  }, [categories])

  useEffect(() => {
    const cateData = names.split(',')
    if (!slug || !cateData) {
      return
    }

    fetcher('/api/hub/detail', {
      method: 'POST',
      body: JSON.stringify({
        query: 'GET_MORE_LIKE_THIS',
        variables: {
          filterCate: {
            slug: {
              not: {
                eq: slug
              }
            },
            project: {
              categories: {
                name: { in: cateData }
              }
            }
          }
        }
      })
    }).then(({ data }) => {
      const formatData = data?.aggregators?.data?.map(v => {
        const d = v.attributes
        return {
          ...d,
          id: v.id,
          verticalThumbnail: get(d, 'verticalThumbnail.data.attributes', {}),
          tokenomic: get(d, 'project.data.attributes.tokenomic', {}),
          categories: get(d, 'project.data.attributes.categories', []),
          shortDesc: get(d, 'project.data.attributes.shortDesc', '-')
        }
      }) || []

      setData(formatData)

      const chunk = []
      const chunkSize = 5

      for (let i = 0; i < formatData.length; i += chunkSize) {
        chunk.push(formatData.slice(i, i + chunkSize))
      }
      setChunkData(chunk)
    }).catch((err) => {
      console.debug('err', err)
    })
  }, [names, slug])

  useEffect(() => {
    if (!isEmpty(data) && !isEmpty(accountHub) && isEmpty(listFavorite)) {
      getListFavoriteByUser()
    } else setListFavorite([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountHub?.id, data])

  const getListFavoriteByUser = () => {
    setLoading(true)
    setListFavorite([])
    fetcher('/api/hub/favorite/getListFavoriteByUserId', { method: 'POST', body: JSON.stringify({ variables: { userId: accountHub?.id, aggregatorIds: data.map(v => v.id) } }) }).then((result) => {
      setLoading(false)
      if (!isEmpty(result)) {
        setListFavorite(get(result, 'data.favorites.data', [])?.reduce((total, v: { attributes: any }) => {
          const objectId = v?.attributes?.objectID
          total[objectId] = objectId
          return total
        }, {}))
      } else setListFavorite([])
    }).catch((err) => {
      setLoading(false)
      console.debug('err', err)
    })
  }

  const prev = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.prev().catch(() => { })
  }
  const next = () => {
    if (!refSlider.current) {
      return
    }

    refSlider.current.next().catch(() => { })
  }

  return (
    <div className="xl:mb-14 w-full">
      <div className='md:hidden'>
        <WrapperSection>
          <div className="flex w-full overflow-x-auto hide-scrollbar">
            {data?.map((item, i) => <ItemCarousel defaultFavorite={!!listFavorite[item.id]} disabled={loading} item={item} index={`MoreLike-${i}`} key={`MoreLike-${i}`} showToolTip />)}
          </div>
        </WrapperSection>
      </div>
      <div className="hidden md:flex mt-8 gap-4 -mx-[50px]">
        <div className="hidden sm:block">
          <img src={arrowLeft.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={prev} />
        </div>
        <Flicking className="flex-1" align="center" interruptable={true} ref={refSlider}>
          {
            chunkData?.map((v, i) => (
              <div className="w-full mb-8 flex" key={`MoreLike-${i}`}>
                {v?.map((item, i) => {
                  return <ItemCarousel defaultFavorite={!!listFavorite[item.id]} disabled={loading} item={item} index={`MoreLike-${i}`} key={`MoreLike-${i}`} showToolTip />
                })}
              </div>
            ))
          }
        </Flicking>
        <div className="hidden sm:block">
          <img src={arrowRight.src} alt="" className="w-8 cursor-pointer opacity-80 hover:opacity-100 select-none" onClick={next} />
        </div>
      </div>
    </div>
  )
}
