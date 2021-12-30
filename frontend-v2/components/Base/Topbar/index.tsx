import React from 'react'
import WalletConnector from '../WalletConnector'

const Topbar = () => {
  return (
    <div className="hidden w-full md:flex md:h-22 lg:h-24v py-4 px-8 bg-gamefiDark-700">
      <div>
        {/* TODO: Search here */}
      </div>
      <div className="ml-auto">
        <WalletConnector></WalletConnector>
      </div>
    </div>
  )
}

export default Topbar