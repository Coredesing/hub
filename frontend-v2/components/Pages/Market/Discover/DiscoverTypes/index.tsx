import React, { useCallback } from 'react'

type DiscoverType = 'items' | 'activities'

type Props = {
  onChange: (type: DiscoverType) => any;
  currentType: string;
}

const DiscoverTypes = ({ onChange, currentType }: Props) => {
  const handleChangeType = useCallback((type: DiscoverType) => {
    if (currentType === type) return
    onChange(type)
  }, [currentType, onChange])

  return (
    <div className="sm:flex grid grid-cols-2 sm:w-auto w-full">
      <div className="relative w-ful" style={{ marginRight: '-6px' }}>
        <button
          style={{
            minWidth: '120px',
            clipPath: 'polygon(0 0, calc(100% - 9px) 0, 100% 100%, 9px 100%, 0 calc(100% - 9px))'
          }}
          className={`w-full h-10 rounded-sm flex items-center justify-center pr-2 font-semibold uppercase ${currentType === 'items' ? 'text-black bg-gamefiGreen-700' : 'text-white bg-gamefiDark-600/80'}`}
          onClick={() => handleChangeType('items')}
        >Items
        </button>
        {/* <svg width="142" height="38" viewBox="0 0 142 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 2C0 0.89543 0.895431 0 2 0H66H130.458C131.367 0 132.161 0.612387 132.392 1.49101L142 38H8.82843C8.298 38 7.78929 37.7893 7.41421 37.4142L0.585786 30.5858C0.210713 30.2107 0 29.702 0 29.1716V2Z" fill={currentType === 'items' ? '#6CDB00' : '#242732'} />
        </svg> */}
      </div>
      <div className="relative w-full">
        <button
          style={{ minWidth: '120px', clipPath: 'polygon(0 0, calc(100% - 9px) 0px, 100% 9px, 100% 100%, 9px 100%)' }}
          className={`w-full h-10 rounded-sm flex items-center justify-center pr-2 font-semibold uppercase ${currentType === 'activities' ? 'text-black bg-gamefiGreen-700' : 'text-white bg-gamefiDark-600/80'}`}
          onClick={() => handleChangeType('activities')}
        >Activities</button>
        {/* <svg width="142" height="38" viewBox="0 0 142 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H133.172C133.702 0 134.211 0.210714 134.586 0.585786L141.414 7.41421C141.789 7.78929 142 8.29799 142 8.82843V36C142 37.1046 141.105 38 140 38H11.5418C10.6332 38 9.83885 37.3876 9.60763 36.509L0 0Z" fill={currentType === 'activities' ? '#6CDB00' : '#242732'} />
        </svg> */}
      </div>
    </div>
  )
}

export default DiscoverTypes
