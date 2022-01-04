import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  path?: string
}
const MenuLink = ({children, path}: Props) => {
  const router = useRouter()
  return (
    <Link href={path} passHref>
      <div
        className={`relative w-full py-4 flex align-middle items-center pl-5 uppercase gap-5 text-sm font-semibold cursor-pointer ${
          router.asPath === path ? 'opacity-100' : 'opacity-40'
        }`}
        style={router.asPath === path ? {
          background: 'linear-gradient(90.53deg, #282B38 1.72%, #15171e 80%)'
        } : {}}
      >
        {router.asPath === path && <span
          style={{
            position: 'absolute',
            width: '3px',
            height: '60%',
            left: '0',
            top: 'auto',
            bottom: 'auto',
            background: '#72F34B',
            boxShadow: '5px 0px 16px #72F34B'
          }}
          className="rounded-r-sm"
        ></span>}
        {children}
      </div>
    </Link>
  )
}

export default MenuLink