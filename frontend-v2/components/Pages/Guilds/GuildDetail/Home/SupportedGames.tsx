import { Pagination } from '@egjs/flicking-plugins'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import Tippy from '@tippyjs/react'
import React, { useMemo, useRef, useState } from 'react'
import { useGuildDetailContext } from '../utils'

import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'

const SupportedGames = () => {
  const { guildData } = useGuildDetailContext()

  const gamesSupported = useMemo(() => {
    return guildData.projects || []
  }, [guildData])

  const ref = useRef(null)

  const [plugins] = useState([
    new Pagination({
      type: 'bullet',
      renderBullet: () => {
        return '<div class="h-[1px] w-[20px] lg:w-[50px] lg:mx-1 bg-gamefiDark-400"></div>'
      }
    })
  ])

  return (
    <div className="container mx-auto px-4 lg:px-16">
      <h4 className='text-2xl font-bold uppercase mb-4'>GAMES SUPPORTED</h4>
      <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {
          gamesSupported.length > 0 && gamesSupported.map(game => <a key={`supported-game-${game.id}`} href={game.communityOfficial?.website} target="_blank" rel="noopenner noreferrer">
            <div className="aspect-[2/3] rounded bg-black hover:opacity-80">
              {!!game.banner && <Tippy key={`game-logo-${game.id}`} content={game.name}>
                <img src={game.banner?.url} className="w-full h-full object-cover" alt=""></img>
              </Tippy>}
            </div>
          </a>)
        }
      </div>
      <div className="lg:hidden">
        <Flicking
          circular={true}
          plugins={plugins}
          className="w-full"
          align="prev"
          panelsPerView={2}
          ref={ref}
        >
          {
            gamesSupported.length > 0 && gamesSupported.map(game => <a key={`supported-game-${game.id}`} href={game.communityOfficial?.website} target="_blank" rel="noopenner noreferrer">
              <div className="aspect-[2/3] rounded hover:opacity-80">
                {!!game.banner && <div className="px-2 w-full aspect-[2/3] mb-8 rounded-sm overflow-hidden"><img src={game.banner?.url} className="w-full h-full object-cover bg-black" alt=""></img></div>}
              </div>
            </a>)
          }
          <ViewportSlot>
            <div className="flicking-pagination !relative flex items-center justify-center gap-1"></div>
            <div></div>
          </ViewportSlot>
        </Flicking>
      </div>
    </div>
  )
}

export default SupportedGames
