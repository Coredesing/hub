import Image from 'next/image'
import Layout from 'components/Layout'

const PressKit = () => (
  <Layout title="Press Kit">
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-4xl pb-4">
      <div className="uppercase font-bold text-4xl">Press Kit</div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">WE PROVIDE EXTENSIVE SERVICES FOR BLOCKCHAIN GAMERS, INVESTORS, AND TRADERS</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">GameFi.org is one of the best performing game hubs that offer all-encompassing services including Game Aggregator, Game Marketplace, Game Accelerator, Yield Guilds & Scholarships as well as a Game Launchpad exclusively made for games.</p>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">GENERAL INFORMATION</div>
      <p className="font-casual text-sm leading-6 opacity-80">Founding date: August 2021</p>
      <p className="font-casual text-sm leading-6 opacity-80">
        Website:
      </p>
      <ul className="font-casual text-sm leading-6 opacity-80 list-disc pl-8">
        <li>Aggregator: <a href="https://gamefi.org/" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://gamefi.org/</a></li>
        <li>Launchpad: <a href="https://hub.gamefi.org/" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://hub.gamefi.org/</a></li>
        <li>Marketplace: <a href="https://hub.gamefi.org/#/mystery-boxes" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://hub.gamefi.org/#/mystery-boxes</a></li>
      </ul>
      <p className="font-casual text-sm leading-6 opacity-80">
        Business Contact: ???
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">
        Social:
      </p>
      <ul className="font-casual text-sm leading-6 opacity-80 list-disc pl-8">
        <li>Twitter: <a href="https://twitter.com/GameFi_Official" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://twitter.com/GameFi_Official</a></li>
        <li>Telegram: <a href="https://t.me/GameFi_OfficialANN" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://t.me/GameFi_OfficialANN</a></li>
        <li>Discord: <a href="https://discord.gg/gamefi" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://discord.gg/gamefi</a></li>
        <li>Medium: <a href="https://medium.com/gamefi-official" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://medium.com/gamefi-official</a></li>
        <li>Facebook: <a href="https://www.facebook.com/GameFi.org/" className="text-gamefiGreen-500 hover:text-gamefiGreen-800" target="_blank" rel="noreferrer">https://www.facebook.com/GameFi.org/</a></li>
      </ul>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">ECOSYSTEM FEATURES</div>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        1. GameFi.org Launchpad
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">First IGO (Initial Game Offering) platform, with tools to facilitate launching new coins, crypto projects, and raising liquidity. GameFi.org Launchpad helps investors identify early-stage potential blockchain games and participate in their presale rounds.</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        2. GameFi.org Aggregator
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">A listing page of the industry’s most creative blockchain games, where players, investors, and traders can receive in-depth information about their game modes, game studios, whitepapers, tokenomics as well as planned IGO events.</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        3. GameFi.org Marketplace
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">First multi-chain marketplace for trading blockchain game items across game borders, with easy connection to wallets, quick purchase, and payment.</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        4. Yield Guilds & Scholarships
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">Yield guild for gamers and token holders from multiple networks. Token holders can finance Play-to-Earn gameplay through Scholarships and other creative activities.</p>
      <p className="font-casual text-sm leading-6 font-bold mt-4">
        5. GameFi.org Accelerator
      </p>
      <p className="font-casual text-sm leading-6 opacity-80">Accelerate your blockchain projects by adopting factory contracts for token economies, NFTs, and Play to Earn mechanics. Get your games exposed to a large community of players and investors.</p>

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
          <div className="py-2 flex items-center justify-center h-full rounded-lg border border-gamefiDark-500 bg-black">
            <Image src={require('assets/images/logo-color.png')} alt="gamefi.org logo color" />
          </div>
          <div className="uppercase text-gamefiDark-100 font-bold text-sm">logo color</div>
        </div>
        <div className="w-full text-center pb-4">
          <div className="py-2 flex items-center justify-center h-full rounded-lg border border-gamefiDark-500 bg-gamefiDark-700">
            <Image src={require('assets/images/logo-white.png')} alt="gamefi.org logo white" />
          </div>
          <div className="uppercase text-gamefiDark-100 font-bold text-sm">logo white</div>
        </div>
        <div className="w-full text-center pb-4">
          <div className="py-2 flex items-center justify-center h-full rounded-lg border border-gamefiDark-500 bg-white">
            <Image src={require('assets/images/logo-isotype.png')} alt="gamefi.org logo isotype" />
          </div>
          <div className="uppercase text-gamefiDark-100 font-bold text-sm">Gafi isotype</div>
        </div>
      </div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">colors</div>
      <div className="flex gap-x-4 justify-between">
        <div className="font-casual font-bold text-sm text-center w-full py-6 rounded-lg" style={{ color: '#0E0F14', backgroundColor: '#6CDB00' }}>
          #6CDB00
        </div>
        <div className="font-casual font-bold text-sm text-center w-full py-6 rounded-lg" style={{ color: '#0E0F14', backgroundColor: '#FEB800' }}>
          #FEB800
        </div>
        <div className="font-casual font-bold text-sm text-center w-full py-6 rounded-lg" style={{ color: '#0E0F14', backgroundColor: '#FF5152' }}>
          #FF5152
        </div>
        <div className="font-casual font-bold text-sm text-center w-full py-6 rounded-lg" style={{ color: '#0E0F14', backgroundColor: '#ECF8F8' }}>
          #ECF8F8
        </div>
        <div className="font-casual font-bold text-sm text-center w-full py-6 rounded-lg" style={{ color: '#fff', backgroundColor: '#23262F' }}>
          #23262F
        </div>
      </div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">FULL KIT</div>
      <p className="font-casual text-sm leading-6 opacity-80">Download the full GameFi.org Press kit here</p>
    </div>
  </Layout>
)

export default PressKit
