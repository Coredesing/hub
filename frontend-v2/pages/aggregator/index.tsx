import { fetchAllWithQueries } from 'pages/api/aggregator'
import Layout from 'components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { paginator, formatterUSD, formatPrice } from 'utils'
import { useMemo, useState, useEffect } from 'react'
import PriceChange from 'components/Pages/Aggregator/PriceChange'

const Pagination = ({ page, pageLast, setPage = () => {}, className }: { page: number, pageLast: number, setPage: (number) => void, className: string }) => {
  const pages = useMemo(() => {
    return paginator({ current: page, last: pageLast })
  }, [page, pageLast])

  return <div className={`inline-flex gap-1 text-white font-casual text-sm ${className}`}>
    <span className="inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border-transparent" onClick={() => { setPage(1) }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.25 1.25L2 5L5.25 8.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.25 1.25L5 5L8.25 8.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    <span className="inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border-transparent" onClick={() => { page > 1 && setPage(page - 1) }}>
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.75 0.25L1 4L4.75 7.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    { pages && (
      <>
        <span className={`inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border border-transparent ${pages.current === pages.first ? 'border-gamefiGreen-600 text-gamefiGreen-600' : ''}`} onClick={() => { setPage(pages.first) }}>{pages.first}</span>
        { pages.leftCluster && <span className={'inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border border-transparent'}>...</span> }
        { pages.pages.map(page => <span className={`inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border border-transparent ${pages.current === page ? 'border-gamefiGreen-600 text-gamefiGreen-600' : ''}`} key={page} onClick={() => { setPage(page) }}>{page}</span>) }
        { pages.rightCluster && <span className={'inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border border-transparent'}>...</span> }
        { pages.last > pages.first && <span className={`inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border border-transparent ${pages.current === pages.last ? 'border-gamefiGreen-600 text-gamefiGreen-600' : ''}`} onClick={() => { setPage(pageLast) }}>{pages.last}</span> }
      </>
    )}
    <span className="inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border border-transparent" onClick={() => { page < pageLast && setPage(page + 1) }}>
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.25 0.25L5 4L1.25 7.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    <span className="inline-flex w-6 h-6 bg-gamefiDark-700 justify-center items-center rounded cursor-pointer border border-transparent" onClick={() => { setPage(pageLast) }}>
      <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.75 8.75L7 5L3.75 1.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.75 8.75L4 5L0.750001 1.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  </div>
}

const Aggregator = ({ data }) => {
  const router = useRouter()
  const [page, setPage] = useState<number>(data.page)
  const [category, setCategory] = useState<string>(data.category)
  const [loading, setLoading] = useState(false)
  const params = useMemo(() => {
    const params = new URLSearchParams()
    if (page) {
      params.set('page', page)
    }

    if (category) {
      params.set('category', category)
    }
    return `${params}`
  }, [page, category])
  useEffect(() => {
    setPage(data.page)
    setCategory(data.category)
  }, [data])

  useEffect(() => {
    setPage(1)
  }, [category])

  useEffect(() => {
    setLoading(true)
    router.push(`?${params}`)
      .finally(() => {
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return (
    <Layout title="GameFi Aggregator">
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        <div className="uppercase font-bold text-3xl">Game List</div>
        <p>Demo Only: <button onClick={() => setCategory('MMORPG')}>Click here to change category to MMORPG</button></p>
        <div className="mt-6 relative">
          <div className="flex mb-2">
            <div className="uppercase text-gray-400 font-bold text-sm flex-1">Game</div>
            <div className="uppercase text-gray-400 font-bold text-sm w-48 hidden lg:block">Category</div>
            <div className="uppercase text-gray-400 font-bold text-sm w-32 xl:w-48">Volume 24h</div>
            <div className="uppercase text-gray-400 font-bold text-sm w-40 xl:w-48">Token Price</div>
            <div className="uppercase text-gray-400 font-bold text-sm w-32 xl:w-48 hidden xl:block">Last 7 days</div>
          </div>
          <div className="relative mb-8">
            { loading && (
              <div className="flex gap-2 justify-center items-center uppercase font-casual font-semibold absolute z-10 inset-0 bg-gamefiDark-900 bg-opacity-90">
                <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) }

            { data.data && data.data.map(item => {
              const roi = ((parseFloat(item.tokenomic?.price) || 0) / parseFloat(item.token_price)).toFixed(2)
              return (
                <Link href={`/aggregator/${item.slug}`} key={item.id} passHref={true}>
                  <div className="flex items-center bg-gamefiDark-700 hover:bg-gamefiDark-600 mb-4 cursor-pointer">
                    <div className="flex-1 flex items-center">
                      <div className="flex-none relative w-48 h-28">
                        <Image src={item.screen_shots_1} layout="fill" alt={item.game_name} />
                      </div>
                      <div className="p-4">
                        <div className="uppercase font-bold text-lg">{item.game_name}</div>
                        <p className="font-casual text-sm line-clamp-1 text-gray-300">{item.short_description}</p>
                      </div>
                    </div>
                    <div className="font-casual text-sm w-48 px-2 hidden lg:block">
                      <p className="text-sm line-clamp-1 text-gray-300">{item.category.split(',').join(', ')}</p>
                    </div>
                    <div className="font-casual text-sm w-32 xl:w-48">
                      <p>{formatterUSD.format(item.tokenomic?.volume_24h)}</p>
                    </div>
                    <div className="font-casual text-sm w-40 xl:w-48">
                      <p className="font-semibold inline-flex items-center">{formatPrice(item.tokenomic?.price)} <PriceChange className="ml-2 text-xs" tokenomic={item.tokenomic} /></p>
                      <p className="text-gray-300"><strong>{roi}x</strong> IDO ROI</p>
                    </div>
                    <div className="font-casual text-sm w-32 xl:w-48 hidden xl:block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      { item.tokenomic?.price_change_7d && <img src={`https://s3.coinmarketcap.com/generated/sparklines/web/7d/usd/${item.tokenomic?.cmc_id}.svg`} alt={`CoinMarketCap ${item.game_name}`} className={parseFloat(item.tokenomic?.price_change_7d || 0) > 0 ? 'hue-rotate-90' : '-hue-rotate-60 -saturate-150 contrast-150 brightness-75'} /> }
                    </div>
                  </div>
                </Link>
              )
            }) }
          </div>
          <Pagination page={data.page} pageLast={data.lastPage} setPage={setPage} className="w-full justify-end mb-8" />
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps ({ query }) {
  const data = await fetchAllWithQueries(query)
  if (!data?.data) {
    return {
      props: {
        data: {}
      }
    }
  }

  return { props: { data: { ...data.data, category: query.category || null } } }
}

export default Aggregator
