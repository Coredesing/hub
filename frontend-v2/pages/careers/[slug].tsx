import Layout from '@/components/Layout'
import Link from 'next/link'
import { jobs } from './index'

const Career = ({ data }) => {
  if (!data) {
    return null
  }

  return (<Layout title={data.title}>
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block pb-16 max-w-4xl">
      <Link href="/careers" passHref={true}>
        <a className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5 8.5H1.5" stroke="currentColor" strokeMiterlimit="10" />
            <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="square" />
          </svg>
          CURRENT OPENINGS
        </a>
      </Link>

      <div className="uppercase font-bold text-4xl">{data.title}</div>

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
      <p className="font-casual text-sm leading-6 opacity-80 mb-2">Icetea Labs is a laboratory incubating and nurturing blockchain-enabled projects. Our mission is to support visionary founders and energetic teams to create a long-lasting positive impact through decentralization technologies. We not only finance potential projects but also advise, assist and connect projects with our extensive network of strategic partners.</p>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">Learn more: <a href="https://icetea.io/" className="text-gamefiGreen-500 hover:text-gamefiGreen-800">https://icetea.io/</a></p>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">APPLLCATION</div>

      <p className="font-casual text-sm leading-6 font-bold mt-4">
        <span className="inline-block w-20">Method:</span> <span className="font-normal opacity-80">Send CV & Portfolio to email: <a href="mailto:talent@icetea.io" className="text-gamefiGreen-500 hover:text-gamefiGreen-800">talent@icetea.io</a></span>
      </p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        <span className="inline-block w-20">Title:</span><span className="font-normal opacity-80">CV Talent Acquisition Specialist – Your full name</span>
      </p>

      <div className="flex mt-4">
        <div className="font-casual text-sm leading-6 font-bold w-20">Contact:</div>
        <div>
          <p className="font-casual text-sm leading-6 opacity-80 mb-4">Nguyen Son Tung – Talent Acquisition Leader</p>
          <p className="font-casual text-sm leading-6 opacity-80 mb-4">Email: tung.nguyen1@icetea.io</p>
          <p className="font-casual text-sm leading-6 opacity-80 mb-4">Skype: live:.cid.50f48be3d1f32dcc</p>
          <p className="font-casual text-sm leading-6 opacity-80 mb-4">Telegram: @tweeday54</p>
          <p className="font-casual text-sm leading-6 opacity-80 mb-4">Phone/Zalo: +84 834 096 856</p>
        </div>
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
    fallback: true // false or 'blocking'
  }
}
