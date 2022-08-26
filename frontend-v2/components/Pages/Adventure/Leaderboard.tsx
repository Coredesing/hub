import { fetcher, printNumber } from '@/utils'
import { useState, useMemo, memo, useEffect } from 'react'
import leaderboardFrame from '@/components/Pages/Adventure/images/leaderboard-frame.png'
import { useMyWeb3 } from '@/components/web3/context'
import { format } from 'date-fns'

type Player = {
  name: string;
  point: number;
  rank?: number;
  prize: number;
}

type Team = Player & {
  count: number;
}

const Leaderboard = () => {
  const { account } = useMyWeb3()
  const [players, setPlayers] = useState<{
    top: Player[];
    me?: Player;
  }>({
    top: []
  })

  const [teams, setTeams] = useState<{
    top: Team[];
    me?: Team;
  }>({
    top: []
  })

  const [tab, setTab] = useState<number>(0)
  const isPlayer = useMemo(() => {
    return tab === 0
  }, [tab])

  useEffect(() => {
    const poolPlayer = {
      1: 2000,
      5: 1000,
      10: 500,
      50: 100,
      100: 50
    }

    const poolTeam = {
      1: 9000,
      5: 3000,
      10: 2000
    }

    if (account === null) {
      // only truthy and undefined are accepted
      return
    }

    fetcher(`/api/adventure/leaderboards/players?walletAddress=${account || ''}`).then(response => {
      if (!response) {
        return
      }

      const { top, me }: { top: Player[]; me?: Player } = response
      if (!top) {
        return
      }

      const top10 = top.slice(0, 10).map((x, i) => {
        for (const k of Object.keys(poolPlayer)) {
          const kInt = parseInt(k)
          if (kInt >= i + 1) {
            x.prize = poolPlayer[k]
            break
          }
        }

        return x
      })

      if (!me) {
        setPlayers({
          top: top10
        })
        return
      }

      const position = top.findIndex(x => x.name === me.name)
      if (position === -1) {
        setPlayers({
          top: top10,
          me
        })
        return
      }

      me.rank = position + 1
      me.prize = top[position]?.prize

      setPlayers({
        top: top10,
        me
      })
    })

    fetcher(`/api/adventure/leaderboards/teams?walletAddress=${account || ''}`).then(response => {
      if (!response) {
        return
      }

      const { top, me }: { top: Team[]; me?: Team } = response
      if (!top) {
        return
      }

      const top10 = top.slice(0, 10).map((x, i) => {
        for (const k of Object.keys(poolTeam)) {
          const kInt = parseInt(k)
          if (kInt >= i + 1) {
            x.prize = poolTeam[k]
            break
          }
        }

        return x
      })

      if (!me) {
        setTeams({
          top: top10
        })
        return
      }

      const position = top.findIndex(x => x.name === me.name)
      if (position === -1) {
        setTeams({
          top: top10,
          me
        })
        return
      }

      me.rank = position + 1
      me.prize = top[position]?.prize

      setTeams({
        top: top10,
        me
      })
    })
  }, [account])

  const from = '24 Aug 2022 20:00'
  const to = '08 Sep 2022 20:00'

  return <div className="container mx-auto max-w-[1000px]">
    <div className="text-center font-spotnik text-2xl sm:text-4xl xl:text-5xl font-bold uppercase leading-none mb-6">Event Leaderboards</div>
    <div className="text-center text-sm sm:text-base"><span className="hidden sm:inline">From</span> <strong>{format(new Date(from), 'dd MMM yyyy HH:ss')}</strong> <span className="hidden sm:inline">to</span><span className="inline sm:hidden">-</span> <strong>{format(new Date(to), 'dd MMM yyyy HH:ss (O)')}</strong></div>
    <div className="flex mx-2 mb-6 relative items-center justify-center bg-center bg-no-repeat bg-contain py-8" style={{
      backgroundImage: `url(${leaderboardFrame.src})`
    }}>
      <div className="inline-block relative w-auto">
        <div className="absolute -top-6 -left-6 z-10 p-2 bg-black"><svg className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m17 0 4.353 17L17 34l-4.353-17L17 0Z" fill="#fff" /><path d="m34 17-17 4.353L0 17l17-4.353L34 17Z" fill="#fff" /></svg></div>
        <div className={'w-full clipped-t-r bg-gamefiDark-300 inline-flex p-px'}>
          <div className="w-full clipped-t-r flex items-center gap-8 sm:gap-16 justify-center font-spotnik py-2 pr-4 pl-8 bg-black relative">
            <div>
              <span className="text-sm sm:text-[18px] uppercase">Prize Pool</span>
              <div className="text-2xl sm:text-[50px] font-bold bg-gradient-to-r from-[#93FF61] to-[#FAFF00] text-transparent bg-clip-text leading-none sm:leading-[54px]">$50,000+</div>
            </div>
            <div>
              <a href="https://gamefi.org/insight/gamefiversary-prize-pool-worth-more-than-50-000-busd-are-you-ready-to-be-the-number-one" target="_blank" rel="noreferrer">
                <svg className="h-10 sm:h-12" viewBox="0 0 188 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 2C0 0.89543 0.895431 0 2 0H180.172C180.702 0 181.211 0.210714 181.586 0.585786L187.414 6.41421C187.789 6.78929 188 7.29799 188 7.82843V44C188 45.1046 187.105 46 186 46H2C0.89543 46 0 45.1046 0 44V2Z" fill="white" />
                  <path d="M0 2C0 0.89543 0.895431 0 2 0H180.172C180.702 0 181.211 0.210714 181.586 0.585786L187.414 6.41421C187.789 6.78929 188 7.29799 188 7.82843V44C188 45.1046 187.105 46 186 46H2C0.89543 46 0 45.1046 0 44V2Z" fill="url(#gradient-prize-pool)" />
                  <path d="M60.4949 18.624L57.4229 27H55.3829L52.3109 18.624H54.1109L56.4149 25.284L58.7069 18.624H60.4949ZM63.4221 18.624V27H61.7421V18.624H63.4221ZM67.002 19.98V22.08H69.822V23.412H67.002V25.632H70.182V27H65.322V18.612H70.182V19.98H67.002ZM83.1447 18.624L80.8047 27H78.8247L77.2527 21.036L75.6087 27L73.6407 27.012L71.3847 18.624H73.1847L74.6607 25.128L76.3647 18.624H78.2367L79.8447 25.092L81.3327 18.624H83.1447ZM90.509 18.624C91.389 18.624 92.161 18.796 92.825 19.14C93.497 19.484 94.013 19.976 94.373 20.616C94.741 21.248 94.925 21.984 94.925 22.824C94.925 23.664 94.741 24.4 94.373 25.032C94.013 25.656 93.497 26.14 92.825 26.484C92.161 26.828 91.389 27 90.509 27H87.581V18.624H90.509ZM90.449 25.572C91.329 25.572 92.009 25.332 92.489 24.852C92.969 24.372 93.209 23.696 93.209 22.824C93.209 21.952 92.969 21.272 92.489 20.784C92.009 20.288 91.329 20.04 90.449 20.04H89.261V25.572H90.449ZM98.1026 19.98V22.08H100.923V23.412H98.1026V25.632H101.283V27H96.4226V18.612H101.283V19.98H98.1026ZM108.749 18.624V19.98H106.517V27H104.837V19.98H102.605V18.624H108.749ZM115.351 25.404H112.015L111.463 27H109.699L112.711 18.612H114.667L117.679 27H115.903L115.351 25.404ZM114.895 24.06L113.683 20.556L112.471 24.06H114.895ZM120.725 18.624V27H119.045V18.624H120.725ZM124.305 25.668H127.065V27H122.625V18.624H124.305V25.668ZM131.265 27.084C130.681 27.084 130.153 26.984 129.681 26.784C129.217 26.584 128.849 26.296 128.577 25.92C128.305 25.544 128.165 25.1 128.157 24.588H129.957C129.981 24.932 130.101 25.204 130.317 25.404C130.541 25.604 130.845 25.704 131.229 25.704C131.621 25.704 131.929 25.612 132.153 25.428C132.377 25.236 132.489 24.988 132.489 24.684C132.489 24.436 132.413 24.232 132.261 24.072C132.109 23.912 131.917 23.788 131.685 23.7C131.461 23.604 131.149 23.5 130.749 23.388C130.205 23.228 129.761 23.072 129.417 22.92C129.081 22.76 128.789 22.524 128.541 22.212C128.301 21.892 128.181 21.468 128.181 20.94C128.181 20.444 128.305 20.012 128.553 19.644C128.801 19.276 129.149 18.996 129.597 18.804C130.045 18.604 130.557 18.504 131.133 18.504C131.997 18.504 132.697 18.716 133.233 19.14C133.777 19.556 134.077 20.14 134.133 20.892H132.285C132.269 20.604 132.145 20.368 131.913 20.184C131.689 19.992 131.389 19.896 131.013 19.896C130.685 19.896 130.421 19.98 130.221 20.148C130.029 20.316 129.933 20.56 129.933 20.88C129.933 21.104 130.005 21.292 130.149 21.444C130.301 21.588 130.485 21.708 130.701 21.804C130.925 21.892 131.237 21.996 131.637 22.116C132.181 22.276 132.625 22.436 132.969 22.596C133.313 22.756 133.609 22.996 133.857 23.316C134.105 23.636 134.229 24.056 134.229 24.576C134.229 25.024 134.113 25.44 133.881 25.824C133.649 26.208 133.309 26.516 132.861 26.748C132.413 26.972 131.881 27.084 131.265 27.084Z" fill="black" />
                  <defs>
                    <linearGradient id="gradient-prize-pool" x1="-56.6549" y1="9.07042" x2="365.625" y2="13.8416" gradientUnits="userSpaceOnUse">
                      <stop offset="0.0752591" stopColor="#93FF61" />
                      <stop offset="1" stopColor="#FAFF00" />
                    </linearGradient>
                  </defs>
                </svg>

              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div className="flex mx-2 mb-6">
      <div className={`clipped-t-l cursor-pointer flex-1 p-px ${isPlayer ? 'bg-white' : 'bg-gamefiDark-300'}`} onClick={() => {
        setTab(0)
      }}>
        <div className={`clipped-t-l py-2 sm:py-4 ${isPlayer ? 'bg-white text-black' : 'bg-black hover:bg-[#111]'} text-center text-lg sm:text-[24px] uppercase font-spotnik font-bold`}>Top Players</div>
      </div>
      <div className={`clipped-t-r cursor-pointer flex-1 p-px ${!isPlayer ? 'bg-white' : 'bg-gamefiDark-300'}`} onClick={() => {
        setTab(1)
      }}>
        <div className={`clipped-t-r py-2 sm:py-4 ${!isPlayer ? 'bg-white text-black' : 'bg-black hover:bg-[#111]'} text-center text-lg sm:text-[24px] uppercase font-spotnik font-bold`}>Top Teams</div>
      </div>
    </div>

    <div className="mx-2 px-2 sm:px-0">
      {isPlayer && <TablePlayerMemo items={players} />}
      {!isPlayer && <TableTeamMemo items={teams} />}
    </div>
  </div>
}

