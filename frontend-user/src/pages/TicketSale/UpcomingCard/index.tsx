import clsx from 'clsx';
import useStyles from './style';
import { useCardStyles } from '../style';
import { caclDiffTime, formatNumber, getDiffTime, getSeedRound } from '../../../utils';
import { useEffect, useState } from 'react';
import Image from '../../../components/Base/Image';
import { TOKEN_TYPE } from '../../../constants';
import { numberWithCommas } from '../../../utils/formatNumber';
import Link from '@material-ui/core/Link';
import { getRoute } from '../utils';
type Props = {
  card: { [k: string]: any },
  refresh: Function,
  [k: string]: any
}
export const UpcomingCard = ({ card, refresh, ...props }: Props) => {
  const styles = { ...useStyles(), ...useCardStyles() };
  const [titleTime, setTitleTime] = useState('');

  const [openTime, setOpenTime] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const isTicket = card?.token_type === TOKEN_TYPE.ERC721;

  useEffect(() => {
    if (card) {
      let timer: number = 0;
      if (card.start_join_pool_time && +card.start_join_pool_time * 1000 > Date.now()) {
        timer = +card.start_join_pool_time * 1000;
        setTitleTime('Whitelist Open in');
      } else if (card.end_join_pool_time && +card.end_join_pool_time * 1000 > Date.now()) {
        timer = +card.end_join_pool_time * 1000;
        setTitleTime('Whitelist End in');
      } else if (card.start_time && +card.start_time * 1000 > Date.now()) {
        setTitleTime('Start Buy in');
        timer = +card.start_time * 1000;
      } else if (card.finish_time) {
        const finish_time = +card.finish_time * 1000;

        if (finish_time > Date.now()) {
          setTitleTime('End Buy in');
          timer = +card.finish_time * 1000;
        }
        if (finish_time <= Date.now()) {
          setTitleTime('Finished')
        }
      } else {
        setTitleTime('Coming soon');
      }
      if (timer && timer > Date.now()) {
        setOpenTime(getDiffTime(timer, Date.now()));
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

  let accept_currency = card?.accept_currency;
  if (card?.network_available === 'bsc' && accept_currency === 'usdt') {
    accept_currency = 'busd'
  }

  return (
    <Link href={`/#/${getRoute(card.token_type)}/${card.id}`} className={clsx(styles.card, styles.cardUpcoming, styles.noUnderline)}>
      <div className={clsx(styles.cardImg, styles.cardImgUpcoming)}>
        <h4>{getSeedRound(card.is_private)} Sale</h4>
        <Image src={card.banner} />
        {/* <img src={card.image} alt="" /> */}
      </div>
      <div className={styles.cardBody}>
        <div className={clsx(styles.cardBodyItem, styles.cardBodyTitle, styles.BodyTitleUpc)}>
          <h4>{card.title}</h4>
          <img src={`/images/icons/${accept_currency}.png`} alt="" />
          {/* <img src={`/images/icons/eth.svg`} alt="" /> */}
        </div>
        <div className={styles.cardBodyItem}>
          <span className={styles.text}>TOTAL {!isTicket ? 'RAISE' : 'SALES'}</span>
          <span className={styles.textBold}> {!isTicket ? '$' + (numberWithCommas(Math.ceil((+card.ether_conversion_rate * +card.total_sold_coin) || 0), 0)) : card.total_sold_coin}</span>
        </div>
        {!isTicket && <div className={styles.cardBodyItem}>
          <span className={styles.text}>EXCHANGE RATE</span>
          <span className={clsx(styles.textBold, styles.price)} style={{ textTransform: 'uppercase' }}> 1 {card.symbol} = {card.ether_conversion_rate} {accept_currency} </span>
        </div>}
        <div className={styles.cardBodyItem}>
          <span className={styles.text}>SUPPORTED</span>
          <span className={clsx(styles.textBold, styles.price)} style={{ textTransform: 'uppercase' }}> {card.network_available} </span>
        </div>
        {isTicket && <div className={styles.cardBodyItem}>
          <span className={styles.text}>PRICE</span>
          <span className={clsx(styles.textBold, styles.price)}> {card.ether_conversion_rate} {accept_currency} </span>
        </div>
        }
        <div className={'cardBodyTimeEndItem'}>
          <img src='/images/icons/bright.svg' alt="" />
          <span className={clsx(styles.text, 'sp1 text-uppercase')} style={{ marginTop: 3 }}>{titleTime}</span>
          <span className={styles.timeEnd}>
            {(titleTime !== 'Coming soon' && titleTime !== 'Finished') &&
              <>
                <span>&nbsp;</span>
                {openTime.days > 1 && <span>{formatNumber(openTime.days)} days</span>}
                {openTime.days === 1 && <span>{formatNumber(openTime.days)} day</span>}
                {openTime.days < 1 && openTime.hours >= 1 && (
                  <span>
                    <span>{formatNumber(openTime.hours)}h</span>
                    {openTime.minutes >= 1 && <span>&nbsp;:&nbsp;</span>}
                  </span>
                )}
                {openTime.days < 1 && openTime.minutes >= 1 && (
                  <span>
                    {<span>{formatNumber(openTime.minutes)}m</span>}
                    {openTime.hours < 1 && <span>&nbsp;:&nbsp;</span>}
                  </span>
                )}
                {openTime.days < 1 && openTime.hours < 1 && (
                  <span>{formatNumber(openTime.seconds)}s</span>
                )}
              </>
            }
          </span>
        </div>
        <Link href={`/#/${getRoute(card.token_type)}/${card.id}`} className={clsx(styles.btnDetail, 'not-approved')}>
          Detail
        </Link>
      </div>
    </Link>
  );
};
