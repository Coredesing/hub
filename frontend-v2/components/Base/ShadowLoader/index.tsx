import React from 'react'
import ContentLoader from 'react-content-loader'

const ShadowLoader = (props: any) => {
  return <ContentLoader
    speed={2}
    viewBox="0 0 311 311"
    backgroundColor="#3a3c3f"
    foregroundColor="#47484c"
    animate={true}
    uniqueKey='loader'
    {...props}
  >
    <rect x="1" y="1" rx="2" ry="2" width="311" height="152" className="flex items-center align-middle justify-center" />
    <rect x="1" y="165" rx="0" ry="0" width="311" height="76" />
  </ContentLoader>
}

export default ShadowLoader
