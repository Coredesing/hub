import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './style';
import DefaultLayout from "../../components/Layout/DefaultLayout";

// import SwipeableViews from 'react-swipeable-views';
import { AboutTicket } from './About';
import { formatNumber } from '../../utils';
import { Progress } from './Progress';
const ticketImg = '/images/gamefi-ticket.png';
const tetherIcon = '/images/icons/tether.svg';
const brightIcon = '/images/icons/bright.svg';
const finishedImg = '/images/finished.png';
const soldoutImg = '/images/soldout.png';
const Ticket: React.FC<any> = (props: any) => {
  const styles = useStyles();
  const [hasError, setError] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false);
  const [isBuy, setIsBuy] = useState<boolean>(false);
  const [endOpenTime, setEndOpenTime] = useState<boolean>(false);
  const [finishedTime, setFinishedTime] = useState<boolean>(false);
  const [openTime, setOpenTime] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 1
  });
  const [endTime, setTimeEnd] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 1
  });
  const ascAmount = () => {
    setAmount(n => n + 1);
  }
  const descAmount = () => {
    if (amount > 0) {
      setAmount(n => n - 1);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {

      const newOpenTime = { ...openTime };
      if (newOpenTime.days === 0 && newOpenTime.hours === 0 && newOpenTime.minutes === 0 && newOpenTime.seconds === 0) {
        clearInterval(interval);
        setIsBuy(true);
        setEndOpenTime(true);
        setIsShowInfo(true);
        return;
      }
      if (newOpenTime.seconds === 0) {
        newOpenTime.seconds = 59;
        if (newOpenTime.minutes === 0) {
          newOpenTime.minutes = 59;
          if (newOpenTime.hours === 0) {
            if (newOpenTime.days > 0) {
              newOpenTime.days -= 1;
              newOpenTime.hours = 23;
            }
          } else {
            newOpenTime.hours -= 1;
          }
        } else {
          newOpenTime.minutes -= 1;
        }
      } else {
        newOpenTime.seconds -= 1;
      }
      setOpenTime(newOpenTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [openTime, setOpenTime]);

  useEffect(() => {
    let interval: any;
    if (isBuy) {
      interval = setInterval(() => {

        const newEndTime = { ...endTime };
        if (newEndTime.days === 0 && newEndTime.hours === 0 && newEndTime.minutes === 0 && newEndTime.seconds === 0) {
          clearInterval(interval);
          setIsBuy(false);
          setEndOpenTime(true);
          setFinishedTime(true);

          return;
        }
        if (newEndTime.seconds === 0) {
          newEndTime.seconds = 59;
          if (newEndTime.minutes === 0) {
            newEndTime.minutes = 59;
            if (newEndTime.hours === 0) {
              if (newEndTime.days > 0) {
                newEndTime.days -= 1;
                newEndTime.hours = 23;
              }
            } else {
              newEndTime.hours -= 1;
            }
          } else {
            newEndTime.minutes -= 1;
          }
        } else {
          newEndTime.seconds -= 1;
        }
        setTimeEnd(newEndTime);
      }, 1000);
    }


    return () => {
      interval && clearInterval(interval);
    }
  }, [isBuy, endTime, setTimeEnd]);
  return (
    <DefaultLayout>

      <div className={styles.content}>
        {hasError && <div className={clsx(styles.displayContent,)}>
          <div className={styles.alert}>
            The connected wallet address (0xa45...223) is unverified. <a className="kyc-link" href="/">Please sumbit KYC</a> now or switch to a verified address.
            Click <a className="link" href="#">here</a> for more process details.
          </div>
        </div>}

        <div className={styles.card}>
          <div className={styles.cardImg}>
            <img src={ticketImg} alt="" />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardBodyText}>
              <h3>GameFi Ticket</h3>
              <h4>
                <span>TOTAL SALE</span> 10,000
              </h4>
              <button>
                <img src={tetherIcon} alt="" />
                <span>100 USDT</span>
                <span className="small-text">
                  /Ticket
                </span>
              </button>
            </div>
            <div className={styles.cardBodyDetail}>
              {!endOpenTime &&
                <div className={styles.cardBodyClock}>
                  <h5>
                    Open in
                    <span className="open">
                      <img src={brightIcon} alt="" />
                    </span>
                  </h5>
                  <div className="times">
                    <span className="time">
                      <span className="number">{formatNumber(openTime.days)}</span>
                      <span className="text">Days</span>
                    </span>
                    <span className="dot">:</span>
                    <span className="time">
                      <span className="number">{formatNumber(openTime.hours)}</span>
                      <span className="text">Hours</span>
                    </span>
                    <span className="dot">:</span>
                    <span className="time">
                      <span className="number">{formatNumber(openTime.minutes)}</span>
                      <span className="text">Minutes</span>
                    </span>
                    <span className="dot">:</span>
                    <span className="time">
                      <span className="number">{formatNumber(openTime.seconds)}</span>
                      <span className="text">Seconds</span>
                    </span>
                  </div>
                </div>
              }
              {isShowInfo && <div className={styles.cardBodyProgress}>
                <div className={styles.progressItem}>
                  <span className={styles.text}>Progress</span>
                  <div className="showProgress">
                  <Progress progress={70} />
                  </div>
                  <div className={clsx(styles.infoTicket, 'total')}>
                    <span className={styles.textBold}>
                      70%
                    </span>
                    
                    <span className="amount">
                      7,000/10,000 Tickets
                    </span>
                  </div>
                </div>
                <div className={styles.infoTicket}>
                  <span className={styles.text}>Remaining</span> <span className={styles.textBold}>10,000
                  </span>
                </div>
                <div className={styles.infoTicket}>
                  <span className={styles.text}>OWNED</span> <span className={styles.textBold}>10,000
                  </span>
                </div>
                <div className={styles.infoTicket}>
                  <span className={styles.text}>PARTICIPANTS</span> <span className={styles.textBold}>10,000
                  </span>
                </div>
                {!finishedTime && isBuy && <div className={styles.infoTicket}>
                  <span className={styles.text}>END IN</span>
                  <span className={styles.timeEnd}>
                    {formatNumber(endTime.days)}d : {formatNumber(endTime.hours)}h : {formatNumber(endTime.minutes)}m : {formatNumber(endTime.seconds)}s
                  </span>
                </div>}

                {isBuy && <div className={styles.infoTicket}>
                  <div className={styles.amountBuy}>
                    <span>Amount</span>
                    <div>
                      <span onClick={descAmount}>-</span>
                      <span>{amount}</span>
                      <span onClick={ascAmount}>+</span>
                    </div>
                  </div>
                  <button className={styles.buynow}>
                    buy now
                  </button>
                </div>}

                {finishedTime && <div className={clsx(styles.infoTicket, styles.finished)}>
                  <div className="img-finished">
                    <img src={finishedImg} alt="" />
                  </div>
                  <div className="soldout">
                    <img src={soldoutImg} alt="" />
                  </div>
                </div>}

              </div>}

            </div>
          </div>
        </div>
        <div className={styles.displayContent}>
          <AboutTicket />
        </div>
      </div>
    </DefaultLayout>
  )
}

export default withRouter(Ticket);
