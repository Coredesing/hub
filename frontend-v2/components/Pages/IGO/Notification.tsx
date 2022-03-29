import React from 'react'
import Image from 'next/image'

const Notification = ({ type, text }: { type: 'error' | 'success'; text: string }) => {
  return (
    <div
      className="w-full px-6 py-2 mb-4 inline-flex items-center gap-2 justify-center text-center font-casual text-sm"
      style={{
        background: type === 'success'
          ? 'linear-gradient(90deg, rgba(28, 45, 102, 0) 0%, #1C2D66 24.78%, #1C2D66 50.41%, #1C2D66 75.81%, rgba(28, 45, 102, 0) 100%)'
          : 'linear-gradient(90deg, rgba(222, 67, 67, 0) 0%, #DE4343 24.78%, #DE4343 50.41%, #DE4343 75.81%, rgba(222, 67, 67, 0) 100%)'
      }}
    >
      {
        type === 'success' && <div className="hidden md:block"><Image src={require('@/assets/images/icons/notify-success.png')} alt=""></Image></div>
      }
      {
        type === 'error' && <div className="hidden md:block"><Image src={require('@/assets/images/icons/notify-error.png')} alt=""></Image></div>
      }
      {text}
    </div>
  )
}

export default Notification
