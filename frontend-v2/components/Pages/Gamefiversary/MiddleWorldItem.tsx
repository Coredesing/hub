import smile from '@/components/Pages/Adventure/images/smile.svg'
import angry from '@/components/Pages/Adventure/images/angry.svg'
import currentFish from '@/components/Pages/Adventure/images/current-fish.svg'
import clsx from 'clsx'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useMyWeb3 } from '@/components/web3/context'
import present from '@/components/Pages/Adventure/images/present.svg'
import SocialTaskButton from './SocialTaskButton'
import toast from 'react-hot-toast'
import { fetcher } from '@/utils'
import { AdventureTasksContext } from '@/pages/happy-gamefiversary/tasks'

const MiddleWorldItem = ({ data, accountEligible = false }) => {
  const canPlayNow = useMemo(() => {
    return data?.status?.toUpperCase() !== 'LOCK'
  }, [data?.status])
  const { account } = useMyWeb3()

  const { fetchTasks } = useContext(AdventureTasksContext)

  const [loadingRecheck, setLoadingRecheck] = useState(false)

  const handleRecheck = useCallback(
    (task) => {
      setLoadingRecheck(true)

      fetcher('/api/adventure/recheckSocialTask', {
        method: 'POST',
        body: JSON.stringify({
          walletAddress: account,
          projectSlug: task.projectSlug,
          taskSlug: task.slug
        })
      })
        .then((res) => {
          if (!res) {
            toast.error('Failed')
            return
          }

          console.log(res)
          fetchTasks()
        })
        .catch((e) => console.debug(e))
        .finally(() => {
          setLoadingRecheck(false)
        })

      // fetcher(`/api/adventure/recheckSocialTask/${task}/${task?.slug}`)
    },
    [account, fetchTasks]
  )

  return (
    <div className="flex flex-col h-[600px] md:h-auto md:flex-1 bg-[#1B1D26] relative">
      <div className="w-full p-6 pt-8 flex items-center justify-between">
        <span className="font-mechanic font-bold text-[20px] leading-[100%] uppercase text-white">
          {data.name}
        </span>
        {data?.tutorialUrl && (
          <img src={present.src} alt="present" className="" />
        )}
      </div>
      <div className="flex-1 flex flex-col overflow-y-scroll md:mr-2 gap-2 pb-30 md:pb-0">
        {data?.tasks?.length > 0 &&
          data?.status === 'UNLOCK' &&
          data?.tasks
            .filter((e) => !e.name.includes('dummy'))
            .map((task, iTask) => (
              <div key={`task-${iTask}`} className="gap-1 md:gap-0 mr-2 ml-4">
                <div className="flex flex-col md:flex-row items-center w-full p-4 rounded gap-2 md:gap-32 lg:gap-10 bg-gradient-to-r from-[#292B36]/0 to-[#21232E]">
                  <div className="w-full md:w-1/6 lg:w-1/4">
                    <span className="font-casual font-medium text-sm">
                      {task?.name}
                    </span>
                  </div>
                  <div className="flex-1 flex gap-2 items-center">
                    {task?.socialInfo && (
                      <div>
                        <SocialTaskButton data={task} />
                      </div>
                    )}
                    {!task?.socialInfo && (
                      <div className="flex-1">
                        <div className="flex items-center pb-5 gap-4">
                          <img src={smile.src} alt="" />
                          <div className="w-1/3 sm:w-1/2 p-[3px] h-fit bg-[#1A1C25] rounded-sm">
                            <div
                              className={clsx(
                                'h-[6px] bg-white rounded-sm',
                                task?.stages[0]?.isCompleted && 'w-full',
                                !(
                                  task.currentRepetition /
                                  task.stages[0]?.repetition
                                ) && 'w-0'
                              )}
                              style={{
                                width: `${
                                  (task.currentRepetition /
                                    task.stages[0]?.repetition) *
                                  100
                                }%`
                              }}
                            />
                          </div>
                          <span className="font-casual text-xs text-white/40">
                            {task.stages[0]?.isCompleted
                              ? task?.stages[0]?.repetition
                              : task.currentRepetition}
                            /{task.stages[0]?.repetition}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="ml-auto flex font-casual font-medium text-[#FFD600] gap-2">
                      <span>+{task.stages[0]?.reward}</span>
                      <img src={currentFish.src} alt="" className="w-4 h-4" />
                    </div>
                    {task?.socialInfo?.url &&
                                task?.currentRepetition !==
                                  task?.stages?.[0]?.repetition && (
                      <button
                        onClick={() => {
                          if (loadingRecheck) return
                          handleRecheck(task)
                        }}
                        className={`text-sm font-semibold ${
                          loadingRecheck
                            ? 'text-gamefiDark-200'
                            : 'text-gamefiGreen'
                        }`}
                      >
                          Recheck
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        {(!data?.tasks?.length || data?.status === 'LOCK') && (
          <>
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
          </>
        )}
      </div>
    </div>
  )
}

export default MiddleWorldItem
