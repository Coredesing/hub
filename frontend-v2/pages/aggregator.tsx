import { fetchDataWithQueries } from 'pages/api/aggregator'
import Layout from 'components/Layout'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { paginator, fetcher, formatterUSD, formatPrice } from 'utils'
import { useMemo, useState, useEffect } from 'react'
import useSWR from 'swr'

const PriceChange = ({ tokenomic, className } : { tokenomic: { price_change_24h: string }, className: string }) => {
  if (!tokenomic?.price_change_24h) {
    return null
  }

  const priceChange = parseFloat(tokenomic.price_change_24h)

  return <span className={`${className} inline-flex items-center px-2 rounded text-xs ${priceChange >= 0 ? 'bg-gamefiGreen-500 text-gamefiDark-800' : 'bg-red-500'}`}>
    { priceChange >= 0
      ? <svg className="inline w-2 h-2 mr-1" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.99965 0.75C2.8774 0.75 2.76265 0.809625 2.69252 0.910125L0.0675246 4.66013C-0.0127254 4.7745 -0.0217254 4.92413 0.0420246 5.04825C0.1069 5.17237 0.234775 5.25 0.37465 5.25H5.62503C5.7649 5.25 5.89315 5.17237 5.95765 5.04825C6.0214 4.92413 6.0124 4.7745 5.93215 4.66013L3.30715 0.910125C3.2374 0.809625 3.12265 0.75 3.0004 0.75C3.00003 0.75 3.00002 0.75 2.99965 0.75C3.00002 0.75 3.00002 0.75 2.99965 0.75Z" fill="currentColor"/>
      </svg>
      : <svg className="inline w-2 h-2 mr-1" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.00035 5.25C3.1226 5.25 3.23735 5.19037 3.30748 5.08987L5.93248 1.33987C6.01273 1.2255 6.02173 1.07587 5.95798 0.95175C5.8931 0.827625 5.76523 0.75 5.62535 0.75L0.374975 0.75C0.2351 0.749999 0.10685 0.827625 0.0423502 0.951749C-0.0213996 1.07587 -0.0123998 1.2255 0.06785 1.33987L2.69285 5.08987C2.7626 5.19037 2.87735 5.25 2.9996 5.25C2.99997 5.25 2.99998 5.25 3.00035 5.25C2.99998 5.25 2.99998 5.25 3.00035 5.25Z" fill="currentColor"/>
      </svg>
    }
    { Math.abs(priceChange).toFixed(2) }%
  </span>
}

const Pagination = ({ page, pageLast, setPage = () => {} }: { page: number, pageLast: number, setPage: (number) => void }) => {
  const pages = useMemo(() => {
    return paginator({ current: page, last: pageLast })
  }, [page, pageLast])

  return <div className="inline-flex gap-1 text-white font-casual text-sm" style={{ marginTop: '2rem' }}>
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
  const [page, setPage] = useState<number>(data.page || 1)
  const [cached, setCached] = useState(data)

  const url = useMemo(() => {
    if (page === data.page) {
      return null
    }

    const params = new URLSearchParams(router.query)
    return `/api/aggregator?${params}`
  }, [router, page, data])

  const { data: result, error } = useSWR(url, fetcher)
  useEffect(() => {
    if (!result?.data) {
      return
    }

    setCached(result.data)
  }, [result])
  useEffect(() => {
    if (page === data.page) {
      setCached(data)
    }
  }, [page, data])

  const loading = useMemo(() => {
    return page !== data.page && !result?.data && !error
  }, [page, data, result, error])

  function updatePage (number) {
    setPage(number)
    router.push(`?page=${number}`, undefined, { shallow: true })
      .catch(err => {
        console.debug(err)
      })
  }

  return (
    <Layout title="GameFi Aggregator">
      <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
        <div className="uppercase font-bold text-3xl">Game List</div>
        <div className="mt-6 relative">
          <div className="flex mb-2">
            <div className="uppercase text-gray-400 font-bold text-sm flex-1">Game</div>
            <div className="uppercase text-gray-400 font-bold text-sm w-48">Category</div>
            <div className="uppercase text-gray-400 font-bold text-sm w-48">Volume 24h</div>
            <div className="uppercase text-gray-400 font-bold text-sm w-48">Token Price</div>
            <div className="uppercase text-gray-400 font-bold text-sm w-48">Last 7 days</div>
          </div>
          <div className="relative">
              { loading && (
              <div className="flex gap-2 justify-center items-center uppercase font-casual font-semibold absolute z-10 inset-0 bg-gamefiDark-900 bg-opacity-90">
                <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
              ) }

            { cached.data && cached.data.map(item => {
              const roi = ((parseFloat(item.tokenomic?.price) || 0) / parseFloat(item.token_price)).toFixed(2)
              return (
                <div className="flex items-center bg-gamefiDark-700 mb-4 relati" key={item.id}>
                  <div className="flex-1 flex items-center">
                    <div className="flex-none relative w-48 h-28">
                      <Image src={item.screen_shots_1} layout="fill" alt={item.game_name} />
                    </div>
                    <div className="p-4">
                      <div className="uppercase font-bold text-lg">{item.game_name}</div>
                      <p className="font-casual text-sm line-clamp-1 text-gray-300">{item.short_description}</p>
                    </div>
                  </div>
                  <div className="font-casual text-sm w-48 px-2">
                    <p className="text-sm line-clamp-1 text-gray-300">{item.category.split(',').join(', ')}</p>
                  </div>
                  <div className="font-casual text-sm w-48">
                    <p>{formatterUSD.format(item.tokenomic?.volume_24h)}</p>
                  </div>
                  <div className="font-casual text-sm w-48">
                    <p className="font-semibold inline-flex items-center">{formatPrice(item.tokenomic?.price)} <PriceChange className="ml-2" tokenomic={item.tokenomic} /></p>
                    <p className="text-gray-300"><strong>x{roi}</strong> IDO ROI</p>
                  </div>
                  <div className="font-casual text-sm w-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    { item.tokenomic?.price_change_7d && <img src={`https://s3.coinmarketcap.com/generated/sparklines/web/7d/usd/${item.tokenomic?.cmc_id}.svg`} alt={`CoinMarketCap ${item.game_name}`} className={parseFloat(item.tokenomic?.price_change_7d || 0) > 0 ? 'hue-rotate-90' : '-hue-rotate-60 -saturate-150 contrast-150 brightness-75'} /> }
                  </div>
                </div>
              )
            }) }
          </div>
          <Pagination page={cached.page} pageLast={cached.lastPage} setPage={updatePage} />
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps ({ query }) {
  const data = await fetchDataWithQueries(query)
  if (!data?.data) {
    return {
      props: {
        data: {}
      }
    }
  }

  return { props: { data: data.data } }
}

export default Aggregator
