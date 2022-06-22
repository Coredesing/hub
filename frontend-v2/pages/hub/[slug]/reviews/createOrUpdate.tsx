import React from 'react'
import Layout from '@/components/Layout'
import { CreateReview } from '@/components/Pages/Hub/Reviews'
import { useRouter } from 'next/router'
import { callWidthGraphql } from '@/pages/api/hub/[slug]'
import get from 'lodash.get'
import isEmpty from 'lodash.isempty'

function Create ({ data }) {
  const router = useRouter()

  return (
    <Layout title="GameFi.org - Games" description="An ultimate gaming destination for gamers, investors, and other game studios.">
      <div className="px-4 xl:p-16 2xl:px-36 container mx-auto lg:block">
        <a onClick={() => {
          // router.push(`/hub/${router.query.slug}?tab=2`).finally(() => {})
          router.back()
        }} className="inline-flex items-center text-[13px] font-casual mb-6 hover:text-gamefiGreen-500 cursor-pointer">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5 8.5H1.5" stroke="currentColor" strokeMiterlimit="10" />
            <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="square" />
          </svg>
          Back
        </a>
        <CreateReview data={data} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps ({ query }) {
  const { slug } = query
  try {
    const { data } = await callWidthGraphql(slug)
    const detail = get(data, 'aggregators.data[0]')
    if (isEmpty(detail)) {
      return { props: { data: {}, data1: data } }
    }

    return { props: { data: { id: detail.id, ...detail.attributes } } }
  } catch (e) {
    return {
      props: { data: {}, query }
    }
  }
}

export default Create
