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
      <div
        className={`relative w-full py-4 flex flex-col align-middle items-center justify-center uppercase text-xs lg:text-sm font-semibold cursor-pointer ${
          router.asPath.includes(path) ? 'dark:bg-gamefiDark-900 opacity-100' : 'opacity-40'
        }`}
      >
        {router.asPath.includes(path) && <span
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
      </div>
    </Link>
  )
}

export default ToolboxItem
