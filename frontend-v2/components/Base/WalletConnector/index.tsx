import React, { useState, useEffect, useCallback, useRef, useLayoutEffect, useMemo, ReactNode, RefObject, ChangeEvent } from 'react'
import useResizeObserver, { UseResizeObserverCallback } from '@react-hook/resize-observer'
import { useWeb3React } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { networks, wallets, connectorFromWallet, activated, deactivated, switchNetwork } from '@/components/web3'
import { injected, IS_TESTNET } from '@/components/web3/connectors'
import { useMyWeb3 } from '@/components/web3/context'
import Image from 'next/image'
import Modal from '../Modal'
import { formatEther } from '@ethersproject/units'
import copy from 'copy-to-clipboard'
import Link from 'next/link'

export function shorten (s: string, max = 12) {
  return s.length > max ? s.substring(0, (max / 2) - 1) + '…' + s.substring(s.length - (max / 2) + 2, s.length) : s
}

const useSize = (target: RefObject<HTMLElement>) => {
  const [size, setSize] = useState<DOMRectReadOnly>()

  useLayoutEffect(() => {
    if (!target?.current) {
      return
    }
    setSize(target.current.getBoundingClientRect())
  }, [target])

  const callback: UseResizeObserverCallback = (entry) => {
    setSize(entry.contentRect)
  }

  useResizeObserver(target, callback)
  return size
}

