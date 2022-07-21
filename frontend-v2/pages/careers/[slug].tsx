import { useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { jobs } from './index'
import Layout from '@/components/Layout'
import { BackIcon } from '@/components/Base/Icon'

const Career = ({ data }) => {
  const router = useRouter()

  const linkShare = process.env.NEXT_PUBLIC_SITE_URL + router.asPath

  useEffect(() => {
    (window as any)?.FB?.XFBML?.parse();
    (window as any)?.twttr?.widgets?.load()
  }, [linkShare])

  if (!data) {
    return null
  }

  return (<Layout title={data.title ? `GameFi.org - ${data.title}` : 'GameFi.org - Careers'}>
    <div id="fb-root"></div>
    <Script id="twitter-share">
      {`
          window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
              t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);

            t._e = [];
            t.ready = function(f) {
              t._e.push(f);
            };

            return t;
          }(document, "script", "twitter-wjs"));
        `}
    </Script>
    <Script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v13.0" nonce="FBK6mkSr" id="facebook-share"></Script>
    <div className="px-4 lg:px-16 mx-auto lg:block pb-12 max-w-4xl">
      <Link href="/careers" passHref={true}>
        <a className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500">
          <BackIcon/>
          CURRENT POSITIONS
        </a>
      </Link>

      <div className="uppercase font-bold text-3xl md:text-4xl">{data.title}</div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">JOB DESCRIPTION</div>
      <ul className="font-casual text-sm leading-6 opacity-80 mb-8 list-disc pl-4">
        {data.descriptions.map(r =>
          <li key={r}>{r}</li>
        )}
      </ul>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">REQUIREMENTS</div>
      <ul className="font-casual text-sm leading-6 opacity-80 mb-4 list-disc pl-4">
        {data.requirements.map(r =>
          <li key={r}>{r}</li>
        )}
      </ul>

      {data?.advantages && <>
        <p className="font-casual text-sm leading-6 font-bold">📌 Advantage</p>
        <ul className="font-casual text-sm leading-6 opacity-80 mb-8 list-disc pl-4">
          {data?.advantages.map(r =>
            <li key={r}>{r}</li>
          )}
        </ul>
      </>
      }

      <div className="uppercase font-bold text-2xl mb-2 mt-8">BENEFITS</div>
      <ul className="font-casual text-sm leading-6 opacity-80 mb-8 list-disc pl-4">
        {data.benefits.map(r =>
          <li key={r}>{r}</li>
        )}
      </ul>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">ABOUT OUR COMPANY</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-2">GameFi.org is an all-encompassing hub for game finance. Its ecosystem features a Launchpad, GameFi Hub, Marketplace, GameFi Earn, Guild Hub, and Tournament. GameFi.org was created to work out problems that most game studios have encountered and discovered effective ways in developing a platform that builds relationships with game developers, players, and investors all in one place.</p>

      <div className="mt-2 w-full flex gap-2 items-center">

        <div className="fb-share-button ml-auto" data-href={linkShare} data-layout="button_count" data-size="small"><a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkShare)}&amp;src=sdkpreparse`} className="fb-xfbml-parse-ignore" rel="noreferrer">Share</a></div>

        <a className="twitter-share-button" href={linkShare}>Tweet</a>

      </div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">APPLICATION</div>

      <p className="font-casual text-sm leading-6 font-bold mt-4">
        <span className="inline-block w-20">Method:</span> <span className="text-xs sm:text-sm font-normal opacity-80">Send CV & Portfolio via email</span>
      </p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        <span className="inline-block w-20">Subject:</span><span className="text-xs sm:text-sm font-normal opacity-80">[GameFi.org] [Position] – Your full name</span>
      </p>

      <div className="flex mt-4">
        <div className="font-casual text-sm leading-6 font-bold w-20">Contact:</div>
        <p className="font-casual text-sm leading-6 opacity-80 mb-4"><a href="mailto:talent@icetea.io" className="text-gamefiGreen-500 hover:text-gamefiGreen-800 text-xs sm:text-sm">talent@icetea.io</a></p>
      </div>
    </div>
  </Layout>)
}

export default Career

export function getStaticProps ({ params }) {
  if (!params?.slug) {
    return { props: { data: {} } }
  }

  const data = jobs.find(job => job.id === params.slug)
  return { props: { data: data } }
}

export function getStaticPaths () {
  const paths = jobs.map(job => {
    return {
      params: { slug: job.id }
    }
  })

  return {
    paths,
    fallback: true
  }
}
