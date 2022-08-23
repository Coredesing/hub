import smile from '@/components/Pages/Adventure/images/smile.svg'
import angry from '@/components/Pages/Adventure/images/angry.svg'
import currentFish from '@/components/Pages/Adventure/images/current-fish.svg'
import clsx from 'clsx'
import playNow from '@/components/Pages/Adventure/images/play-now.svg'
import { useMemo } from 'react'
import { useMyWeb3 } from '@/components/web3/context'

const TopWorldItem = ({ data, playGame, connectedAllSocial = false }) => {
  const canPlayNow = useMemo(() => {
    return (
      data?.status?.toUpperCase() !== 'LOCK' ||
      data?.slug === 'epic-war' ||
      data?.slug === 'befitter'
    )
  }, [data?.slug, data?.status])
  const { account } = useMyWeb3()

  return (
    <div className="flex flex-col h-[600px] md:h-auto md:flex-1 bg-[#1B1D26] relative">
      <div className="flex flex-col md:flex-row md:items-center w-full p-6 pt-8">
        <p className="font-bold text-xl p-2 md:p-0">{data?.name}</p>
        <p className="font-casual text-sm text-white/40 md:ml-auto p-2 md:p-0">
          Account Type: {data?.accountType}
        </p>
      </div>
      <div className="flex-1 flex flex-col overflow-y-scroll md:mr-2 gap-2 pb-30 md:pb-0">
        {data?.tasks?.length > 0 &&
          data?.tasks.map((task, iTask) => (
            <div key={`task-${iTask}`} className="gap-1 md:gap-0 mr-2 ml-4">
              <div className="flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]">
                <div className="w-full md:w-1/12 lg:w-1/6">
                  <span className="font-casual font-medium text-sm">
                    {task?.name}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center pb-5 gap-4">
                    <img src={smile.src} alt="" />
                    <div className="w-1/3 sm:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm">
                      <div
                        className={clsx(
                          'h-[6px] bg-white rounded-sm',
                          task?.stages[0]?.isCompleted && 'w-full',
                          task?.currentRepetition === 0
                            ? 'w-0'
                            : `w-${task?.currentRepetition}/${task?.stages[0]?.repetition}`
                        )}
                      />
                    </div>
                    <span className="font-casual text-xs text-white/40">
                      {task.stages[0]?.isCompleted
                        ? task?.stages[0]?.repetition
                        : task.currentRepetition}
                      /{task.stages[0]?.repetition}
                    </span>
                    <div className="ml-auto flex font-casual font-medium text-[#FFD600] gap-2">
                      <span>+{task.stages[0]?.reward}</span>
                      <img src={currentFish.src} alt="" className="w-4 h-4" />
                    </div>
                  </div>
                  {task.stages[1] && (
                    <>
                      <div className="h-[1px] bg-gradient-to-r from-[#303342]/0 to-[#2A2D3D]" />
                      <div className="flex items-center pt-5 gap-4">
                        <img src={angry.src} alt="" />
                        <div className="w-1/3 sm:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm">
                          <div
                            className={clsx(
                              'h-[6px] bg-white rounded-sm',
                              task.stages[1]?.isCompleted && 'w-full',
                              task.currentRepetition === 0
                                ? 'w-0'
                                : `w-${task.currentRepetition}/${task.stages[1]?.repetition}`
                            )}
                          />
                        </div>
                        <span className="font-casual text-xs text-white/40">
                          {task.stages[1]?.isCompleted
                            ? task?.stages[1]?.repetition
                            : task?.currentRepetition}
                          /{task?.stages[1]?.repetition}
                        </span>
                        <div className="ml-auto flex font-casual font-medium text-[#FFD600] gap-2">
                          <span>+{task?.stages[1]?.reward}</span>
                          <img
                            src={currentFish.src}
                            alt=""
                            className="w-4 h-4"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        <div className="gap-1 md:gap-0 mr-2 ml-4">
          <div className="flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]">
            <div className="w-full">
              <span className="font-casual font-medium text-sm">
                Like on GameHub
              </span>
            </div>
          </div>
        </div>
        <div className="gap-1 md:gap-0 mr-2 ml-4">
          <div className="flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]">
            <div className="w-full">
              <span className="font-casual font-medium text-sm">
                Review on GameHub
              </span>
            </div>
          </div>
        </div>
        <div className="gap-1 md:gap-0 mr-2 ml-4">
          <div className="flex flex-col md:flex-row w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]">
            <div className="h-10 w-full md:w-1/6 lg:w-1/4" />
          </div>
        </div>
        {/* <div className='w-full h-11 md:h-24'></div> */}
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex flex-col md:flex-row w-full pt-8 bg-gradient-to-t from-[#1B1D26] via-[#1B1D26]/95 to-transparent">
          <div className="flex flex-col md:flex-row md:items-center px-6 py-2 text-sm font-casual">
            <span className="text-white">
              This game has extra contribute bonus.{' '}
            </span>
            <span className="text-gamefiGreen-700">View Detail</span>
          </div>
          {canPlayNow
            ? (
              <a
                className={clsx(
                  'cursor-pointer bg-gradient-to-tl from-[#6CDB00] via-[#6CDB00] to-[#C9DB00] ml-auto flex items-center justify-center w-2/3 sm:w-1/3 md:w-1/5 aspect-6 md:aspect-[5/1.1] 2xl:aspect-6 uppercase text-sm text-black font-bold tracking-[0.02em] rounded-br'
                )}
                style={{
                  clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)'
                }}
                onClick={() => {
                  playGame(data.id)
                }}
                href={
                  account && connectedAllSocial &&
                `${
                  data?.slug === 'epic-war'
                    ? 'https://portal.epicwar.io/'
                    : data?.slug === 'befitter'
                      ? 'https://befitter.io/'
                      : ''
                }`
                }
                target="_blank"
                rel="noreferrer"
              >
              Play now
                <img src={playNow.src} alt="" className="m-2" />
              </a>
            )
            : (
              <div
                className="bg-gamefiDark-400 ml-auto flex items-center justify-center w-2/3 sm:w-1/3 md:w-1/5 aspect-6 md:aspect-[5/1.1] 2xl:aspect-6 uppercase text-sm text-black font-bold tracking-[0.02em] rounded-br"
                style={{
                  clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)'
                }}
              >
              Coming Soon
                <img src={playNow.src} alt="" className="m-2" />
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default TopWorldItem
