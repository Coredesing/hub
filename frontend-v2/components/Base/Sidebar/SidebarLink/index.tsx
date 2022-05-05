import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useMemo } from 'react'

type Props = {
  children?: ReactNode;
  path?: string;
  external?: boolean;
}
const SidebarLink = ({ children, path, external }: Props) => {
  const router = useRouter()
  const isActive = useMemo(() => {
    return router.pathname === path || (router.asPath.indexOf(path) === 0 && path !== '/')
  }, [router, path])

  if (external) {
    return (
      <a href={path} target="_blank" rel="noreferrer">
        <div
          className={'relative w-full py-4 flex flex-col align-middle items-center justify-center uppercase text-xs font-semibold cursor-pointer opacity-40'}
        >
          {children}
        </div>
      </a>
    )
  }

  return (
    <Link href={path} passHref>
      <a
        className={`relative w-full py-4 flex flex-col align-middle items-center justify-center uppercase text-xs font-semibold cursor-pointer ${
          isActive ? 'dark:bg-gamefiDark-900 text-white' : 'text-gamefiDark-300'
        }`}
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
      </a>
    </Link>
  )
}

export default SidebarLink
