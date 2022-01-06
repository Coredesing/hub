import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, ReactNode, RefObject, MouseEvent } from 'react'
import useResizeObserver, { UseResizeObserverCallback } from '@react-hook/resize-observer'
import { useWeb3React } from '@web3-react/core'
import { networks, wallets } from 'components/web3'
import Image from 'next/image'
import Modal from '../Modal'

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

const WalletConnector = () => {
  const context = useWeb3React()
  const { connector } = context
  // const { connector, library, chainId, account, activate, deactivate, active, error } = context

  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  const [showModal, setShowModal] = useState(false)

  const [agreed, setAgreed] = useState(false)
  function handleAgreement(event: any) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setAgreed(value)
  }

  const [networkChosen, setNetworkChosen] = useState({id: null})
  const chooseNetwork = network => {
    if (!agreed) {
      return
    }

    setNetworkChosen(network)
  }

  const [walletChosen, setWalletChosen] = useState({id: null})
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
  }

  return (
    <>
      <button
        className='overflow-hidden py-2 px-8 bg-gamefiGreen-500 text-gamefiDark-900 font-semibold text-sm rounded-xs hover:opacity-95 cursor-pointer w-full clipped-t-r'
        onClick={() => setShowModal(true)}
      >
        Connect Wallet
      </button>
      <Modal show={showModal} toggle={setShowModal} className='dark:bg-transparent'>
        <ModalConnect close={() => setShowModal(false)}>
          <div className="font-bold text-2xl uppercase mb-5">Connect Wallet</div>
          <div className="font-bold text-sm uppercase">1. Agreement</div>
          <label className="py-2 leading-relaxed mb-5 inline-block">
            <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-500 mr-2" checked={agreed} onChange={handleAgreement} />
            I have read and agreed with the <a className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline" href="#" target="_blank" rel="noopener nofollower">Terms of Service</a> and <a className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline" href="#" target="_blank" rel="noopener nofollower">Privacy Policy</a>.
          </label>
          <div className="mb-7">
            <div className={`font-bold text-sm uppercase mb-2 ${agreed ? `text-white` : 'text-gray-400'}`}>2. Choose Network</div>
            <div className="flex gap-x-2">
              {networks.map(network => {
                const available = !!agreed
                const chosen = available && network.id === networkChosen?.id

                return <div key={network.id} className={`flex-1 relative cursor-pointer flex flex-col items-center justify-between bg-gray-700 py-4 border border-transparent ${chosen ? 'border-gamefiGreen-500' : ''}`} onClick={() => chooseNetwork(network)}>
                  <Image src={network.image} className={available ? 'filter-none' : 'grayscale'} alt={network.name} />
                  <span className={`text-sm ${available ? 'text-white' : 'text-gray-100'}`}>{network.name}</span>

                  { chosen && <svg className="w-6 absolute top-0 left-0" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1C0 0.447715 0.447715 0 1 0H21.0144C21.7241 0 22.208 0.718806 21.9408 1.37638L16.2533 15.3764C16.1002 15.7534 15.7338 16 15.3269 16H8H1C0.447715 16 0 15.5523 0 15V1Z" fill="#6CDB00"/>
                    <path d="M6 8L8.5 10.5L13 6" stroke="#212121" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> }

                </div>
              })}
            </div>
          </div>
          <div className={agreed ? `text-white` : 'text-gray-400'}>
            <div className="font-bold text-sm uppercase mb-2">3. Choose Wallet</div>
            <div className="flex gap-x-2">
              {walletsAvailable.map(wallet => {
                const available = !!agreed && !!networkChosen
                const chosen = available && walletChosen && wallet.id === walletChosen.id

                return <div key={wallet.id} className={`flex-1 relative cursor-pointer flex flex-col items-center justify-between bg-gray-700 py-4 border border-transparent ${chosen ? 'border-gamefiGreen-500' : ''}`} onClick={() => chooseWallet(wallet)}>
                  <Image src={wallet.image} className={available ? 'filter-none' : 'grayscale'} alt={wallet.name} />
                  <span className={`text-sm ${available ? 'text-white' : 'text-gray-100'}`}>{wallet.name}</span>

                  { chosen && <svg className="w-6 absolute top-0 left-0" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 1C0 0.447715 0.447715 0 1 0H21.0144C21.7241 0 22.208 0.718806 21.9408 1.37638L16.2533 15.3764C16.1002 15.7534 15.7338 16 15.3269 16H8H1C0.447715 16 0 15.5523 0 15V1Z" fill="#6CDB00"/>
                    <path d="M6 8L8.5 10.5L13 6" stroke="#212121" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> }

                </div>
              })}
            </div>
          </div>
        </ModalConnect>
      </Modal>
    </>
  )
}

type Props = {
  children?: ReactNode,
  close: () => void
}

const ModalConnect = ({ children, close }: Props) => {
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
    return `m${start} 0 h${toRight} v${toBottom} h${-toLeft} v${bar-toBottom} h${start - qux} l${qux} ${-bar} z`
  }, [size])

  return (
    <div ref={target} style={{clipPath: `path('${path}')`, position: 'relative'}}>
      {viewBox && <svg className="absolute inset-0" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" style={{zIndex: -1}}>
        <path fillRule="evenodd" clipRule="evenodd" d={path} fill="currentColor" className="text-gray-800"/>
      </svg>}
      <div className="p-4 pt-10">
        {children}
      </div>

      <svg onClick={close} className="absolute right-1 top-1 w-6 h-6 cursor-pointer hover:text-gamefiGreen-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L9 9L12 12M18 18L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

    </div>
  )
}

export default WalletConnector
