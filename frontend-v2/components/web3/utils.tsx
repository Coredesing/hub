import { useState, useCallback } from 'react'
import { utils, Contract, BigNumber } from 'ethers'
import { networkConnector } from 'components/web3/connectors'
import { Token, useWeb3Default, getNetworkByAlias, getLibrary } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import ERC20 from 'components/web3/abis/ERC20.json'

export const useTokenAllowance = (token?: Token, owner?: string, spender?: string, networkAlias?: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [allowance, setAllowance] = useState<BigNumber | null>(null)
  const [error, setError] = useState<Error>()
  const { connector, library } = useWeb3Default()

  const load = useCallback(async () => {
    setError(null)

    if (!token || !owner || !spender) {
      setError(new Error('Invalid token or owner or spender'))
      setAllowance(null)
      return
    }

    if (!utils.isAddress(token.address) || !utils.isAddress(owner) || !utils.isAddress(spender)) {
      setError(new Error('Invalid token or owner or spender'))
      setAllowance(null)
      return
    }

    if (!connector || !library) {
      setError(new Error('Invalid connector or library'))
      setAllowance(null)
      return
    }

    setLoading(true)

    try {
      let provider = library
      const network = getNetworkByAlias(networkAlias)
      if (network) {
        const connector = networkConnector(network.id)
        if (connector) {
          const update = await connector.activate()
          provider = getLibrary(update.provider)
        }
      }

      const contract = new Contract(token.address, ERC20, provider)
      const approved = await contract.allowance(owner, spender)
      setAllowance(approved)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [token, owner, spender, connector, library, networkAlias])

  return {
    load,
    loading,
    allowance,
    error
  }
}

export const useTokenApproval = (token?: Token, spender?: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const { account, library } = useMyWeb3()

  const approve = useCallback(async (amount) => {
    setError(null)

    if (!token || !account || !spender) {
      setError(new Error('Invalid token or owner or spender'))
      return
    }

    if (!utils.isAddress(token.address) || !utils.isAddress(spender)) {
      setError(new Error('Invalid token or spender'))
      return
    }

    if (!library) {
      setError(new Error('Invalid library'))
      return
    }

    setLoading(true)

    try {
      const signer = library.getSigner()
      const contract = new Contract(token.address, ERC20, signer)
      const tx = await contract.approve(spender, amount)
      await tx.wait(1)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [token, account, spender, library])

  return {
    approve,
    loading,
    error
  }
}
