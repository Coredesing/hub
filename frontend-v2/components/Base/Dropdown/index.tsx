import { ObjectType } from '@/utils/types'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import styles from './Dropdown.module.scss'

type Item = {
  key: any;
  label: string;
  value: any;
} | ObjectType;
type Props = {
  items?: Array<Item>;
  selected?: Item;
  onChange?: any;
  propLabel?: string;
  propValue?: string;
  propIcon?: string;
  isFilter?: boolean;
  children?: ReactNode;
  classes?: {
    wrapperDropdown?: string;
  };
  isShow?: boolean;
  onHandleFilter?: (show?: boolean) => any
}
const Dropdown = ({ items, selected, onChange, propLabel, propValue, isFilter, children, classes, propIcon, isShow, onHandleFilter }: Props) => {
  const isSmScreen = useMediaQuery({ maxWidth: '640px' })
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)

  // const getSelectedItem = (value: any) => {
  //   return items.find(item => item.value === value)
  // }

  const handleClickOutside = (e: any) => {
    if (show === true && wrapperRef.current && !wrapperRef.current.contains(e?.target)) {
      onHandleFilter && onHandleFilter(false)
      setShow(false)
    }
  }

  useEffect(() => {
    window && window.addEventListener('click', handleClickOutside)

    return () => {
      window && window.removeEventListener('click', handleClickOutside)
    }
  })

  useEffect(() => {
    if (typeof isShow === 'boolean') {
      setShow(isShow)
    }
  }, [isShow])
  const handleShowFilter = () => {
    if (onHandleFilter) {
      onHandleFilter(!show)
    } else {
      setShow(!show)
    }
  }

  const availableOptions = () => {
    return items?.filter(item => (item[propValue] || item.value) !== (selected?.[propValue] || selected?.value))
  }

  const handleChangeFilter = (item: Item) => {
    onChange && onChange(item)
    setShow(false)
  }

  return (
    <div className={`relative inline-block text-sm border border-transparent ${classes?.wrapperDropdown || ''}`}>
      <div className={`absolute left-0 mt-2 rounded-r ${show ? 'bg-gamefiGreen-700' : 'bg-gamefiDark-300'}`} style={{ width: '2px', height: '20px' }}></div>
      {
        !isFilter
          ? <button className={`${styles.button} flex align-middle justify-between items-center bg-gamefiDark-650 text-white font-bold uppercase px-4 rounded mr-2 w-full`} onClick={() => setShow(!show)}>
            <span className='flex items-center gap-2'>
              {propIcon && selected?.[propIcon] && <img src={selected?.[propIcon]} width='18px' height='18px' />}
              {selected?.[propLabel] || selected?.label || 'Select Item'}
            </span>
            <svg className="ml-2" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 4.5L8 12L0.5 4.5" stroke="#ffffff" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          : <button className={`${styles.button} flex align-middle items-center bg-gamefiDark-650 text-white font-bold uppercase px-4 h-9 rounded`} onClick={handleShowFilter}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.9084 1.48387C14.7596 1.18725 14.4569 1 14.1252 1H1.87476C1.54313 1 1.24036 1.18725 1.09161 1.48387C0.944602 1.7805 0.976103 2.13488 1.17474 2.4L6.24993 9.16638V14.125C6.24993 14.6089 6.64107 15 7.12497 15H8.87503C9.35893 15 9.75007 14.6089 9.75007 14.125V9.16638L14.8253 2.4C15.0239 2.13488 15.0554 1.7805 14.9084 1.48387Z" fill="white" />
            </svg>
          </button>
      }
      {show
        ? <div ref={wrapperRef} className={`origin-top-right right-0 absolute mt-2 z-10 rounded-sm py-1 shadow-lg focus:outline-none text-base ${!isFilter && 'bg-gamefiDark-650 w-40'}`}>
          {isFilter
            ? <div className="right-0 top-0">
              <svg width={isSmScreen ? "320" : "526"} height={isSmScreen ? "400" : "377"} viewBox={`0 0 ${isSmScreen ? '320 400' : '526 377'}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-inside-1_964_15152" fill="white">
                  <path fillRule="evenodd" clipRule="evenodd" d="M101.5 0H526V39V375C526 376.105 525.105 377 524 377H2.00001C0.89544 377 0 376.105 0 375V39V15H89L101.5 0Z" />
                </mask>
                <path fillRule="evenodd" clipRule="evenodd" d="M101.5 0H526V39V375C526 376.105 525.105 377 524 377H2.00001C0.89544 377 0 376.105 0 375V39V15H89L101.5 0Z" fill="#27272D" />
                <path d="M526 0H527V-1H526V0ZM101.5 0V-1H101.032L100.732 -0.640184L101.5 0ZM0 15V14H-1V15H0ZM89 15V16H89.4684L89.7682 15.6402L89 15ZM526 -1H101.5V1H526V-1ZM527 39V0H525V39H527ZM527 375V39H525V375H527ZM524 378C525.657 378 527 376.657 527 375H525C525 375.552 524.552 376 524 376V378ZM2.00001 378H524V376H2.00001V378ZM-1 375C-1 376.657 0.343166 378 2.00001 378V376C1.44771 376 1 375.552 1 375H-1ZM-1 39V375H1V39H-1ZM-1 15V39H1V15H-1ZM89 14H0V16H89V14ZM100.732 -0.640184L88.2318 14.3598L89.7682 15.6402L102.268 0.640184L100.732 -0.640184Z" fill="#44454B" mask="url(#path-1-inside-1_964_15152)" />
              </svg>
              <div className="absolute top-0 left-0 z-10 w-full h-full py-10 px-5">{children}</div>
            </div>
            : <div className="w-full">
              {
                availableOptions() && availableOptions().length
                  ? availableOptions().map(item =>
                    <button key={item[propValue] || item.value} onClick={() => handleChangeFilter(item)} className="cursor-pointer hover:bg-gamefiDark-600 px-4 py-1 w-full text-left text-sm flex items-center gap-2">
                      {propIcon && <img src={item[propIcon]} width='16px' height='16px' />}
                      {item[propLabel] || item.label}
                    </button>
                  )
                  : <></>
              }
            </div>
          }
        </div>
        : <></>}
    </div>
  )
}

export default Dropdown
