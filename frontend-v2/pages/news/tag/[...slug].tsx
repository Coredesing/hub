import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { api, Categories } from '..'
import { format } from 'date-fns'
import Pagination from '@/components/Pages/Aggregator/Pagination'
import { useEffect, useState } from 'react'

const PER_PAGE = 10
const Articles = ({ posts, tag, pagination, pageOriginal }) => {
  const router = useRouter()
  const [page, setPage] = useState<number>(pagination.page)
  useEffect(() => {
    if (!pageOriginal && page === 1) {
      return
    }

    router.push(`/news/tag/${tag}/${page}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOriginal, tag, page])
  return <Layout title={tag ? `GameFi.org News - ${tag.toUpperCase()}` : 'GameFi.org News'}>
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-4 md:mb-8 lg:mb-10 xl:mb-16">
      <Categories active={tag}></Categories>
      <div className="flex flex-col sm:flex-row gap-6 mt-10">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            { posts && posts.map(item => <div key={item.id} className="flex flex-col gap-4 sm:gap-0">
              <Link href={`/news/${item.slug}`} passHref={true}>
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
                <Link href={`/news/${item.slug}`} passHref={true}>
                  <a className="line-clamp-3 font-bold text-lg sm:text-2xl !leading-none mt-2 mb-2 xl:mb-4 hover:underline">{item.title}</a>
                </Link>
                <div className="line-clamp-3 font-casual text-xs sm:text-sm whitespace-pre-line text-white text-opacity-75">{item.excerpt}</div>
              </div>
            </div>)}
          </div>

          <Pagination page={pagination.page} pageLast={Math.ceil(pagination?.total / pagination?.limit)} setPage={setPage} className="w-full my-8" />
        </div>
        <div className="w-full sm:w-60 xl:w-72">
          <div className="relative">
            <div className="md:text-lg 2xl:text-2xl uppercase font-bold flex">
              <span>Stay</span>
              <span className="text-gamefiGreen-500 ml-2">Connected</span>
            </div>
            <div className="w-full relative bg-gamefiDark-600 h-px">
              <div className="absolute top-0 left-0 bg-gamefiDark-600 clipped-b-r-full-sm inline-block h-[4px] w-[60px] mt-0 ml-0"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <a className="bg-[#1da1f2] rounded-sm flex items-center" href="http://twitter.com/GameFi_Official" target="_blank" rel="noreferrer">
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 26" className="w-8 h-8 sm:w-6 sm:h-6 xl:w-8 xl:h-8 my-1 mx-2">
                  <path d="M22.8773 6.80931C22.0918 7.15678 21.2588 7.38498 20.4058 7.48636C21.3048 6.94867 21.9777 6.10244 22.2991 5.10538C21.4553 5.6075 20.5303 5.9594 19.5662 6.14976C18.9186 5.45684 18.0602 4.9973 17.1244 4.84257C16.1887 4.68784 15.2281 4.84659 14.3919 5.29414C13.5557 5.74169 12.8908 6.45297 12.5005 7.3174C12.1103 8.18183 12.0165 9.15097 12.2339 10.0742C10.5229 9.98841 8.849 9.54377 7.32097 8.76911C5.79294 7.99446 4.4449 6.90711 3.36437 5.57766C2.9819 6.2346 2.78091 6.98138 2.78199 7.74154C2.78199 9.23351 3.54135 10.5516 4.69583 11.3233C4.01262 11.3018 3.34444 11.1173 2.747 10.7852V10.8387C2.74721 11.8323 3.09105 12.7953 3.72023 13.5644C4.34941 14.3335 5.22521 14.8613 6.19912 15.0584C5.5649 15.2303 4.89988 15.2556 4.25441 15.1325C4.52901 15.9878 5.0642 16.7358 5.78507 17.2718C6.50593 17.8078 7.37637 18.1049 8.27451 18.1216C7.38188 18.8226 6.35982 19.3408 5.26677 19.6466C4.17373 19.9524 3.03113 20.0398 1.9043 19.9037C3.87133 21.1687 6.16115 21.8403 8.49985 21.8381C16.4155 21.8381 20.7443 15.2806 20.7443 9.59365C20.7443 9.40844 20.7392 9.22117 20.7309 9.03801C21.5735 8.42905 22.3007 7.67468 22.8784 6.81034L22.8773 6.80931Z"/>
                </svg>
                <span className="uppercase font-semibold sm:text-sm xl:text-base">Twitter</span>
              </a>
              <a className="bg-[#0088cc] rounded-sm flex items-center" href="https://t.me/GameFi_OfficialANN" target="_blank" rel="noreferrer">
                <svg className="w-8 h-8 sm:w-6 sm:h-6 xl:w-8 xl:h-8 my-1 mx-2" viewBox="0 0 23 23" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_2872_4444)">
                    <path d="M22.1884 2.67276C22.1713 2.59235 22.133 2.51799 22.0774 2.4574C22.0218 2.39681 21.9511 2.3522 21.8724 2.32822C21.5861 2.27113 21.2897 2.2923 21.0145 2.3895C21.0145 2.3895 1.9228 9.25046 0.831969 10.0104C0.597732 10.1752 0.518745 10.2691 0.479252 10.3808C0.291317 10.9255 0.878271 11.1611 0.878271 11.1611L5.79861 12.764C5.88168 12.779 5.96714 12.7739 6.04782 12.749C7.16726 12.0422 17.3103 5.6375 17.8959 5.42232C17.9885 5.39509 18.0565 5.42232 18.032 5.48905C17.7978 6.30616 9.03571 14.0945 8.98804 14.1422C8.96479 14.1616 8.94658 14.1864 8.93496 14.2144C8.92334 14.2423 8.91866 14.2727 8.92131 14.3029L8.46237 19.1075C8.46237 19.1075 8.26899 20.6055 9.76429 19.1075C10.8252 18.0466 11.8438 17.1669 12.3518 16.7406C14.0432 17.9091 15.864 19.2001 16.6498 19.8728C16.7813 20.001 16.9375 20.1012 17.1088 20.1674C17.2801 20.2336 17.4631 20.2645 17.6466 20.2582C17.8727 20.2303 18.0849 20.1343 18.2551 19.9831C18.4254 19.8318 18.5456 19.6323 18.5999 19.4112C18.5999 19.4112 22.0876 5.41824 22.2034 3.53481C22.2143 3.35096 22.232 3.23929 22.232 3.10311C22.2369 2.95835 22.2223 2.81358 22.1884 2.67276V2.67276Z"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2872_4444">
                      <rect width="21.7895" height="21.7895" fill="white" transform="translate(0.442139 0.37915)"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="uppercase font-semibold sm:text-sm xl:text-base">Telegram</span>
              </a>
              <a className="bg-[#1877f2] rounded-sm flex items-center" href="https://www.facebook.com/GameFi.org" target="_blank" rel="noreferrer">
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 sm:w-6 sm:h-6 xl:w-8 xl:h-8 my-1 mx-2">
                  <path d="M17.525,9H14V7c0-1.032,0.084-1.682,1.563-1.682h1.868v-3.18C16.522,2.044,15.608,1.998,14.693,2 C11.98,2,10,3.657,10,6.699V9H7v4l3-0.001V22h4v-9.003l3.066-0.001L17.525,9z"></path>
                </svg>
                <span className="uppercase font-semibold sm:text-sm xl:text-base">Facebook</span>
              </a>
              <a className="bg-[#7289da] rounded-sm flex items-center" href="https://discord.com/invite/gamefi" target="_blank" rel="noreferrer">
                <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 sm:w-6 sm:h-6 xl:w-8 xl:h-8 my-1 mx-2">
                  <path d="M19.952,5.672c-1.904-1.531-4.916-1.79-5.044-1.801c-0.201-0.017-0.392,0.097-0.474,0.281 c-0.006,0.012-0.072,0.163-0.145,0.398c1.259,0.212,2.806,0.64,4.206,1.509c0.224,0.139,0.293,0.434,0.154,0.659 c-0.09,0.146-0.247,0.226-0.407,0.226c-0.086,0-0.173-0.023-0.252-0.072C15.584,5.38,12.578,5.305,12,5.305S8.415,5.38,6.011,6.872 c-0.225,0.14-0.519,0.07-0.659-0.154c-0.14-0.225-0.07-0.519,0.154-0.659c1.4-0.868,2.946-1.297,4.206-1.509 c-0.074-0.236-0.14-0.386-0.145-0.398C9.484,3.968,9.294,3.852,9.092,3.872c-0.127,0.01-3.139,0.269-5.069,1.822 C3.015,6.625,1,12.073,1,16.783c0,0.083,0.022,0.165,0.063,0.237c1.391,2.443,5.185,3.083,6.05,3.111c0.005,0,0.01,0,0.015,0 c0.153,0,0.297-0.073,0.387-0.197l0.875-1.202c-2.359-0.61-3.564-1.645-3.634-1.706c-0.198-0.175-0.217-0.477-0.042-0.675 c0.175-0.198,0.476-0.217,0.674-0.043c0.029,0.026,2.248,1.909,6.612,1.909c4.372,0,6.591-1.891,6.613-1.91 c0.198-0.172,0.5-0.154,0.674,0.045c0.174,0.198,0.155,0.499-0.042,0.673c-0.07,0.062-1.275,1.096-3.634,1.706l0.875,1.202 c0.09,0.124,0.234,0.197,0.387,0.197c0.005,0,0.01,0,0.015,0c0.865-0.027,4.659-0.667,6.05-3.111 C22.978,16.947,23,16.866,23,16.783C23,12.073,20.985,6.625,19.952,5.672z M8.891,14.87c-0.924,0-1.674-0.857-1.674-1.913 s0.749-1.913,1.674-1.913s1.674,0.857,1.674,1.913S9.816,14.87,8.891,14.87z M15.109,14.87c-0.924,0-1.674-0.857-1.674-1.913 s0.749-1.913,1.674-1.913c0.924,0,1.674,0.857,1.674,1.913S16.033,14.87,15.109,14.87z"/>
                </svg>
                <span className="uppercase font-semibold sm:text-sm xl:text-base">Discord</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
}

export default Articles

export async function getStaticProps (context) {
  const tag = context.params.slug?.[0]
  const page = context.params.slug?.[1]
  if (!tag) {
    return {
      notFound: true,
      revalidate: 60
    }
  }

  const posts = await api.posts.browse({ filter: `tag:${tag}`, limit: PER_PAGE, page: page || 1 }).catch(() => {})
  if (!posts) {
    return {
      notFound: true,
      revalidate: 60
    }
  }

  const { pagination } = posts.meta
  return {
    props: { posts, tag, pagination, pageOriginal: page || null },
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
