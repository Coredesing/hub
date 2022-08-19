import { printNumber, shorten } from '@/utils'
import clsx from 'clsx'

const TabLeaderBoard = ({ data, ranks }) => {
  return (
    <div className="">
      <table className="table-auto w-full">
        <thead className="bg-[#242529]">
          <tr>
            <th className="py-4" align="center">
              Rank
            </th>
            <th className="py-4" align="center">
              Wallet Address
            </th>
            <th className="py-4" align="center">
              GXP
            </th>
            {/* <th className="py-4" align="center">
              Time
            </th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((e, i: number) => {
            const isOld = i % 2
            return (
              <tr
                key={e._id}
                className={clsx(isOld ? 'bg-gamefiDark-800' : '')}
              >
                <td className="py-4" align="center">
                  {i + 1}
                </td>
                <td className="py-4" align="center">
                  <div className="md:hidden block">
                    {shorten(e.walletId, 10)}
                  </div>
                  <div className="hidden md:block">{e.walletId}</div>
                </td>
                <td className="py-4" align="center">
                  {printNumber(parseInt(e.exp.total))}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TabLeaderBoard
