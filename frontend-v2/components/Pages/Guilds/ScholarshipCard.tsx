import React, { useMemo } from 'react'
import { format } from 'date-fns'

const ScholarshipCard = ({ item, className }: { item: any; className?: string }) => {
  return <div className={`bg-[#21232A] w-full flex flex-col font-casual rounded overflow-hidden ${className}`}>
    <div>
      <div>
        <div className="w-full h-36 bg-black relative">
          <img src={item?.banner?.url} alt="" className="object-cover w-full h-full"></img>
          <div
            className="absolute bottom-0 left-0 right-0 p-4 w-full h-1/2 overflow-hidden flex items-end text-left text-ellipsis whitespace-nowrap uppercase font-semibold text-lg"
            style={{ background: 'linear-gradient(180deg, rgba(45, 47, 56, 0) 0%, #21232A 100%)' }}
          >
            <div className="w-full overflow-hidden text-ellipsis">{item?.name}</div>
          </div>
        </div>
        <div className="px-4 text-sm font-light">{item?.description}</div>
        <div className="px-4 pt-4 pb-12 flex flex-col gap-4">
          <div className="w-full flex gap-16">
            <div className="text-left flex items-center gap-2 text-sm">
              <div className="w-8 h-8">
                <img className="w-full h-full object-cover rounded-full" src={item?.project?.logo?.url} alt=""></img>
              </div>
              <div className="flex flex-col">
                <div className="uppercase text-[12px] text-gamefiDark-200 font-semibold">Game</div>
                <div>{item?.project?.name}</div>
              </div>
            </div>
            <div className="flex flex-col text-sm">
              <div className="uppercase text-[12px] text-gamefiDark-200 font-semibold">End Date</div>
              <div>{!!item?.endDate && format(new Date(item?.endDate), 'd MMM, yyyy')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default ScholarshipCard
