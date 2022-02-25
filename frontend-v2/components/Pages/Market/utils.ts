import { useState, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '@/utils/constants'

import { Contract } from '@ethersproject/contracts'
import ERC721Abi from '@/components/web3/abis/Erc721.json'
import { useLibraryDefaultFlexible } from '@/components/web3/utils'
import { fetcher } from '@/utils'
import { useWeb3Default } from '@/components/web3'
import { ObjectType } from '@/utils/types'

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

export const useNFTInfos = (listData: any[]) => {
  const { provider } = useLibraryDefaultFlexible('bsc', true)
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const list = []
    const fetchDatas = async () => {
      for (let i = 0; i < listData?.length || 0; i++) {
        let item = listData[i]
        const tokenAddress = item?.token_address
        const erc721Contract = new Contract(tokenAddress, ERC721Abi, provider)
        if (!erc721Contract) return null
        const tokenURI = await erc721Contract.functions?.tokenURI(item.id).then(res => res[0]).catch(e => console.log(e?.message))
        if (!tokenURI) {
          return null
        }
        await fetcher(tokenURI)
          .then(data => {
            item = {
              token_info: data,
              ...item
            }
          }).catch(function (e) {
            setError(true)
            setErrorMessage(e.message)
            setLoading(false)
          })
        const collectionInfo = await fetcher(`${API_BASE_URL}/marketplace/collection/${item?.token_address}`).then(res => res?.data)
        item = {
          collection_info: collectionInfo,
          ...item
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
  }, [provider, listData])

  return { data, error, loading, errorMessage }
}

export const useNFTInfo = (projectInfo: ObjectType, token_id: string | number) => {
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
        const result = await fetcher(`${API_BASE_URL}/marketplace/collection/${projectInfo.token_address}/${token_id}`, { method: 'POST' })
        const info = result.data
        if (info) {
          setTokenInfo({ ...info, id: token_id })
        }
      } else {
        const erc721Contract = new Contract(projectInfo.token_address, ERC721Abi, library)
        const tokenURI = await erc721Contract.tokenURI(token_id)
        let info = {}
        try {
          info = await fetcher(tokenURI)
        } catch (error) {
          console.debug('err', error)
        }
        setTokenInfo({ ...info, id: token_id })
      }
    } catch (error) {
      console.debug('error', error)
      setTokenInfo(null)
    }

  }, [projectInfo, token_id, library])

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