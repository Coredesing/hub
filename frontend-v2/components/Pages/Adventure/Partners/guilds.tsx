import img1 from '../images/guilds/1.png'
import img2 from '../images/guilds/2.png'
import img3 from '../images/guilds/3.png'
import img4 from '../images/guilds/4.png'
import img5 from '../images/guilds/5.png'
import img6 from '../images/guilds/6.png'
import img7 from '../images/guilds/7.png'
import img8 from '../images/guilds/8.png'
import img9 from '../images/guilds/9.png'
import img10 from '../images/guilds/10.png'
import img11 from '../images/guilds/11.png'
import img12 from '../images/guilds/12.png'
import img13 from '../images/guilds/13.png'
import img14 from '../images/guilds/14.png'
import img15 from '../images/guilds/15.png'
import img16 from '../images/guilds/16.png'
import img17 from '../images/guilds/17.png'
import img18 from '../images/guilds/18.png'
import img19 from '../images/guilds/19.png'
import img20 from '../images/guilds/20.png'
import img21 from '../images/guilds/21.png'
import Image from 'next/image'

const items = [
  { name: 'Avocado', url: 'https://gamefi.org/guilds/avocadodao', img: img1 },
  { name: 'GGG', url: 'https://gamefi.org/guilds/goodgamesguild', img: img2 },
  { name: 'YGG SEA', url: 'https://gamefi.org/guilds/yggsea', img: img3 },
  { name: 'AVG', url: 'https://gamefi.org/guilds/avisagamesguild', img: img4 },
  { name: 'BGH', url: 'https://gamefi.org/guilds/babymoongaminghouse', img: img5 },
  { name: 'Metagaming', url: 'https://gamefi.org/guilds/metagamingguild', img: img6 },
  { name: 'Promisphere', url: 'https://gamefi.org/guilds/promisphere', img: img7 },
  { name: 'Bach Nghien', url: 'https://gamefi.org/guilds/bachnghiengamehub', img: img8 },
  { name: 'BAGG', url: 'https://battlearena.gg', img: img9 },
  { name: 'Bengbeng', url: 'https://bengbenggaming.com', img: img10 },
  { name: 'Enich', url: 'https://gamefi.org/guilds/enrichgameguild', img: img11 },
  { name: 'HLGH', url: 'https://gamefi.org/guilds/highlightgamehouse', img: img12 },
  { name: 'Hoopoe', url: 'https://gamefi.org/guilds/hoopoeventures', img: img13 },
  { name: 'Laplap', url: 'https://gamefi.org/guilds/laplap', img: img14 },
  { name: 'Lucis', url: 'https://gamefi.org/guilds/lucisnetwork', img: img15 },
  { name: 'Madmonkey', url: 'https://gamefi.org/guilds/madmonkeyguild', img: img16 },
  { name: 'Metadao', url: 'https://gamefi.org/guilds/metadaoguild', img: img17 },
  { name: 'playitforward', url: 'https://gamefi.org/guilds/playitforwarddao', img: img18 },
  { name: 'senguild', url: 'https://gamefi.org/guilds/senguild', img: img19 },
  { name: 'Slime family', url: 'https://gamefi.org/guilds/slimefamilyguild', img: img20 },
  { name: 'X8', url: 'https://gamefi.org/guilds/x8guild', img: img21 }
]

const Guilds = () => {
  return <div className="px-6 lg:px-12 container mx-auto lg:block font-atlas mt-16">
    <div className="text-3xl mb-3 lg:mb-6 text-center">
      <span className="bg-gradient-to-r from-[#93FF61] to-[#FAFF00] bg-clip-text text-transparent">Guilds</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      { items.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopenner noreferrer" className="grayscale hover:grayscale-0 flex justify-center">
        <Image src={item.img} alt={item.name}></Image>
      </a>) }
    </div>
  </div>
}

export default Guilds