const TablePlayer = ({ items }: {
  items: {
    top: Player[];
    me?: Player;
  };
}) => {
  return <table className="table-auto w-full mt-6">
    <thead className="font-spotnik">
      <tr>
        <th className="uppercase pb-3 text-base sm:text-lg text-white text-opacity-50 font-medium text-left pl-2 sm:pl-6">Player</th>
        <th className="uppercase pb-3 text-base sm:text-lg text-white text-opacity-50 font-medium text-right">Prize</th>
        <th className="uppercase pb-3 text-base sm:text-lg text-white text-opacity-50 font-medium text-right hidden sm:table-cell pl-2 sm:pr-8">Gafish</th>
      </tr>
    </thead>
    <tbody>
      {(items?.top || []).map(item => <tr key={item.rank} className={`rounded ${item.rank === 1 ? 'text-black' : 'border-b border-[#222]'}`}>
        <td className={`text-left flex items-center py-2 sm:py-6 px-2 ${item.rank === 1 && 'bg-[#FFC700] rounded-tl rounded-bl sm:py-4'}`}>
          <div className={`leading-none text-left sm:text-center min-w-[2rem] sm:min-w-[5rem] ${item.rank === 1 ? 'text-2xl font-bold sm:font-medium sm:text-[50px]' : 'text-white text-opacity-40 text-2xl font-medium'}`}>
            <span className="leading-none sm:pt-1 inline-block">{item.rank}</span>
          </div>
          <div className={`leading-none text-lg ${item.rank === 1 ? 'sm:text-[28px] font-bold sm:font-spotnik' : 'sm:text-xl'}`}>{item.name}</div>
        </td>
        <td className={`leading-none text-right pr-2 sm:pr-0 rounded-tr rounded-br sm:rounded-none ${item.rank === 1 ? 'bg-[#FFC700] sm:text-2xl font-bold font-spotnik' : 'text-base sm:text-lg font-medium'}`}>{item.prize ? `${printNumber(item.prize)} BUSD` : '-'}</td>
        <td className={`hidden sm:table-cell leading-none text-right pr-2 sm:pr-8 ${item.rank === 1 ? 'bg-[#FFC700] sm:text-2xl font-bold font-spotnik rounded-tr rounded-br' : 'text-base sm:text-lg font-medium'}`}>
          <div className="flex items-center justify-end">
            {printNumber(item.point)}
            <svg className="w-5 h-5 ml-2" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.0884 7.92167C15.7396 9.57229 17.8561 10.6784 20.154 11.0915C21.8379 7.22776 20.3373 2.56651 20.2539 2.33092C20.2094 2.19716 20.1346 2.07547 20.0354 1.97531C19.9362 1.87515 19.8153 1.79922 19.6819 1.75342C19.4445 1.67276 14.7979 0.130006 10.9131 1.84509C11.325 4.14775 12.4333 6.26866 14.0884 7.92167Z" fill="currentColor" />
              <path d="M12.7926 9.21715C11.0388 7.46512 9.81221 5.25582 9.25248 2.84082C9.0159 3.02319 8.79031 3.21939 8.5769 3.4284C4.91023 7.10057 5.4474 12.0597 5.90665 14.1992L1.83848 14.7804C1.66939 14.8041 1.51026 14.8745 1.37904 14.9837C1.24781 15.0929 1.1497 15.2367 1.09577 15.3987C1.04183 15.5607 1.03421 15.7345 1.07377 15.9006C1.11332 16.0667 1.19848 16.2184 1.31965 16.3387L5.67382 20.6929C5.79405 20.814 5.94573 20.8992 6.11175 20.9388C6.27778 20.9784 6.45157 20.9709 6.61354 20.9171C6.77552 20.8632 6.91925 20.7652 7.02854 20.6341C7.13783 20.503 7.20835 20.344 7.23215 20.175L7.81332 16.1068C8.81955 16.3232 9.84575 16.4332 10.875 16.435C12.2952 16.476 13.7093 16.2316 15.0335 15.7164C16.3576 15.2013 17.565 14.4257 18.5842 13.4357C18.793 13.2229 18.9886 12.9976 19.1699 12.761C16.7544 12.1998 14.5449 10.972 12.7926 9.21715Z" fill="currentColor" />
            </svg>
          </div>
        </td>
      </tr>)}
      {items?.me && <tr className="bg-gradient-to-r from-[#242424] via-[#161616]">
        <td>
          <div className="p-2 sm:py-4 sm:pl-10">
            <div className="text-base sm:text-[20px]">{items?.me?.name}</div>
            {!!items?.me?.rank && <div className="text-sm sm:text-base text-[#8C8C8C]">Your Current Rank: <span className="text-white">{items?.me?.rank}</span></div>}
          </div>
        </td>
        <td className={'leading-none text-right text-base sm:text-lg font-medium pr-2 sm:pr-0'}>{items?.me?.prize ? `${printNumber(items?.me?.prize)} BUSD` : '-'}</td>
        <td className={'hidden sm:table-cell leading-none text-right pr-2 sm:pr-8 text-base sm:text-lg font-medium'}>
          <div className="flex items-center justify-end">
            {printNumber(items?.me?.point)}
            <svg className="w-5 h-5 ml-2" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.0884 7.92167C15.7396 9.57229 17.8561 10.6784 20.154 11.0915C21.8379 7.22776 20.3373 2.56651 20.2539 2.33092C20.2094 2.19716 20.1346 2.07547 20.0354 1.97531C19.9362 1.87515 19.8153 1.79922 19.6819 1.75342C19.4445 1.67276 14.7979 0.130006 10.9131 1.84509C11.325 4.14775 12.4333 6.26866 14.0884 7.92167Z" fill="currentColor" />
              <path d="M12.7926 9.21715C11.0388 7.46512 9.81221 5.25582 9.25248 2.84082C9.0159 3.02319 8.79031 3.21939 8.5769 3.4284C4.91023 7.10057 5.4474 12.0597 5.90665 14.1992L1.83848 14.7804C1.66939 14.8041 1.51026 14.8745 1.37904 14.9837C1.24781 15.0929 1.1497 15.2367 1.09577 15.3987C1.04183 15.5607 1.03421 15.7345 1.07377 15.9006C1.11332 16.0667 1.19848 16.2184 1.31965 16.3387L5.67382 20.6929C5.79405 20.814 5.94573 20.8992 6.11175 20.9388C6.27778 20.9784 6.45157 20.9709 6.61354 20.9171C6.77552 20.8632 6.91925 20.7652 7.02854 20.6341C7.13783 20.503 7.20835 20.344 7.23215 20.175L7.81332 16.1068C8.81955 16.3232 9.84575 16.4332 10.875 16.435C12.2952 16.476 13.7093 16.2316 15.0335 15.7164C16.3576 15.2013 17.565 14.4257 18.5842 13.4357C18.793 13.2229 18.9886 12.9976 19.1699 12.761C16.7544 12.1998 14.5449 10.972 12.7926 9.21715Z" fill="currentColor" />
            </svg>
          </div>
        </td>
      </tr>}
    </tbody>
  </table>
}

