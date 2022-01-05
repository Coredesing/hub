/* eslint-disable @next/next/no-img-element */
import Layout from 'components/Layout'
import Image from 'next/image'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'

const items = [
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/dhatsJO.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/4rav4Pk.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/mAMucft.png'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/u1NM6S6.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/9lfkSWM.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/yFevUKf.jpeg'
  },
  {
    title: 'LOREM IPSUM DOLOR SIT AMET',
    favorites: 1024000,
    type: 'game studio',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores ullam id fugit alias obcaecati dolores qui eos recusandae magni. Veritatis officia omnis necessitatibus pariatur, odio earum! Quae evenie',
    img: 'https://i.imgur.com/rCPySIK.jpeg'
  }
]

const IndexPage = () => {
  return (
    <Layout title="GameFi">
      <div className="px-16 container mx-auto hidden lg:block">
        <Carousel
          showStatus={false}
          showIndicators={false}
          // autoPlay={true}
          stopOnHover={true}
          showThumbs={true}
          thumbWidth={150}
          renderThumbs={(children) => {
            return items && items.length > 1 && items.map((item, i) => {
              console.log(item)
              return <img key={item.title} src={item.img} alt="img" />
            })
          }}
          renderArrowPrev={(onClickHandler, hasPrev, label) => {
            return (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ position: 'absolute', zIndex: '2', top: 'calc(50% - 12px)', cursor: 'pointer', left: '0', opacity: !hasPrev && '50%' }}
              >
                <Image src={require('assets/images/icons/arrow-left.svg')} alt="left"/>
              </button>
            )
          }
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ position: 'absolute', zIndex: '2', top: 'calc(50% - 12px)', cursor: 'pointer', right: '0', opacity: !hasNext && '50%' }}
              >
                <Image src={require('assets/images/icons/arrow-right.svg')} alt="right"/>
              </button>
            )
          }
        >
          {items.map(item => (
            <div key={item.title} className="px-14 mx-auto grid grid-cols-12 gap-4">
              <div className="col-span-7 xl:col-span-8 overflow-hidden">
                <img src={item.img} alt="img" className='clipped-t-r-lg slider-image'/>
              </div>
              <div className="col-span-5 xl:col-span-4 xl:pt-16 w-full px-4">
                <div className="text-lg xl:text-3xl font-bold uppercase text-left">{item.title}</div>
                <div className="flex align-middle items-center w-full mt-3 xl:mt-5">
                  <div className="flex align-middle items-center text-sm">
                    <Image src={require('assets/images/icons/heart.svg')} alt="heart"/>
                    <p className="ml-2 tracking-widest text-gray-200">{item.favorites}</p>
                  </div>
                  <div className="flex align-middle items-center ml-4">
                    <Image src={require('assets/images/icons/game-console.svg')} alt="game-console"/>
                    <p className="ml-2 tracking-widest uppercase text-gray-200">{item.type}</p>
                  </div>
                </div>
                <div className="mt-3 xl:mt-5">
                  <p className="text-left tracking-wider leading-6 text-gray-300 max-h-24 overflow-y-scroll hide-scrollbar">{item.description}</p>
                </div>
                <div className="mt-3 xl:mt-5">
                  <button className="bg-gamefiGreen-500 text-gamefiDark-900 py-2 px-6 flex align-middle items-center rounded-xs clipped-t-r hover:opacity-90">
                    <div className="mr-2 uppercase font-bold text-xs">View more</div>
                    <Image src={require('assets/images/icons/arrow-right-dark.svg')} alt="right" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </Layout>
  )
}

export default IndexPage
