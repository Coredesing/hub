import React from 'react'
import Image from 'next/image'
import { prettyPrice, priceChange, priceChangeTag } from '../utils'

const GameFiPerformance = ({ item } : { item: any }) => {
  return (
    <>
      <div className="container">
        <div className="relative w-full px-6 py-5 bg-gamefiDark-800 rounded-sm">
          <div className="w-full flex items-center justify-end">
            <div className="mr-6 cursor-pointer">
              <a href="https://t.me/GameFi_Official" target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1424_6166)">
                    <path d="M15.9683 1.68422C15.9557 1.62517 15.9276 1.57057 15.8868 1.52608C15.846 1.48158 15.794 1.44883 15.7363 1.43122C15.526 1.3893 15.3084 1.40484 15.1063 1.47622C15.1063 1.47622 1.08725 6.51422 0.286252 7.07222C0.114252 7.19322 0.056252 7.26222 0.027252 7.34422C-0.110748 7.74422 0.320252 7.91722 0.320252 7.91722L3.93325 9.09422C3.99426 9.10522 4.05701 9.10145 4.11625 9.08322C4.93825 8.56422 12.3863 3.86122 12.8163 3.70322C12.8843 3.68322 12.9343 3.70322 12.9163 3.75222C12.7443 4.35222 6.31025 10.0712 6.27525 10.1062C6.25818 10.1205 6.2448 10.1387 6.23627 10.1592C6.22774 10.1798 6.2243 10.2021 6.22625 10.2242L5.88925 13.7522C5.88925 13.7522 5.74725 14.8522 6.84525 13.7522C7.62425 12.9732 8.37225 12.3272 8.74525 12.0142C9.98725 12.8722 11.3243 13.8202 11.9013 14.3142C11.9979 14.4083 12.1125 14.4819 12.2383 14.5305C12.3641 14.5792 12.4985 14.6018 12.6333 14.5972C12.7992 14.5767 12.955 14.5062 13.0801 14.3952C13.2051 14.2841 13.2934 14.1376 13.3333 13.9752C13.3333 13.9752 15.8943 3.70022 15.9793 2.31722C15.9873 2.18222 16.0003 2.10022 16.0003 2.00022C16.0039 1.89392 15.9931 1.78762 15.9683 1.68422Z" fill="white"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1424_6166">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
            <div className="mr-6 cursor-pointer">
              <a href="https://twitter.com/GameFi_Official" target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 3C15.4 3.3 14.8 3.4 14.1 3.5C14.8 3.1 15.3 2.5 15.5 1.7C14.9 2.1 14.2 2.3 13.4 2.5C12.8 1.9 11.9 1.5 11 1.5C9.3 1.5 7.8 3 7.8 4.8C7.8 5.1 7.8 5.3 7.9 5.5C5.2 5.4 2.7 4.1 1.1 2.1C0.8 2.6 0.7 3.1 0.7 3.8C0.7 4.9 1.3 5.9 2.2 6.5C1.7 6.5 1.2 6.3 0.7 6.1C0.7 7.7 1.8 9 3.3 9.3C3 9.4 2.7 9.4 2.4 9.4C2.2 9.4 2 9.4 1.8 9.3C2.2 10.6 3.4 11.6 4.9 11.6C3.8 12.5 2.4 13 0.8 13C0.5 13 0.3 13 0 13C1.5 13.9 3.2 14.5 5 14.5C11 14.5 14.3 9.5 14.3 5.2C14.3 5.1 14.3 4.9 14.3 4.8C15 4.3 15.6 3.7 16 3Z" fill="white"/>
                </svg>
              </a>
            </div>
            <div className="mr-6 cursor-pointer">
              <a href="https://discord.com/invite/gamefi" target="_blank" rel="noreferrer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.8352 13.8052C12.8352 13.8052 12.3451 13.213 11.9367 12.7025C12.9235 12.4702 13.7964 11.8963 14.4009 11.0824C13.911 11.4084 13.3858 11.6778 12.8352 11.8856C12.2019 12.156 11.5395 12.3524 10.8611 12.471C9.69515 12.6859 8.49931 12.6813 7.33501 12.4574C6.65146 12.3237 5.98156 12.1277 5.33369 11.872C4.78846 11.662 4.26799 11.3926 3.78165 11.0687C4.36427 11.8656 5.20701 12.4339 6.16417 12.6752C5.75574 13.1858 5.252 13.8052 5.252 13.8052C4.44327 13.8271 3.64157 13.6498 2.91748 13.2889C2.19338 12.928 1.56911 12.3947 1.09961 11.7359C1.14379 8.97582 1.81414 6.26185 3.06008 3.79865C4.15652 2.93752 5.49326 2.43803 6.88573 2.36914L7.02188 2.53932C5.71427 2.86462 4.4942 3.47349 3.4481 4.32281C3.4481 4.32281 3.74761 4.15263 4.25135 3.92799C5.23036 3.48363 6.27333 3.19647 7.34182 3.07709C7.41803 3.06131 7.49547 3.0522 7.57326 3.04986C8.48253 2.92474 9.4035 2.90875 10.3166 3.00221C11.7547 3.16645 13.1468 3.61045 14.4145 4.30919C13.419 3.5018 12.2636 2.9148 11.0245 2.58697L11.2151 2.36914C12.6076 2.43803 13.9443 2.93752 15.0408 3.79865C16.2867 6.26185 16.9571 8.97582 17.0012 11.7359C16.5279 12.3941 15.901 12.9267 15.1749 13.2873C14.4489 13.648 13.6457 13.8258 12.8352 13.8052ZM5.51177 7.93044C5.76964 7.65048 6.12338 7.47774 6.50272 7.44654C6.69355 7.4533 6.88113 7.4979 7.05457 7.57776C7.22802 7.65763 7.38386 7.77116 7.51306 7.91175C7.64226 8.05235 7.74224 8.21722 7.80718 8.39678C7.87213 8.57634 7.90075 8.76702 7.89139 8.95774C7.89961 9.14818 7.87019 9.33839 7.80482 9.51745C7.73945 9.69652 7.63941 9.86094 7.51043 10.0013C7.38145 10.1417 7.22605 10.2552 7.05314 10.3355C6.88023 10.4157 6.69319 10.4611 6.50272 10.4689C6.12338 10.4377 5.76964 10.265 5.51177 9.98503C5.25389 9.70507 5.11074 9.33836 5.11074 8.95774C5.11074 8.57711 5.25389 8.2104 5.51177 7.93044ZM10.5971 7.63804C10.8628 7.48758 11.1677 7.42084 11.472 7.44654C11.6624 7.45441 11.8495 7.49977 12.0224 7.58001C12.1953 7.66026 12.3507 7.77381 12.4797 7.91417C12.6087 8.05453 12.7087 8.21895 12.7741 8.39802C12.8394 8.57709 12.8689 8.76729 12.8607 8.95774C12.8606 9.26306 12.7684 9.56126 12.596 9.81331C12.4237 10.0654 12.1793 10.2595 11.8948 10.3703C11.6103 10.4812 11.2989 10.5035 11.0015 10.4345C10.7041 10.3655 10.4344 10.2083 10.2278 9.98343C10.0213 9.75861 9.88735 9.47665 9.84365 9.17447C9.79995 8.87228 9.8485 8.56394 9.98294 8.28981C10.1174 8.01567 10.3315 7.78851 10.5971 7.63804Z" fill="white"/>
                </svg>
              </a>
            </div>
            <div className="mr-6 cursor-pointer">
              <a href="https://medium.com/gamefi-official" target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="white"/>
                </svg>
              </a>
            </div>
            <div className="cursor-pointer">
              <a href="https://www.facebook.com/GameFi.org/" target="_blank" rel="noreferrer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.01972 15.3334L5.9987 8.66675H3.33203V6.00008H5.9987V4.33341C5.9987 1.85915 7.53091 0.666748 9.73812 0.666748C10.7954 0.666748 11.7041 0.745461 11.9689 0.780648V3.3664L10.4381 3.36709C9.23766 3.36709 9.00524 3.93751 9.00524 4.77455V6.00008H12.4987L11.1654 8.66675H9.00524V15.3334H6.01972Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/11783.png" width="60" height="60" alt=""></img>
            <div className="ml-3 uppercase text-xl font-bold">GameFi</div>
          </div>
          <div className="mt-6 flex" style={{
            background: 'linear-gradient(91.27deg, rgba(255, 255, 255, 0.03) 37.59%, rgba(255, 255, 255, 0) 101.09%)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div className="px-2 md:px-6 py-1 md:py-4 flex flex-col justify-center border-r border-gamefiDark-600 pr-10 md:pr-14">
              <div className="uppercase text-xs text-white opacity-50 font-semibold">Current Price</div>
              <div className="flex items-center mt-2">
                <div className="uppercase text-2xl font-bold mr-4">${parseFloat(item?.price).toFixed(3)}</div>
                {priceChangeTag(item?.price_change_24h || 0)}
              </div>
            </div>
            <div className="w-full md:grid md:grid-cols-2 xl:grid-cols-3 gap-20 py-4 px-6 font-casual" style={{ maxWidth: '800px' }}>

              <div className="w-full flex flex-col justify-between">
                <div className="w-full flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-white opacity-50 text-xs">Market Cap:</div>
                  <div className="text-sm font-medium">{prettyPrice(item?.market_cap)}</div>
                </div>
                <div className="w-full mt-4 sm:mt-0 flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-white opacity-50 text-xs">Vol (24h):</div>
                  <div className="flex">
                    <div className="mr-2 text-sm font-medium">{prettyPrice(item?.volume_24h || 0)}</div>
                    {priceChange(item?.volume_change_24h || 0)}
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col justify-between">
                <div className="w-full mt-4 sm:mt-0 flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-white opacity-50 text-xs">Raised:</div>
                  <div className="text-sm font-medium">{item?.raised}</div>
                </div>
                <div className="w-full mt-4 sm:mt-0 flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-white opacity-50 text-xs">IGO Price:</div>
                  <div className="flex">
                    <div className="mr-2 text-sm font-medium">${item?.ido_price}</div>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col justify-between">
                <div className="w-full mt-4 sm:mt-0 flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-white opacity-50 text-xs">IGO ROI:</div>
                  <div className="text-sm font-medium">{parseFloat(item.ido_roi).toFixed(2)}x</div>
                </div>
                <div className="w-full mt-4 sm:mt-0 flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-white opacity-50 text-xs">Native Token:</div>
                  <div className="flex">
                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/11783.png" width="24" height="24" alt=""></img>
                    <div className="ml-2 text-sm font-medium">GAFI</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-5 h-5 bg-gamefiDark-900" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute right-0 bottom-0 w-4 h-4 bg-gamefiGreen-700 rounded-sm" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}></div>
        </div>
      </div>
    </>
  )
}

export default GameFiPerformance