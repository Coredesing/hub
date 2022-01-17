import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  path?: string
}
const SidebarLink = ({children, path}: Props) => {
  const router = useRouter()
  return (
    <Link href={path} passHref>
      <div
        className={`relative w-full py-4 flex flex-col align-middle items-center justify-center uppercase text-xs font-semibold cursor-pointer ${
          router.pathname === path ? 'dark:bg-gamefiDark-900 opacity-100' : 'opacity-40'
        }`}
      >
        {router.pathname === path && <span
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

export default SidebarLink