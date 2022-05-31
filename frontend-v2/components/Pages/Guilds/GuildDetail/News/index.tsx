import React, { useCallback, useEffect, useState } from 'react'
import PostItem from './PostItem'
import { fetcher } from '@/utils'
import toast from 'react-hot-toast'
import { ContentLoading } from '@/components/Base/Animation'
import { useGuildDetailContext } from '../utils'

const PER_PAGE = 20

const News = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const { guildData } = useGuildDetailContext()

  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetcher(`/api/guilds/posts?tag=${guildData.slug}&limit=${PER_PAGE}`)
      setPosts(response.data)
      setLoading(false)
      console.log(response)
    } catch (e) {
      setLoading(false)
      toast.error(e.message || 'Loading News Failed!')
    }
  }, [guildData.slug])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  return (
    <div className="px-4 lg:px-16">
      <div className="grid lg:grid-cols-2 gap-8 m-auto px-3">
        {
          !loading && posts?.length > 0 && posts.map((item, index) => <PostItem key={`news-${index}`} item={item} />)
        }
      </div>
      {
        !loading && !posts?.length && <div className="w-full flex items-center justify-center py-32 text-2xl font-bold">No Post Yet</div>
      }
      {
        loading && <div className="w-full flex items-center justify-center py-32">
          <ContentLoading></ContentLoading>
        </div>
      }
    </div>
  )
}

export default News
