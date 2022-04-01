import Image from 'next/image'
import Layout from '@/components/Layout'

const PressKit = () => (
  <Layout title="GameFi.org - Press Kit">
    <div className="px-4 lg:px-16 mx-auto lg:block max-w-4xl my-8 md:my-12 lg:my-16 xl:my-24">
      <div className="uppercase font-bold text-4xl">Press Kit</div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">WE PROVIDE EXTENSIVE SERVICES FOR BLOCKCHAIN GAME DEVELOPERS, PLAYERS, AND INVESTORS</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">GameFi.org is an all-encompassing hub for game finance. Its ecosystem features GameFi Hub, Launchpad, Marketplace, Guild Hub, and Metaverse. GameFi.org was created to work out problems that most game studios have encountered and discovered effective ways in developing a platform that builds relationships with game developers, players, and investors all in one place.</p>
      <div className="uppercase font-bold text-2xl mb-2 mt-8">GENERAL INFORMATION</div>
      <p className="font-casual text-sm leading-6 opacity-80">Founded: August 2021</p>
      <p className="font-casual text-sm leading-6 opacity-80">
        Website: <a href="https://gamefi.org/" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://gamefi.org/</a>
      </p>

      <p className="font-casual text-sm leading-6 opacity-80">
        Social:
      </p>
      <ul className="font-casual text-sm leading-6 opacity-80 list-disc pl-8">
        <li>Twitter: <a href="https://twitter.com/GameFi_Official" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://twitter.com/GameFi_Official</a></li>
        <li>Telegram Global Chat: <a href="https://t.me/GameFi_Official" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://t.me/GameFi_Official</a></li>
        <li>Announcement Channel: <a href="https://t.me/GameFi_OfficialANN" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://t.me/GameFi_OfficialANN</a></li>
        <li>Discord: <a href="https://discord.gg/gamefi" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://discord.gg/gamefi</a></li>
        <li>Facebook: <a href="https://www.facebook.com/GameFi.org/" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://www.facebook.com/GameFi.org/</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/company/gamefi-official/" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://www.linkedin.com/company/gamefi-official/</a></li>
      </ul>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">ECOSYSTEM FEATURES</div>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        GameFi Launchpad
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">GameFi Hub will be an ultimate gaming destination for gamers, investors, and other game studios.</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        GameFi Hub (former Aggregator)
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">A listing page of the industry’s most creative blockchain games, where players, investors, and traders can receive in-depth information about their game modes, game studios, whitepapers, tokenomics as well as planned IGO events.</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        GameFi Marketplace
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">GameFi.org Marketplace is the destination for everyone to track and trade in-game items, boxes & virtual lands from various collections of game finance projects, updating in real-time.</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        GameFi Earn
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">GameFi Earn is a one-stop service allowing users to earn interest on crypto savings. It offers different types of funds, including Flexible and Fixed pools with competitive interest rates.</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        Metaverse and many more!
      </p>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">BENEFITS</div>
      <p className="font-casual text-sm leading-6 opacity-80">
        Game Projects
      </p>
      <ul className="font-casual text-sm leading-6 opacity-80 list-disc pl-8">
        <li>Facilitated holder-player relations</li>
        <li>Player-centric development funding</li>
        <li>Rapid exposure for the game and its items</li>
      </ul>

      <p className="font-casual text-sm leading-6 opacity-80">
        Game Investors
      </p>
      <ul className="font-casual text-sm leading-6 opacity-80 list-disc pl-8">
        <li>Easy onboarding of scholars</li>
        <li>First access to major games&apos; tokens</li>
        <li>Better liquidity for game assets</li>
      </ul>

      <p className="font-casual text-sm leading-6 opacity-80">
        Game Players
      </p>
      <ul className="font-casual text-sm leading-6 opacity-80 list-disc pl-8">
        <li>Costless access to Play-to-Earn games as a scholar</li>
        <li>Fast access and tracking of all games</li>
        <li>Liquid market for all game items</li>
      </ul>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">LOGO</div>
      <p className="font-casual text-sm leading-6 opacity-80">Do not edit, change, distort or color the GameFi.org Press kit</p>
      <div className="flex gap-x-4">
        <div className="w-full text-center pb-4">
          <div className="flex items-center justify-center h-full rounded-lg border border-gamefiDark-500 bg-black">
            <Image src={require('@/assets/images/logo-color.png')} alt="gamefi.org logo color" width={190} height={20} />
          </div>
          <div className="uppercase text-gamefiDark-100 font-bold text-sm">logo color</div>
        </div>
        <div className="w-full text-center pb-4">
          <div className="flex items-center justify-center h-full rounded-lg border border-gamefiDark-500 bg-gamefiDark-700">
            <Image src={require('@/assets/images/logo-white.png')} alt="gamefi.org logo white" width={190} height={20} />
          </div>
          <div className="uppercase text-gamefiDark-100 font-bold text-sm">logo white</div>
        </div>
        <div className="w-full text-center pb-4">
          <div className="py-2 flex items-center justify-center h-full rounded-lg border border-gamefiDark-500 bg-white">
            <Image src={require('@/assets/images/logo-isotype.png')} alt="gamefi.org logo isotype" />
          </div>
          <div className="uppercase text-gamefiDark-100 font-bold text-sm">Gafi isotype</div>
        </div>
      </div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">colors</div>
      <div className="flex gap-x-4 justify-between">
        <div className="font-casual font-medium sm:font-bold text-[11px] sm:text-sm text-center w-full py-6 rounded-lg" style={{ color: '#0E0F14', backgroundColor: '#72F34B' }}>
          #72F34B
        </div>
        <div className="font-casual font-medium sm:font-bold text-[11px] sm:text-sm text-center w-full py-6 rounded-lg" style={{ color: '#0E0F14', backgroundColor: '#FEB800' }}>
          #FEB800
        </div>
        <div className="font-casual font-medium sm:font-bold text-[11px] sm:text-sm text-center w-full py-6 rounded-lg" style={{ color: '#0E0F14', backgroundColor: '#FF5152' }}>
          #FF5152
        </div>
        <div className="font-casual font-medium sm:font-bold text-[11px] sm:text-sm text-center w-full py-6 rounded-lg" style={{ color: '#0E0F14', backgroundColor: '#ECF8F8' }}>
          #ECF8F8
        </div>
        <div className="font-casual font-medium sm:font-bold text-[11px] sm:text-sm text-center w-full py-6 rounded-lg" style={{ color: '#fff', backgroundColor: '#23262F' }}>
          #23262F
        </div>
      </div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">FULL KIT</div>
      <p className="font-casual text-sm leading-6 opacity-80">Download the full GameFi.org Press kit <a target={'_blank'} href={'https://drive.google.com/file/d/1gWo9XYdKk-u0PEmeORoeWWCPv1_RCmqs/view?usp=sharing'} className={'text-gamefiGreen-400'} rel="noreferrer"><strong>HERE</strong></a></p>
      <p className="font-casual text-sm opacity-80">Last update: Apr 01, 2022</p>
    </div>
  </Layout>
)

export default PressKit
