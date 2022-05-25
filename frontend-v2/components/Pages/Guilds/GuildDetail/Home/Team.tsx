import React from 'react'
import { useGuildDetailContext } from '../utils'

const Team = () => {
  const { guildData } = useGuildDetailContext()
  return (
    guildData?.members?.length > 0
      ? <div className="container mx-auto px-4 lg:px-16">
        <h4 className="text-2xl font-bold uppercase mb-4">Team Members</h4>
        <div className="mb-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {guildData.members.map((member, index) => <div key={`team-member-${index}`}>
            <div className="w-full aspect-1 bg-gamefiDark-630/30 rounded overflow-hidden">
              {member.avatar ? <img src={member.avatar?.url} className="w-full h-full object-contain" alt=""></img> : ''}
            </div>
            <div className="mt-4 w-full text-center">
              <div className="font-semibold">{member.name}</div>
              <div className="mt-2 text-gamefiDark-200">{member.role}</div>
            </div>
          </div>)}
        </div>
        {/* <div>
          <div className="w-full rounded flex justify-center">
            <img src={member.investors_link} alt=""></img>
          </div>
        </div> */}
      </div>
      : <></>
  )
}

export default Team
