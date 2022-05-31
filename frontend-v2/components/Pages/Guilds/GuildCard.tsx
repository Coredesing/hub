import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { printNumber } from '@/utils'
import Tippy from '@tippyjs/react'

const GuildCard = ({ item }: { item: any }) => {
  const router = useRouter()

  useEffect(() => {
    console.log(item)
  }, [item])

  return <div onClick={() => { router.push(`/guilds/${item.id}`) }} className="bg-gamefiDark-630/30 cursor-pointer w-full flex flex-col font-casual hover:opacity-90 clipped-b-r">
    <div className="w-full aspect-[16/9] overflow-hidden bg-black relative">
      {!!item.banner?.url && <img src={item.banner?.url} alt="" className="object-cover w-full h-full"></img>}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 w-full h-1/2 overflow-hidden flex items-end text-left text-ellipsis whitespace-nowrap uppercase font-semibold hover:underline text-lg"
        style={{ background: 'linear-gradient(180deg, rgba(45, 47, 56, 0) 0%, #21232A 100%)' }}
      >
        <div className="w-full overflow-hidden text-ellipsis">{item.name}</div>
      </div>
    </div>
    <div className="px-4 text-sm text-gamefiDark-200">{item.region}</div>
    <div className="px-4 pt-4 pb-12 flex flex-col gap-4">
      <div className="flex gap-1 mb-4 relative">
        {item?.projects?.map((game, index) => index < 5 && <div key={`supported-${index}`}>
          <Tippy key={`game-logo-${game.id}`} content={game.name}>
            <img src={game.logo?.url} className="w-9 h-9 rounded-full object-cover" alt="" />
          </Tippy>
        </div>)}
        {
          item?.projects?.length > 5 && <div className="w-9 h-9 rounded bg-gamefiDark-600 flex items-center justify-center font-medium">+{item?.projects?.length - 5}</div>
        }
      </div>
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="text-left flex flex-col gap-2 text-sm">
          <div className="text-white/50 uppercase font-medium text-xs">Discord Member</div>
          <div>{printNumber(item.discordMember)}</div>
        </div>
        <div className="text-left flex flex-col gap-2 text-sm">
          <div className="text-white/50 uppercase font-medium text-xs">Scholarship</div>
          <div>{item.scholarship}</div>
        </div>
        <div className="text-left flex flex-col gap-2 text-sm">
          <div className="text-white/50 uppercase font-medium text-xs">Recruiting</div>
          <div>{item.recruiting || '-'}</div>
        </div>
      </div>
    </div>
  </div>
}

export default GuildCard
