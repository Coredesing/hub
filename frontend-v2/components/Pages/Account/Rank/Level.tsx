import { printNumber } from '@/utils'
import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import styles from './AccountRank.module.scss'
import get from 'lodash.get'

const LevelItem = ({ data }) => {
  const { rank, privileges } = useMemo(() => {
    return {
      rank: get(data, 'name') || '1',
      privileges: get(data, 'privileges') || []
    }
  }, [data])

  return (
    // Need set height to 194px when show reward
    <div className="relative min-w-[248px] h-[80px]  rounded-[3px]">
      <div className="absolute top-0 left-0 w-full h-full"></div>
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <div className="w-[70px] h-[70px] absolute left-[calc(50%-35px)] -top-[calc(30px)]">
          <Image
            src={require(`@/assets/images/ranks/${rank}.png`)}
            alt=""
            layout="fill"
          ></Image>
        </div>
        <div className="p-4">
          <div className="flex flex-col pt-[48px] gap-5">
            <span className="font-casual mx-auto font-semibold text-13px leading-[150%] text-[#F4F4F4]/40">
              Coming Soon
            </span>
            {/* {privileges.map((e) => {
              return (
                <div key={e._id} className="flex justify-center">
                  <span className="font-casual font-bold text-[13px] leading-[150%] text-[#F4F4F4]">
                    {e.description || '-'}
                  </span>
                </div>
              )
            })} */}
          </div>
        </div>
      </div>
    </div>
  )
}

const Stepper = ({ data, currentRankExp }) => {
  const { name, exp, isLessOrEqualCurrentRank } = useMemo(() => {
    const _name = get(data, 'name')
    const _exp = get(data, 'exp')
    return {
      name: _name,
      exp: get(data, 'exp'),
      isLessOrEqualCurrentRank: _exp <= currentRankExp
    }
  }, [data, currentRankExp])

  return (
    <div
      className={clsx(
        'font-casual font-bold text-[13px] leading-[150%] rounded-full w-8 h-8 flex items-center justify-center border-[4px] border-black',
        isLessOrEqualCurrentRank
          ? 'text-black bg-gradient-to-r from-[#7EFF00] to-[#BCDB00]'
          : 'bg-[#444444]'
      )}
    >
      {!isLessOrEqualCurrentRank && name}
      {isLessOrEqualCurrentRank && (
        <svg
          width="12"
          height="8"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6L6 10L14 2"
            stroke="black"
            strokeWidth="2"
            strokeMiterlimit="10"
            strokeLinecap="square"
          />
        </svg>
      )}
    </div>
  )
}

