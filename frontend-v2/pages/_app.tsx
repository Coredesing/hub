import React from 'react'
import { AppProps } from 'next/app'

import '../assets/styles/index.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp