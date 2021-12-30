import React, { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'

type Props = {
  children?: ReactNode,
  show?: boolean,
  toggle?: any,
  className?: any
}

const Modal = ({ children, show, toggle, className }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    if (close) {
      close()
    }
    toggle(false)
  }

  useEffect(() => {
    function handleClick(event: any) {
      if (wrapperRef?.current && !wrapperRef?.current?.contains(event.target)) {
        handleClose()
      }
    }

    if (!show) {
      document.removeEventListener('click', handleClick, { capture: true })
      return
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
    }
  }, [wrapperRef, show])

  return (
    show &&
    <>
      <div
        className={`modal bg-blue-gray-800 bg-opacity-60 items-center lg:py-40 ${
          show ? 'modal-open' : ''
        } ${className}`}
      >
        <div ref={wrapperRef} className="px-10 py-8">
          <div className="bg-mechBlue-400 px-4 py-3 w-full flex justify-between rounded-t-sm shadow-lg">
            <div className="text-lg uppercase font-bold">{}</div>
            <button className="ml-auto " onClick={handleClose}>
              {/* <X className="w-4 h-4" /> */}
            </button>
          </div>
          <div className="bg-mechBlue-500 rounded-b-sm px-4 pt-6 pb-4">
            <div className="overflow-auto">{children}</div>
            {/* {footer && <div className="pt-4">{footer}</div>} */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal