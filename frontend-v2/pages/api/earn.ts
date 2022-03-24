import { getLibraryDefaultFlexible } from '@/components/web3/utils'
import { fetcher } from '@/utils'
import { API_BASE_URL } from '@/utils/constants'
import { Contract } from 'ethers'
import ABIStakingPool from '@/components/web3/abis/StakingPool'
import { GAFI } from '@/components/web3'

export function fetchAll () {
  return fetcher(`${API_BASE_URL}/staking-pool`).then(pools => {
    const poolsAPI = (pools?.data || []).filter(x => !x?.rkp_rate)
    return Promise.all(poolsAPI.map(async ({ pool_id: poolID, title, logo, pool_address: contractAddress, network_available: network }) => {
      const library = await getLibraryDefaultFlexible(null, network)
      const data = {
        id: poolID,
        title,
        logo,
        contractAddress,
        network
      }

      if (!library) {
        return data
      }

      const contract = new Contract(contractAddress, ABIStakingPool, library)
      const linearData = await contract.linearPoolInfo(poolID)
      return {
        ...data,
        token: GAFI.symbol,
        tokenAddress: GAFI.address,
        tokenImage: GAFI.image,
        cap: linearData.cap.toString(),
        totalStaked: linearData.totalStaked.toString(),
        minInvestment: linearData.minInvestment.toString(),
        maxInvestment: linearData.maxInvestment.toString(),
        APR: linearData.APR.toString(),
        lockDuration: linearData.lockDuration.toString(),
        delayDuration: linearData.delayDuration.toString(),
        startJoinTime: linearData.startJoinTime.toString(),
        endJoinTime: linearData.endJoinTime.toString()
      }
    }))
  })
}
