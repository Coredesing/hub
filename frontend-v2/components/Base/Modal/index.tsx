/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ObjectType } from '@/utils/types'
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import { CloseIcon } from '../Icon'
import styles from './Modal.module.scss'

type Props = {
  children?: ReactNode;
  show?: boolean;
  toggle?: any;
  className?: any;
  onClose?: any;
} & ObjectType

const Modal = ({ children, show, toggle, className, onClose, ...props }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const handleClose = useCallback(() => {
    onClose && onClose()
    toggle && toggle(false)
  }, [onClose, toggle])

  useEffect(() => {
    function handleClick (event: any) {
      if (wrapperRef?.current && !wrapperRef?.current?.contains(event?.target)) {
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
  }, [wrapperRef, show, toggle, handleClose])

  return (
    show
      ? <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: '9999' }}>
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gamefiDark-900 bg-opacity-75 transition-opacity -z-[1]"></div>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <div ref={wrapperRef} {...props} className={`dark:bg-gamefiDark-400 inline-block align-bottom rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full relative ${styles.modalContent} ${className}`}>
            <button onClick={handleClose} className='absolute right-4 top-4 cursor-pointer'>
              <CloseIcon />
            </button>
            {children}
          </div>
        </div>
      </div>
      : null
  )
}

export default Modal
