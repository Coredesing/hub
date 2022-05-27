import React from 'react'
import { useGuildDetailContext } from '../utils'

const RoadMap = () => {
  const { guildData } = useGuildDetailContext()
  return (
    guildData.roadmapText || guildData.roadmapPicture
      ? <div className="container mx-auto px-4 lg:px-16">
        <h4 className="text-2xl font-bold uppercase mb-4">ROADMAP</h4>
        <div className="font-casual max-w-[700px] text-sm mb-5">
          {guildData?.roadmapText}
        </div>
        <div>
          <div className="w-full h-full rounded flex items-center justify-center">
            <img src={guildData.roadmapPicture?.url} className="w-full h-full" alt=""></img>
          </div>
        </div>
      </div>
      : <></>
  )
}

export default RoadMap
