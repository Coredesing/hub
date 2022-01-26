import { useEffect, useMemo, useCallback } from 'react'
import Layout from 'components/Layout'
import { useWeb3Default, STAKING_CONTRACT, GAFI } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import { shorten } from 'components/Base/WalletConnector'
import { constants } from 'ethers'

import { useTokenAllowance, useTokenApproval, useBalanceToken } from 'components/web3/utils'

function ChainID ({ default: isDefault }: { default?: boolean }) {
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
  const { balance, balanceShort, updateBalance } = useMyWeb3()

  return (
    <div>
      <span className="block">Balance</span>
      <span>{balance === null ? 'Error' : balanceShort}</span>
      <button className="border bg-gray-500 px-2 ml-4" onClick={() => updateBalance()}>Force Reload</button>
    </div>
  )
}

function BalanceGAFI () {
  const { balance, balanceShort, updateBalance } = useBalanceToken(GAFI)

  return (
    <div>
      <span className="block">Balance ${GAFI.symbol}</span>
      <span>{balance === null ? 'N/A' : balanceShort}</span>
      <button className="border bg-gray-500 px-2 ml-4" onClick={() => updateBalance()}>Force Reload</button>
    </div>
  )
}

function Allowance () {
  const { account } = useMyWeb3()
  const { allowance, load, loading, error } = useTokenAllowance(GAFI, account, STAKING_CONTRACT)
  const { approve, loading: loadingApproval, error: errorApproval } = useTokenApproval(GAFI, STAKING_CONTRACT)
  useEffect(() => {
    load().catch(err => {
      console.debug(err)
    })
  }, [load])

  const approveAndReload = useCallback((amount) => {
    approve(amount).finally(() => {
      load().catch(err => {
        console.debug(err)
      })
    })
  }, [load, approve])

  const isMax = useMemo(() => {
    return allowance && allowance.eq(constants.MaxUint256)
  }, [allowance])
  return <div>
    <div>
      Allowance of GAFI on BSC (mainnet/testnet): { loading ? 'Loading...' : null }
      { !loading && <>
        <p>{allowance && allowance.toString()}</p>
        { error ? <p>Allowance Error: {error.message}</p> : null }
        { !loadingApproval && errorApproval ? <p>Approval Error: {errorApproval.message}</p> : null }
        { isMax && <button className="border bg-gray-500 px-2" onClick={() => approveAndReload(0)}>{ loadingApproval ? 'Approving...' : 'Revoke' }</button> }
        { !isMax && <button className="border bg-gray-500 px-2" onClick={() => approveAndReload(constants.MaxUint256)}>{ loadingApproval ? 'Approving...' : 'Approve' }</button> }
      </>
      }
    </div>
  </div>
}

const MyAccount = () => (
  <Layout title="MyAccount">
    <div className="md:px-4 lg:px-16 md:container mx-auto lg:block mb-6">
      <h2 className="text-2xl font-bold">MyAccount</h2>
      <p className="mb-6">Current Network & Account</p>

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

    <div className="md:px-4 lg:px-16 md:container mx-auto lg:block">
      <h2 className="text-2xl font-bold">Staking</h2>
      <p className="mb-6">GAFI Staking</p>

      <div className="flex w-full justify-between">
        <Allowance />
      </div>
    </div>
  </Layout>
)

export default MyAccount
