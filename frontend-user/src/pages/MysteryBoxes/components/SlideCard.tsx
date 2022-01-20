import CountDownTimeV1, { CountDonwRanges } from '@base-components/CountDownTime';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { getCountdownInfo } from '../utils';

type Props = {
    item: { [k: string]: any },
    active?: boolean;
    onSelectItem?: Function;
    [k: string]: any;
}

const SlideCard = ({ item = {}, active, onSelectItem, compareTime }: Props) => {

    const [time, setTime] = useState<CountDonwRanges & { title?: string, [k: string]: any }>({ date1: 0, date2: 0 });
    useEffect(() => {
        if ('id' in item) {
            setTime(getCountdownInfo(item, compareTime))
        }
    }, [item, compareTime]);
    return (
        <div className={clsx("slide", { active })} onClick={() => onSelectItem && onSelectItem(item)}>
            <div className="img-slide">
                <img src={item.mini_banner} alt="" />
            </div>
            <div className={clsx("detail")}>
                <div className={clsx("info", { upcoming: time.isUpcoming, sale: time.isOnsale, over: time.isFinished })}>
                    <div className="status">
                        <span>
                            {time.isUpcoming && 'Upcoming'}
                            {time.isOnsale && 'ON SALE'}
                            {time.isFinished && 'Sold Out'}
                        </span>
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

export default SlideCard
