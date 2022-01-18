import { useState, useEffect, useMemo } from 'react'
import Layout from 'components/Layout'
import { useWeb3Default } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import { shorten } from 'components/Base/WalletConnector'
import { formatEther } from '@ethersproject/units'
import { Contract } from '@ethersproject/contracts'

function ChainID ({ default: isDefault }: { default: boolean }) {
  const { network, chainID } = useMyWeb3()
  const { chainId: chainIdDefault } = useWeb3Default()

  return (
    <div>
      <span className="block">Network {isDefault ? 'Default' : ''}</span>
      { isDefault && <span>{chainIdDefault}</span> }
      { !isDefault && <span>{network?.name} ({chainID ?? ''})</span> }
    </div>
  )
}

function Account () {
  const { account } = useMyWeb3()

  return (
    <div>
      <span className="block">Account</span>
      <span>
        {!account ? '-' : (account ? shorten(account) : '')}
      </span>
    </div>
  )
}

function Balance () {
  const { account, library, chainID, balance, updateBalance } = useMyWeb3()

  const balanceShort = useMemo(() => {
    if (!balance) {
      return '0'
    }

    return parseFloat(formatEther(balance)).toFixed(4)
  }, [balance])

  return (
    <div>
      <span className="block">Balance</span>
      <span>{balance === null ? 'Error' : balanceShort}</span>
      <button className="border bg-gray-500 px-2 ml-4" onClick={() => updateBalance()}>Force Reload</button>
    </div>
  )
}

function BalanceGAFI () {
  const { library } = useWeb3Default()
  const { account } = useMyWeb3()

  const [balance, setBalance] = useState()
  const balanceShort = useMemo(() => {
    if (!balance) {
      return '0'
    }

    return parseFloat(formatEther(balance)).toFixed(4)
  }, [balance])

  useEffect((): any => {
    if (!account || !library) {
      return
    }

    let stale = false
    const contractGAFIReadOnly = new Contract('0x89af13a10b32f1b2f8d1588f93027f69b6f4e27e', [{
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }], library)

    contractGAFIReadOnly
      .balanceOf(account)
      .then((balance: any) => {
        if (stale) {
          return
        }

        setBalance(balance)
      })
      .catch(() => {
        if (stale) {
          return
        }

        setBalance(null)
      })

    return () => {
      stale = true
      setBalance(undefined)
    }
  }, [account, library])

  return (
    <div>
      <span className="block">Balance $GAFI</span>
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
        <BalanceGAFI />
      </div>

      <div className="flex w-full justify-between mt-6">
        <ChainID default={true} />
      </div>
    </div>
  </Layout>
)

export default MyAccount
