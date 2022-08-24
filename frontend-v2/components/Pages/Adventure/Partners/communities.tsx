import img1 from '../images/communities/1.png'
import img2 from '../images/communities/2.png'
import img3 from '../images/communities/3.png'
import img4 from '../images/communities/4.png'
import img5 from '../images/communities/5.png'
import img6 from '../images/communities/6.png'
import img7 from '../images/communities/7.png'
import img8 from '../images/communities/8.png'
import img9 from '../images/communities/9.png'
import img10 from '../images/communities/10.png'
import img11 from '../images/communities/11.png'
import img12 from '../images/communities/12.png'
import img13 from '../images/communities/13.png'
import img14 from '../images/communities/14.png'
import img15 from '../images/communities/15.png'
import img16 from '../images/communities/16.png'
import img17 from '../images/communities/17.png'
import img18 from '../images/communities/18.png'
import img19 from '../images/communities/19.png'
import img20 from '../images/communities/20.png'
import img21 from '../images/communities/21.png'
import img22 from '../images/communities/22.png'
import img23 from '../images/communities/23.png'
import img24 from '../images/communities/24.png'
import img25 from '../images/communities/25.png'
import img26 from '../images/communities/26.png'
import img27 from '../images/communities/27.png'
import Image from 'next/image'

const items = [
  { name: 'CCC', url: 'https://t.me/CryptoCoinsCoach', img: img1 },
  { name: 'cryptobanter', url: 'https://www.cryptobanter.com', img: img2 },
  { name: 'Crypto nation', url: 'https://t.me/cryptonationamagroup', img: img3 },
  { name: 'airdropfind', url: 'https://t.me/airdropfind', img: img4 },
  { name: 'TokenHunter', url: 'https://t.me/tokenhunter_official', img: img5 },
  { name: 'TCVN (+ Kienthucfarming)', url: 'https://t.me/vietnamtradecoinchannel', img: img6 },
  { name: 'HC gem', url: 'https://t.me/HCGemAlerts', img: img7 },
  { name: 'Bengbeng gaming', url: 'https://linktr.ee/bengbenggaming', img: img8 },
  { name: 'UB Ventures', url: 'https://t.me/ubholdcoin', img: img9 },
  { name: 'CryptoCup', url: 'https://t.me/CryptoCupTH ', img: img10 },
  { name: 'Blocktalks', url: 'https://t.me/BlockTalksDiscussion', img: img11 },
  { name: 'Hidden Gem', url: 'https://t.me/GRgameguild', img: img12 },
  { name: 'AVStar', url: 'https://t.me/AvstarCapital', img: img13 },
  { name: 'Redkite', url: 'https://t.me/PolkaFoundry', img: img14 },
  { name: 'Mechmaster', url: 'https://t.me/MechMaster_Chat', img: img15 },
  { name: 'GAINs | Sam', url: 'https://t.me/GainsChat ', img: img16 },
  { name: 'Moonboots', url: 'https://twitter.com/MoonBootsCap', img: img17 },
  { name: 'Criptogemas', url: 'https://t.me/CriptoGemas_R4H', img: img18 },
  { name: 'MANDY', url: 'https://t.me/getrichwithmandygroupchat', img: img19 },
  { name: 'WOLF', url: 'https://t.me/wolfonairechatbox', img: img20 },
  { name: 'TK venture', url: 'https://twitter.com/PlayToEarnGames', img: img21 },
  { name: 'Onemax', url: 'https://twitter.com/capitalonemax', img: img22 },
  { name: 'VBC', url: 'https://t.me/vbc_group', img: img23 },
  { name: 'Cryptodiffer', url: 'https://t.me/cryptodiffer', img: img24 },
  { name: 'ICO & IDO Update', url: 'https://t.me/Binance_Persiann', img: img25 },
  { name: 'Setio', url: 'https://t.me/nftgamesid', img: img26 },
  { name: 'CCA Channel', url: 'https://t.me/CCA_Group', img: img27 }
]

const Communities = () => {
  return <div className="px-4 xl:p-16 2xl:px-32 container mx-auto lg:block font-atlas mt-8">
    <div className="text-3xl mb-3">
      <span className="bg-gradient-to-r from-[#93FF61] to-[#FAFF00] bg-clip-text text-transparent">Community</span> Partners
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {items.map(item => <a key={item.name} href={item.url} target="_blank" rel="noopenner noreferrer" className="grayscale hover:grayscale-0 flex justify-center">
        <Image src={item.img} alt={item.name}></Image>
      </a>)}
    </div>
  </div>
}

export default Communities
