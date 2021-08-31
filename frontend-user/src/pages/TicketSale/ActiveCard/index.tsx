import useStyles from './style';
import clsx from 'clsx';
import Link from '@material-ui/core/Link';
// @ts-ignore
import { Fade } from 'react-reveal';
import { useCardStyles } from '../style';
import { Progress } from '../../../components/Base/Progress';
import { caclDiffTime, formatNumber, getDiffTime } from '../../../utils';
import { useEffect, useState } from 'react';
import Image from '../../../components/Base/Image';
import { calcProgress, getRemaining, getRoute } from '../utils';
import { TOKEN_TYPE } from '../../../constants';
import { numberWithCommas } from '../../../utils/formatNumber';

type Props = {
  card: { [k: string]: any },
  refresh: Function,
  [k: string]: any
}

export const ActiveCard = ({ card, refresh, ...props }: Props) => {
  const styles = { ...useStyles(), ...useCardStyles() };
  const [isBuy, setIsBuy] = useState<boolean>(false);
  const [finishedTime, setFinishedTime] = useState<boolean>(true);
  const [endTime, setTimeEnd] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (card) {
      const openTime = +card.start_time * 1000;
      const finishTime = +card.finish_time * 1000;

      if (finishTime < Date.now() || finishTime <= openTime) {
        // setFinishedTime(true);
        setIsBuy(false);
      } else {
        setFinishedTime(false);
        setIsBuy(true);
        setTimeEnd(getDiffTime(finishTime, Date.now() >= openTime ? Date.now() : openTime));
      }
    }
  }, [card]);

  useEffect(() => {
    let interval: any;
    if (isBuy) {
      interval = setInterval(() => {

        const newEndTime = { ...endTime };
        if (newEndTime.days === 0 && newEndTime.hours === 0 && newEndTime.minutes === 0 && newEndTime.seconds === 0) {
          clearInterval(interval);
          setIsBuy(false);
          setFinishedTime(true);
          refresh();
          return;
        }
        setTimeEnd(caclDiffTime(newEndTime));
      }, 1000);
    }

    return () => {
      interval && clearInterval(interval);
    }
  }, [isBuy, endTime, setTimeEnd]);
  const isClaim = card?.process === "only-claim";
  const isTicket = card?.token_type === TOKEN_TYPE.ERC721;
  return (
    <div className={clsx(styles.card, styles.cardActive, {
      [styles.cardActiveApproved]: card.isApproved
    })}>
      <div className={styles.cardImg}>
        <Image src={card.banner} />
      </div>
      <div className={styles.cardBody}>
        <div className={clsx(styles.cardBodyItem, styles.cardBodyTitle)}>
          <h4>{card.title}</h4>
          <img src={`/images/icons/${card.accept_currency}.png`} alt="" />
        </div>
        {!isTicket &&
          <div className={styles.cardBodyItem}>
            <span className={styles.text}>TOTAL RAISE</span> <span className={styles.textBold}>
              {'$' + (numberWithCommas(Math.ceil((+card.ether_conversion_rate * +card.total_sold_coin) || 0), 0))}
            </span>
          </div>
        }
        {!isTicket &&
          <div className={styles.cardBodyItem}>
            <span className={styles.text}>EXCHANGE RATE</span> <span className={styles.textBold} style={{textTransform: 'uppercase'}}>
              1 {card.symbol} = {card.ether_conversion_rate} {card.accept_currency}
            </span>
          </div>}
          <div className={styles.cardBodyItem}>
            <span className={styles.text}>SUPPORTED</span> <span className={styles.textBold} style={{textTransform: 'uppercase'}}>
              {card.network_available}
            </span>
          </div>
        {isTicket &&
          <div className={styles.cardBodyItem}>
            <span className={styles.text}>REMAINING</span> <span className={styles.textBold}>
              {getRemaining(card.total_sold_coin, card.token_sold)}
            </span>
          </div>
        }
        {isTicket &&
          <div className={styles.cardBodyItem}>
            <span className={styles.text}>PRICE</span> <span className={clsx(styles.textBold, styles.price)}>
              {isClaim ? 0 : card.ether_conversion_rate} {card.accept_currency}
            </span>
          </div>
        }
        <div className={styles.progressItem}>
          <span className={styles.text}>Progress</span>
          <div className="showProgress">
            <Progress progress={calcProgress(+card.token_sold, +card.total_sold_coin)} />
          </div>
          <div className={clsx(styles.cardBodyItem, 'total')}>
            <span className={styles.textBold}>
              {calcProgress(+card.token_sold, +card.total_sold_coin)}%
            </span>

            <span className="amount">
              {card.token_sold ? numberWithCommas(card.token_sold, 0) : '...'}/{card.total_sold_coin ? numberWithCommas(card.total_sold_coin, 0) : '...'} {isTicket ? 'Tickets' : 'Tokens'}
            </span>
          </div>
        </div>
        {
          /*isBuy &&*/ <div className={clsx(styles.cardBodyItem, styles.buyBox)} style={{ marginTop: '16px' }}>
            <div className={styles.timeEnd}>
              <span className={clsx(styles.text, 'sp1')}>END IN</span>
              <span className={styles.timeEnd}>
                {formatNumber(endTime.days)}d : {formatNumber(endTime.hours)}h : {formatNumber(endTime.minutes)}m : {formatNumber(endTime.seconds)}s
              </span>
            </div>
            <Link href={`/#/${getRoute(card.token_type)}/${card.id}`} className={clsx(styles.btnDetail, 'not-approved')}>
              {/* {card.isApproved ? 'Buy Now' : 'Approve'} */}
              Detail
            </Link>
          </div>
        }

      </div>
    </div>
  );
};
