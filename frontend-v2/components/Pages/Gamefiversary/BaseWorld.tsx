import left from '@/components/Pages/Adventure/images/left.svg'
import right from '@/components/Pages/Adventure/images/right.svg'
import Image from 'next/image'
import Flicking, { Plugin } from '@egjs/react-flicking'
import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { imagesProjects } from '@/pages/happy-gamefiversary/tasks'
import { Sync } from '@egjs/flicking-plugins'
import { fetcher } from '@/utils'
import { useMyWeb3 } from '@/components/web3/context'
import TopWorldItem from './TopWorldItem'
import MiddleWorldItem from './MiddleWorldItem'
import { useWalletContext } from '@/components/Base/WalletConnector/provider'

type WorldType = 'top-world' | 'middle-world'

const BaseWorld = ({
  projects,
  type,
  className = '',
  layoutBodyRef,
  connectedAllSocial
}: {
  projects: Array<Record<string, unknown>>;
  type: WorldType;
  className?: string;
  layoutBodyRef: any;
  connectedAllSocial: boolean;
}) => {
  const flickingGameRef = useRef(null)
  const flickingListGameRef = useRef(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0)
  const [plugins, setPlugins] = useState<Plugin[]>([])

  const { account } = useMyWeb3()
  const { setShowModal: showConnectWallet } = useWalletContext()

  useEffect(() => {
    if (!projects || !projects.length) return

    setTimeout(() => {
      setPlugins([
        new Sync({
          type: 'index',
          synchronizedFlickingOptions: [
            {
              flicking: flickingGameRef.current,
              isClickable: true,
              activeClass: ''
            },
            {
              flicking: flickingListGameRef.current,
              isSlidable: true
            }
          ]
        })
      ])
      flickingGameRef.current.change = (e) => setCurrentProjectIndex(e.index)
      flickingListGameRef.current.change = (e) =>
        setCurrentProjectIndex(e.index)
    }, 1000)
  }, [projects])

  const playGame = useCallback(
    async (id) => {
      if (!account) {
        showConnectWallet(true)
        // return layoutBodyRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }
      if (!connectedAllSocial) {
        return layoutBodyRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }

      return fetcher(`/api/adventure/${account}/connect?id=${id}`, {
        method: 'PATCH'
      })
        .then((res) => console.log(res))
        .catch((e) => console.debug(e))
    },
    [account, connectedAllSocial, layoutBodyRef, showConnectWallet]
  )

  return (
    <>
      {projects?.length !== 0 && (
        <section className={clsx(className)}>
          <div className="flex justify-center gap-3 sm:gap-6">
            <img src={left.src} alt="" />
            <span className="uppercase font-bold min-w-fit sm:text-2xl">
              {type === 'top-world' ? 'Top world' : 'Middle world'}
            </span>
            <img src={right.src} alt="" />
          </div>
          {/* {type === 'top-world' && (
            <>
              <div className="hidden w-full lg:flex justify-center mb-12 mx-auto">
                <Image
                  src={require('@/assets/images/adventure/meowo.png')}
                  alt=""
                ></Image>
              </div>
              <div className="lg:hidden w-full flex justify-center mb-12 mx-auto">
                <Image
                  src={require('@/assets/images/adventure/meowo-mobile.png')}
                  alt=""
                ></Image>
              </div>
            </>
          )} */}
          <div
            className={clsx('my-3 mt-10')}
          >
            {/* <img src={circleArrow.src} alt="" /> */}
            <Flicking
              defaultIndex={currentProjectIndex}
              ref={flickingGameRef}
              bound={true}
              plugins={plugins}
              preventClickOnDrag={false}
              onChanged={(e) => setCurrentProjectIndex(e.index)}
            >
              {projects.map((el, i) => (
                <div key={`top-world-${i}`} className="w-1/3 md:w-1/6">
                  <div
                    className={clsx(
                      'border-2 border-transparent rounded-xl cursor-pointer overflow-hidden mx-1',
                      i === currentProjectIndex ? 'border-[#6CDB00]' : ''
                    )}
                  >
                    <div className="w-full rounded-xl overflow-hidden aspect-[158/213]">
                      {imagesProjects[`${el?.slug}`]?.imageVertical && (
                        <img
                          src={
                            imagesProjects[`${el?.slug}`]?.imageVertical
                              ?.default?.src
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className={clsx(
                      el?.status === 'UNLOCK'
                        ? 'bg-gradient-to-t from-[#C9DB00] to-[#6CDB00]'
                        : 'bg-[#D9D9D9]',
                      'mx-auto mt-2 justify-center w-2 h-2 rounded-full'
                    )}
                  />
                </div>
              ))}
            </Flicking>
            {/* <img src={circleArrow.src} alt="" /> */}
          </div>
          <Flicking
            defaultIndex={currentProjectIndex}
            ref={flickingListGameRef}
            plugins={plugins}
            preventClickOnDrag={false}
            onChanged={(e) => setCurrentProjectIndex(e.index)}
          >
            {projects.map((el, i) => (
              <div
                key={`top-world-info-${i}`}
                className="flex md:h-96 flex-col md:flex-row w-full border border-[#303342] rounded-[4px] overflow-hidden"
              >
                <div className="aspect-[158/213] hidden md:block relative">
                  <img
                    src={
                      imagesProjects[`${el?.slug}`]?.imageVertical?.default?.src
                    }
                    className="object-cover w-full h-full"
                    alt=""
                  />
                  <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      background:
                        'linear-gradient(270deg, #1B1D26 0%, rgba(27, 29, 38, 0) 118.45%)'
                    }}
                  ></div>
                </div>
                <img
                  src={imagesProjects[`${el?.slug}`]?.imageMobile?.default?.src}
                  className="aspect-[2/1] object-cover md:hidden"
                  alt=""
                />
                {type === 'top-world' && (
                  <TopWorldItem data={el} playGame={playGame} connectedAllSocial={connectedAllSocial}/>
                )}
                {type === 'middle-world' && (
                  <MiddleWorldItem data={el} playGame={playGame} connectedAllSocial={connectedAllSocial}/>
                )}
              </div>
            ))}
          </Flicking>
        </section>
      )}
    </>
  )
}

export default BaseWorld
