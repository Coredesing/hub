import { useMemo } from 'react'
import { paginator } from '@/utils'

const Pagination = ({ page, pageLast, setPage = () => {}, className }: { page: number; pageLast: number; setPage: (number) => void; className?: string }) => {
  const pages = useMemo(() => {
    return paginator({ current: page, last: pageLast })
  }, [page, pageLast])

  return <div className={`flex h-full items-center gap-1 text-white font-casual text-sm ${className}`}>
    <span className="inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border-transparent" onClick={() => { setPage(1) }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.25 1.25L2 5L5.25 8.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.25 1.25L5 5L8.25 8.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    <span className="inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border-transparent" onClick={() => { page > 1 && setPage(page - 1) }}>
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.75 0.25L1 4L4.75 7.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    { pages && (
      <>
        <span className={`inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border border-transparent ${pages.current === pages.first ? 'border-gamefiGreen-600 text-gamefiGreen-600' : ''}`} onClick={() => { setPage(pages.first) }}>{pages.first}</span>
        { pages.leftCluster && <span className={'inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border border-transparent'}>...</span> }
        { pages.pages.map(page => <span className={`inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border border-transparent ${pages.current === page ? 'border-gamefiGreen-600 text-gamefiGreen-600' : ''}`} key={page} onClick={() => { setPage(page) }}>{page}</span>) }
        { pages.rightCluster && <span className={'inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border border-transparent'}>...</span> }
        { pages.last > pages.first && <span className={`inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border border-transparent ${pages.current === pages.last ? 'border-gamefiGreen-600 text-gamefiGreen-600' : ''}`} onClick={() => { setPage(pageLast) }}>{pages.last}</span> }
      </>
    )}
    <span className="inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border border-transparent" onClick={() => { page < pageLast && setPage(page + 1) }}>
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.25 0.25L5 4L1.25 7.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
    <span className="inline-flex w-6 h-6 justify-center items-center rounded cursor-pointer border border-transparent" onClick={() => { setPage(pageLast) }}>
      <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.75 8.75L7 5L3.75 1.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0.75 8.75L4 5L0.750001 1.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  </div>
}

export default Pagination
