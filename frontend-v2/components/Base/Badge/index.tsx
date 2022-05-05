
import clsx from 'clsx'

const MAX_BADGE_COUNT = 99

const Badge = ({ count, className }) => {
  const isOverMaxCount = count > MAX_BADGE_COUNT
  const _formattedCount = isOverMaxCount ? `${MAX_BADGE_COUNT}+` : count

  if (!count) {
    return null
  }

  return <div className={className || ''}>
    <div className={clsx('relative w-4 h-4', isOverMaxCount ? 'w-6' : '')}>
      <div className="w-full h-full bg-gamefiGreen-500 rounded-full absolute inset-0 animate-ping2"></div>
      <div className="w-full h-full bg-gamefiGreen-500 rounded-full absolute inset-0 inline-flex items-center justify-center text-gamefiDark-900 leading-none font-bold">{_formattedCount}</div>
    </div>
  </div>
}

export default Badge
