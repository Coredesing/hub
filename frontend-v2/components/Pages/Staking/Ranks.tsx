import { useAppContext } from '@/context'
import { GAFI } from '@/components/web3'
import Image from 'next/image'
import Tippy from '@tippyjs/react'
import Flicking, { MoveEvent, WillChangeEvent } from '@egjs/react-flicking'
import '@egjs/flicking/dist/flicking.css'

export default function Ranks () {
  const { tiers } = useAppContext()

  return <div className="mt-2 md:mt-10">
    <div className="flex font-casual">
      <div className="flex w-28 sm:w-30 md:w-48 flex-none flex-col">
        <p className="text-xs sm:text-sm leading-10 sm:leading-10 truncate mt-auto">$GAFI Required</p>
        <p className="text-xs sm:text-sm leading-10 sm:leading-10 truncate">Winner Selection</p>
        <p className="text-xs sm:text-sm leading-10 sm:leading-10 truncate">Max <span className="hidden md:inline">Individual</span> Allocation</p>
        <p className="text-xs sm:text-sm leading-10 sm:leading-10 truncate">Withdrawal Delay</p>
      </div>
      <div className="flex-1 flex w-full overflow-x-hidden">
        <div className="w-full">
          <Flicking
            viewportTag="div"
            cameraTag="div"
            align="prev"
            horizontal={true}
            bound={true}
            bounce={0}
          >
            { tiers.state.all.map(tier => {
              return <div className="w-2/3 sm:w-[29%] md:w-1/5 flex flex-col items-center justify-center overflow-x-hidden" key={tier.name}>
                <div className="w-1/2 relative mb-auto">
                  <Image src={tier.image} layout='responsive' objectFit='contain' alt={tier.name}/>
                </div>
                <p className="font-mechanic font-bold text-base uppercase">{tier.name}</p>
                { tier.config.requirement && <div className="w-full text-sm leading-10 flex items-center"><span className="text-center w-full text-xs sm:text-sm leading-10 sm:leading-10 md:leading-10 opacity-50 truncate">{tier.config.requirement}</span>
                  <Tippy content={<span>{tier.config.requirementDescription}</span>} className="font-casual text-sm leading-5 text-white bg-black opacity-100 p-3">
                    <button><svg className="w-4 h-4 ml-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#858689"/>
                    </svg></button>
                  </Tippy>
                </div> }
                { !tier.config.requirement && <p className="text-center w-full text-xs sm:text-sm leading-10 sm:leading-10 md:leading-10 opacity-50 truncate"><span className="hidden md:inline">Min</span> {tier.config.tokens} ${GAFI.symbol}</p> }
                <p className="text-center w-full text-xs sm:text-sm leading-10 sm:leading-10 md:leading-10 opacity-50 truncate">{ tier.method || '—' }</p>
                <p className="text-center w-full text-xs sm:text-sm leading-10 sm:leading-10 md:leading-10 opacity-50 truncate">{ tier.config.max ? `$${tier.config.max}` : '—' }</p>
                <p className="text-center w-full text-xs sm:text-sm leading-10 sm:leading-10 md:leading-10 opacity-50 truncate">{ tier.config.delay ? `${tier.config.delay} days` : '—' }</p>
              </div>
            }) }
          </Flicking>
        </div>
      </div>
    </div>
  </div>
}
