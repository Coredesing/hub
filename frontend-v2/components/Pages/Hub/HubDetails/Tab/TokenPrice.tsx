import React, { useEffect, useState } from 'react'
import RenderEditorJs from '@/components/Base/RenderEditorJs'
import { TokenSummary, KeyMetrics } from '../index'
import { isEmptyDataParse } from '@/utils'

const TokenPrice = ({ data, tabRef }: { data: any; tabRef: any }) => {
  const [, setTv] = useState(null)
  const showComingSoon = !(data?.currentPrice > 0 || data?.publicPrice > 0) && !data?.chartSymbol && !isEmptyDataParse(data.tokenUtilities) && !isEmptyDataParse(data.tokenEconomy) && !isEmptyDataParse(data.tokenDistribution) && !isEmptyDataParse(data.vestingSchedule)
  useEffect(() => {
    tabRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tabRef])

  useEffect(() => {
    if (!showComingSoon && data?.chartSymbol) {
      // eslint-disable-next-line new-cap
      setTv(new window.TradingView.widget({
        autosize: true,
        symbol: data?.chartSymbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_24fb6'
      }))
    }
  }, [data?.chartSymbol, data?.tokenSymbol, showComingSoon])

  return (
    showComingSoon
      ? <div className="uppercase font-bold text-3xl mb-6 font-mechanic">Coming Soon</div>
      : <>
        {data?.currentPrice > 0 && <div className='flex flex-col bg-[#292C36] gap-6 p-8 rounded-sm'>
          <div className='text-2xl font-mechanic'><strong>Token Summary</strong></div>
          <TokenSummary data={data} />
        </div>}
        {!!data?.chartSymbol && <div className='w-full mt-3'>
          <div className="tradingview-widget-container">
            <div id="tradingview_24fb6" className='w-full h-[200px] md:h-[508px] bg-[#292C36]'></div>
          </div>
        </div>}
        {data?.publicPrice > 0 && <div className='flex flex-col bg-[#292C36] gap-6 mt-4 p-8 rounded-sm'>
          <div className='text-2xl font-mechanic'><strong>Key Metrics</strong></div>
          <KeyMetrics data={data} />
        </div>}
        {isEmptyDataParse(data.tokenUtilities) && <>
          <div className="max-w-[740px] mx-auto mt-16 text-2xl font-mechanic uppercase mb-4"><strong>Token Utilities</strong></div>
          <RenderEditorJs data={data.tokenUtilities} index={'tokenUtilities'} />
        </>
        }
        {isEmptyDataParse(data.tokenEconomy) && <>
          <div className="max-w-[740px] mx-auto mt-16 text-2xl font-mechanic uppercase mb-4"><strong>Token Economy</strong></div>
          <RenderEditorJs data={data.tokenEconomy} index={'tokenEconomy'} />
        </>
        }
        {isEmptyDataParse(data.tokenDistribution) && <>
          <div className="max-w-[740px] mx-auto mt-16 text-2xl font-mechanic uppercase mb-4"><strong>Token Distribution</strong></div>
          <RenderEditorJs data={data.tokenDistribution} index={'tokenDistribution'} />
        </>
        }
        {isEmptyDataParse(data.vestingSchedule) && <>
          <div className="max-w-[740px] mx-auto mt-16 text-2xl font-mechanic uppercase mb-4"><strong>Vesting Schedule</strong></div>
          <RenderEditorJs data={data.vestingSchedule} index={'vestingSchedule'} />
        </>
        }
      </>
  )
}

export default TokenPrice
