import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { networks } from '@/components/web3'
import { useMyWeb3 } from '@/components/web3/context'
import Image from 'next/image'
import { useWalletContext } from './provider'
import { shorten } from '@/utils'

const WalletConnector = (props) => {
  const { network, account, balance, currencyNative, balanceShort } = useMyWeb3()

  const { setShowModal } = useWalletContext()

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
      { (!account) &&
        <button
          className={`uppercase overflow-hidden py-3 px-8 bg-gamefiGreen-500 text-gamefiDark-900 font-bold text-[13px] rounded-xs hover:opacity-95 cursor-pointer w-full md:w-auto rounded-sm clipped-t-r ${btnClass}`}
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
          <div className="w-full sm:w-auto bg-gray-700 clipped-t-r py-2 px-6 rounded inline-flex justify-center cursor-pointer text-[13px]" onClick={() => setShowModal(true)}>
            <div className="inline-flex font-bold mr-2 items-center">
              <div className="inline-flex w-5 h-5 relative mr-2">
                <Image src={network.image} layout="fill" alt={network.name}/>
              </div>
              {balance && balanceShort} {currencyNative}
            </div>
            <span className="bg-gray-800 px-2 rounded-sm">{accountShort}</span>
          </div>
        </div>
      }
    </>
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
