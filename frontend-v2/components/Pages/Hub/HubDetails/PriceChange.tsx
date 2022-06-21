export const PriceChangeBg = ({ priceChange24h, className }: { priceChange24h: string; className: string }) => {
  if (!priceChange24h) {
    return null
  }
  const priceChange = parseFloat(priceChange24h)

  return <span className={`${className} ${(priceChange > 0 || priceChange < 0) ? 'visible' : 'invisible'} inline-flex items-center px-2 rounded ${priceChange > 0 ? 'bg-gamefiGreen-500 text-gamefiDark-800' : 'bg-red-500'}`}>
    {priceChange > 0
      ? <svg className="inline w-2 h-2 mr-1" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.99965 0.75C2.8774 0.75 2.76265 0.809625 2.69252 0.910125L0.0675246 4.66013C-0.0127254 4.7745 -0.0217254 4.92413 0.0420246 5.04825C0.1069 5.17237 0.234775 5.25 0.37465 5.25H5.62503C5.7649 5.25 5.89315 5.17237 5.95765 5.04825C6.0214 4.92413 6.0124 4.7745 5.93215 4.66013L3.30715 0.910125C3.2374 0.809625 3.12265 0.75 3.0004 0.75C3.00003 0.75 3.00002 0.75 2.99965 0.75C3.00002 0.75 3.00002 0.75 2.99965 0.75Z" fill="currentColor" />
      </svg>
      : <svg className="inline w-2 h-2 mr-1" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.00035 5.25C3.1226 5.25 3.23735 5.19037 3.30748 5.08987L5.93248 1.33987C6.01273 1.2255 6.02173 1.07587 5.95798 0.95175C5.8931 0.827625 5.76523 0.75 5.62535 0.75L0.374975 0.75C0.2351 0.749999 0.10685 0.827625 0.0423502 0.951749C-0.0213996 1.07587 -0.0123998 1.2255 0.06785 1.33987L2.69285 5.08987C2.7626 5.19037 2.87735 5.25 2.9996 5.25C2.99997 5.25 2.99998 5.25 3.00035 5.25C2.99998 5.25 2.99998 5.25 3.00035 5.25Z" fill="currentColor" />
      </svg>
    }
    {Math.abs(priceChange).toFixed(2)}%
  </span>
}

export const PriceChange = ({ priceChange24h, className }: { priceChange24h: string; className: string }) => {
  if (!priceChange24h) {
    return null
  }
  const priceChange = parseFloat(priceChange24h)

  return <span className={`${className} inline-flex items-center px-2 rounded ${priceChange >= 0 ? 'text-gamefiGreen-500' : 'text-red-500'}`}>
    {priceChange >= 0
      ? <svg className="inline w-2 h-2" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.99965 0.75C2.8774 0.75 2.76265 0.809625 2.69252 0.910125L0.0675246 4.66013C-0.0127254 4.7745 -0.0217254 4.92413 0.0420246 5.04825C0.1069 5.17237 0.234775 5.25 0.37465 5.25H5.62503C5.7649 5.25 5.89315 5.17237 5.95765 5.04825C6.0214 4.92413 6.0124 4.7745 5.93215 4.66013L3.30715 0.910125C3.2374 0.809625 3.12265 0.75 3.0004 0.75C3.00003 0.75 3.00002 0.75 2.99965 0.75C3.00002 0.75 3.00002 0.75 2.99965 0.75Z" fill="currentColor" />
      </svg>
      : <svg className="inline w-2 h-2" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.00035 5.25C3.1226 5.25 3.23735 5.19037 3.30748 5.08987L5.93248 1.33987C6.01273 1.2255 6.02173 1.07587 5.95798 0.95175C5.8931 0.827625 5.76523 0.75 5.62535 0.75L0.374975 0.75C0.2351 0.749999 0.10685 0.827625 0.0423502 0.951749C-0.0213996 1.07587 -0.0123998 1.2255 0.06785 1.33987L2.69285 5.08987C2.7626 5.19037 2.87735 5.25 2.9996 5.25C2.99997 5.25 2.99998 5.25 3.00035 5.25C2.99998 5.25 2.99998 5.25 3.00035 5.25Z" fill="currentColor" />
      </svg>
    }
    {Math.abs(priceChange).toFixed(2)}%
  </span>
}
