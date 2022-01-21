import React, { useEffect, useRef, useState } from 'react'

type Item = {
  key: any,
  label: string,
  value: any
}
type Props = {
  items?: Array<Item>,
  selected?: any,
  onChange?: any
}
const FilterDropdown = ({ items, selected, onChange }: Props) => {
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)

  const getSelectedItem = (value: any) => {
    return items.find(item => item.value === value)
  }

  const handleClickOutside = (e: any) => {
    if (show === true && wrapperRef.current && !wrapperRef.current.contains(e?.target)) {
      setShow(false)
    }
  }

  useEffect(() => {
    window && window.addEventListener('click', handleClickOutside)

    return () => {
      window && window.removeEventListener('click', handleClickOutside)
    }
  })

  const availableOptions = () => {
    return items?.filter(item => item.value !== selected)
  }

  const handleChangeFilter = (item: Item) => {
    onChange(item)
    setShow(false)
  }

  return (
    <div className="relative inline-block text-left">
      <button className="flex align-middle items-center text-gamefiGreen font-bold uppercase" onClick={() => setShow(!show)}>
        {getSelectedItem(selected)?.label}
        <svg className="ml-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 4.5L8 12L0.5 4.5" stroke="#6CDB00" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {show
        ? <div ref={wrapperRef} className="origin-top-left absolute mt-2 z-10 left-0 w-52 rounded-sm py-1 shadow-lg focus:outline-none text-base bg-gamefiDark-500">
          {
            availableOptions().length
              ? availableOptions().map(item =>
                <button key={item.key} onClick={() => handleChangeFilter(item)} className="cursor-pointer hover:bg-gamefiDark-600 px-4 py-1 w-full text-left">{item.label}</button>
              )
              : <></>
          }
        </div>
        : <></>}
    </div>
  )
}

export default FilterDropdown
