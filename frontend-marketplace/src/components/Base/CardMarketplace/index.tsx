import React from 'react'
import { ObjectType } from '@app-types'
import { ButtonBase } from '@base-components/Buttons'
import clsx from 'clsx';
import useStyles from './style';

const CardMarketplace = ({id, item, ...props}: ObjectType<any>) => {
    const styles = useStyles();
    return (
        <div key={id} className={clsx(styles.card, { active: id === 0 })} >
            <ButtonBase className="btn-buy" color="green">Buy Now</ButtonBase>
            <div className={styles.cardImg}>
                <img src={item.image} alt="" />
            </div>
            <div className={styles.cardBody}>
                <h3>
                    {item.name}
                </h3>
                <div className="network">
                    <div className="exchange-rate">
                        <span className="current">
                            {item.price}
                        </span>
                        <span className="seperate">~</span>
                        <span className="usd">
                            $ {item.usdPrice}
                        </span>
                    </div>
                    <div className="icon">
                        <img src={`/images/icons/${item.network}.png`} alt="" />
                    </div>
                </div>
                <div className="tags">
                    {(item.tags || []).map((t: any) => <span key={t}>{t}</span>)}
                </div>
            </div>
            <div className={styles.cardFooter}>
                <div className="logo">
                    <img src={item.iconToken} alt="" />
                    <span className="text-uppercase">{item.tokenName}</span>
                </div>
                <div className="interactions">
                    <div className="item">
                        <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.7782 8.74697C4.83696 8.8076 4.91696 8.84128 5.00072 8.84128C5.08447 8.84128 5.16447 8.8076 5.22323 8.74697L9.22096 4.6543C10.8881 2.94794 9.70349 0 7.33252 0C5.90868 0 5.25531 1.05716 5.00072 1.25462C4.74487 1.05632 4.09566 0 2.66891 0C0.30544 0 -0.893797 2.94036 0.780885 4.6543L4.7782 8.74697Z" fill="#7D7D7D" />
                        </svg>
                        <span>{item.interactions?.hearts}</span>
                    </div>
                    <div className="item">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 0.827148C4.32515 0.827148 1.89946 2.29058 0.109543 4.66759C-0.0365143 4.86233 -0.0365143 5.1344 0.109543 5.32914C1.89946 7.70901 4.32515 9.17245 7 9.17245C9.67485 9.17245 12.1005 7.70901 13.8905 5.332C14.0365 5.13726 14.0365 4.8652 13.8905 4.67045C12.1005 2.29058 9.67485 0.827148 7 0.827148ZM7.19188 7.93812C5.41628 8.04981 3.94998 6.58638 4.06168 4.80792C4.15332 3.34162 5.34182 2.15312 6.80812 2.06147C8.58372 1.94978 10.05 3.41322 9.93832 5.19168C9.84382 6.65511 8.65531 7.84361 7.19188 7.93812ZM7.1031 6.58065C6.14657 6.64079 5.35614 5.85323 5.41915 4.8967C5.46783 4.10627 6.10934 3.46763 6.89977 3.41608C7.8563 3.35594 8.64672 4.1435 8.58372 5.10003C8.53217 5.89332 7.89066 6.53196 7.1031 6.58065Z" fill="#7D7D7D" />
                        </svg>
                        <span>{item.interactions?.views}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardMarketplace
