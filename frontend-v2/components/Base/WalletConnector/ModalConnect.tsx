import { ReactNode, RefObject, useRef, useLayoutEffect, useState, useMemo } from 'react'
import useResizeObserver, { UseResizeObserverCallback } from '@react-hook/resize-observer'

type Props = {
  children?: ReactNode;
  close?: () => void;
  style?: any;
  x?: number;
  y?: number;
  hideClose?: boolean;
  bgColor?: string;
}

const useSize = (target: RefObject<HTMLElement>) => {
  const [size, setSize] = useState<DOMRectReadOnly>()

  useLayoutEffect(() => {
    if (!target?.current) {
      return
    }
    setSize(target.current.getBoundingClientRect())
  }, [target])

  const callback: UseResizeObserverCallback = (entry) => {
    setSize(entry.contentRect)
  }

  useResizeObserver(target, callback)
  return size
}

const ModalConnect = ({ children, close, style, x, y, hideClose, bgColor }: Props) => {
  const target = useRef(null)
  const size = useSize(target)
  const viewBox = useMemo(() => {
    if (!size) {
      return ''
    }
    return `0 0 ${size.width} ${size.height}`
  }, [size])
  const path = useMemo(() => {
    if (!size) {
      return ''
    }

    const qux = 12.5
    const left = x || 81.5
    const down = y || 15
    const toRight = size.width - left
    const toBottom = size.height
    const toLeft = size.width
    return `m${left} 0 h${toRight} v${toBottom} h${-toLeft} v${down - toBottom} h${left - qux} l${qux} ${-down} z`
  }, [size, x, y])

  return (
    <div ref={target} style={{ clipPath: `path('${path}')`, position: 'relative', ...style }}>
      {viewBox && <svg className="absolute inset-0" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: -1 }}>
        <path fillRule="evenodd" clipRule="evenodd" d={path} fill="currentColor" className={bgColor || 'text-gamefiDark-700'}/>
      </svg>}
      {children}

      {!hideClose && <svg onClick={close} className="absolute right-1 top-1 w-6 h-6 cursor-pointer hover:opacity-50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L9 9L12 12M18 18L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg> }

    </div>
  )
}

export default ModalConnect
