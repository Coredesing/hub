import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import TabMenus from './TabMenus'
import styles from './Asset.module.scss'
import CardSlim from '../Market/CardSlim'
import { useMyWeb3 } from '@/components/web3/context'
import { fetcher } from '@/utils'
import { Contract } from '@ethersproject/contracts'
import ERC721Abi from '@/components/web3/abis/Erc721.json'
// import LoadingOverlay from '@/components/Base/LoadingOverlay'
// import Dropdown from '@/components/Base/Dropdown'
import { API_BASE_URL } from '@/utils/constants'
import { BeatLoader, MoonLoader } from 'react-spinners'
import clsx from 'clsx'
import { useRouter } from 'next/router'

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
  const [availableSlugs, setAvailableSlug] = useState([])

  const router = useRouter()
  const slug = useMemo(() => {
    const x = router.query.slug
    if (!availableSlugs.includes(x)) return ''
    return x || ''
  }, [availableSlugs, router.query.slug])

  const tab = useMemo(() => {
    return Number(router.query.tab) || 0
  }, [router.query.tab])

  useEffect(() => {
    setTab(tab)
  }, [tab])
  const onChangeTab = (val: number) => {
    setTab(val)
  }

  const [assetLoading, setAssetLoading] = useState(false)
  const [assetComponents, setAssetComponents] = useState<ReactNode[]>([])

  const getMyListAsset = useCallback(async (account: string, erc721Contract: any, prjInfo: any) => {
    try {
      const collections: any[] = []
      const result = await fetcher(`${API_BASE_URL}/marketplace/owner/${prjInfo.slug}?wallet=${account}`)
      const array = result.data?.data || []
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
            const info = (await fetcher(tokenURI)) || {}
            Object.assign(collection, info)
          } catch (error) {
            console.debug('err', error)
          }
        }
        collection.value = collection.value || collection.price
        collections.push(collection)
        setAssetComponents((c) => [
          ...c,
          <CardSlim item={collection} key={collection.id} detailLink={`/account/collections/${prjInfo.slug}/${collection.id}`} />
        ])
      }
      return collections
    } catch (error) {
      console.debug('error', error)
      return []
    }
  }, [])

  const getMyAssetsFromExternalUri = useCallback(async (amountBox: number, erc721Contract: any, prjInfo: any) => {
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
          const result = await fetcher(`${API_BASE_URL}/marketplace/collection/${prjInfo.token_address}/${idCollection}`, { method: 'POST' })
          const info = result.data || {}
          Object.assign(collection, info)
        } else {
          if (erc721Contract) {
            const tokenURI = await erc721Contract.tokenURI(collection.token_id)
            const info = (await fetcher(tokenURI)) || {}
            Object.assign(collection, info)
          }
        }
      } catch (error: any) {
        collection.icon = 'default.img'
      }
      collection.value = collection.value || collection.price
      setAssetComponents((c) => [
        ...c,
        <CardSlim item={collection} key={collection.id} detailLink={`/account/collections/${prjInfo.slug}/${collection.id}`} />
      ])
      collections.push(collection)
    }
    return collections
  }, [account])

  useEffect(() => {
    setAssetComponents([])
  }, [currentTab])

  useEffect(() => {
    if (!account || !library) return
    const type = assetTypes[currentTab].type || assetTypes[0].type
    setAssetLoading(true)
    fetcher(`${API_BASE_URL}/marketplace/collections/support?type=${type}`).then(async (res) => {
      const arr = res.data || []
      const listSlug = []
      arr.forEach(item => {
        if (item.slug && !listSlug.includes(item.slug)) {
          listSlug.push(item.slug)
        }
      })

      setAvailableSlug(listSlug)
      console.log('ccc', listSlug)

      if (arr.length) {
        for (let i = 0; i < arr.length; i++) {
          const p = arr[i]
          if (slug && p.slug !== slug) {
            continue
          }
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
              await getMyListAsset(account, erc721Contract, p)
            } else {
              await getMyAssetsFromExternalUri(myBoxes, erc721Contract, p)
            }
          } catch (error) {
          }
        }
      }
      setAssetLoading(false)
    })
  }, [currentTab, account, library, assetTypes, getMyAssetsFromExternalUri, getMyListAsset, slug])

  return <div>
    <div className='header px-9 '>
      <h3 className='mt-14 lg:mt-0 font-bold text-2xl uppercase'>Assets ({assetLoading ? <BeatLoader color='#fff' size={6} /> : assetComponents.length})</h3>
      <TabMenus value={currentTab} menus={[assetTypes[0].name, assetTypes[1].name, assetTypes[2].name]} tabDisabled={assetLoading} onChange={!assetLoading ? onChangeTab : undefined} />
    </div>
    <div className={styles.content}>
      {/* <LoadingOverlay loading={assetLoading}></LoadingOverlay> */}
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

      <div className={clsx(styles.collectionList, 'relative')}>
        {assetComponents}
        {assetLoading && <div className='flex items-center justify-center' style={{ width: '280px', height: '420px' }}><MoonLoader size={50} color='#fff'></MoonLoader></div>}
      </div>
      {
        !assetLoading && !assetComponents.length && <div className='flex items-center w-full h-32 justify-center'>
          <h1 className='uppercase text-4xl text-center font-bold'>No Collections Found</h1>
        </div>
      }
    </div>
  </div>
}

export default Asset
