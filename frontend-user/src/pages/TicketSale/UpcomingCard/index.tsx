import clsx from 'clsx';
import useStyles from './style';
import { useCardStyles } from '../style';
import { caclDiffTime, formatNumber, getDiffTime, getSeedRound } from '../../../utils';
import { useEffect, useState } from 'react';
import Image from '../../../components/Base/Image';
import { TOKEN_TYPE } from '../../../constants';
import { numberWithCommas } from '../../../utils/formatNumber';

type Props = {
  card: { [k: string]: any },
  refresh: Function,
  [k: string]: any
}
export const UpcomingCard = ({ card, refresh, ...props }: Props) => {
  const styles = { ...useStyles(), ...useCardStyles() };

  const [openTime, setOpenTime] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (card) {
      const openTime = +card.start_time * 1000;
      if (openTime > Date.now()) {
        setOpenTime(getDiffTime(openTime, Date.now()));
      }
    }
  }, [card]);

  useEffect(() => {
    const interval = setInterval(() => {

      const newOpenTime = { ...openTime };
      if (newOpenTime.days === 0 && newOpenTime.hours === 0 && newOpenTime.minutes === 0 && newOpenTime.seconds === 0) {
        clearInterval(interval);
        refresh();
        // recall api
        return;
      }
      setOpenTime(caclDiffTime(newOpenTime));
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [openTime, setOpenTime, refresh]);
  console.log(card)

  const isTicket = card?.token_type === TOKEN_TYPE.ERC721;

  return (
    <div className={clsx(styles.card, styles.cardUpcoming)}>
      <div className={clsx(styles.cardImg, styles.cardImgUpcoming)}>
        <h4>{getSeedRound(card.is_private)} Sale</h4>
        <Image src={card.banner} />
        {/* <img src={card.image} alt="" /> */}
      </div>
      <div className={styles.cardBody}>
        <div className={clsx(styles.cardBodyItem, styles.cardBodyTitle, styles.BodyTitleUpc)}>
          <h4>{card.title}</h4>
          <img src={`/images/icons/${card.accept_currency}.png`} alt="" />
          {/* <img src={`/images/icons/eth.svg`} alt="" /> */}
        </div>
        <div className={styles.cardBodyItem}>
          <span className={styles.text}>TOTAL {!isTicket ? 'RAISE' : 'SALES'}</span>
          <span className={styles.textBold}> {!isTicket ? '$' + (numberWithCommas(Math.ceil((+card.ether_conversion_rate * +card.total_sold_coin) || 0), 0)) : card.total_sold_coin}</span>
        </div>
        {!isTicket && <div className={styles.cardBodyItem}>
          <span className={styles.text}>EXCHANGE RATE</span>
          <span className={clsx(styles.textBold, styles.price)} style={{textTransform: 'uppercase'}}> 1 {card.symbol} = {card.ether_conversion_rate} {card.accept_currency} </span>
        </div>}
        {!isTicket && <div className={styles.cardBodyItem}>
          <span className={styles.text}>SUPPORTED</span>
          <span className={clsx(styles.textBold, styles.price)} style={{textTransform: 'uppercase'}}> {card.accept_currency} </span>
        </div>}
        {isTicket && <div className={styles.cardBodyItem}>
          <span className={styles.text}>PRICE</span>
          <span className={clsx(styles.textBold, styles.price)}> {card.ether_conversion_rate} {card.accept_currency} </span>
        </div>
        }
        <div className={'cardBodyTimeEndItem'}>
          <img src='/images/icons/bright.svg' alt="" />
          <span className={clsx(styles.text, 'sp1')}>OPEN IN</span>
          <span className={styles.timeEnd}>
            {formatNumber(openTime.days)}d : {formatNumber(openTime.hours)}h : {formatNumber(openTime.minutes)}m : {formatNumber(openTime.seconds)}s
          </span>
        </div>
      </div>
    </div>
  );
};
