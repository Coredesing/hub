import Layout from '@/components/Layout'
import { defaultDescription, defaultTitle } from '@/utils/constants'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

export default function Custom404 () {
  const router = useRouter()
  const extractPath = useCallback((path) => {
    const parts = path.split('#')
    if (parts?.length !== 2) {
      return ''
    }

    return parts[1]
  }, [])

  useEffect(() => {
    const path = extractPath(router.asPath)
    if (path.indexOf('pools/token') > -1) {
      router.push('/igo')
      return
    }

    if (path.indexOf('mystery-boxes') > -1) {
      router.push('/ino')
      return
    }

    if (path.indexOf('staking-pools') > -1) {
      router.push('/staking')
      return
    }

    if (path.indexOf('account') > -1) {
      if (path.indexOf('rank') > -1) {
        router.push('/account/rank')
        return
      }

      if (path.indexOf('exp') > -1) {
        router.push('/account/gxp')
        return
      }

      if (path.indexOf('pool') > -1) {
        router.push('/account/pools')
        return
      }

      router.push('/account')
      return
    }

    if (path.indexOf('pools') > -1) {
      router.push('/igo')
      return
    }

    let regMatches = path.match(/buy-token\/(\d+)/)
    if (regMatches) {
      router.push(`/igo/${regMatches[1]}`)
      return
    }

    regMatches = path.match(/mystery-box\/(\d+)/)
    if (regMatches) {
      router.push(`/ino/${regMatches[1]}`)
      return
    }

    router.push('/')
  }, [router.asPath, extractPath, router])

  return <Layout title="GameFi.org - Disclaimer" disableFooter>
    <Head>
      <title>GameFi.org Migration</title>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={defaultTitle} key="title" />
      <meta property="og:description" content={defaultDescription} key="description" />
    </Head>
    <div className="px-4 lg:px-16 mx-auto lg:block max-w-4xl h-full -mb-[400px]">
      <div className="uppercase font-bold text-3xl">Migration From The Old Version</div>
      <p className="font-casual text-sm leading-6 opacity-80 mt-4">
        You are being redirected from the old version of GameFi.org to the new version. If this page does not change after a short period of time, please click <Link href="/" passHref><a className="text-gamefiGreen-400 hover:underline">here</a></Link>.
      </p>
    </div>
  </Layout>
}
