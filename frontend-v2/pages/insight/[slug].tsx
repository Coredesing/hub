import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { api, Categories } from '.'
import { format } from 'date-fns'
import avatar from '@/assets/images/avatar.png'
import Head from 'next/head'

const Article = ({ post }) => {
  return <Layout title={post.title} description={post.excerpt} image={post.feature_image}>
    <Head>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      <meta name="twitter:url" content={`https://gamefi.org/insight/${post.slug}`} />
      <meta name="twitter:image" content={post.feature_image} />
      <meta name="twitter:site" content="@GameFi_Official" />
    </Head>
    <div className="px-4 lg:px-16 mx-auto lg:block max-w-7xl mb-4 md:mb-8 lg:mb-10 xl:mb-16">
      <Categories active={post.primary_tag?.slug}></Categories>
    </div>
    <div className="px-4 lg:px-16 mx-auto lg:block max-w-4xl my-8 mb-16">
      <h1 className="text-[28px] !leading-shi lg:text-4xl font-bold uppercase">{post.title}</h1>

      {post.primary_author && <div className="flex gap-2 items-center mt-2 xl:mt-6">
        <div className="relative w-11 h-11">
          <img src={post.primary_author?.profile_image || avatar} className="w-full h-full object-cover rounded-full" alt={post.primary_author?.name}></img>
        </div>
        <div>
          <p className="font-casual font-medium text-sm leading-loose">{post.primary_author?.name}</p>
          <p className="font-casual text-[13px] text-white text-opacity-50">
            {format(new Date(post.published_at), 'MMM d, yyyy')}
            <span className="mx-2">•</span>
            {post.reading_time} min read
          </p>
        </div>
      </div>}

      <div className="relative mt-6">
        <img src={post.feature_image} alt={post.title} className="w-full aspect-[16/9]"></img>
      </div>
      <div className="mt-6 font-casual editor-content !text-base text-white text-opacity-95" dangerouslySetInnerHTML={{ __html: post.html }} />
      <div className="h-px bg-gradient-to-r from-gray-300/30 mt-8"></div>
      <p className="font-bold font-casual text-base mt-2">Tags</p>
      <div className="mt-4 inline-flex gap-2 flex-wrap font-casual text-sm">
        {post.tags && post.tags.map(tag =>
          <Link href={`/insight/tag/${tag.slug}`} passHref={true} key={tag.id}>
            <a className="px-2 py-1 bg-[#242732] cursor-pointer hover:bg-gamefiDark-650 uppercase rounded-sm" key={tag.id}>{tag.name}</a>
          </Link>
        )}
      </div>
      <div className="h-px bg-gradient-to-r from-gray-300/30 my-8"></div>
      {post.primary_author && <div className="flex gap-4 items-center mt-2 xl:mt-6">
        <div className="relative w-20 h-20">
          <Image src={post.primary_author?.profile_image || avatar} layout="fill" className="rounded-full" alt={post.primary_author?.name}></Image>
        </div>
        <div className="flex-1">
          <p className="font-bold text-[13px] text-white text-opacity-50 uppercase">Author</p>
          <p className="font-casual font-medium text-lg">{post.primary_author?.name}</p>
          {post.primary_author?.bio && <p className="font-casual text-base text-white text-opacity-75">
            {post.primary_author?.bio}
          </p>}
        </div>
      </div>}
    </div>
  </Layout>
}

export default Article

export async function getStaticProps (context) {
  let slug = context.params.slug
  if (slug === 'game-hub-in-gamefi-org-improve-your-experience-to-overview-the-blockchain-gaming-world') {
    slug = 'gamefi-org-game-hub-a-steam-like-platform-bring-together-all-blockchain-games-and-gamified-projects'
  }

  const post = await api.posts.read({ slug: context.params.slug, include: 'authors,tags' }).catch(() => { })

  if (!post) {
    return {
      notFound: true,
      revalidate: 10
    }
  }

  return {
    props: { post },
    revalidate: 10
  }
}

export async function getStaticPaths () {
  const posts = await api.posts.browse({ limit: 'all' })

  const paths = posts.map((post) => ({
    params: { slug: post.slug }
  }))

  return { paths, fallback: 'blocking' }
}
