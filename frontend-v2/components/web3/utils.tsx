import { useState, useCallback, useEffect } from 'react'
import { utils, Contract, BigNumber, providers } from 'ethers'
import { networkConnector } from 'components/web3/connectors'
import { Token, useWeb3Default, getNetworkByAlias, getLibrary } from 'components/web3'
import { useMyWeb3 } from 'components/web3/context'
import ERC20 from 'components/web3/abis/ERC20.json'

export const useTokenAllowance = (token?: Token, owner?: string, spender?: string, networkAlias?: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [allowance, setAllowance] = useState<BigNumber | null>(null)
  const [error, setError] = useState<Error>()
  const { provider } = useLibraryDefaultFlexible(networkAlias)

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

    if (!provider) {
      setError(new Error('Invalid provider'))
      setAllowance(null)
      return
    }

    setLoading(true)

    try {
      const contract = new Contract(token.address, ERC20, provider)
      const approved = await contract.allowance(owner, spender)
      setAllowance(approved)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [token, owner, spender, provider])

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
      setError(new Error('Invalid provider'))
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

export function useLibraryDefaultFlexible (networkAlias?: string) {
  const { library } = useWeb3Default()
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null)

  useEffect(() => {
    if (!networkAlias) {
      setProvider(library)
      return
    }

    const network = getNetworkByAlias(networkAlias)
    if (!network) {
      setProvider(null)
      return
    }

    const connector = networkConnector(network.id)
    if (!connector) {
      setProvider(null)
      return
    }

    connector.activate().then(update => {
      setProvider(getLibrary(update.provider))
    }).catch(err => {
      console.debug(err)
    })
  }, [networkAlias, library])

  return {
    provider
  }
}
