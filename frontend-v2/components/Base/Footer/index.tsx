import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return <div className="w-full" style={{ backgroundColor: '#0E0F14', fontFamily: 'Poppins' }}>
    <div className="md:container px-4 text-center lg:text-left lg:px-16 mx-auto lg:block py-20">
      <div className="flex flex-col align-middle items-center justify-center lg:grid lg:grid-cols-5 lg:gap-2 zl:gap-4">
        <div className="col-span-2 flex flex-col items-center lg:block">
          <Image src={require('assets/images/gamefi-full.svg')} alt="gamefi"></Image>
          <div className="mt-8 font-thin text-sm">From the labs behind Red Kite launchpad and several NFT games</div>
          <div className="flex mt-6">
            <div className="mr-3 cursor-pointer">
              <Link href="#" passHref>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="white"/>
                </svg>
              </Link>
            </div>
            <div className="mr-3 cursor-pointer">
              <Link href="#" passHref>
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
              </Link>
            </div>
            <div className="mr-3 cursor-pointer">
              <Link href="#" passHref>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 3C15.4 3.3 14.8 3.4 14.1 3.5C14.8 3.1 15.3 2.5 15.5 1.7C14.9 2.1 14.2 2.3 13.4 2.5C12.8 1.9 11.9 1.5 11 1.5C9.3 1.5 7.8 3 7.8 4.8C7.8 5.1 7.8 5.3 7.9 5.5C5.2 5.4 2.7 4.1 1.1 2.1C0.8 2.6 0.7 3.1 0.7 3.8C0.7 4.9 1.3 5.9 2.2 6.5C1.7 6.5 1.2 6.3 0.7 6.1C0.7 7.7 1.8 9 3.3 9.3C3 9.4 2.7 9.4 2.4 9.4C2.2 9.4 2 9.4 1.8 9.3C2.2 10.6 3.4 11.6 4.9 11.6C3.8 12.5 2.4 13 0.8 13C0.5 13 0.3 13 0 13C1.5 13.9 3.2 14.5 5 14.5C11 14.5 14.3 9.5 14.3 5.2C14.3 5.1 14.3 4.9 14.3 4.8C15 4.3 15.6 3.7 16 3Z" fill="white"/>
                </svg>

              </Link>
            </div>
            <div className="cursor-pointer">
              <Link href="#" passHref>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="white"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center lg:text-left mt-8 lg:mt-0">
          <div className="text-sm uppercase text-white opacity-50">Our Team</div>
          <div className="mt-3 lg:mt-8 flex flex-col text-xs leading-7 font-extralight">
            <Link href="#" passHref><a className="hover:underline cursor-pointer">Features</a></Link>
            <Link href="#" passHref><a className="hover:underline cursor-pointer">Roadmap</a></Link>
            <Link href="#" passHref><a className="hover:underline cursor-pointer">Our Team</a></Link>
            <Link href="#" passHref><a className="hover:underline cursor-pointer">Advisors</a></Link>
          </div>
        </div>
        <div className="text-center lg:text-left mt-8 lg:mt-0">
          <div className="text-sm uppercase text-white opacity-50">Token</div>
          <div className="mt-3 lg:mt-8 flex flex-col text-xs leading-7 font-extralight">
            <Link href="#" passHref><a className="hover:underline cursor-pointer">Token Metrics</a></Link>
            <Link href="#" passHref><a className="hover:underline cursor-pointer">Token Utilities</a></Link>
          </div>
        </div>
        <div className="text-center lg:text-left mt-8 lg:mt-0">
          <div className="text-sm uppercase text-white opacity-50">Contact</div>
          <div className="mt-3 lg:mt-8 flex flex-col text-xs leading-7 font-extralight">
            <Link href="#" passHref><a className="hover:underline cursor-pointer">Contact Us</a></Link>
          </div>
        </div>
      </div>
    </div>
    <div className="md:container md:px-4 lg:px-16 mx-auto lg:block">
      <div className="flex align-middle items-center justify-center text-xs font-light pt-6 pb-8 border-t border-gray-700">
        &#169; Icetea Labs, 2021
      </div>
    </div>
  </div>
}

export default Footer
