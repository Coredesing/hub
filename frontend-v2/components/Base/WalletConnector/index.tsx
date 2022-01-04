import React from 'react'
import { useState } from 'react'
import Modal from '../Modal'

const WalletConnector = () => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <button
        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%, 0 0)' }}
        className='overflow-hidden py-2 px-6 bg-gamefiGreen-500 text-gamefiDark-900 font-semibold text-sm rounded-sm hover:opacity-95 cursor-pointer w-full'
        onClick={() => setShowModal(true)}
      >
        Connect Wallet
      </button>
      <Modal show={showModal} toggle={setShowModal} className='px-4 py-2'>
        <div>Wallet Connector</div>
      </Modal>
    </>
  )
}

export default WalletConnector