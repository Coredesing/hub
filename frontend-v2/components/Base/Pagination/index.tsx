import React from 'react'
import styles from './pagination.module.scss'
import clsx from 'clsx'
type Props = {
  totalPage: number;
  currentPage: number;
  onChange?: (page: number) => any;
  className?: string;
}

const Pagination = ({ totalPage, currentPage, onChange, className }: Props) => {
  const handleChangePage = (p: number) => {
    if (currentPage === p) return
    onChange && onChange(p)
  }
  const renderPageElm = (p: number) => (<div
    key={p}
    className={clsx(styles.page, 'page font-casual rounded w-7 h-7 text-xs p-1 grid place-items-center font-medium transition ease-in-out delay-150', {
      ['cursor-pointer ' + styles.bordered]: currentPage !== p,
      [styles['page-active']]: currentPage === p
    })}
    onClick={() => handleChangePage(p)}
  >
    {p}
  </div>)
  const renderEmptyPage = (k: any) => (<div
    key={k}
    className={clsx('page w-7 h-7 text-xs p-1 grid place-items-center font-medium bg-transparent tracking-widest')}
  >
    ...
  </div>)
  const renderPage = () => {
    const pages: any[] = []
    if (totalPage > 5) {
      if (currentPage === 1 || currentPage === 2 || currentPage === 3) {
        [1, 2, 3, 4].forEach(p => {
          pages.push(renderPageElm(p))
        })
        pages.push(renderEmptyPage('...'))
        pages.push(renderPageElm(totalPage))
      } else if (currentPage === totalPage || currentPage === totalPage - 1 || currentPage === totalPage - 2) {
        pages.push(renderPageElm(1))
        pages.push(renderEmptyPage('...'));
        [3, 2, 1, 0].forEach(p => {
          pages.push(renderPageElm(totalPage - p))
        })
      } else {
        pages.push(renderPageElm(1))
        pages.push(renderEmptyPage('...1'))
        pages.push(renderPageElm(currentPage - 1))
        pages.push(renderPageElm(currentPage))
        pages.push(renderPageElm(currentPage + 1))
        pages.push(renderEmptyPage('...2'))
        pages.push(renderPageElm(totalPage))
      }
    } else {
      for (let p = 1; p < totalPage + 1; p++) {
        pages.push(
          renderPageElm(p)
        )
      }
    }
    return pages
  }
  return (
    <div className={className}>
      <div className={clsx(styles.pages)}>
        <div
          className={clsx(styles.page, 'page rounded w-7 h-7 text-xs p-1 grid place-items-center font-medium transition ease-in-out delay-150', {
            ['cursor-pointer ' + styles.bordered]: currentPage !== 1
          })}
          onClick={() => (currentPage - 1 > 0) && handleChangePage(1)}
        >
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.25 1.25L1 5L4.25 8.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.25 1.25L4 5L7.25 8.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          className={clsx(styles.page, 'page rounded w-7 h-7 text-xs p-1 grid place-items-center font-medium transition ease-in-out delay-150', {
            ['cursor-pointer ' + styles.bordered]: currentPage !== 1
          })}
          onClick={() => (currentPage - 1 > 0) && handleChangePage(currentPage - 1)}
        >
          <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.75 0.25L1 4L4.75 7.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {renderPage()}
        <div
          className={clsx(styles.page, 'page rounded w-7 h-7 text-xs p-1 grid place-items-center font-medium transition ease-in-out delay-150', {
            ['cursor-pointer ' + styles.bordered]: currentPage !== totalPage
          })}
          onClick={() => (currentPage + 1 <= totalPage) && handleChangePage(currentPage + 1)}
        >
          <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.25 0.25L5 4L1.25 7.75" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          className={clsx(styles.page, 'page rounded w-7 h-7 text-xs p-1 grid place-items-center font-medium transition ease-in-out delay-150', {
            ['cursor-pointer ' + styles.bordered]: currentPage !== totalPage
          })}
          onClick={() => (currentPage + 1 <= totalPage) && handleChangePage(totalPage)}
        >
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.75 8.75L7 5L3.75 1.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0.75 8.75L4 5L0.750001 1.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Pagination
