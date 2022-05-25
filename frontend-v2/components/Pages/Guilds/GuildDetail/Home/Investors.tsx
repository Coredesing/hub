import React from 'react'
import { useGuildDetailContext } from '../utils'

const Investors = () => {
  const { guildData } = useGuildDetailContext()
  return (
    guildData?.backers
      ? <div className="container mx-auto px-4 lg:px-16">
        <h4 className="text-2xl font-bold uppercase mb-4">Backed By</h4>
        <div className="mb-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {guildData.backers.map(investor =>
            <div key={`backer-${investor.id}`} className="rounded overflow-hidden w-full aspect-1 bg-gamefiDark-630/30 p-4 md:p-6 lg:px-12 hover:opacity-75">
              <a href={investor.link}>
                {!!investor.logo && <img src={investor.logo?.url} className="w-full h-full object-contain" alt=""></img>}
              </a>
            </div>)}
        </div>
        <div>
        </div>
      </div>
      : <></>
  )
}

export default Investors
