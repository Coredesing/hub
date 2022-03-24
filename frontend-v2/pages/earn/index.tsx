import Layout from '@/components/Layout'
import { fetchAll } from '@/pages/api/earn'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { formatDistanceStrict } from 'date-fns'

const Earn = ({ pools }) => {
  const poolsByContract = useMemo(() => {
    return pools.reduce((acc, val) => {
      if (!val?.contractAddress) {
        return acc
      }

      const token = acc[val?.contractAddress]
      if (token?.pools) {
        token.pools.push(val)
        return acc
      }

      acc[val?.contractAddress] = {
        token: val?.token,
        tokenImage: val?.tokenImage,
        pools: [val]
      }

      return acc
    }, {})
  }, [pools])

  const [selected, setSelected] = useState({})
  const selectPool = useCallback((contractAddress, pool) => {
    setSelected(prevState => {
      return {
        ...prevState,
        [contractAddress]: pool
      }
    })
  }, [setSelected])
  useEffect(() => {
    Object.keys(poolsByContract).forEach(contractAddress => {
      const pools = (poolsByContract?.[contractAddress]?.pools || []).sort((a, b) => Number(b.lockDuration) - Number(a.lockDuration))
      const pool = pools?.[0]
      if (!pool) {
        return
      }

      selectPool(contractAddress, pool)
    })
  }, [poolsByContract, selectPool])

  const [open, setOpen] = useState({})
  const toggle = useCallback((contractAddress) => {
    setOpen(prevState => {
      return {
        ...prevState,
        [contractAddress]: !prevState[contractAddress]
      }
    })
  }, [setOpen])

  return <Layout title="GameFi Earn">
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-4 md:mb-8 lg:mb-10 xl:mb-16">
      <h1 className="uppercase font-bold text-4xl">GameFi Earn</h1>
      <h3 className="font-medium text-xl mb-14">A Safe and Simple Way to Grow Your Digital Assets.</h3>

      {Object.keys(poolsByContract).map(contractAddress => {
        const pools = (poolsByContract?.[contractAddress]?.pools || []).sort((a, b) => Number(a.lockDuration) - Number(b.lockDuration))
        const { token, tokenImage } = pools?.[0] || {}
        return <div key={contractAddress} className="flex w-full items-center bg-gamefiDark-630/40 px-6 py-4 rounded font-casual shadow">
          <div className="inline-flex items-center w-[12rem] truncate">
            <img src={tokenImage} alt={token} className="w-10 h-10 mr-3" />
            <span className="text-2xl uppercase font-medium tracking-wide font-mechanic">{token}</span>
          </div>
          <div className="w-[10rem]">
            <p className="text-[13px] text-white text-opacity-60">APR</p>
            <span className="text-xl uppercase font-medium">{ Number(selected[contractAddress]?.APR).toFixed(2) }%</span>
          </div>
          <div>
            <p className="text-[13px] text-white text-opacity-60">Lock-in term</p>
            { pools && <div className="flex text-[12px] gap-x-2 mt-1">{ pools.map(pool => <div key={pool.id} className={`px-2 py-1 rounded-sm border cursor-pointer ${selected[contractAddress] === pool ? 'border-gamefiGreen-500' : 'border-white/50'}`} onClick={() => {
              selectPool(contractAddress, pool)
            }}>
              {formatDistanceStrict(0, Number(pool.lockDuration) * 1000, { unit: 'day' })}
            </div>) }</div> }
          </div>
          <div className="ml-auto">
            <p className="text-[13px] text-white text-opacity-60">Applicable subject</p>
            <span className="text-base">Everyone</span>
          </div>
          <div className="w-[10rem] text-right">
            <div className={`items-center justify-center py-1 px-3 rounded text-sm cursor-pointer inline-flex ${open[contractAddress] ? 'hover:text-gamefiGreen-500' : 'bg-gamefiGreen-600 hover:bg-gamefiGreen-500 text-gamefiDark-900'}`} onClick={() => toggle(contractAddress)}>
              { open[contractAddress] ? <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg> : 'Stake Now' }
            </div>
          </div>
        </div>
      }
      )}
    </div>
  </Layout>
}
export default Earn

export async function getStaticProps () {
  const pools = await fetchAll()
  return {
    props: {
      pools
    },
    revalidate: 60
  }
}
