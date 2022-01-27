import Layout from 'components/Layout'
import Link from 'next/link'
import { jobs } from './index'

const Career = ({ data }) => {
  if (!data) {
    return null
  }

  return (<Layout title={data.title}>
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-4xl pb-4">
      <Link href="/careers" passHref={true}>
        <a className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5 8.5H1.5" stroke="currentColor" strokeMiterlimit="10"/>
            <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="square"/>
          </svg>
          CURRENT OPENINGS
        </a>
      </Link>

      <div className="uppercase font-bold text-4xl">{data.title}</div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">ABOUT OUR COMPANY</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">We are proudly one of the top blockchain companies in Vietnam. Our ecosystem includes one Venture Capital, Icetea Labs; a blockchain platform with its own cryptocurrency, PolkaFoundry; and a launchpad named Red Kite.</p>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">WHO ARE WE LOOKING FOR?</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">{data.description.short}</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">Requirements:</p>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">{data.description.requirement}</p>
      <ul className="font-casual text-sm leading-6 opacity-80 list-disc pl-8">
        { data.description.requirements.map(r => <li key={r}>{r}</li>) }
      </ul>
      <p className="font-casual text-sm leading-6 font-bold mt-4">Employment Type: <span className="font-normal opacity-80">{data.description.type}</span></p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">Workplace: <span className="font-normal opacity-80">{data.description.workplace}</span></p>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">WHAT WE OFFER?</div>
      <ul className="font-casual text-sm leading-6 opacity-80 list-disc pl-8">
        { data.description.offers.map(o => <li key={o}>{o}</li>) }
      </ul>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">Apply Now</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">We want to get to know you and would love for you to consider joining us. Please reach out to us at <a href="mailto:talent@icetea.io" className="text-gamefiGreen-500 hover:text-gamefiGreen-800">talent@icetea.io</a> or <a href="https://t.me/GameFi_Official" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">our telegram</a> with your CVs! </p>
    </div>
  </Layout>)
}

export default Career

export function getServerSideProps ({ params }) {
  if (!params?.slug) {
    return { props: { data: {} } }
  }

  const data = jobs.find(job => job.id === params.slug)
  return { props: { data: data } }
}
