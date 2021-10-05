import clsx from 'clsx';
import React from 'react';

type Props = {
    item: { [k: string]: any },
    active?: boolean;
    onSelectItem?: Function;
    [k: string]: any;
}

const SlideCard = ({ item = {}, active, onSelectItem }: Props) => {
    return (
        <div className={clsx("slide", { active })} onClick={() => onSelectItem && onSelectItem(item)}>
            <img src={item.banner} alt="" />
            <div className={clsx("detail")}>
                <div className={clsx("info", { upcoming: true })}>
                    <h3>{item.campaign_status}</h3>
                    <h2>{item.title}</h2>
                    <div className="countdown">
                        <span>OPEN IN</span>
                        <div className="time">20h : 31m</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(SlideCard)
