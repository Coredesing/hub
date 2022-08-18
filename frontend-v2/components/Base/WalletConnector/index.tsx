import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { networks } from '@/components/web3'
import { useMyWeb3 } from '@/components/web3/context'
import Image from 'next/image'
import Link from 'next/link'
import { useWalletContext } from './provider'
import { shorten } from '@/utils'
import { ObjectType } from '@/utils/types'
import Tippy from '@tippyjs/react/headless'
import ModalConnect from './ModalConnect'
import 'tippy.js/dist/tippy.css'

const WalletConnector = (props) => {
  const { network, account, balance, currencyNative, balanceShort } = useMyWeb3()

  const { setShowModal, tryDeactivate } = useWalletContext()

  const accountShort = useMemo(() => {
    if (!account) {
      return
    }

    return shorten(account, 10)
  }, [account])

  const btnClass = useMemo(() => {
    return props.buttonClassName || ''
  }, [props])

  return (
    <>
      {(!account) &&
        <button
          className={`uppercase overflow-hidden py-3 px-8 bg-gamefiGreen-700 text-gamefiDark-900 font-bold text-[13px] rounded-xs hover:opacity-95 cursor-pointer w-full md:w-auto rounded-sm clipped-t-r ${btnClass}`}
          onClick={() => setShowModal(true)}
        >
          Connect Wallet
        </button>
      }
      {
        account &&
        <div className="font-casual leading-6 text-sm flex items-center justify-center w-full">
          <a className="hidden sm:inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1" href="https://pancakeswap.finance/swap?outputCurrency=0x89af13a10b32f1b2f8d1588f93027f69b6f4e27e&inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56" target="_blank" rel="noreferrer">
            <span className="font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-6 rounded leading-5 uppercase font-bold text-[13px]">
              Buy $GAFI
            </span>
          </a>

          <Tippy
            render={attrs => (
              <div tabIndex={-1} {...attrs}>
                <ModalConnect close={() => setShowModal(false)} x={45} y={10} hideClose={true} bgColor="text-gamefiDark-600">
                  <div className="px-2 pt-5 pb-2 font-medium">
                    <div className="flex min-w-[15rem] items-center p-1.5 mb-1 bg-gradient-to-r via-transparent hover:from-gamefiDark-400 hover:cursor-pointer rounded-sm" onClick={() => setShowModal(true)}>
                      <svg className="w-4 h-4 mr-2.5 text-gamefiDark-200" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 0H1.5C0.7 0 0 0.7 0 1.5C0 2.3 0.7 3 1.5 3H10V0Z" fill="currentColor" />
                        <path d="M15 5H0V14C0 15.1 0.9 16 2 16H15C15.6 16 16 15.6 16 15V6C16 5.4 15.6 5 15 5ZM12.5 12C11.7 12 11 11.3 11 10.5C11 9.7 11.7 9 12.5 9C13.3 9 14 9.7 14 10.5C14 11.3 13.3 12 12.5 12Z" fill="currentColor" />
                      </svg>
                        My Wallet
                    </div>
                    <Link href="/account" passHref={true}>
                      <a className="flex min-w-[15rem] items-center p-1.5 mb-1 bg-gradient-to-r via-transparent hover:from-gamefiDark-400 hover:cursor-pointer rounded-sm">
                        <svg className="w-4 h-4 mr-2.5 text-gamefiDark-200" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#a)" fill="currentColor">
                            <path d="M8 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 13.2a1.989 1.989 0 0 0-1.163-1.818A16.654 16.654 0 0 0 8 10a16.654 16.654 0 0 0-6.837 1.382A1.99 1.99 0 0 0 0 13.2V16h16v-2.8Z" />
                          </g>
                          <defs>
                            <clipPath id="a">
                              <path fill="#fff" d="M0 0h16v16H0z" />
                            </clipPath>
                          </defs>
                        </svg>
                          My Profile
                      </a>
                    </Link>
                    <Link href="/account/rank" passHref={true}>
                      <a className="flex min-w-[15rem] items-center p-1.5 mb-1 bg-gradient-to-r via-transparent hover:from-gamefiDark-400 hover:cursor-pointer rounded-sm">
                        <svg className="w-4 h-4 mr-2.5 text-gamefiDark-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172">
                          <path d="M0,172v-172h172v172z" fill="none"></path><g fill="currentColor"><path d="M86,11.46667c-6.33287,0 -11.46667,5.1338 -11.46667,11.46667c0.00193,4.23237 2.33509,8.11953 6.06927,10.11172l-22.67578,42.51849l-30.85026,-18.15183c1.03863,-1.76086 1.58762,-3.76737 1.5901,-5.81172c0,-6.33287 -5.1338,-11.46667 -11.46667,-11.46667c-6.33287,0 -11.46667,5.1338 -11.46667,11.46667c0,6.33287 5.1338,11.46667 11.46667,11.46667c0.38161,-0.00338 0.76281,-0.0258 1.14219,-0.06719l4.59115,45.93386h17.2h74.53333h17.2h17.2l4.59114,-45.92266c0.37956,0.03765 0.76077,0.05634 1.14219,0.05599c6.33287,0 11.46667,-5.1338 11.46667,-11.46667c0,-6.33287 -5.1338,-11.46667 -11.46667,-11.46667c-6.33287,0 -11.46667,5.1338 -11.46667,11.46667c0.00248,2.04435 0.55147,4.05086 1.59011,5.81172l-30.85026,18.15183l-22.67578,-42.51849c3.73418,-1.99219 6.06734,-5.87935 6.06927,-10.11172c0,-6.33287 -5.1338,-11.46667 -11.46667,-11.46667zM22.93333,120.4v11.46667c0,6.33533 5.13133,11.46667 11.46667,11.46667h103.2c6.33533,0 11.46667,-5.13133 11.46667,-11.46667v-11.46667z"></path></g>
                        </svg>
                          My Rank
                      </a>
                    </Link>
                    {/* <Link href="/account/gxp" passHref={true}>
                      <a className="flex min-w-[15rem] items-center p-1.5 mb-1 bg-gradient-to-r via-transparent hover:from-gamefiDark-400 hover:cursor-pointer rounded-sm">
                        <svg className="w-4 h-4 mr-2.5 text-gamefiDark-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172">
                          <path d="M0,172v-172h172v172z" fill="none"></path><g fill="currentColor"><path d="M86,11.46667c-6.33287,0 -11.46667,5.1338 -11.46667,11.46667c0.00193,4.23237 2.33509,8.11953 6.06927,10.11172l-22.67578,42.51849l-30.85026,-18.15183c1.03863,-1.76086 1.58762,-3.76737 1.5901,-5.81172c0,-6.33287 -5.1338,-11.46667 -11.46667,-11.46667c-6.33287,0 -11.46667,5.1338 -11.46667,11.46667c0,6.33287 5.1338,11.46667 11.46667,11.46667c0.38161,-0.00338 0.76281,-0.0258 1.14219,-0.06719l4.59115,45.93386h17.2h74.53333h17.2h17.2l4.59114,-45.92266c0.37956,0.03765 0.76077,0.05634 1.14219,0.05599c6.33287,0 11.46667,-5.1338 11.46667,-11.46667c0,-6.33287 -5.1338,-11.46667 -11.46667,-11.46667c-6.33287,0 -11.46667,5.1338 -11.46667,11.46667c0.00248,2.04435 0.55147,4.05086 1.59011,5.81172l-30.85026,18.15183l-22.67578,-42.51849c3.73418,-1.99219 6.06734,-5.87935 6.06927,-10.11172c0,-6.33287 -5.1338,-11.46667 -11.46667,-11.46667zM22.93333,120.4v11.46667c0,6.33533 5.13133,11.46667 11.46667,11.46667h103.2c6.33533,0 11.46667,-5.13133 11.46667,-11.46667v-11.46667z"></path></g>
                        </svg>
                          My GXP
                      </a>
                    </Link> */}
                    <Link href="/account/review" passHref={true}>
                      <a className="flex min-w-[15rem] items-center p-1.5 mb-1 bg-gradient-to-r via-transparent hover:from-gamefiDark-400 hover:cursor-pointer rounded-sm">
                        <svg className='w-4 h-4 mr-2.5 text-gamefiDark-200' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 0H15C15.552 0 16 0.448 16 1V11C16 11.552 15.552 12 15 12H10L4 16V12H1C0.448 12 0 11.552 0 11V1C0 0.448 0.448 0 1 0Z" fill="currentColor"/>
                        </svg>

                          My Review
                      </a>
                    </Link>
                    <Link href="/account/pools" passHref={true}>
                      <a className="flex min-w-[15rem] items-center p-1.5 mb-1 bg-gradient-to-r via-transparent hover:from-gamefiDark-400 hover:cursor-pointer rounded-sm">
                        <svg className="w-4 h-4 mr-2.5 text-gamefiDark-200" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 0H2C1.4 0 1 0.4 1 1V16L4 14L6 16L8 14L10 16L12 14L15 16V1C15 0.4 14.6 0 14 0ZM12 10H4V8H12V10ZM12 6H4V4H12V6Z" fill="currentColor"/>
                        </svg>
                          IGO Pools
                      </a>
                    </Link>
                    <Link href="/account/collections/assets" passHref={true}>
                      <a className="flex min-w-[15rem] items-center p-1.5 mb-1 bg-gradient-to-r via-transparent hover:from-gamefiDark-400 hover:cursor-pointer rounded-sm">
                        <svg className="w-4 h-4 mr-2.5 text-gamefiDark-200" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5Z" stroke={'#92929e'} strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 6.5C5.38071 6.5 6.5 5.38071 6.5 4C6.5 2.61929 5.38071 1.5 4 1.5C2.61929 1.5 1.5 2.61929 1.5 4C1.5 5.38071 2.61929 6.5 4 6.5Z" stroke={'#92929e'} strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.5 1.5H9.5V6.5H14.5V1.5Z" stroke={'#92929e'} strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M6.5 9.5H1.5V14.5H6.5V9.5Z" stroke={'#92929e'} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                          Collections
                      </a>
                    </Link>
                    <div className="h-px w-full bg-gamefiDark-400 my-2"></div>
                    <div className="flex justify-center items-center text-red-500/95 hover:text-red-300 cursor-pointer py-2" onClick={tryDeactivate}>
                        Disconnect
                      <svg className="w-5 h-5 ml-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 12.414L15.414 8L11 3.586L9.586 5L11.586 7H5V9H11.586L9.586 11L11 12.414Z" fill="currentColor"/>
                        <path d="M12 14H3V2H12V0H2C1.448 0 1 0.448 1 1V15C1 15.552 1.448 16 2 16H12V14Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </ModalConnect>
              </div>
            )}
            placement="bottom-end"
            trigger="click"
            interactive={true}
            appendTo="parent">
            <div className="w-full sm:w-auto flex">
              <div className="flex-1 bg-gamefiDark-500 p-2 pl-6 rounded-l inline-flex justify-center cursor-pointer text-[13px]">
                <div className="inline-flex font-bold mr-2 items-center">
                  <div className="inline-flex w-5 h-5 relative mr-2">
                    <Image src={network.image} layout="fill" alt={network.name} />
                  </div>
                  {balance && balanceShort} {currencyNative}
                </div>
                <span className="bg-gamefiDark-700 px-2 rounded-sm">{accountShort}</span>
              </div>
              <button className="bg-gamefiDark-600 px-3 clipped-t-r">
                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 6.5L8 11L12.5 6.5" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </Tippy>
        </div>
      }
    </>
  )
}

