import Link from 'next/link'
import React from 'react'
import WalletConnector, { NetworkSelector } from '../WalletConnector'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Topbar = () => {
  // const router = useRouter()
  // const activeNetworks = router?.query?.activeNetworks?.toString()
  // const handleChangeNetwork = async (network: any) => {
  //   const active = []
  //   Object.keys(network).forEach(key => network?.[key] ? active.push(key) : null)
  //   console.log(active)
  //   if (active.join(',') !== activeNetworks) {
  //     await router.push({ query: { activeNetworks: active.join(',') } }, undefined, { shallow: true })
  //   }
  // }

  return (
    <>
      <div className="hidden w-full md:container md:mx-auto md:flex justify-between items-center md:h-22 lg:h-24 py-8 px-8">
        <div>
          <div className="flex align-middle items-center cursor-pointer">
            <Image src={require('assets/images/icons/search.svg')} alt='search'></Image>
            <input placeholder='Search' className="bg-transparent outline-none focus:outline-none ml-4"></input>
          </div>
        </div>
        {/* {
          router.pathname.includes('market')
            ? <div className="ml-auto">
              <NetworkSelector onChange={(network: any) => handleChangeNetwork(network)} />
            </div>
            : <></>
        } */}
        <div className="ml-auto">
          <div className='flex items-center gap-2'>
            <Link href="/account">
              <a className='font-bold uppercase text-sm flex-none'>My Account</a>
            </Link>
            <WalletConnector></WalletConnector>
          </div>
        </div>
      </div>
      <div className="z-20 h-16 md:hidden flex align-middle items-center justify-between w-full py-4 px-6" style={{ boxShadow: 'inset -1px 0px 0px #303442' }}>
        <Link href="/" passHref>
          <div className="flex align-middle items-center cursor-pointer">
            <Image src={require('assets/images/gamefi.svg')} alt='gamefi'></Image>
          </div>
        </Link>
        <div className="flex align-middle items-center cursor-pointer">
          <Image src={require('assets/images/icons/search.svg')} alt='search'></Image>
        </div>
      </div>
    </>
  )
}

export default Topbar
