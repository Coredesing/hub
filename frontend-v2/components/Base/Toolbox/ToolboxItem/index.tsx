import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode;
  path?: string;
}
const ToolboxItem = ({ children, path }: Props) => {
  const router = useRouter()
  return (
    <Link href={path} passHref>
      <a
        className={`relative w-full py-4 flex flex-col align-middle items-center justify-center uppercase text-xs lg:text-sm font-semibold cursor-pointer ${
          ((path.length === 1 && router.asPath === path) || (path.length > 1 && router.asPath.includes(path))) ? 'dark:bg-gamefiDark-900 text-white' : 'text-gamefiDark-300'
        }`}
      >
        {((path.length === 1 && router.asPath === path) || (path.length > 1 && router.asPath.includes(path))) && <span
          style={{
            position: 'absolute',
            width: '60%',
            height: '3px',
            top: 'auto',
            bottom: '0',
            background: '#72F34B',
            boxShadow: '0px -5px 16px #72F34B'
          }}
          className="rounded-t-sm"
        ></span>}
        {children}
      </a>
    </Link>
  )
}

export default ToolboxItem
