import Link from 'next/link'
import WalletConnector from '../WalletConnector'
import Image from 'next/image'

const Topbar = () => {
  return (
    <>
      <div className="hidden w-full md:container md:mx-auto md:flex justify-between items-center md:h-22 lg:h-24 py-8 px-8">
        <div>
          <div className="flex align-middle items-center cursor-pointer">
            <Image src={require('assets/images/icons/search.svg')} alt='search'></Image>
            <input placeholder='Search' className="bg-transparent outline-none focus:outline-none ml-4"></input>
          </div>
        </div>
        <div className="ml-auto">
          <WalletConnector></WalletConnector>
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
