import styles from '@/assets/styles/partnership.module.scss'
import { ScrollStage } from '@/components/Pages/Partnership'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import logo from '@/assets/images/logo-white.png'
import imageSocial from '@/assets/images/gamefi.jpg'

const Apply = () => {
  const refContent = useRef(null)
  const refCanvas = useRef(null)
  const stage = useRef(null)

  useEffect(() => {
    if (stage.current) {
      stage.current.update()
      return
    }

    const elContent = refContent.current
    const elCanvas = refCanvas.current

    stage.current = new ScrollStage(elContent, elCanvas)
  }, [])

  const title = 'GameFi.org - Apply For Partnership'

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={title || 'GameFi.org'} key="title" />
        <meta property="og:description" content={'GameFi.org is an all-in-one discovery gaming hub for games, guilds, and metaverses.'} key="description" />
        <meta property="og:image" content={imageSocial.src} key="image" />
        <meta name="keywords" content="launchpad, game hub, nft marketplace, game portal, game pass, game guild, tournament, metaverse, ido"></meta>
      </Head>
      <div className="absolute z-50 w-full">
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center sm:justify-start max-w-6xl mx-auto">
          <Link href="/" passHref>
            <a>
              <Image src={logo} alt="GameFi.org"></Image>
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.content} ref={refContent}>
        <div className={styles.scroll__stage}>
          <div className={styles.scroll__content}>
            <section className={styles.section}>
              <div className={styles.section__title}>
                <h1 className={styles['section__title-number']}>01</h1>
                <h2 className={styles['section__title-text']}>IGO</h2>
                <p className={clsx(styles['section__title-arrow'], 'mt-16')}>
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 3V61" stroke="white" strokeWidth="2" strokeMiterlimit="10"/>
                    <path d="M50 43L32 61L14 43" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                  </svg>
                </p>
              </div>
              <p className={clsx(styles.section__paragraph, 'font-casual font-normal leading-relaxed md:text-xl')}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, doloremque quis! Numquam ipsum soluta officiis quod iure necessitatibus molestias aliquam ea possimus, eaque consequuntur. Rerum nisi perspiciatis quis cupiditate suscipit!<br/>
                <a className={clsx(styles.button, 'mt-6 inline-block border border-white font-mechanic uppercase font-bold text-lg px-10 text-center leading-loose rounded-sm hover:text-black cursor-pointer')}>Apply</a>
              </p>
            </section>
            <section className={styles.section}>
              <div className={styles.section__title}>
                <h1 className={styles['section__title-number']}>02</h1>
                <h2 className={styles['section__title-text']}>INO</h2>
              </div>
              <p className={clsx(styles.section__paragraph, 'font-casual font-normal leading-relaxed md:text-xl')}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, doloremque quis! Numquam ipsum soluta officiis quod iure necessitatibus molestias aliquam ea possimus, eaque consequuntur. Rerum nisi perspiciatis quis cupiditate suscipit!<br/>
                <a className={clsx(styles.button, 'mt-6 inline-block border border-white font-mechanic uppercase font-bold text-lg px-10 text-center leading-loose rounded-sm hover:text-black cursor-pointer')}>Apply</a>
              </p>
            </section>
            <section className={styles.section}>
              <div className={styles.section__title}>
                <h1 className={styles['section__title-number']}>03</h1>
                <h2 className={styles['section__title-text']}>EARN</h2>
              </div>
              <p className={clsx(styles.section__paragraph, 'font-casual font-normal leading-relaxed md:text-xl')}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, doloremque quis! Numquam ipsum soluta officiis quod iure necessitatibus molestias aliquam ea possimus, eaque consequuntur. Rerum nisi perspiciatis quis cupiditate suscipit!<br/>
                <a className={clsx(styles.button, 'mt-6 inline-block border border-white font-mechanic uppercase font-bold text-lg px-10 text-center leading-loose rounded-sm hover:text-black cursor-pointer')}>Apply</a>
              </p>
            </section>
            <section className={styles.section}>
              <div className={styles.section__title}>
                <h1 className={styles['section__title-number']}>04</h1>
                <h2 className={styles['section__title-text']}>MARKET<br />-PLACE</h2>
              </div>
              <p className={clsx(styles.section__paragraph, 'font-casual font-normal md:text-xl')}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, doloremque quis! Numquam ipsum soluta officiis quod iure necessitatibus molestias aliquam ea possimus, eaque consequuntur. Rerum nisi perspiciatis quis cupiditate suscipit!<br/>
                <a className={clsx(styles.button, 'mt-6 inline-block border border-white font-mechanic uppercase font-bold text-lg px-10 text-center leading-loose rounded-sm hover:text-black cursor-pointer')}>Apply</a>
              </p>
            </section>
            <section className={styles.section}>
              <div className={styles.section__title}>
                <h1 className={styles['section__title-number']}>05</h1>
                <h2 className={styles['section__title-text']}>GAME<br />HUB</h2>
              </div>
              <p className={clsx(styles.section__paragraph, 'font-casual font-normal md:text-xl')}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, doloremque quis! Numquam ipsum soluta officiis quod iure necessitatibus molestias aliquam ea possimus, eaque consequuntur. Rerum nisi perspiciatis quis cupiditate suscipit!<br/>
                <a className={clsx(styles.button, 'mt-6 inline-block border border-white font-mechanic uppercase font-bold text-lg px-10 text-center leading-loose rounded-sm hover:text-black cursor-pointer')}>Apply</a>
              </p>
            </section>
            <section className={styles.section}>
              <div className={styles.section__title}>
                <h1 className={styles['section__title-number']}>06</h1>
                <h2 className={styles['section__title-text']}>GUILD<br />HUB</h2>
              </div>
              <p className={clsx(styles.section__paragraph, 'font-casual font-normal md:text-xl')}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, doloremque quis! Numquam ipsum soluta officiis quod iure necessitatibus molestias aliquam ea possimus, eaque consequuntur. Rerum nisi perspiciatis quis cupiditate suscipit!<br/>
                <a className={clsx(styles.button, 'mt-6 inline-block border border-white font-mechanic uppercase font-bold text-lg px-10 text-center leading-loose rounded-sm hover:text-black cursor-pointer')}>Apply</a>
              </p>
            </section>
            <section className={styles.section}>
              <div className={styles.section__title}>
                <h1 className={styles['section__title-number']}>07</h1>
                <h2 className={styles['section__title-text']}>GAME<br />PORTAL</h2>
              </div>
              <p className={clsx(styles.section__paragraph, 'font-casual font-normal md:text-xl')}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, doloremque quis! Numquam ipsum soluta officiis quod iure necessitatibus molestias aliquam ea possimus, eaque consequuntur. Rerum nisi perspiciatis quis cupiditate suscipit!<br/>
                <a className={clsx(styles.button, 'mt-6 inline-block border border-white font-mechanic uppercase font-bold text-lg px-10 text-center leading-loose rounded-sm hover:text-black cursor-pointer')}>Apply</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <canvas ref={refCanvas} className="test"></canvas>
    </div>
  )
}

export default Apply
