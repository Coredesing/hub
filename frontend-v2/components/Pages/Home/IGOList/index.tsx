import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import CardItem from './CardItem'
import Flicking from '@egjs/react-flicking'
import '@egjs/flicking-plugins/dist/pagination.css'
import '@egjs/flicking/dist/flicking.css'

const IGOList = ({ listUpcoming }) => {
  const [loading, setLoading] = useState(true)
  const refSlider = useRef(null)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (listUpcoming && listUpcoming.length > 0
    ? <>
      <div className="md:px-4 lg:px-16 mx-auto bg-black mt-20 pb-32">
        <div className="relative w-64 md:w-64 lg:w-1/3 xl:w-96 mx-auto text-center font-bold md:text-lg lg:text-xl">
          <div className="inline-block top-0 left-0 right-0 uppercase bg-gamefiDark-900 w-full mx-auto text-center clipped-b p-3 font-bold md:text-lg lg:text-xl xl:text-3xl">
            Upcoming IGOs
          </div>
          <div className="absolute -bottom-5 left-0 right-0">
            <Image src={require('@/assets/images/under-stroke-green.svg')} alt="under stroke"></Image>
          </div>
        </div>
        <div className="lg:hidden mt-14">
          {!loading && <Flicking circular={true} className="w-full" align="center" ref={refSlider} interruptable={true}>
            {listUpcoming.map(item => (
              <div key={item.id} className="w-2/3 px-3"><CardItem item={item}></CardItem></div>
            ))}
          </Flicking>}
        </div>
        <div className="hidden lg:block mx-auto md:container 2xl:px-16">
          {
            !loading && <div className={`text-center justify-center ${listUpcoming.length <= 3 ? 'flex' : 'grid grid-cols-3'} gap-4 xl:gap-6 mt-14`}>
              {listUpcoming.map(item => (
                <CardItem key={`igo-${item.id}`} item={item} className="max-w-[400px]"></CardItem>
              ))}
            </div>
          }
        </div>
      </div>
    </>
    : <></>
  )
}

export default IGOList
