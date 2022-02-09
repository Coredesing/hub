import React from 'react'

type Props = {
  loading: boolean;
}
const LoadingOverlay = ({ ...props } : Props) => {
  return (
    props.loading
      ? <div className="w-full h-full fixed block top-0 left-0 bg-gamefiDark-900 opacity-75 z-50">
        <span className="opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
          <svg className="big-loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path fill="#fff" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      </div>
      : <></>
  )
}

export default LoadingOverlay
