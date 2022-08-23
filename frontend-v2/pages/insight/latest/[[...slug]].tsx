import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { api, Categories, cleanHTML, Right } from '..'
import { format } from 'date-fns'
import Pagination from '@/components/Pages/Hub/Pagination'
import { useEffect, useState } from 'react'

const PER_PAGE = 10
const Articles = ({ posts, pagination }) => {
  const original = pagination.page
  const router = useRouter()
  const [page, setPage] = useState<number>(pagination.page)
  useEffect(() => {
    if (page === original) {
      return
    }

    router.push(`/insight/latest/${page}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
  return <Layout title={'GameFi.org - Latest News'} description="An integrated information channel providing the latest news on GameFi.org">
    <div className="px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-16">
      <Categories active={'latest'}></Categories>
      <div className="flex flex-col sm:flex-row gap-12 mt-10 mb-12">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            { posts && posts.map(item => <div key={item.id} className="flex flex-col gap-4 sm:gap-0">
              <Link href={`/insight/${item.slug}`} passHref={true}>
                <a className="block relative w-full aspect-[16/9]">
                  <Image src={item.feature_image} layout="fill" alt={item.title} className="rounded" objectFit={'contain'}></Image>
                </a>
              </Link>

              <p className="font-casual text-[13px] text-white text-opacity-50 mt-2 hidden sm:block">
                {format(new Date(item.published_at), 'MMM d, yyyy')}
                <span className="mx-2">•</span>
                {item.reading_time} min read
              </p>

              <div className="w-full sm:max-w-xl">
                <Link href={`/insight/${item.slug}`} passHref={true}>
                  <a className="line-clamp-2 font-semibold text-[22px] !leading-shi -mt-2 sm:mt-1 mb-2 hover:underline tracking-wide">{item.title}</a>
                </Link>
                <div className="line-clamp-2 font-casual text-sm sm:text-sm text-white text-opacity-75">{item.excerpt}</div>
              </div>
            </div>)}
          </div>

          <Pagination page={pagination.page} pageLast={Math.ceil(pagination?.total / pagination?.limit)} setPage={setPage} className="w-full mt-14 mb-14" />
        </div>
        <Right></Right>
      </div>
    </div>
  </Layout>
}

export default Articles

export async function getStaticProps (context) {
  const page = context.params.slug?.[0] || 1
  const posts = await api.posts.browse({ limit: PER_PAGE, filter: 'tag:-unlisted', page }).catch(() => {})

  if (!posts) {
    return {
      notFound: true,
      revalidate: 60
    }
  }

  const { pagination } = posts.meta
  return {
    props: { posts: cleanHTML(posts), pagination },
    revalidate: 60
  }
}

export async function getStaticPaths () {
  const posts = await api.posts.browse({ limit: PER_PAGE, fields: ['title'], filter: 'tag:-unlisted' }).catch(() => {})
  const pages = posts?.meta?.pagination?.pages || 1
  if (pages === 1) {
    return {
      paths: [
        { slug: [] },
        { slug: ['1'] }
      ],
      fallback: 'blocking'
    }
  }

  const paths = Array.from(Array(pages).keys()).map(x => {
    return {
      params: { slug: [`${x + 1}`] }
    }
  })

  return {
    paths: [
      { params: { slug: [] } },
      ...paths
    ],
    fallback: 'blocking'
  }
}
