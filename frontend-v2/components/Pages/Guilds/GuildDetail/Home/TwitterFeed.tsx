import { fetcher } from '@/utils'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useGuildDetailContext } from '../utils'
import Image from 'next/image'
import { format } from 'date-fns'
import TwitterParser from './TwitterParser'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import { Pagination } from '@egjs/flicking-plugins'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'

const PER_PAGE = 6

const TwitterFeed = () => {
  const [posts, setPosts] = useState([])
  const [, setMeta] = useState(null)
  const [user, setUser] = useState(null)
  const [, setLoading] = useState(false)
  const { guildData } = useGuildDetailContext()

  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetcher(`/api/hub/guilds/feeds?id=${guildData.twitterId}&limit=${PER_PAGE}`)
      setPosts(response?.data?.posts?.data)
      setMeta(response?.data?.posts?.meta)
      setUser(response?.data?.user?.data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }, [guildData.twitterId])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const [plugins] = useState([
    new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[2px] w-[50px] bg-gamefiDark-400"></div>'
      }
    })
  ])

  const ref = useRef(null)

  return (
    posts?.length > 0 && <>
      <div className="hidden md:block container mx-auto px-4 lg:px-16">
        <div className="uppercase text-2xl font-bold mb-4">Twitter Feeds</div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map(post => <div key={post.id} className="bg-gamefiDark-800 rounded px-6 py-4 font-casual leading-6 h-full">
            <div className="w-full flex gap-2 mb-4">
              <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="w-10 h-10 rounded-full overflow-hidden">
                <img src={user?.profile_image_url} className="w-full h-full" alt=""></img>
              </a>
              <div className="h-10 flex flex-col">
                <div className="flex items-center gap-2">
                  <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="font-semibold hover:underline">{user?.name}</a>
                  {user?.verified && <div><Image src={require('@/assets/images/guilds/verified.png')} alt=""></Image></div>}
                </div>
                <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="text-xs text-gamefiDark-200 hover:underline">{!!user?.username && `@${user.username}`}</a>
              </div>
              <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="ml-auto hover:underline">
                <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.43465 24C20.7561 24 26.9473 14.7672 26.9473 6.76137C26.9473 6.49896 26.9418 6.23823 26.9296 5.9785C28.1312 5.12299 29.1758 4.05595 30 2.84131C28.897 3.32362 27.7103 3.64862 26.4651 3.79488C27.7361 3.04514 28.7116 1.85828 29.172 0.443484C27.9823 1.13766 26.6657 1.64206 25.2638 1.91418C24.1404 0.736685 22.5409 0 20.7711 0C17.3715 0 14.6149 2.71345 14.6149 6.05816C14.6149 6.53377 14.669 6.996 14.7744 7.43982C9.65941 7.18644 5.12315 4.77523 2.08775 1.10955C1.55867 2.00488 1.25435 3.04514 1.25435 4.15469C1.25435 6.25664 2.34107 8.11257 3.99324 9.19802C2.98371 9.16756 2.03505 8.89411 1.20573 8.43991C1.20437 8.46535 1.20437 8.49079 1.20437 8.51723C1.20437 11.4519 3.32612 13.9016 6.1422 14.4569C5.62536 14.5955 5.08132 14.6701 4.5196 14.6701C4.12313 14.6701 3.73755 14.6313 3.3625 14.561C4.14626 16.9679 6.4183 18.7197 9.11265 18.7692C7.00552 20.3942 4.35197 21.3625 1.46822 21.3625C0.971789 21.3625 0.481814 21.3347 0 21.2785C2.72393 22.9969 5.95825 24 9.43465 24Z" fill="#049EF4"/>
                </svg>
              </a>
            </div>
            <div className="w-full text-sm mb-4">
              {!!post.text && <TwitterParser user={user}>{post.text}</TwitterParser>}
            </div>
            {!!post?.created_at && <div className="text-sm font-medium text-gamefiDark-200">{format(new Date(post?.created_at), 'dd MMM yyyy')}</div>}
          </div>)}
        </div>
      </div>
      <div className="md:hidden mx-auto px-4 lg:px-16 flex gap-4 w-screen">
        <Flicking
          circular={true}
          panelsPerView={1}
          className="gap-2"
          plugins={plugins}
          align="prev"
          ref={ref}
          interruptable={true}
        >
          {posts.map(post => <div className="mb-8 w-full" key={`twitter-${post.id}`}>
            <div>
              <div key={post.id} className="w-full bg-gamefiDark-800 rounded px-6 py-4 font-casual leading-6 h-full">
                <div className="w-full flex gap-2 mb-4">
                  <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={user?.profile_image_url} className="w-full h-full" alt=""></img>
                  </a>
                  <div className="h-10 flex flex-col">
                    <div className="flex items-center gap-2">
                      <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="font-semibold hover:underline">{user?.name}</a>
                      {user?.verified && <div><Image src={require('@/assets/images/guilds/verified.png')} alt=""></Image></div>}
                    </div>
                    <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="text-xs text-gamefiDark-200 hover:underline">{!!user?.username && `@${user.username}`}</a>
                  </div>
                  <a href={`https://twitter.com/${user?.username}`} target="_blank" rel="noreferrer noopener" className="ml-auto hover:underline">
                    <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.43465 24C20.7561 24 26.9473 14.7672 26.9473 6.76137C26.9473 6.49896 26.9418 6.23823 26.9296 5.9785C28.1312 5.12299 29.1758 4.05595 30 2.84131C28.897 3.32362 27.7103 3.64862 26.4651 3.79488C27.7361 3.04514 28.7116 1.85828 29.172 0.443484C27.9823 1.13766 26.6657 1.64206 25.2638 1.91418C24.1404 0.736685 22.5409 0 20.7711 0C17.3715 0 14.6149 2.71345 14.6149 6.05816C14.6149 6.53377 14.669 6.996 14.7744 7.43982C9.65941 7.18644 5.12315 4.77523 2.08775 1.10955C1.55867 2.00488 1.25435 3.04514 1.25435 4.15469C1.25435 6.25664 2.34107 8.11257 3.99324 9.19802C2.98371 9.16756 2.03505 8.89411 1.20573 8.43991C1.20437 8.46535 1.20437 8.49079 1.20437 8.51723C1.20437 11.4519 3.32612 13.9016 6.1422 14.4569C5.62536 14.5955 5.08132 14.6701 4.5196 14.6701C4.12313 14.6701 3.73755 14.6313 3.3625 14.561C4.14626 16.9679 6.4183 18.7197 9.11265 18.7692C7.00552 20.3942 4.35197 21.3625 1.46822 21.3625C0.971789 21.3625 0.481814 21.3347 0 21.2785C2.72393 22.9969 5.95825 24 9.43465 24Z" fill="#049EF4"/>
                    </svg>
                  </a>
                </div>
                <div className="text-sm mb-4">
                  {!!post.text && <TwitterParser user={user}>{post.text}</TwitterParser>}
                </div>
                {!!post?.created_at && <div className="text-sm font-medium text-gamefiDark-200">{format(new Date(post?.created_at), 'dd MMM yyyy')}</div>}
              </div>
            </div>
          </div>)}
          <ViewportSlot>
            <div className="flicking-pagination !relative flex items-center justify-center gap-1"></div>
            <div></div>
          </ViewportSlot>
        </Flicking>
      </div>
    </>
  )
}

export default TwitterFeed
