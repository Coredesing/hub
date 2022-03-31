import React from 'react'

const WrapperContent = (props: any) => {
  return (
    <div style={{ maxWidth: '1344px' }} className="px-5 m-auto">
      {props.children}
    </div>
  )
}

export default WrapperContent