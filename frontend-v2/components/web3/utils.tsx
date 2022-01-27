import { useState, useCallback, useEffect, useMemo } from 'react'
import { utils, Contract, BigNumber, providers } from 'ethers'
import { networkConnector } from 'components/web3/connectors'
import { useWeb3Default, getNetworkByAlias, getLibrary, ETH, MATIC, BNB, USDT_ERC, USDT_POLYGON, BUSD_BSC, Token } from 'components/web3'
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
      return true
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

export const useLibraryDefaultFlexible = (networkAlias?: string, mainnet = false) => {
  const { library } = useWeb3Default()
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null)

  useEffect(() => {
    if (!networkAlias) {
      setProvider(library)
      return
    }

    const network = getNetworkByAlias(networkAlias, mainnet)
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
  }, [networkAlias, library, mainnet])

  return {
    provider
  }
}

export const useBalanceToken = (token?: Token, networkAlias?: string) => {
  const { provider } = useLibraryDefaultFlexible(networkAlias)
  const { account } = useMyWeb3()

  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const balanceShort = useMemo(() => {
    if (!balance) {
      return '0'
    }

    return parseFloat(utils.formatEther(balance)).toFixed(4)
  }, [balance])
  const updateBalance = useCallback(() => {
    if (!account || !provider || !token?.address) {
      setBalance(null)
      return
    }

    const contractReadOnly = new Contract(token.address, ERC20, provider)
    setLoading(true)

    contractReadOnly
      .balanceOf(account)
      .then((balance: any) => {
        setBalance(balance)
      })
      .catch(() => {
        setBalance(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [account, provider, token, setBalance, setLoading])

  useEffect((): any => {
    updateBalance()
  }, [updateBalance])

  return {
    balance,
    balanceShort,
    loading,
    updateBalance
  }
}

interface Item {
  accept_currency?: string
  network_available?: string
}

export const useCurrency = (item?: Item) => {
  const currency = useMemo(() => {
    if (!item?.accept_currency) {
      return null
    }

    if (item.accept_currency === 'eth') {
      return currencyNative(item.network_available)
    }

    if (item.accept_currency === 'usdt') {
      return currencyStable(item.network_available)
    }
  }, [item])

  return { currency }
}

export const currencyNative = (network: string) => {
  switch (network) {
  case 'bsc': {
    return BNB
  }

  case 'eth': {
    return ETH
  }

  case 'polygon': {
    return MATIC
  }

  default: {
    return null
  }
  }
}

const currencyStable = (network: string) => {
  switch (network) {
  case 'bsc': {
    return BUSD_BSC
  }

  case 'eth': {
    return USDT_ERC
  }

  case 'polygon': {
    return USDT_POLYGON
  }

  default: {
    return null
  }
  }
}
