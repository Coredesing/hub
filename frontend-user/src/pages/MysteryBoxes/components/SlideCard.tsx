import CountDownTimeV1, { CountDonwRanges } from '@base-components/CountDownTime';
import { getTimelineOfPool } from '@utils/index';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

type Props = {
    item: { [k: string]: any },
    active?: boolean;
    onSelectItem?: Function;
    [k: string]: any;
}

const SlideCard = ({ item = {}, active, onSelectItem }: Props) => {

    const [time, setTime] = useState<CountDonwRanges & { title?: string }>({date1: 0, date2: 0});
    useEffect(() => {
        if ('id' in item) {
            const time = getTimelineOfPool(item);
            if (time.startJoinPooltime > Date.now()) {
                return setTime({ date1: time.startJoinPooltime, date2: Date.now(), title: 'Whitelist start in' })
            }
            if (time.startBuyTime > Date.now()) {
                return setTime({ date1: time.startBuyTime, date2: Date.now(), title: 'Open buy in' })
            }
            if (time.finishTime > Date.now()) {
                return setTime({ date1: time.finishTime, date2: Date.now(), title: 'End buy in' })
            }
            setTime({ date1: 0, date2: 0, title: 'Finished' })
        }
    }, [item]);
    return (
        <div className={clsx("slide", { active })} onClick={() => onSelectItem && onSelectItem(item)}>
            <div className="img-slide">
                <img src={item.mini_banner} alt="" />
            </div>
            <div className={clsx("detail")}>
                <div className={clsx("info", { upcoming: true })}>
                    <div className="status">
                        <span>{item.campaign_status}</span>
                    </div>
                    <h2>{item.title}</h2>
                </div>
                {time.date1 &&
                    <div className="box-countdown">
                        <span>{time.title}</span>
                        <CountDownTimeV1 time={{ date1: time.date1, date2: time.date2 }} className="countdown" />
                    </div>
                }

            </div>
        </div>
    )
}

export default React.memo(SlideCard)
