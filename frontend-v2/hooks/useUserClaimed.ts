import { useMyWeb3 } from '@/components/web3/context'
import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import POOL_ABI from '@/components/web3/abis/Pool.json'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'

export const useUserClaimed = (address: string, networkAlias: string, decimals: number) => {
  const [userClaimedTokens, setUserClaimedTokens] = useState('0')
  const { account } = useMyWeb3()
  const { provider } = useLibraryDefaultFlexible(networkAlias)

  const updateClaimedTokens = useCallback(async () => {
    try {
      if (!address || !account || !provider || !decimals) {
        return
      }
      const poolContract = new ethers.Contract(address, POOL_ABI, provider)
      const claimed = await poolContract.userClaimed(account)
      setUserClaimedTokens(ethers.utils.formatUnits(claimed, decimals) || '0')
    } catch (e) {
      console.debug(e)
    }
  }, [account, address, decimals, provider])

  useEffect((): any => {
    updateClaimedTokens()
  }, [updateClaimedTokens])

  return {
    userClaimedTokens,
    updateClaimedTokens
  }
}