export const NetworkSelector = ({ onChange, isMulti = true, isToggle = true, ...props }: { onChange: (network) => void; selected?: any; isMulti?: boolean; isToggle?: boolean } & ObjectType) => {
  const _networks = networks.filter(x => !x.testnet)
  const defaultValue = _networks.reduce((acc, val) => {
    acc[val.alias] = true
    return acc
  }, {})
  const [selected, setSelected] = useState(props.selected || defaultValue)
  const isActive = useCallback((network) => {
    if (!selected) {
      return true
    }

    return !!selected[network?.alias]
  }, [selected])
  const toggle = network => {
    if (isMulti) {
      const update = { ...selected }
      update[network?.alias] = !update?.[network?.alias]
      setSelected(update)
    } else {
      setSelected(s => {
        const obj = {}
        for (const p in s) {
          obj[p] = false
        }
        if (isToggle) {
          obj[network?.alias] = !obj?.[network?.alias]
        } else {
          obj[network?.alias] = true
        }
        return obj
      })
    }
  }

  useEffect(() => {
    if (!onChange) {
      return
    }

    onChange(selected)
  }, [onChange, selected])

  return (
    <div className="font-casual">
      <div className={`grid grid-cols-3 sm:flex gap-1.5 bg-gamefiDark-630/30 rounded p-1.5 mb-1 ${props.className || ''}`} style={props.style}>
        {_networks.map(network => {
          return <div key={network.alias} className={'flex items-center rounded flex-none cursor-pointer py-1 px-2'} onClick={() => toggle(network)} style={{ backgroundColor: isActive(network) ? (network.colorAlt || network.color) : 'transparent' }}>
            <div className={`flex-none w-4 h-4 relative contrast-200 brightness-200 grayscale ${isActive(network) ? 'opacity-100' : 'opacity-50'} hover:opacity-100`}><Image src={network.image2} alt={network.name} layout="fill" /></div>
            {isActive(network) && <span className={'ml-2 text-xs'}>{network.name}</span>}
          </div>
        })}
      </div>
    </div>
  )
}

export default WalletConnector
