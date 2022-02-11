import { useState, useEffect, useMemo, useCallback } from 'react'
import toast from 'react-hot-toast'
import { utils } from 'ethers'
import { GAFI } from '@/components/web3'

export default function StakeRight ({ pool, contractStaking, loadMyStaking, loadMyPending, account, stakingMine, pendingWithdrawal, className }) {
  const [withdrawing, setWithdrawing] = useState(false)
  const [restaking, setRestaking] = useState(false)

  const pendingAmount = useMemo(() => {
    if (!pendingWithdrawal?.amount) {
      return 0
    }

    try {
      return parseFloat(utils.formatUnits(pendingWithdrawal?.amount, GAFI.decimals))
    } catch (err) {
      return 0
    }
  }, [pendingWithdrawal])

  const onWithdraw = useCallback(() => {
    if (!contractStaking) {
      return
    }

    (async function () {
      try {
        setWithdrawing(true)
        await contractStaking.linearClaimPendingWithdraw(pool.pool_id)
          .then(tx => {
            return tx.wait(1).then(() => {
              loadMyPending()
              toast.success('Successfully Claimed Your $GAFI')
            })
          })
          .catch(err => {
            if (err.code === 4001) {
              toast.error('User Denied Transaction')
              return
            }

            toast.error('Claiming Failed!')
          })
      } catch (err) {
        console.debug(err)
      } finally {
        setWithdrawing(false)
      }
    })()
  }, [contractStaking, pool, loadMyPending, setWithdrawing])
  const onRestake = useCallback(() => {
    if (!contractStaking) {
      return
    }

    (async function () {
      try {
        setRestaking(true)
        await contractStaking.linearReStake(pool.pool_id)
          .then(tx => {
            tx.wait(2).then(loadMyStaking)
            return tx.wait(1).then(() => {
              loadMyPending()
              toast.success('Successfully Restaked Your $GAFI')
            })
          })
          .catch(err => {
            if (err.code === 4001) {
              toast.error('User Denied Transaction')
              return
            }

            toast.error('Restaking Failed!')
          })
      } catch (err) {
        console.debug(err)
      } finally {
        setRestaking(false)
      }
    })()
  }, [contractStaking, pool, loadMyStaking, loadMyPending, setRestaking])

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [setNow])

  const canWithdraw = useMemo(() => {
    return pendingWithdrawal?.time <= now
  }, [pendingWithdrawal, now])

  const withdraw = useCallback(() => {
    if (!canWithdraw) {
      return
    }

    if (withdrawing) {
      return
    }

    onWithdraw()
  }, [onWithdraw, canWithdraw, withdrawing])

  const restake = useCallback(() => {
    if (canWithdraw) {
      return
    }

    if (restaking) {
      return
    }

    onRestake()
  }, [onRestake, canWithdraw, restaking])

  return <div className={`w-full md:w-60 ${className || ''}`}>
    <div className="p-4 rounded bg-gray-500 bg-opacity-20 bg-gradient-to-l from-gamefiDark-800">
      <span className="font-bold text-sm uppercase text-white opacity-50">Current Staking</span>
      { account && <p className="font-semibold text-2xl text-white leading-6">{stakingMine?.tokenStaked !== undefined ? `${stakingMine?.tokenStaked} $GAFI` : 'Loading...'}</p>}
    </div>

    <div className="p-4 rounded bg-gray-500 bg-opacity-20 bg-gradient-to-l from-gamefiDark-800 mt-6">
      <span className="font-bold text-sm uppercase text-white opacity-50">Pending Withdrawal</span>
      { account && <p className="font-semibold text-2xl text-white leading-6">{pendingWithdrawal.amount === null ? 'Loading...' : `${pendingAmount} $GAFI`}</p>}
      { !!pendingWithdrawal?.time && <p className="mt-4 font-casual text-xs opacity-50">Withdrawable at: <br />{pendingWithdrawal.time.toLocaleString('en-ZA', { timeZoneName: 'short', hour12: false })}</p> }
      { !!pendingWithdrawal.amount && <div className="font-mechanic font-bold uppercase text-center text-sm mt-4">
        <div className={`cursor-pointer clipped-t-r p-px mt-2 bg-gamefiGreen-500 ${!canWithdraw ? 'grayscale' : 'grayscale-0'}`} onClick={withdraw}>
          <div className={'clipped-t-r p-2 flex justify-center items-center bg-gamefiGreen-500 text-gamefiDark-900'}>
            {withdrawing ? 'Withdrawing...' : 'Withdraw'}
          </div>
        </div>
        <div className={`cursor-pointer clipped-b-l p-px mt-2 bg-gamefiGreen-500 ${canWithdraw ? 'grayscale' : 'grayscale-0'}`} onClick={restake}>
          <div className={'clipped-b-l p-2 flex justify-center items-center bg-gamefiDark-800 text-gamefiGreen-500 bg-gamefiDark-800 text-gamefiGreen-500\'}'}>
            {restaking ? 'Restaking...' : 'Restake'}
          </div>
        </div>
      </div> }
    </div>
  </div>
}
