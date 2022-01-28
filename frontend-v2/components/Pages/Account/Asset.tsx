import React, { useEffect, useMemo, useState } from 'react'
import TabMenus from './TabMenus'
import styles from './Asset.module.scss'
import CardSlim from '../Market/CardSlim'
import { useMyWeb3 } from 'components/web3/context'
import axios from 'axios'
import { Contract } from '@ethersproject/contracts'
import ERC721Abi from 'components/web3/abis/Erc721.json'
import LoadingOverlay from 'components/Base/LoadingOverlay'
import Dropdown from 'components/Base/Dropdown'

const Asset = () => {
  const assetTypes = useMemo(() => ({
    0: {
      name: 'Items',
      value: 0,
      type: 'nft'
    },
    1: {
      name: 'Mystery Box',
      value: 1,
      type: 'box'
    },
    2: {
      name: 'Equipment',
      value: 2,
      type: 'equipment'
    }
  }), [])
  const { account, library } = useMyWeb3()
  const [currentTab, setTab] = useState(0)
  const onChangeTab = (val: number) => {
    setTab(val)
  }

  const [assetLoading, setAssetLoading] = useState(false)
  const [assets, setAssets] = useState<any[]>([])

  const getMyListAsset = async (account: string, erc721Contract: any, prjInfo: any) => {
    try {
      const collections: any[] = []
      const result = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/marketplace/owner/${prjInfo.slug}?wallet=${account}`)
      const array = result.data.data?.data || []
      for (let j = 0; j < array.length; j++) {
        const collection: any = {
          project: prjInfo
        }
        const item = array[j]
        collection.id = item.token_id
        collection.token_id = item.token_id
        if (erc721Contract) {
          try {
            const tokenURI = await erc721Contract.tokenURI(collection.token_id)
            const infor = (await axios.get(tokenURI)).data || {}
            Object.assign(collection, infor)
          } catch (error) {
            console.debug('err', error)
          }
        }
        collection.value = collection.value || collection.price
        collections.push(collection)
      }
      return collections
    } catch (error) {
      console.debug('errr', error)
      return []
    }
  }

  const getMyAssetsFromExternalUri = async (amountBox: number, erc721Contract: any, prjInfo: any) => {
    const collections: any[] = []
    const useExternalUri = !!+prjInfo?.use_external_uri
    for (let id = 0; id < amountBox; id++) {
      const idCollection = await erc721Contract.tokenOfOwnerByIndex(account, id)
      const collection: any = {
        id: idCollection.toNumber(),
        token_id: idCollection.toNumber(),
        project: prjInfo
      }
      try {
        if (useExternalUri) {
          const result = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/marketplace/collection/${prjInfo.token_address}/${idCollection}`)
          const infor = result.data?.data || {}
          Object.assign(collection, infor)
        } else {
          if (erc721Contract) {
            const tokenURI = await erc721Contract.tokenURI(collection.token_id)
            const infor = (await axios.get(tokenURI)).data || {}
            Object.assign(collection, infor)
          }
        }
      } catch (error: any) {
        collection.icon = 'default.img'
      }
      collection.value = collection.value || collection.price
      collections.push(collection)
    }
    return collections
  }

  useEffect(() => {
    if (!account || !library) return
    const type = assetTypes[currentTab].type || assetTypes[0].type
    setAssetLoading(true)
    axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/marketplace/collections/support?type=${type}`).then(async (res) => {
      const arr = res.data.data || []
      if (arr.length) {
        let collections: any[] = []
        for (let i = 0; i < arr.length; i++) {
          const p = arr[i]
          try {
            const projectAddress = p?.token_address
            const erc721Contract = new Contract(projectAddress, ERC721Abi, library)
            if (!erc721Contract) continue
            let myBoxes = await erc721Contract.balanceOf(account)
            myBoxes = myBoxes.toNumber()
            if (!myBoxes) {
              continue
            }

            const useExternalApi = !!+p?.use_external_api
            if (useExternalApi) {
              const assets = await getMyListAsset(account, erc721Contract, p)
              collections = [...collections, ...assets]
            } else {
              const assets = await getMyAssetsFromExternalUri(myBoxes, erc721Contract, p)
              collections = [...collections, ...assets]
            }
          } catch (error) {
          }
        }
        setAssets(collections)
      } else {
        setAssets([])
      }
      setAssetLoading(false)
    })
  }, [currentTab, account, library])

  return <div>
    <div className='header px-9 '>
      <h3 className='font-bold text-2xl uppercase'>Assets ({assets.length})</h3>
      <TabMenus value={currentTab} menus={[assetTypes[0].name, assetTypes[1].name, assetTypes[2].name]} onChange={onChangeTab} />
    </div>
    <div className={styles.content}>
      <LoadingOverlay loading={assetLoading}></LoadingOverlay>
      {/* <div className='flex gap-2 flex-wrap mb-10'>
        <Dropdown
          selected={{ value: 'Listing', key: 'listing', label: 'Listing' }}
          items={[
            { value: '', key: 'all-status', label: 'All Status' },
            { value: 'Listing', key: 'listing', label: 'Listing' },
          ]}
        />
        <Dropdown
          selected={{ value: 'Listing', key: 'listing', label: 'Listing' }}
          items={[
            { value: '', key: 'all-status', label: 'All Status' },
            { value: 'Listing', key: 'listing', label: 'Listing' },
          ]}
        />
      </div> */}

      <div className={styles.collectionList}>
        {assets.map((c) => (<CardSlim item={c} key={c.id} detailLink={`/account/collections/${c.project.slug}/${c.id}`} />))}
      </div>
    </div>
  </div>
}

export default Asset
