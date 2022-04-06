import { formatNumber } from '@/utils'
import { intervalToDuration } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

const CountdownSVG = ({ action, title, deadline, onAction }:{ title?: string; action?: string; deadline: Date | string; onAction?: () => void }) => {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [setNow])

  const deadlineActual = useMemo(() => {
    if (deadline instanceof Date) {
      return deadline
    }

    if (typeof deadline === 'string') {
      return new Date(deadline)
    }

    return null
  }, [deadline])
  const countdown = useMemo(() => {
    if (!now) {
      return {}
    }

    if (!deadlineActual) {
      return {}
    }

    if (deadlineActual.getTime() === 0) {
      return {}
    }

    if (deadlineActual < now) {
      return {}
    }

    return intervalToDuration({
      start: now,
      end: deadlineActual
    })
  }, [deadlineActual, now])

  return <svg xmlns="http://www.w3.org/2000/svg" className="w-full" viewBox={action ? '0 0 372 90' : '0 0 273 90'} fill="none">
    { title && <text fill="white" fontFamily="Rajdhani" fontSize="13" fontWeight="bold" letterSpacing="0.04em">
      <tspan y="14">{title}</tspan>
    </text> }
    <path opacity="0.12" d="M271.5 25.5V73.5V88.5H0.5V25.5H20.516H271.5Z" fill="#525252" stroke="#525252"/>
    <path d="M272.5 25.5V74.5V89.5H0.5V33.7315L10.2016 25.5H20.3801H272.5Z" stroke="#525252"/>
    <rect x="263" y="29" width="6" height="21" fill="#525252"/>
    <text fill="white" fontFamily="Rajdhani" fontSize="28" fontWeight="bold" letterSpacing="0em"><tspan x="55.1426" y="57.176">:</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="28" fontWeight="bold" letterSpacing="0em"><tspan x="121.143" y="57.176">:</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="28" fontWeight="bold" letterSpacing="0em"><tspan x="187.143" y="57.176">:</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="28" fontWeight="bold" letterSpacing="0em"><tspan x="12.8184" y="57.176">{countdown.days ? formatNumber(countdown.days, 2) : '00'}</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="10" fontWeight="600" letterSpacing="0px"><tspan x="14.209" y="75.92">DAYS</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="28" fontWeight="bold" letterSpacing="0em"><tspan x="79.4199" y="57.176">{countdown.hours ? formatNumber(countdown.hours, 2) : '00'}</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="10" fontWeight="600" letterSpacing="0px"><tspan x="77.1377" y="75.92">HOURS</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="28" fontWeight="bold" letterSpacing="0em"><tspan x="142.344" y="57.176">{countdown.minutes ? formatNumber(countdown.minutes, 2) : '00'}</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="10" fontWeight="600" letterSpacing="0px"><tspan x="139.153" y="75.92">MINUTES</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="28" fontWeight="bold" letterSpacing="0em"><tspan x="208.344" y="57.176">{countdown.seconds ? formatNumber(countdown.seconds, 2) : '00'}</tspan></text>
    <text fill="white" fontFamily="Rajdhani" fontSize="10" fontWeight="600" letterSpacing="0px"><tspan x="203.972" y="75.92">SECONDS</tspan></text>
    {
      action && <g className="cursor-pointer" onClick={() => {
        if (!onAction) {
          return
        }

        onAction()
      }}><path fillRule="evenodd" clipRule="evenodd" d="M272 54L262 61.5V88C262 89.1046 262.895 90 264 90H272H362L372 82.5V56C372 54.8954 371.105 54 370 54H362H272Z" fill="#6CDB00"/>
        <text x="315" y="73" dominantBaseline="middle" textAnchor="middle" fill="#0D0F15" fontFamily="Rajdhani" fontSize="13" fontWeight="bold" letterSpacing="0.02em">{action}</text>
      </g>
    }
  </svg>
}

export default CountdownSVG
