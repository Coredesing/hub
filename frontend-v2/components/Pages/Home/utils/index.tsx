import { useMediaQuery } from 'react-responsive'

export const useScreens = () => {
  const screens = {
    mobile: useMediaQuery({ maxWidth: '640px' }),
    tablet: useMediaQuery({ minWidth: '641px', maxWidth: '960px' }),
    md: useMediaQuery({ minWidth: '961px', maxWidth: '1279px' }),
    lg: useMediaQuery({ minWidth: '1280px', maxWidth: '1535px' }),
    xl: useMediaQuery({ minWidth: '1536px' }),
    '2xl': useMediaQuery({ minWidth: '1920px' })
  }
  return screens
}

export const prettyPrice = (input: any) => {
  const price = parseFloat(input)

  if (!price || price === 0) {
    return 'N/A'
  }

  if (price / Math.pow(10, 9) > 1) {
    return `$${(price / Math.pow(10, 9)).toFixed(1)}B`
  }

  if (price / Math.pow(10, 6) > 1) {
    return `$${(price / Math.pow(10, 6)).toFixed(1)}M`
  }

  if (price / Math.pow(10, 3) > 1) {
    return `$${(price / Math.pow(10, 3)).toFixed(1)}K`
  }

  return `$${price.toFixed(2)}`
}

export const priceChange = (input) => {
  const rate = parseFloat(input)
  if (rate >= 0) {
    return <div className="flex items-center text-sm">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1834_4014)">
          <path d="M3.99953 1C3.83653 1 3.68353 1.0795 3.59003 1.2135L0.0900328 6.2135C-0.0169672 6.366 -0.0289672 6.5655 0.0560328 6.731C0.142533 6.8965 0.313033 7 0.499533 7H7.50003C7.68653 7 7.85753 6.8965 7.94353 6.731C8.02853 6.5655 8.01653 6.366 7.90953 6.2135L4.40953 1.2135C4.31653 1.0795 4.16353 1 4.00053 1C4.00003 1 4.00003 1 3.99953 1C4.00003 1 4.00003 1 3.99953 1Z" fill="#6CDB00"/>
        </g>
        <defs>
          <clipPath id="clip0_1834_4014">
            <rect width="8" height="8" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      <div className="ml-1 text-gamefiGreen-700">{rate.toFixed(2)}%</div>
    </div>
  }

  return <div className="flex items-center text-sm">
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1834_4034)">
        <path d="M4.00047 7C4.16347 7 4.31647 6.9205 4.40997 6.7865L7.90997 1.7865C8.01697 1.634 8.02897 1.4345 7.94397 1.269C7.85747 1.1035 7.68697 1 7.50047 1L0.499967 0.999999C0.313467 0.999999 0.142467 1.1035 0.0564666 1.269C-0.0285334 1.4345 -0.0165334 1.634 0.0904665 1.7865L3.59047 6.7865C3.68347 6.9205 3.83647 7 3.99947 7C3.99997 7 3.99997 7 4.00047 7C3.99997 7 3.99997 7 4.00047 7Z" fill="#DE4343"/>
      </g>
      <defs>
        <clipPath id="clip0_1834_4034">
          <rect width="8" height="8" fill="white" transform="translate(8 8) rotate(-180)"/>
        </clipPath>
      </defs>
    </svg>

    <div className="ml-1 text-gamefiRed">{ Math.abs(rate).toFixed(2)}%</div>
  </div>
}

export const priceChangeTag = (input) => {
  const rate = parseFloat(input)
  if (rate >= 0) {
    return <div className="flex items-center text-sm bg-gamefiGreen-700 rounded-sm px-2">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1834_4014)">
          <path d="M3.99953 1C3.83653 1 3.68353 1.0795 3.59003 1.2135L0.0900328 6.2135C-0.0169672 6.366 -0.0289672 6.5655 0.0560328 6.731C0.142533 6.8965 0.313033 7 0.499533 7H7.50003C7.68653 7 7.85753 6.8965 7.94353 6.731C8.02853 6.5655 8.01653 6.366 7.90953 6.2135L4.40953 1.2135C4.31653 1.0795 4.16353 1 4.00053 1C4.00003 1 4.00003 1 3.99953 1C4.00003 1 4.00003 1 3.99953 1Z" fill="#000000"/>
        </g>
        <defs>
          <clipPath id="clip0_1834_4014">
            <rect width="8" height="8" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      <div className="ml-1 text-black">{rate.toFixed(2)}%</div>
    </div>
  }

  return <div className="flex items-center text-sm bg-gamefiRed rounded-sm px-2">
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1834_4034)">
        <path d="M4.00047 7C4.16347 7 4.31647 6.9205 4.40997 6.7865L7.90997 1.7865C8.01697 1.634 8.02897 1.4345 7.94397 1.269C7.85747 1.1035 7.68697 1 7.50047 1L0.499967 0.999999C0.313467 0.999999 0.142467 1.1035 0.0564666 1.269C-0.0285334 1.4345 -0.0165334 1.634 0.0904665 1.7865L3.59047 6.7865C3.68347 6.9205 3.83647 7 3.99947 7C3.99997 7 3.99997 7 4.00047 7C3.99997 7 3.99997 7 4.00047 7Z" fill="#FFFFFF"/>
      </g>
      <defs>
        <clipPath id="clip0_1834_4034">
          <rect width="8" height="8" fill="white" transform="translate(8 8) rotate(-180)"/>
        </clipPath>
      </defs>
    </svg>

    <div className="ml-1">{ Math.abs(rate).toFixed(2)}%</div>
  </div>
}
