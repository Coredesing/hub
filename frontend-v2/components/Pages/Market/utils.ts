import { useState, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '@/utils/constants'

import { Contract } from '@ethersproject/contracts'
import ERC721Abi from '@/components/web3/abis/Erc721.json'
// import ERC20Abi from '@/components/web3/abis/ERC20.json'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { fetcher } from '@/utils'
import { useWeb3Default } from '@/components/web3'
import { ObjectType } from '@/utils/types'
// import { BigNumber } from 'ethers'

export const networkImage = (network: string) => {
  switch (network) {
    case 'bsc': {
      return require('@/assets/images/networks/bsc.svg')
    }

    case 'eth': {
      return require('@/assets/images/networks/eth.svg')
    }

    case 'polygon': {
      return require('@/assets/images/networks/polygon.svg')
    }
  }
}

// const currencies = {
//   list: {},
//   get(token: string) {
//     return this.list[token]
//   },
//   set(token: string, symbol: string) {
//     this.list[token] = symbol
//   }
// }

export const useNFTInfos = (listData: any[], onSetOneItem?: (item: any) => any) => {
  const { provider } = useLibraryDefaultFlexible('bsc', false)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!provider || !listData?.length) return
    setLoading(true)
    const list = []
    const fetchDatas = async () => {
      for (let i = 0; i < listData?.length || 0; i++) {
        let item = listData[i]
        try {
          const tokenAddress = item?.token_address
          const tokenId = item.token_id
          const erc721Contract = new Contract(tokenAddress, ERC721Abi, provider)
          if (!erc721Contract) return null
          let collectionInfo = await fetcher(`${API_BASE_URL}/marketplace/collection/${item?.slug}`).then(res => res?.data)
          collectionInfo = collectionInfo || {}
          item.collection_info = collectionInfo

          // if (!BigNumber.from(item.currency || 0).isZero()) {
          //   item.currencySymbol = currencies.get(item.currency)
          //   if (!item.currencySymbol) {
          //     const erc20Contract = new Contract(item.currency, ERC20Abi, provider)
          //     if (!erc20Contract) return null
          //     const symbol = await erc20Contract.symbol().then(s => s).catch(console.error)
          //     item.currencySymbol = symbol
          //     currencies.set(item.currency, symbol)
          //   }
          // }
          if (+collectionInfo.use_external_uri === 1) {
            const result = await fetcher(`${API_BASE_URL}/marketplace/collection/${tokenAddress}/${tokenId}`, { method: 'POST' })
            const info = result.data
            if (info) {
              item = { ...item, token_info: info }
            }
          } else {
            const tokenURI = await erc721Contract.tokenURI(tokenId)
            let info = {}
            try {
              info = await fetcher(tokenURI)
            } catch (error) {
              console.debug('err', error)
            }
            item = { ...item, token_info: info }
          }
          item = {
            collection_info: collectionInfo,
            ...item
          }
        } catch (error) {
          setErrorMessage(error.message || error)
        }
        if (onSetOneItem) {
          onSetOneItem(item)
        }
        list.push(item)
      }
      setData(list)
      setLoading(false)
    }

    fetchDatas().catch(e => console.debug(e))
    return function () {
      setLoading(false)
    }
  }, [provider, listData, onSetOneItem])

  return { data, error, loading, errorMessage }
}

export const useNFTInfo = (projectInfo: ObjectType, tokenId: string | number) => {
  const [loading, setLoading] = useState(true)
  const { library } = useWeb3Default()
  const [tokenInfo, setTokenInfo] = useState<any>()
  const getTokenInfo = useCallback(async () => {
    try {
      if (!projectInfo) {
        setLoading(false)
        return
      }
      if (!library) return
      if (+projectInfo.use_external_uri === 1) {
        const result = await fetcher(`${API_BASE_URL}/marketplace/collection/${projectInfo.token_address}/${tokenId}`, { method: 'POST' })
        const info = result.data
        if (info) {
          setTokenInfo({ ...info, id: tokenId })
        }
      } else {
        const erc721Contract = new Contract(projectInfo.token_address, ERC721Abi, library)
        const tokenURI = await erc721Contract.tokenURI(tokenId)
        let info = {}
        try {
          info = await fetcher(tokenURI)
        } catch (error) {
          console.debug('err', error)
        }
        setTokenInfo({ ...info, id: tokenId })
      }
    } catch (error) {
      console.debug('error', error)
      setTokenInfo(null)
    }
  }, [projectInfo, tokenId, library])

  useEffect(() => {
    getTokenInfo().catch(err => {
      console.debug(err)
    })
  }, [getTokenInfo])

  useEffect(() => {
    if (tokenInfo !== undefined) {
      setLoading(false)
    }
  }, [tokenInfo])

  return {
    loading,
    tokenInfo
  }
}
