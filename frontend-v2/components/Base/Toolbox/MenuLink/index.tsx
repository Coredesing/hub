import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useMemo } from 'react'

type Props = {
  children?: ReactNode;
  path?: string;
  onClick: () => void;
}
const MenuLink = ({ children, path, onClick }: Props) => {
  const router = useRouter()
  const isActive = useMemo(() => {
    return router.pathname === path || (router.asPath.indexOf(path) === 0 && path !== '/')
  }, [router, path])

  return (
    <Link href={path} passHref>
      <div
        onClick={onClick}
        className={`relative w-full py-4 flex align-middle items-center px-5 uppercase gap-5 text-sm font-semibold cursor-pointer ${
          isActive ? 'text-white' : 'text-gamefiDark-300'
        }`}
        style={isActive
          ? {
            background: 'linear-gradient(90.53deg, #282B38 1.72%, #15171e 80%)'
          }
          : {}}
      >
        {isActive && <span
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
