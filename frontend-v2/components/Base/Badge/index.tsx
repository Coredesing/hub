
import clsx from 'clsx'

const MAX_BADGE_COUNT = 99

const Badge = ({ count, className }) => {
  const isOverMaxCount = count > MAX_BADGE_COUNT
  const _formattedCount = isOverMaxCount ? `${MAX_BADGE_COUNT}+` : count

  return count
    ? <div className={clsx('flex justify-center items-center w-4 h-4 rounded-full bg-gamefiGreen-500', className, isOverMaxCount ? 'w-6' : '')}>
      <span className='text-black font-bold'>{_formattedCount}</span>
    </div>
    : null
}

export default Badge