const Level = ({ data, ranks, specialRank }) => {
  const [isShowRankDetail, setShowRankDetail] = useState(true)
  const toggleShowRankDetail = () => {
    setShowRankDetail((prev) => {
      return !prev
    })
  }

  const { exp, rank, privileges } = useMemo(() => {
    const _current = get(data, 'exp.total', '')
    const _next = get(data, 'nextRank.exp', '') || 'MAX'
    const _rank = get(data, 'rank.name')

    const _currentRank = ranks.find((rank) => rank.name === _rank)

    return {
      exp: {
        current: _current,
        next: _next,
        percent: (_current / (_next === 'MAX' ? _current : _next)) * 100
      },
      rank: _rank,
      privileges: _currentRank?.privileges || []
    }
  }, [data, ranks])

  const getExpText = () => {
    if (exp.next === 'MAX') return '0 GXP'

    return `${printNumber(exp.next - exp.current)} GXP`
  }

  return (
    <div className="bg-[#0E0F14] border border-[#23252C] rounded-[4px]">
      <div className="flex md:flex-row flex-col bg-[#0E0F14]">
        <div
          className={clsx(
            // styles['gradient-box'],
            'flex items-center rounded-[4px] p-4 md:p-[30px] w-full md:w-3/5'
          )}
        >
          <div
            className={clsx(
              'w-[88px] h-[88px] relative z-10',
              rank >= 4 ? 'translate-x-[14px]' : 'translate-x-[6px]'
            )}
          >
            {rank && (
              <Image
                src={require(`@/assets/images/ranks/${rank}.png`)}
                alt=""
                layout="fill"
              ></Image>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-3">
                  <div
                    className={clsx(
                      'uppercase font-mechanic font-bold text-[18px] leading-[100%] text-white pl-2'
                    )}
                  >
                    LEVEL {rank}
                  </div>
                </div>

                <div
                  className={clsx(
                    styles['gradient-box'],
                    'w-full h-5 py-1 relative clipped-t-r'
                  )}
                >
                  {exp.percent > 0 && (
                    <div
                      className={clsx(
                        styles['gradient-exp'],
                        'h-full',
                        exp.percent < 10 ? '' : 'clipped-t-r'
                      )}
                      style={{ width: `${exp.percent < 1 ? 1 : exp.percent}%` }}
                    ></div>
                  )}
                </div>

                <div className="flex gap-2 pl-2">
                  <span className="text-[#838487] font-casual font-normal, text-xs leading-[150%]">
                    Reputation:
                  </span>
                  <span className="font-casual mx-auto font-semibold text-13px leading-[150%] text-[#F4F4F4]/40">
                    Coming Soon
                  </span>
                </div>
              </div>

              <div className="font-casual font-normal text-xs leading-[150%] text-white opacity-50">
                {exp.next !== 'MAX' && (
                  <span>
                    Need <b>{getExpText()}</b> to next rank
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#272930] flex-1 clipped-t-l-full pl-[52px] py-5 pr-[30px] gap-5 flex flex-col">
          <div className="font-mechanic font-bold text-13px leading-[100%] uppercase text-white/50">
            Current rank benefit
          </div>
          <span className="font-casual font-semibold text-xs leading-[150%] text-white">
            Coming Soon
          </span>
          {/* <div>
            {privileges.map((e) => {
              return (
                <div key={e._id} className="flex">
                  <span className="flex-1 font-casual font-normal text-[13px] leading-[150%] text-[#F4F4F4]">
                    {e.name}
                  </span>
                  <span className="flex-1 font-casual font-bold text-[13px] leading-[150%] text-[#F4F4F4]">
                    {e.description || '-'}
                  </span>
                </div>
              )
            })}
          </div> */}
        </div>
      </div>

      <div className={clsx('relative')}>
        <div
          className={clsx(
            isShowRankDetail ? 'rotate-180' : 'rotate-0',
            'w-8 h-8 border transition-all duration-300 border-[#23252C] rounded-full absolute bg-[#101015] -top-4 left-[calc(50%-16px)] hidden md:flex justify-center items-center cursor-pointer'
          )}
          onClick={toggleShowRankDetail}
        >
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.91 5.21297L4.41 0.212974C4.36137 0.150638 4.29917 0.100211 4.22813 0.0655279C4.15708 0.0308444 4.07906 0.0128174 4 0.0128174C3.92094 0.0128174 3.84292 0.0308444 3.77188 0.0655279C3.70083 0.100211 3.63863 0.150638 3.59 0.212974L0.0900008 5.21297C0.0374564 5.28793 0.00649822 5.37588 0.000501835 5.46722C-0.00549455 5.55857 0.0137009 5.6498 0.0559952 5.73099C0.0982895 5.81217 0.162059 5.88019 0.240353 5.92762C0.318647 5.97505 0.40846 6.00008 0.500001 5.99997H7.5C7.59154 6.00008 7.68135 5.97505 7.75965 5.92762C7.83794 5.88019 7.90171 5.81217 7.94401 5.73099C7.9863 5.6498 8.0055 5.55857 7.9995 5.46722C7.9935 5.37588 7.96254 5.28793 7.91 5.21297Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          className={clsx(
            'w-full hidden md:flex',
            isShowRankDetail ? 'h-fit opacity-100' : 'h-0 overflow-hidden'
          )}
        >
          <div className="p-[30px] bg-black w-full border-t border-[#23252C]">
            <div className="pb-[100px] relative h-8">
              <div className="absolute flex items-center top-[12px] left-[140px] h-2 w-[calc(100%-280px)] bg-gradient-to-r from-gamefiDark-600 to-black"></div>
              <div className="absolute top-0 left-[108px] w-full flex">
                {ranks.map((e, i) => {
                  const isLastStep = i === ranks.length - 1
                  const isCurrentLevel = rank === e.name
                  const isFirstStep = i === 0
                  const isHigherThanCurrentLevel =
                    get(data, 'rank.exp', 0) < get(e, 'exp', 0)
                  const isSmallerThanCurrentLevel =
                    get(data, 'rank.exp', 0) > get(e, 'exp', 0)
                  const getPercent = () => {
                    if (isHigherThanCurrentLevel) return 0
                    if (isSmallerThanCurrentLevel) return 100
                    if (isFirstStep) {
                      const nextExp =
                        exp.next === 'MAX' ? exp.current : exp.next

                      return (exp.current / nextExp) * 100
                    }

                    const diffExpFromCurrent =
                      exp.current - get(data, 'rank.exp', exp.current)
                    const diffExpFromNext = exp.next - exp.current

                    return (diffExpFromCurrent / diffExpFromNext) * 100
                  }

                  return (
                    <div key={`step_${e._id}`} className="flex items-center">
                      <Stepper data={e} currentRankExp={exp.current}></Stepper>
                      {!isLastStep && (
                        <div className="relative flex w-[226px] h-fit items-center">
                          <div
                            className="flex items-center"
                            style={{ width: `${getPercent()}%` }}
                          >
                            <div className="w-full h-1 bg-gradient-to-r from-[#7BF404] to-[#7BF404]"></div>
                            {isCurrentLevel && exp.current > 0 && (
                              <div className="relative z-10 bg-[#FCF202] rounded-full p-[2px] w-fit">
                                <div className="bg-black p-[2px] rounded-full text-[#FCF202] font-casual font-bold text-[10px] leading-[150%]">
                                  {printNumber(exp.current)}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative h-1 bg-black flex-1"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-[10px] ">
              {ranks.map((e) => (
                <LevelItem key={e._id} data={e}></LevelItem>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-10 w-full bg-[#23252C] h-[1px]"></div>

        {specialRank?.name && (
          <div
            className={clsx(
              'bg-black hidden md:flex justify-center items-center',
              isShowRankDetail ? 'h-fit opacity-100' : 'h-0 overflow-hidden'
            )}
          >
            <div className="w-[300px] h-[250px] relative">
              <Image
                src={require(`@/assets/images/ranks/${
                  specialRank.name || 5
                }.png`)}
                alt=""
                layout="fill"
              ></Image>
            </div>
            <span className="font-casual font-semibold text-13px leading-[150%] text-[#F4F4F4]/40">
              Coming Soon
            </span>
            {/* <div className="flex flex-col">
              <div className="font-mechanic font-bold text-base leading-[100%] uppercase text-white flex gap-2">
                <span>Level {specialRank.name}</span>
                <span className="opacity-50"> — Special Auction</span>
                <Tippy content="Special Auction tooltip">
                  <div className="w-4 h-4 relative mr-36 cursor-pointer">
                    <Image
                      src={require('@/assets/images/ranks/tooltip.svg')}
                      alt=""
                      layout="fill"
                    ></Image>
                  </div>
                </Tippy>
              </div>
              <div className="mt-[34px] font-mechanic text-13px font-bold leading-[100%] uppercase text-white/50">
                Rank benefit
              </div>

              <div className="mt-4">
                {get(specialRank, 'privileges', []).map((e) => {
                  return (
                    <div key={e._id} className="flex">
                      <span className="flex-1 font-casual font-normal text-[13px] leading-[150%] text-[#F4F4F4]">
                        {e.name}
                      </span>
                      <span className="flex-1 font-casual font-bold text-[13px] leading-[150%] text-[#F4F4F4]">
                        {e.description || '-'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Level
