import img1 from '../images/games/1.png'
import img2 from '../images/games/2.png'
import img3 from '../images/games/3.png'
import img4 from '../images/games/4.png'
import img5 from '../images/games/5.png'
import img6 from '../images/games/6.png'
import img7 from '../images/games/7.png'
import img8 from '../images/games/8.png'
import img9 from '../images/games/9.png'
import img10 from '../images/games/10.png'
import img11 from '../images/games/11.png'
import img12 from '../images/games/12.png'
import img13 from '../images/games/13.png'
import img14 from '../images/games/14.png'
import img15 from '../images/games/15.png'
import img16 from '../images/games/16.png'
import img17 from '../images/games/17.png'
import img18 from '../images/games/18.png'
import img19 from '../images/games/19.png'
import img20 from '../images/games/20.png'
import img21 from '../images/games/21.png'
import img22 from '../images/games/22.png'
import img23 from '../images/games/23.png'
import img24 from '../images/games/24.png'
import img25 from '../images/games/25.png'
import img26 from '../images/games/26.png'
import img27 from '../images/games/27.png'
import img28 from '../images/games/28.png'
import img29 from '../images/games/29.png'
import img30 from '../images/games/30.png'
import img31 from '../images/games/31.png'
import img32 from '../images/games/32.png'
import img33 from '../images/games/33.png'
import img34 from '../images/games/34.png'
import img35 from '../images/games/35.png'
import img36 from '../images/games/36.png'
import Image from 'next/image'

const items = [
  { name: 'Dvision Network', url: 'https://dvision.app/en/home', img: img1 },
  { name: 'Kucoin', url: 'https://www.kucoin.com/', img: img2 },
  { name: 'Splinterlands', url: 'https://splinterlands.com/', img: img3 },
  { name: 'Aether Games', url: 'https://www.aethergames.io/', img: img4 },
  { name: 'Ninneko', url: 'https://ninneko.com/', img: img5 },
  { name: 'Monsterra', url: 'https://monsterra.io/', img: img6 },
  { name: 'Titan Hunters', url: 'https://www.titanhunters.io/', img: img7 },
  { name: 'Step App', url: 'https://step.app/', img: img8 },
  { name: 'The Unfettered', url: 'https://www.theunfettered.io/', img: img9 },
  { name: 'Codyfight', url: 'https://codyfight.com/', img: img10 },
  { name: 'Engines of Fury', url: 'https://www.eof.gg/', img: img11 },
  { name: 'Summoners Arena', url: 'https://summonersarena.io/', img: img12 },
  { name: 'Epicwar', url: 'https://epicwar.io/', img: img13 },
  { name: 'Aradena', url: 'https://www.aradena.io/home/', img: img14 },
  { name: 'Planet Sandbox', url: 'https://planetsandbox.io/', img: img15 },
  { name: 'DESports', url: 'https://www.desports.gg/', img: img16 },
  { name: 'beFITTER', url: 'https://befitter.io/', img: img17 },
  { name: 'Metacity', url: 'https://metacity.game/', img: img18 },
  { name: 'MetaShooter', url: 'https://metashooter.gg/', img: img19 },
  { name: 'DINOX World', url: 'https://dinox.io/', img: img20 },
  { name: 'Evermoon', url: 'https://evermoon.games/', img: img21 },
  { name: 'Goons of Balatroon', url: 'https://goonsofbalatroon.com/', img: img22 },
  { name: 'Moon Strike', url: 'https://moonstrike.io/', img: img23 },
  { name: 'Pikaster', url: 'https://www.pikaster.com/', img: img24 },
  { name: 'Isekaiverse', url: 'https://www.isekaiverse.io/', img: img25 },
  { name: 'Dark Country', url: 'https://darkcountry.io/', img: img26 },
  { name: 'Heroes Land', url: 'https://heroesland.io/', img: img27 },
  { name: 'Moverse.run', url: 'https://moverse.run/', img: img28 },
  { name: 'IguVerse', url: 'https://iguverse.com/', img: img29 },
  { name: 'Planet Mojo', url: 'https://www.planetmojo.io/', img: img30 },
  { name: 'Thunder Lands', url: 'https://tl.games/', img: img31 },
  { name: 'Rise of Immortals', url: 'https://www.immortalrise.com/', img: img32 },
  { name: 'Homie Wars', url: 'https://homiewars.com/', img: img33 },
  { name: 'Monster Era', url: 'https://monsterera.io/', img: img34 },
  { name: 'Aniwar', url: 'https://aniwar.io/', img: img35 },
  { name: 'War Legends', url: 'https://warlegends.co/', img: img36 }
]

const Games = () => {
  return <div className="px-6 lg:px-12 container mx-auto lg:block font-atlas mt-16">
    <div className="text-3xl mb-3 lg:mb-6 text-center">
      <span className="bg-gradient-to-r from-[#93FF61] to-[#FAFF00] bg-clip-text text-transparent">Game</span> Partners
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {items.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopenner noreferrer" className="grayscale hover:grayscale-0 flex justify-center">
        <Image src={item.img} alt={item.name}></Image>
      </a>)}
    </div>
  </div>
}

export default Games
