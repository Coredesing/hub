import React from 'react'
import styles from './pagination.module.scss'
import clsx from 'clsx'
type Props = {
    totalPage: number;
    currentPage: number;
    onChange?: (page: number) => any;
}

const Pagination = ({ totalPage, currentPage, onChange }: Props) => {
  const handleChangePage = (p: number) => {
    if (currentPage === p) return
    onChange && onChange(p)
  }
  const renderPageElm = (p: number) => (<div
    key={p}
    className={clsx('page rounded w-10 h-10 bg-gamefiDark-500 p-1 grid place-items-center font-bold transition ease-in-out delay-150', {
      'cursor-pointer': currentPage !== p,
      [styles['page-active']]: currentPage === p
    })}
    onClick={() => handleChangePage(p)}
  >
    {p}
  </div>)
  const renderEmptyPage = (k: any) => (<div
    key={k}
    className={clsx('page w-10 h-10 p-1 grid place-items-center font-bold bg-transparent tracking-widest')}
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
    <div>
      <div className={clsx(styles.pages)}>
        <div
          className={clsx('page rounded w-10 h-10 bg-gamefiDark-500 p-1 grid place-items-center font-bold transition ease-in-out delay-150', {
            'cursor-pointer': currentPage !== 1
          })}
          onClick={() => (currentPage - 1 > 0) && handleChangePage(currentPage - 1)}
        >
          <svg className='w-5 h-5' focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill='#fff'><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
        </div>
        {renderPage()}
        <div
          className={clsx('page rounded w-10 h-10 bg-gamefiDark-500 p-1 grid place-items-center font-bold transition ease-in-out delay-150', {
            'cursor-pointer': currentPage !== totalPage
          })}
          onClick={() => (currentPage + 1 <= totalPage) && handleChangePage(currentPage + 1)}
        >
          <svg className='w-5 h-5' focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill='#fff'><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
        </div>
      </div>
    </div>
  )
}

export default Pagination
