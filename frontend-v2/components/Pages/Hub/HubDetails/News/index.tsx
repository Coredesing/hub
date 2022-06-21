import React, { useCallback, useEffect, useState } from 'react'
import PostItem from './PostItem'
import { fetcher } from '@/utils'
import toast from 'react-hot-toast'
import { ContentLoading } from '@/components/Base/Animation'
import { useRouter } from 'next/router'

const PER_PAGE = 2

const News = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetcher(`/api/hub/detail/posts?tag=${router.query.slug}&limit=${PER_PAGE}`)
      setPosts(response.data)

      setLoading(false)
    } catch (e) {
      setLoading(false)
      toast.error(e.message || 'Loading News Failed!')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  return (
    <>
      {
        !loading && !!posts?.length && <><div className="mt-10 md:mt-14 text-lg md:text-2xl font-mechanic uppercase"><strong>Reseach more</strong></div>
          <div className="flex flex-col md:flex-row gap-6 items-center mt-2 md:mt-4">
            { posts.map((item, index) => <PostItem key={`news-${index}`} item={item} />) }
          </div>
        </>
      }
      {
        loading && <div className="w-full flex items-center justify-center py-32">
          <ContentLoading></ContentLoading>
        </div>
      }
    </>
  )
}

export default News
