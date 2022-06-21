import React from 'react'

const STARS = [1, 2, 3, 4, 5]

function Star ({ hightLight }) {
  return (
    <svg className='w-6 h-6 md:w-8 md:h-8' viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path stroke="#FFB800" fill={hightLight ? '#FFB800' : ''} strokeMiterlimit="10" d="M29.2942 10.5997L21.1716 9.4212L17.5937 1.95751C16.9168 0.680829 14.8862 0.680829 14.2093 1.95751L10.6314 9.4212L2.60546 10.5997C1.05828 10.7961 0.478091 12.7602 1.54177 13.8405L7.44038 19.6347L6.0866 27.7858C5.79651 29.3571 7.44038 30.5356 8.79416 29.7499L16.0466 25.9199L23.2989 29.7499C24.6527 30.4374 26.2966 29.2589 26.0065 27.7858L24.6527 19.6347L30.5513 13.8405C31.5183 12.7602 30.8414 10.8943 29.2942 10.5997Z" />
    </svg>

  )
}
export default function RateAction ({ rate, callBack, disabled }) {
  return (
    <div className='flex gap-3 py-4 md:py-0'>
      {STARS.map(v => (
        <button key={`RateAction-${v}`} onClick={callBack(v)} disabled={disabled} className="disabled:cursor-not-allowed">
          <Star hightLight={rate >= v} />
        </button>
      ))}
    </div>
  )
}
