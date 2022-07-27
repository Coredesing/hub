import clsx from 'clsx'
import { format } from 'date-fns'

const TabEarnHistory = ({ data }) => {
  return (
    <div className="">
      <table className="table-auto w-full">
        <thead className="bg-[#242529]">
          <tr>
            <th className="py-4" align="center">
              Task
            </th>
            <th className="py-4" align="center">
              Reward
            </th>
            <th className="py-4" align="center">
              Change Amount
            </th>
            <th className="py-4" align="center">
              Completed At
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((e, i) => {
            const isOld = i % 2
            return (
              <tr key={e._id} className={clsx(isOld ? 'bg-gamefiDark-800' : '')}>
                <td className="py-4" align="center">
                  {e.quest.name}
                </td>
                <td className="py-4" align="center">
                  {e.quest.rewards[0].name}
                </td>
                <td className="py-4" align="center">
                  {e.quest.rewards[0].quantity >= 0 ? '+' : ''}
                  {e.quest.rewards[0].quantity *
                    (e.totalAmount ? e.totalAmount : 1)}
                </td>
                <td className="py-4" align="center">
                  {format(new Date(e.completedAt), 'd LLL, yyyy - hh:mm:ss OOO')}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TabEarnHistory