const TableTeam = ({ items }: {
  items: {
    top: Team[];
    me?: Team;
  };
}) => {
  return <>
    <table className="table-auto w-full mt-6">
      <thead className="font-spotnik">
        <tr>
          <th className="uppercase pb-3 text-base sm:text-lg text-white text-opacity-50 font-medium text-left pl-2 sm:pl-6">Team</th>
          <th className="uppercase pb-3 text-base sm:text-lg text-white text-opacity-50 font-medium text-right hidden sm:table-cell">Players</th>
          <th className="uppercase pb-3 text-base sm:text-lg text-white text-opacity-50 font-medium text-right">Prize</th>
          <th className="uppercase pb-3 text-base sm:text-lg text-white text-opacity-50 font-medium text-right hidden sm:table-cell pl-2 sm:pr-8">Gafish</th>
        </tr>
      </thead>
      <tbody>
        {(items?.top || []).map(item => <tr key={item.rank} className={`rounded ${item.rank === 1 ? 'text-black' : 'border-b border-[#222]'}`}>
          <td className={`text-left flex items-center py-2 sm:py-6 px-2 ${item.rank === 1 && 'bg-[#FFC700] rounded-tl rounded-bl sm:py-4'}`}>
            <div className={`leading-none text-left sm:text-center min-w-[2rem] sm:min-w-[5rem] ${item.rank === 1 ? 'text-2xl font-bold sm:font-medium sm:text-[50px]' : 'text-white text-opacity-40 text-2xl font-medium'}`}>
              <span className="leading-none sm:pt-1 inline-block">{item.rank}</span>
            </div>
            <div className={`leading-none text-lg ${item.rank === 1 ? 'sm:text-[28px] font-bold sm:font-spotnik' : 'sm:text-xl'}`}>{item.name}</div>
          </td>
          <td className={`hidden sm:table-cell leading-none text-right ${item.rank === 1 ? 'bg-[#FFC700] sm:text-2xl font-bold font-spotnik' : 'text-base sm:text-lg font-medium'}`}>{item.count}</td>
          <td className={`leading-none text-right pr-2 sm:pr-0 rounded-tr rounded-br sm:rounded-none ${item.rank === 1 ? 'bg-[#FFC700] sm:text-2xl font-bold font-spotnik' : 'text-base sm:text-lg font-medium'}`}>{item.prize ? `${printNumber(item.prize)} BUSD` : '-'}</td>
          <td className={`hidden sm:table-cell leading-none text-right pr-2 sm:pr-8 ${item.rank === 1 ? 'bg-[#FFC700] sm:text-2xl font-bold font-spotnik rounded-tr rounded-br' : 'text-base sm:text-lg font-medium'}`}>
            <div className="flex items-center justify-end">
              {printNumber(item.point)}
              <svg className="w-5 h-5 ml-2" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0884 7.92167C15.7396 9.57229 17.8561 10.6784 20.154 11.0915C21.8379 7.22776 20.3373 2.56651 20.2539 2.33092C20.2094 2.19716 20.1346 2.07547 20.0354 1.97531C19.9362 1.87515 19.8153 1.79922 19.6819 1.75342C19.4445 1.67276 14.7979 0.130006 10.9131 1.84509C11.325 4.14775 12.4333 6.26866 14.0884 7.92167Z" fill="currentColor" />
                <path d="M12.7926 9.21715C11.0388 7.46512 9.81221 5.25582 9.25248 2.84082C9.0159 3.02319 8.79031 3.21939 8.5769 3.4284C4.91023 7.10057 5.4474 12.0597 5.90665 14.1992L1.83848 14.7804C1.66939 14.8041 1.51026 14.8745 1.37904 14.9837C1.24781 15.0929 1.1497 15.2367 1.09577 15.3987C1.04183 15.5607 1.03421 15.7345 1.07377 15.9006C1.11332 16.0667 1.19848 16.2184 1.31965 16.3387L5.67382 20.6929C5.79405 20.814 5.94573 20.8992 6.11175 20.9388C6.27778 20.9784 6.45157 20.9709 6.61354 20.9171C6.77552 20.8632 6.91925 20.7652 7.02854 20.6341C7.13783 20.503 7.20835 20.344 7.23215 20.175L7.81332 16.1068C8.81955 16.3232 9.84575 16.4332 10.875 16.435C12.2952 16.476 13.7093 16.2316 15.0335 15.7164C16.3576 15.2013 17.565 14.4257 18.5842 13.4357C18.793 13.2229 18.9886 12.9976 19.1699 12.761C16.7544 12.1998 14.5449 10.972 12.7926 9.21715Z" fill="currentColor" />
              </svg>
            </div>
          </td>
        </tr>)}
        {items?.me && <tr className="bg-gradient-to-r from-[#242424] via-[#161616]">
          <td>
            <div className="p-2 sm:py-4 sm:pl-10">
              <div className="text-base sm:text-[20px]">{items?.me?.name}</div>
              {!!items?.me?.rank && <div className="text-sm sm:text-base text-[#8C8C8C]">Your Current Rank: <span className="text-white">{items?.me?.rank}</span></div>}
            </div>
          </td>
          <td className={'hidden sm:table-cell leading-none text-right text-base sm:text-lg font-medium'}>{items?.me?.count || '-'}</td>
          <td className={'leading-none text-right text-base sm:text-lg font-medium pr-2 sm:pr-0'}>{items?.me?.prize ? `${printNumber(items?.me?.prize)} BUSD` : '-'}</td>
          <td className={'hidden sm:table-cell leading-none text-right pr-2 sm:pr-8 text-base sm:text-lg font-medium'}>
            <div className="flex items-center justify-end">
              {printNumber(items?.me?.point)}
              <svg className="w-5 h-5 ml-2" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0884 7.92167C15.7396 9.57229 17.8561 10.6784 20.154 11.0915C21.8379 7.22776 20.3373 2.56651 20.2539 2.33092C20.2094 2.19716 20.1346 2.07547 20.0354 1.97531C19.9362 1.87515 19.8153 1.79922 19.6819 1.75342C19.4445 1.67276 14.7979 0.130006 10.9131 1.84509C11.325 4.14775 12.4333 6.26866 14.0884 7.92167Z" fill="currentColor" />
                <path d="M12.7926 9.21715C11.0388 7.46512 9.81221 5.25582 9.25248 2.84082C9.0159 3.02319 8.79031 3.21939 8.5769 3.4284C4.91023 7.10057 5.4474 12.0597 5.90665 14.1992L1.83848 14.7804C1.66939 14.8041 1.51026 14.8745 1.37904 14.9837C1.24781 15.0929 1.1497 15.2367 1.09577 15.3987C1.04183 15.5607 1.03421 15.7345 1.07377 15.9006C1.11332 16.0667 1.19848 16.2184 1.31965 16.3387L5.67382 20.6929C5.79405 20.814 5.94573 20.8992 6.11175 20.9388C6.27778 20.9784 6.45157 20.9709 6.61354 20.9171C6.77552 20.8632 6.91925 20.7652 7.02854 20.6341C7.13783 20.503 7.20835 20.344 7.23215 20.175L7.81332 16.1068C8.81955 16.3232 9.84575 16.4332 10.875 16.435C12.2952 16.476 13.7093 16.2316 15.0335 15.7164C16.3576 15.2013 17.565 14.4257 18.5842 13.4357C18.793 13.2229 18.9886 12.9976 19.1699 12.761C16.7544 12.1998 14.5449 10.972 12.7926 9.21715Z" fill="currentColor" />
              </svg>
            </div>
          </td>
        </tr>}
      </tbody>
    </table>
  </>
}

const TablePlayerMemo = memo(TablePlayer)
const TableTeamMemo = memo(TableTeam)

export default Leaderboard
