import { useEffect, useState } from 'react'
import { checkProfane } from '@/utils'

export const MIN_LENGTH_PROS_CONS = 5

const ReviewCreateProsAndCons = ({ data, title, onChange, currentResource }) => {
  const [showButton, setShowButton] = useState(false)
  const [prosAndConsPlaceholder, setProsAndConsPlaceholder] = useState('')

  const addMore = () => {
    onChange([...data, ''])
  }

  const handleChangeText = (i: number) => (e: any) => {
    const newData = [...data]
    newData[i] = e.target.value
    onChange(newData)
  }

  const handleClear = (i: number) => () => {
    const newData = [...data]
    if (i === 0 && data.length === 1) {
      newData[i] = ''
    } else {
      newData.splice(i, 1)
    }
    onChange(newData)
  }

  const handleShowCloseButton = (value: boolean) => () => {
    setShowButton(value)
  }

  const handleValidateText = (value: string) => {
    const badWord = checkProfane(value).listText.join(', ')
    return badWord ? `Please remove profane word: ${badWord}` : ''
  }
  useEffect(() => {
    if (title === 'pros') {
      setProsAndConsPlaceholder('What you like about ' + (currentResource === 'guild' ? 'guild' : 'game'))
    } else {
      setProsAndConsPlaceholder('What the ' + (currentResource === 'guild' ? 'guild' : 'game') + ' should be improve')
    }
  }, [title, currentResource])

  return (
    <div className="mb-9">
      <div className="font-bold text-base uppercase mb-6">add {title}</div>
      {data?.map((v, i) => (
        <div
          className="flex items-center font-mechanic pb-3"
          onMouseEnter={handleShowCloseButton(true)}
          onMouseLeave={handleShowCloseButton(false)}
          key={`${title}-${i}`}
        >
          <div className="font-semibold text-white/50 text-sm w-5">{+i + 1}.</div>
          <div className="flex-1 relative">
            <input
              value={v}
              maxLength={100}
              autoComplete="off"
              minLength={MIN_LENGTH_PROS_CONS}
              className=" bg-[#303035] border border-[#3C3C42] placeholder-white placeholder-size-[26px] placeholder-opacity-30 font-casual text-sm rounded-sm px-4 py-2 w-full focus-visible:border-gamefiDark-350 invalid:border-gamefiRed"
              name={`${title}-${i}`}
              placeholder={prosAndConsPlaceholder}
              onChange={handleChangeText(i)}
            />
            {v?.trim() && v.trim().length < MIN_LENGTH_PROS_CONS
              ? (
                <div className="mt-2 text-normal text-red-500 ">At least 5 characters</div>
              )
              : <div className="mt-2 text-normal text-red-500 ">{handleValidateText(v)}</div>}
            {showButton && <button className="absolute right-[-11px] top-2 rounded-full p-1 bg-[#15171E] cursor-pointer" onClick={handleClear(i)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM11.5 10.1L10.1 11.5L8 9.4L5.9 11.5L4.5 10.1L6.6 8L4.5 5.9L5.9 4.5L8 6.6L10.1 4.5L11.5 5.9L9.4 8L11.5 10.1Z" fill="#53535B" className="hover:fill-[#36C40C]" />
              </svg>
            </button>}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        {data?.length <= 9 && <button
          className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-700 hover:text-gamefiGreen-200 py-2 pl-7 leading-5 font-bold text-sm"
          onClick={addMore}
        >
          Add more {title}
        </button>}
      </div>
    </div>
  )
}

export default ReviewCreateProsAndCons
