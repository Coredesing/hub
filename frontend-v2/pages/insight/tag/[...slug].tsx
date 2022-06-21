import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { api, Categories, Right } from '..'
import { format } from 'date-fns'
import Pagination from '@/components/Pages/Hub/Pagination'
import { useEffect, useState } from 'react'

const PER_PAGE = 10
const Articles = ({ posts, tag, pagination }) => {
  const original = pagination.page
  const router = useRouter()
  const [page, setPage] = useState<number>(pagination.page)
  useEffect(() => {
    if (page === original) {
      return
    }

    router.push(`/insight/tag/${tag}/${page}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
  return <Layout title={tag ? `GameFi.org - ${tag.toUpperCase()} Insight` : 'GameFi.org - Insight'} description="An integrated information channel providing the latest news on GameFi.org">
    <div className="px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-16">
      <Categories active={tag}></Categories>
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
  const tag = context.params.slug?.[0]
  const page = context.params.slug?.[1] || 1
  if (!tag) {
    return {
      notFound: true,
      revalidate: 60
    }
  }

  const posts = await api.posts.browse({ filter: `tag:${tag}`, limit: PER_PAGE, page }).catch(() => {})
  if (!posts) {
    return {
      notFound: true,
      revalidate: 60
    }
  }

  const { pagination } = posts.meta
  return {
    props: { posts, tag, pagination },
    revalidate: 60
  }
}

export async function getStaticPaths () {
  const tags = await api.tags.browse({ limit: 'all', filter: 'visibility:public', include: 'count.posts' })
  const paths = tags.map((tag) => ({
    params: { slug: [tag.slug] }
  }))

  tags.map(tag => {
    return Array.from(Array(Math.ceil(tag.count.posts / PER_PAGE)).keys()).map(x => {
      return [tag.slug, `${x + 1}`]
    })
  }).forEach(slugs => {
    slugs.forEach(slug => {
      paths.push({
        params: { slug }
      })
    })
  })

  return { paths, fallback: 'blocking' }
}
