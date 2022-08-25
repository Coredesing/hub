import smile from '@/components/Pages/Adventure/images/smile.svg'
import angry from '@/components/Pages/Adventure/images/angry.svg'
import currentFish from '@/components/Pages/Adventure/images/current-fish.svg'
import clsx from 'clsx'
import playNow from '@/components/Pages/Adventure/images/play-now.svg'
import { useMemo } from 'react'
import { useMyWeb3 } from '@/components/web3/context'
import { useHubContext } from '@/context/hubProvider'
import { shorten } from '@/utils'
import Tippy from '@tippyjs/react'

const TopWorldItem = ({ data, playGame, accountEligible = false }) => {
  const canPlayNow = useMemo(() => {
    return data?.status?.toUpperCase() !== 'LOCK' && data.playUrl
  }, [data])

  const { account } = useMyWeb3()
  const { accountHub } = useHubContext()

  return (
    <div className="flex flex-col h-[600px] md:h-auto md:flex-1 bg-[#1B1D26] relative">
      <div className="flex flex-col md:flex-row md:items-center w-full p-6 pt-8">
        <div className='flex items-center'>
          <p className="font-bold text-xl p-2 md:p-0">{data?.name}</p>
          {data?.tutorialUrl && <a href={data?.tutorialUrl || null} className="text-gamefiGreen-700 p-2 md:px-5 cursor-pointer font-medium hover:underline" target='_blank' rel="noreferrer" >Guideline</a>}
        </div>
        <p className="font-casual text-sm text-gamefiYellow md:ml-auto p-2 md:p-0 md:pl-10">
          {data?.accountType === 'EMAIL' ? !accountHub?.email ? 'You must verify email' : `You must use the email ${accountHub?.email} to play this game.` : ''}
          {data?.accountType === 'WALLET' ? !account ? 'Connect wallet' : `You must use the wallet ${shorten(account)} to play this game.` : ''}
        </p>
      </div>
      <div className="flex-1 flex flex-col overflow-y-scroll md:mr-2 gap-2 pb-30 md:pb-0">
        {data?.tasks?.length > 0 &&
          data?.tasks.map((task, iTask) => (
            <div key={`task-${iTask}`} className="gap-1 md:gap-0 mr-2 ml-4">
              <div className="flex flex-col md:flex-row items-center w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]">
                <div className="w-full md:w-1/6 lg:w-1/4">
                  <span className="font-casual font-medium text-sm">
                    {task?.name}
                  </span>
                </div>
                <div className="w-full lg:flex-1 gap-4">
                  <div className="flex flex-col lg:flex-row w-full pb-5 items-center gap-4">
                    <div className="w-full flex items-center gap-4">
                      <img src={smile.src} alt="" />
                      <div className="w-full lg:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm">
                        <div
                          className={clsx(
                            'h-[6px] bg-white rounded-sm',
                            task?.stages[0]?.isCompleted && 'w-full',
                            !(task.currentRepetition / task.stages[0]?.repetition) && 'w-0'
                          )}
                          style={{ width: `${(task.currentRepetition / task.stages[0]?.repetition) * 100}%` }}
                        />
                      </div>
                      <span className="font-casual text-xs text-white/40">
                        {task.stages[0]?.isCompleted
                          ? task?.stages[0]?.repetition
                          : task.currentRepetition}
                        /{task.stages[0]?.repetition}
                      </span>
                    </div>
                    <div className="lg:ml-auto flex justify-center font-casual font-medium text-[#FFD600] gap-2">
                      <span>+{task.stages[0]?.reward}</span>
                      <img src={currentFish.src} alt="" className="w-4 h-4" />
                    </div>
                  </div>
                  {task.stages[1] && (
                    <>
                      <div className="h-[1px] bg-gradient-to-r from-[#303342]/0 to-[#2A2D3D]" />
                      <div className="flex flex-col lg:flex-row w-full items-center pt-5 gap-4">
                        <div className="w-full flex items-center gap-4">
                          <img src={angry.src} alt="" />
                          <div className="w-full lg:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm">
                            <div
                              className={clsx(
                                'h-[6px] bg-white rounded-sm',
                                task.stages[1]?.isCompleted && 'w-full',
                                !(task.currentRepetition / task.stages[1]?.repetition) && 'w-0'
                              )}
                              style={{ width: `${(task.currentRepetition / task.stages[1]?.repetition) * 100}%` }}
                            />
                          </div>
                          <span className="font-casual text-xs text-white/40">
                            {task.stages[1]?.isCompleted
                              ? task?.stages[1]?.repetition
                              : task?.currentRepetition}
                            /{task?.stages[1]?.repetition}
                          </span>
                        </div>
                        <div className="lg:ml-auto flex font-casual font-medium text-[#FFD600] gap-2">
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
            <span className="text-white mr-1">
              You will have more rewards from
              <span className='font-semibold'>
                { ` ${data?.name}` }.
              </span>
            </span>
            <span className="text-gamefiGreen-700">View Detail</span>
          </div>
          {canPlayNow
            ? <>
              {(
                account && accountEligible
                  ? <a
                    className={clsx(
                      'cursor-pointer bg-gradient-to-tl from-[#6CDB00] via-[#6CDB00] to-[#C9DB00] ml-auto flex items-center gap-2 justify-center w-2/3 sm:w-1/3 md:w-1/5 aspect-6 md:aspect-[5/1.1] 2xl:aspect-6 uppercase text-sm text-black font-bold tracking-[0.02em] rounded-br'
                    )}
                    style={{
                      clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)'
                    }}
                    onClick={() => {
                      playGame(data.id)
                    }}
                    href={data.playUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                  Get Gafish
                    <div className="flex items-center">
                      <Tippy content={<span>You need to click this button once only to start tracking progress and earning gafish</span>} className="font-casual text-sm leading-5 p-3">
                        <div><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#858689" />
                        </svg></div>
                      </Tippy>
                    </div>
                  </a>
                  : <button
                    className={clsx(
                      'cursor-pointer bg-gradient-to-tl from-[#6CDB00] via-[#6CDB00] to-[#C9DB00] ml-auto flex items-center gap-2 justify-center w-2/3 sm:w-1/3 md:w-1/5 aspect-6 md:aspect-[5/1.1] 2xl:aspect-6 uppercase text-sm text-black font-bold tracking-[0.02em] rounded-br'
                    )}
                    style={{
                      clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)'
                    }}
                    onClick={() => {
                      playGame(data.id)
                    }}
                  >
                  Get Gafish
                    <div className="flex items-center">
                      <Tippy content={<span>You need to click this button once only to start tracking progress and earning gafish</span>} className="font-casual text-sm leading-5 p-3">
                        <div><svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z" fill="#858689" />
                        </svg></div>
                      </Tippy>
                    </div>
                  </button>
              )}
            </>
            : (
              <div
                className="bg-gamefiDark-400 ml-auto flex items-center justify-center w-2/3 sm:w-1/3 md:w-1/5 aspect-6 md:aspect-[5/1.1] 2xl:aspect-6 uppercase text-sm text-black font-bold tracking-[0.02em] rounded-br"
                style={{
                  clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0% 100%)'
                }}
              >
              Coming Soon
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default TopWorldItem