const WalletConnector = (props) => {
  const [showModal, setShowModal] = useState(false)

  const contextWeb3: Web3ReactContextInterface = useWeb3React()
  const contextWeb3App = useMyWeb3()

  const { library, chainId: _chainID, account: _account, activate, deactivate, active, error: _error } = contextWeb3
  const { network, account, balance, currencyNative, dispatch } = contextWeb3App

  useEffect(() => {
    dispatch({
      type: 'SET_CHAINID',
      payload: { chainID: _chainID }
    })
  }, [_chainID, dispatch])

  useEffect(() => {
    dispatch({
      type: 'SET_ACCOUNT',
      payload: { account: _account }
    })

    if (_account) {
      activated(_account)
    }
  }, [_account, dispatch])

  useEffect(() => {
    dispatch({
      type: 'SET_LIBRARY',
      payload: { library }
    })
  }, [library, dispatch])

  const [agreed, setAgreed] = useState(false)
  function handleAgreement (event: ChangeEvent<HTMLInputElement>) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : !!target.value
    setAgreed(value)
  }
  const [networkChosen, setNetworkChosen] = useState<{ id: any } | undefined>()
  const chooseNetwork = network => {
    if (!agreed) {
      return
    }

    setNetworkChosen(network)
  }
  const [walletChosen, setWalletChosen] = useState<{ id: any } | undefined>()
  const [connectorChosen, setConnectorChosen] = useState<AbstractConnector | undefined>()
  const walletsAvailable = useMemo(() => {
    if (!networkChosen) {
      return wallets
    }

    return wallets.filter(w => {
      return w.networks.indexOf(networkChosen.id) > -1
    })
  }, [networkChosen])
  const chooseWallet = wallet => {
    if (!agreed || !networkChosen) {
      return
    }

    setWalletChosen(wallet)
    setConnectorChosen(connectorFromWallet(wallet))
  }
  const [activating, setActivating] = useState<boolean>(false)
  const tryActivate = useCallback(async () => {
    if (active) {
      return
    }

    if (!connectorChosen) {
      return
    }

    try {
      setActivating(true)
      if (connectorChosen === injected && (window as any).ethereum) {
        await switchNetwork((window as any).ethereum, networkChosen?.id)
      }
      await activate(connectorChosen)
    } catch (err) {
      console.debug(err)
    } finally {
      setShowModal(false)
      setActivating(false)
      setConnectorChosen(undefined)
    }
  }, [active, connectorChosen, networkChosen, setActivating, activate, setConnectorChosen])

  const tryDeactivate = useCallback(() => {
    if (!active) {
      return
    }

    try {
      const acc = account
      deactivate()
      deactivated(acc)
    } catch (err) {
      console.debug(err)
    } finally {
      setShowModal(false)
      setConnectorChosen(undefined)
    }
  }, [active, deactivate, setConnectorChosen, account])

  // activation when user select a connector in the modal
  useEffect(() => {
    if (!connectorChosen) {
      return
    }

    tryActivate()
      .catch(err => {
        console.debug(err)
      })
  }, [connectorChosen, tryActivate])

  // sync error from current context -> app context
  useEffect(() => {
    dispatch({ type: 'SET_ERROR', payload: { error: _error } })
  }, [_error, dispatch])

  // sync chainID from user choice -> app context
  useEffect(() => {
    if (networkChosen?.id !== undefined) {
      dispatch({ type: 'SET_CHAINID', payload: { chainID: networkChosen?.id } })
    }

    setWalletChosen(undefined)
  }, [networkChosen, dispatch])

  const accountShort = useMemo(() => {
    if (!active || !account) {
      return
    }

    return shorten(account, 10)
  }, [active, account])

  const balanceShort = useMemo(() => {
    if (!balance) {
      return '0'
    }

    return parseFloat(formatEther(balance)).toFixed(4)
  }, [balance])
  const btnClass = useMemo(() => {
    return props.buttonClassName || ''
  }, [props])

  return (
    <>
      { (!active || !account) &&
        <button
          className={`overflow-hidden py-2 px-8 bg-gamefiGreen-500 text-gamefiDark-900 font-bold text-sm rounded-xs hover:opacity-95 cursor-pointer w-full md:w-auto clipped-t-r ${btnClass}`}
          onClick={() => setShowModal(true)}
        >
          Connect Wallet
        </button>
      }
      {
        active && account &&
        <div className="font-casual leading-6 text-sm flex items-center justify-center">
          <a className="inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded cursor-pointer mr-1" href="https://pancakeswap.finance/swap?outputCurrency=0x89af13a10b32f1b2f8d1588f93027f69b6f4e27e&inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56" target="_blank" rel="noreferrer">
            <span className="bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-6 rounded leading-5 uppercase font-bold text-xs">
              Buy $GAFI
            </span>
          </a>
          <Link href="/account">
            <a className="flex py-2 px-4 bg-gray-700 mr-1 rounded" href="">
              My Account
            </a>
          </Link>
          <div className="bg-gray-700 clipped-t-r py-2 px-4 rounded inline-flex cursor-pointer" onClick={() => setShowModal(true)}>
            <div className="inline-flex font-medium mr-2 items-center">
              <div className="inline-flex w-5 h-5 relative mr-2">
                <Image src={network.image} layout="fill" alt={network.name}/>
              </div>
              {balance && balanceShort} {currencyNative}
            </div>
            <span className="font-bold">{accountShort}</span>
          </div>
        </div>
      }
      <Modal show={showModal} toggle={setShowModal} className='dark:bg-transparent fixed z-50'>
        <ModalConnect close={() => setShowModal(false)} style={{ color: network?.colorText || '' }}>
          { active && <div className="font-casual">
            <div className="p-6 pt-10" style={{ backgroundColor: network?.color || 'transparent' }}>
              <div className="font-bold text-2xl uppercase mb-5">Account</div>
              <div className="flex items-center w-full text-base">
                <span className="w-14 h-14 mr-4"><Image src={ require('@/assets/images/avatar.png') } alt="avatar" /></span>
                <div className="flex-1 flex justify-between">
                  <div>
                    <span>Balance</span>
                    <strong className="block text-lg">{balanceShort} {currencyNative}</strong>
                  </div>

                  <div>
                    <span>Network</span>
                    <strong className="block text-lg">{network?.name}</strong>
                  </div>

                  <div>
                    <span>Wallet</span>
                    <strong className="block text-lg">Web3</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 text-white">
              <div className="p-4 bg-gray-700 rounded flex justify-between">
                <div>{account}</div>
                <svg style={{ height: '1em' }} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer hover:text-gray-300" onClick={() => copy(account)}>
                  <path d="M12.5 3.5H2.5V15.5H12.5V3.5Z" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.5 0.5H15.5V13.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 6.5H9.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 9.5H9.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 12.5H9.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="inline-flex items-center mt-4 justify-center w-full text-red-400 font-medium cursor-pointer hover:text-red-500" onClick={tryDeactivate}>
                Disconnect
                <svg className="w-6 h-6 ml-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 12.414L15.414 8L11 3.586L9.586 5L11.586 7H5V9H11.586L9.586 11L11 12.414Z" fill="currentColor"/>
                  <path d="M12 14H3V2H12V0H2C1.448 0 1 0.448 1 1V15C1 15.552 1.448 16 2 16H12V14Z" fill="currentColor"/>
                </svg>
              </p>
            </div>
          </div> }

          { !active &&
            <div className="p-6 pt-10 text-white">
              <div className="font-bold text-2xl uppercase mb-5">Connect Wallet</div>
              <div className="font-bold text-sm uppercase">1. Agreement</div>
              <label className="py-2 leading-relaxed mb-5 inline-block font-casual text-sm">
                <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 mr-2" checked={agreed} onChange={handleAgreement} />
                I have read and agreed with the <a className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline" href="#" target="_blank" rel="noopener nofollower">Terms of Service</a> and <a className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline" href="#" target="_blank" rel="noopener nofollower">Privacy Policy</a>.
              </label>
              <div className="mb-7">
                <div className={`font-bold text-sm uppercase mb-2 ${agreed ? 'text-white' : 'text-gray-400'}`}>2. Choose Network</div>
                <div className="flex gap-x-2 font-casual">
                  {networks.filter(x => IS_TESTNET ? x.testnet : !x.testnet).map(network => {
                    const available = !!agreed
                    const chosen = available && network.id === networkChosen?.id

                    return <div key={network.id} className={`flex-1 relative cursor-pointer flex flex-col items-center justify-between py-4 border border-transparent ${chosen ? 'border-gamefiGreen-500 bg-gray-800' : 'bg-gray-700'}`} onClick={() => chooseNetwork(network)}>
                      <div className="w-11 h-11 relative"><Image src={network.image2} className={available ? 'filter-none' : 'grayscale'} alt={network.name} layout="fill"/></div>
                      <span className={`text-[13px] leading-6 ${available ? 'text-white' : 'text-gray-100'}`}>{network.name}</span>

                      { chosen && <svg className="w-6 absolute top-0 left-0" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 1C0 0.447715 0.447715 0 1 0H21.0144C21.7241 0 22.208 0.718806 21.9408 1.37638L16.2533 15.3764C16.1002 15.7534 15.7338 16 15.3269 16H8H1C0.447715 16 0 15.5523 0 15V1Z" fill="#6CDB00"/>
                        <path d="M6 8L8.5 10.5L13 6" stroke="#212121" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg> }

                    </div>
                  })}
                </div>
              </div>
              <div className={agreed ? 'text-white' : 'text-gray-400'}>
                <div className="font-bold text-sm uppercase mb-2">3. Choose Wallet</div>
                <div className="flex gap-x-2 font-casual">
                  {walletsAvailable.map(wallet => {
                    const available = !!agreed && !!networkChosen
                    const chosen = available && wallet.id === walletChosen?.id

                    return <div key={wallet.id} className={`flex-1 relative cursor-pointer flex flex-col items-center justify-between py-6 border border-transparent ${chosen ? 'border-gamefiGreen-500 bg-gray-800' : 'bg-gray-700'}`} onClick={() => chooseWallet(wallet)}>
                      <Image src={wallet.image} className={available ? 'filter-none' : 'grayscale'} alt={wallet.name} />
                      <span className={`text-[13px] leading-6 ${available ? 'text-white' : 'text-gray-100'}`}>{ (activating && chosen) ? 'Loading...' : wallet.name}</span>

                      { chosen && <svg className="w-6 absolute top-0 left-0" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 1C0 0.447715 0.447715 0 1 0H21.0144C21.7241 0 22.208 0.718806 21.9408 1.37638L16.2533 15.3764C16.1002 15.7534 15.7338 16 15.3269 16H8H1C0.447715 16 0 15.5523 0 15V1Z" fill="#6CDB00"/>
                        <path d="M6 8L8.5 10.5L13 6" stroke="#212121" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg> }

                    </div>
                  })}
                </div>
              </div>
            </div> }
        </ModalConnect>
      </Modal>
    </>
  )
}

