import { useState, useEffect, useMemo } from 'react'
import Layout from 'components/Layout'
import { useMyWeb3 } from 'components/web3/context'
import { shorten } from 'components/Base/WalletConnector'
import { formatEther } from '@ethersproject/units'

function ChainID() {
  const { network, chainID } = useMyWeb3()

  return (
    <div>
      <span className="block">Network</span>
      <span>{network?.name} ({chainID ?? ''})</span>
    </div>
  )
}

function Account() {
  const { account } = useMyWeb3()

  return (
    <div>
      <span className="block">Account</span>
      <span>
        {!account ? '-' : (account ? shorten(account): '')}
      </span>
    </div>
  )
}

function Balance() {
  const { account, library, chainID } = useMyWeb3()

  const [balance, setBalance] = useState()
  const balanceShort = useMemo(() => {
    if (!balance) {
      return '0'
    }

    return parseFloat(formatEther(balance)).toFixed(4)
  }, [balance])

  useEffect((): any => {
    if (!!account && !!library) {
      let stale = false

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainID]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <div>
      <span className="block">Balance</span>
      <span>{balance === null ? 'Error' : balanceShort}</span>
    </div>
  )
}

const MyAccount = () => (
  <Layout title="MyAccount">
    <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
      <h1>MyAccount</h1>
      <p className="mb-6">This is the demonstration of interation with the contract</p>

      <div className="flex w-full justify-between">
        <ChainID />
        <Account />
        <Balance />
      </div>
    </div>
  </Layout>
)

export default MyAccount
