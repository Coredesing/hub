import { printNumber } from '@/utils'
import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useMemo } from 'react'
import styles from './AccountRank.module.scss'
import get from 'lodash.get'
import Link from 'next/link'

const LevelItem = ({ data }) => {
  const { rank, privileges } = useMemo(() => {
    return {
      rank: get(data, 'name') || '1',
      privileges: get(data, 'privileges') || []
    }
  }, [data])

  return (
    <div className="relative min-w-[248px] h-[194px]  rounded-[3px]">
      <div className="absolute top-0 left-0 w-full h-full bg-[#272930] clipped-b-r"></div>
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <div className="w-[70px] h-[70px] absolute left-[calc(50%-35px)] -top-[calc(30px)]">
          <Image
            src={require(`@/assets/images/ranks/${rank}-sd.png`)}
            alt=""
            layout="fill"
          ></Image>
        </div>
        <div className="p-4">
          <div className="flex flex-col pt-[48px] gap-5">
            {privileges.map((e) => {
              return (
                <div key={e._id} className="flex justify-between">
                  <span className="font-casual font-normal text-[13px] leading-[150%] text-[#F4F4F4]">
                    {e.name}
                  </span>
                  <span className="font-casual font-bold text-[13px] leading-[150%] text-[#F4F4F4]">
                    {e.description || '-'}
                  </span>
                </div>
              )
            })}
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
  const { exp, rank } = useMemo(() => {
    const _current = get(data, 'exp.total', '')
    const _next = get(data, 'nextRank.exp', '') || 'MAX'
    const _rank = get(data, 'rank.name')

    return {
      exp: {
        current: _current,
        next: _next,
        percent: (_current / (_next === 'MAX' ? _current : _next)) * 100
      },
      rank: _rank
    }
  }, [data])

  const levelTooltipModalContent = useMemo(() => {
    return (
      <div className="flex w-full rounded-[4px] overflow-hidden">
        <div className="p-[30px] bg-black">
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
                  let percent = 0
                  if (isFirstStep) {
                    percent =
                      (exp.current /
                        (exp.next === 'MAX' ? exp.current : exp.next)) *
                      100
                  } else {
                    const diffExpFromCurrent =
                      exp.current - get(data, 'rank.exp', exp.current)
                    const diffExpFromNext = exp.next - exp.current

                    percent = (diffExpFromCurrent / diffExpFromNext) * 100
                  }

                  return percent
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

        <div className="p-[30px] h-full bg-[#151515]">
          <div className="relative pb-[100px] font-mechanic font-bold text-base leading-[100%] text-white uppercase">
            <div className="absolute top-0 h-8 w-full flex justify-center items-center">
              Special Auction
            </div>
          </div>
          <LevelItem data={specialRank} />
        </div>
      </div>
    )
  }, [data, exp, rank, ranks, specialRank])

  return (
    <div className="flex">
      <div
        className={clsx(
          styles['gradient-box'],
          'flex items-center rounded-[4px] p-4 md:p-[30px]'
        )}
      >
        <div className="w-[88px] h-[88px] relative z-10">
          {rank && (
            <Image
              src={require(`@/assets/images/ranks/${rank}.png`)}
              alt=""
              layout="fill"
            ></Image>
          )}
        </div>
        <div className="">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <div className="uppercase font-mechanic font-bold text-[18px] leading-[100%] text-white">
                  LEVEL {rank}
                </div>
                {/* <Tippy
                  placement="auto"
                  theme="no-padding"
                  touch={true}
                  zIndex={9999}
                  interactive={true}
                  arrow={false}
                  duration={0}
                  delay={0}
                  maxWidth={1400}
                  content={levelTooltipModalContent}
                >
                  <div className="w-4 h-4 relative mr-36 cursor-pointer">
                    <Image
                      src={require('@/assets/images/ranks/tooltip.svg')}
                      alt=""
                      layout="fill"
                    ></Image>
                  </div>
                </Tippy> */}
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

              <div className="flex gap-2">
                <span className="text-[#838487] font-casual font-normal, text-xs leading-[150%]">
                  Reputation:
                </span>
                <span className="font-casual font-semibold text-xs leading-[150%] text-white">
                  Coming Soon
                </span>
              </div>
            </div>

            <div className="font-casual font-semibold text-xs leading-[150%] text-white opacity-50">
              {/* {`EXP ${printNumber(exp.current)}${
                exp.current ? ` / ${printNumber(exp.next)}` : ''
              }`} */}
              {`EXP ${printNumber(exp.current)}`}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-[#272930] flex-1 clipped-t-l-full pl-[52px] py-10 pr-[30px] flex gap-5 rounded-tr-[4px] rounded-br-[4px]">
        <div className="flex flex-col gap-2 max-w-[305px]">
          <div className="font-mechanic font-bold text-sm leading-[150%] uppercase">
            Get EXP by doing task
          </div>
          <div className="font-casual font-normal text-sm leading-[150%] text-white opacity-70">
            Exp give you benefit...
          </div>
        </div>

        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center w-fit gap-2">
            <Link href="/staking">
              <a className="hidden sm:inline-flex bg-gamefiGreen-600 clipped-t-r p-px rounded-sm cursor-pointer">
                <span className="font-mechanic bg-[#7BF404] text-[#0D0F15] hover:text-[#0D0F15]/70 clipped-b-l py-2 px-[38px] rounded-sm leading-5 uppercase font-bold text-[13px]">
                  Stake gafi
                </span>
              </a>
            </Link>
            <Tippy content="Stake GAFI">
              <div className="w-4 h-4 relative cursor-pointer">
                <Image
                  src={require('@/assets/images/ranks/tooltip.svg')}
                  alt=""
                  layout="fill"
                ></Image>
              </div>
            </Tippy>
          </div>

          <div className="flex items-center w-fit gap-2">
            <a
              className="hidden sm:inline-flex bg-gamefiGreen-600 clipped-b-l p-px rounded-sm cursor-pointer"
              href="#task-list"
              // target="_blank"
              rel="noreferrer"
            >
              <span className="w-full font-mechanic bg-gamefiDark-900 text-gamefiGreen-500 hover:text-gamefiGreen-200 clipped-b-l py-2 px-[42px] rounded-sm leading-5 uppercase font-bold text-[13px]">
                Task list
              </span>
            </a>
            <Tippy content="Task list">
              <div className="w-4 h-4 relative cursor-pointer">
                <Image
                  src={require('@/assets/images/ranks/tooltip.svg')}
                  alt=""
                  layout="fill"
                ></Image>
              </div>
            </Tippy>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default Level
