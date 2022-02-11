import { useState, useEffect, useMemo, useCallback, createContext, ChangeEvent, useContext } from 'react'
import { useEagerConnect, NoEthereumProviderError, getNetworkAvailable, wallets, connectorFromWallet, switchNetwork, activated, deactivated } from '@/components/web3'
import { injected } from '@/components/web3/connectors'
import { useMyWeb3 } from '@/components/web3/context'
import Modal from '@/components/Base/Modal'
import ModalConnect from './ModalConnect'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import copy from 'copy-to-clipboard'

export const ctx = createContext<{ setShowModal:(any) => void }>({
  setShowModal () {}
})

export const useWalletContext = () => useContext(ctx)

export default function WalletProvider ({ children }) {
  const { library, chainId: _chainID, account: _account, activate, deactivate, active, error: _error } = useWeb3React()
  const { network, account, currencyNative, dispatch, error, updateBalance, balanceShort } = useMyWeb3()

  const tried = useEagerConnect()
  useEffect(() => {
    dispatch({ type: 'SET_TRIED_EAGER', payload: { triedEager: tried } })
  }, [tried, dispatch])
  useEffect(() => {
    if (!error) {
      return
    }

    if (error instanceof NoEthereumProviderError) {
      toast.error('No Ethereum Wallet Detected')
      return
    }

    toast.error(error.message)
  }, [error])
  useEffect(() => {
    if (!library) {
      return
    }

    library.on('block', () => {
      updateBalance()
    })
    return () => {
      if (!library) {
        return
      }

      library.removeAllListeners()
    }
  }, [library, updateBalance])
  useEffect(() => {
    updateBalance()
  }, [updateBalance])

  const [showModal, setShowModal] = useState(false)
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
  const defaultNetwork = getNetworkAvailable().find(x => x.alias === 'bsc')
  const [networkChosen, setNetworkChosen] = useState<{ id: any } | undefined>(defaultNetwork)
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
      .then(() => {
        setWalletChosen(undefined)
      })
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

  return <ctx.Provider value={{ setShowModal }}>
    {children}
    <Modal show={showModal} toggle={setShowModal} className='dark:bg-transparent fixed z-50'>
      <ModalConnect close={() => setShowModal(false)} style={{ color: network?.colorText || '' }}>
        { account && <div className="font-casual">
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
            <p className="flex mt-4 justify-between w-full font-medium cursor-pointer" onClick={tryDeactivate}>
              <Link href="/account" passHref={true}>
                <a className="text-white hover:text-gray-400 underline">
                  View My Account
                </a>
              </Link>
              <span className="inline-flex items-center text-red-400 hover:text-red-500">
                Disconnect
                <svg className="w-5 h-5 ml-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 12.414L15.414 8L11 3.586L9.586 5L11.586 7H5V9H11.586L9.586 11L11 12.414Z" fill="currentColor"/>
                  <path d="M12 14H3V2H12V0H2C1.448 0 1 0.448 1 1V15C1 15.552 1.448 16 2 16H12V14Z" fill="currentColor"/>
                </svg>
              </span>
            </p>
          </div>
        </div> }

        { !account &&
          <div className="p-6 pt-10 text-white">
            <div className="font-bold text-2xl uppercase mb-5">Connect Wallet</div>
            <div className="font-bold text-sm uppercase">1. Agreement</div>
            <label className="py-2 leading-relaxed mb-5 inline-block font-casual text-sm">
              <input type="checkbox" className="rounded bg-transparent border-white checked:text-gamefiGreen-700 dark mr-2" checked={agreed} onChange={handleAgreement} />
              I have read and agreed with the <a className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline" href="#" target="_blank" rel="noopener nofollower">Terms of Service</a> and <a className="text-gamefiGreen-500 hover:text-gamefiGreen-200 hover:underline" href="#" target="_blank" rel="noopener nofollower">Privacy Policy</a>.
            </label>
            <div className="mb-7">
              <div className={`font-bold text-sm uppercase mb-2 ${agreed ? 'text-white' : 'text-gray-400'}`}>2. Choose Network</div>
              <div className="flex gap-x-2 font-casual">
                {getNetworkAvailable().map(network => {
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
  </ctx.Provider>
}
