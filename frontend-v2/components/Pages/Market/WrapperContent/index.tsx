import React from 'react'
import { useMediaQuery } from 'react-responsive'

const WrapperContent = (props: any) => {
  return (
    <div style={{ maxWidth: '1344px' }} className="px-5 m-auto">
      {props.children}
    </div>
  )
}

export default WrapperContent

export const WrapperItem = (props: any) => {
  const isMsScreen = useMediaQuery({ maxWidth: '640px' })
  return <div style={{ width: isMsScreen ? '220px' : '280px' }} {...props}>
    {props.children}
  </div>
}