type Props = {
  children?: ReactNode;
  close: () => void;
  style: any;
}

const ModalConnect = ({ children, close, style }: Props) => {
  const target = useRef(null)
  const size = useSize(target)
  const viewBox = useMemo(() => {
    if (!size) {
      return ''
    }
    return `0 0 ${size.width} ${size.height}`
  }, [size])
  const path = useMemo(() => {
    if (!size) {
      return ''
    }

    const bar = 15
    const qux = 12.5
    const start = 81.5
    const toRight = size.width - start
    const toBottom = size.height
    const toLeft = size.width
    return `m${start} 0 h${toRight} v${toBottom} h${-toLeft} v${bar - toBottom} h${start - qux} l${qux} ${-bar} z`
  }, [size])

  return (
    <div ref={target} style={{ clipPath: `path('${path}')`, position: 'relative', ...style }}>
      {viewBox && <svg className="absolute inset-0" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: -1 }}>
        <path fillRule="evenodd" clipRule="evenodd" d={path} fill="currentColor" className="text-gray-800"/>
      </svg>}
      {children}

      <svg onClick={close} className="absolute right-1 top-1 w-6 h-6 cursor-pointer hover:opacity-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L9 9L12 12M18 18L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

    </div>
  )
}

export const NetworkSelector = ({ onChange, ...props }: { onChange: (network) => void; selected?: any }) => {
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
    const update = { ...selected }
    update[network?.alias] = !update?.[network?.alias]
    setSelected(update)
  }
  useEffect(() => {
    if (!onChange) {
      return
    }

    onChange(selected)
  }, [onChange, selected])

  return (
    <div className="font-casual">
      <div className="flex gap-x-1.5 bg-gamefiDark-700 rounded p-1.5">
        {_networks.map(network => {
          return <div key={network.alias} className={'flex items-center rounded flex-none cursor-pointer py-1 px-2'} onClick={() => toggle(network)} style={{ backgroundColor: isActive(network) ? (network.colorAlt || network.color) : 'transparent' }}>
            <div className={`flex-none w-4 h-4 relative contrast-200 brightness-200 grayscale ${isActive(network) ? 'opacity-100' : 'opacity-50'} hover:opacity-100`}><Image src={network.image2} alt={network.name} layout="fill"/></div>
            { isActive(network) && <span className={'ml-2 text-xs'}>{network.name}</span> }
          </div>
        })}
      </div>
    </div>
  )
}

export default WalletConnector
