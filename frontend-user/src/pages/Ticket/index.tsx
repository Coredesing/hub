import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './style';
import LandingLayout from "../../components/Layout/LandingLayout";

// import SwipeableViews from 'react-swipeable-views';
import { AboutTicket } from './About';
const ticketImg = '/images/gamefi-ticket.png';
const tetherIcon = '/images/icons/tether.svg';
const brightIcon = '/images/icons/bright.svg';
const finishedImg = '/images/finished.png';
const soldoutImg = '/images/soldout.png';
const Ticket: React.FC<any> = (props: any) => {
  const isShowProg = false;
  const styles = useStyles();
  const [hasError, setError] = useState<boolean>(false);
  return (
    <LandingLayout>

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
              <div className={styles.cardBodyClock}>
                <h5>
                  Open in
                  <span className="open">
                    <img src={brightIcon} alt="" />
                  </span>
                </h5>
                <div className="times">
                  <span className="time">
                    <span className="number">01</span>
                    <span className="text">Days</span>
                  </span>
                  <span className="dot">:</span>
                  <span className="time">
                    <span className="number">01</span>
                    <span className="text">Hours</span>
                  </span>
                  <span className="dot">:</span>
                  <span className="time">
                    <span className="number">01</span>
                    <span className="text">Minutes</span>
                  </span>
                  <span className="dot">:</span>
                  <span className="time">
                    <span className="number">01</span>
                    <span className="text">Seconds</span>
                  </span>
                </div>
              </div>
              {isShowProg && <div className={styles.cardBodyProgress}>
                <div className={styles.progressItem}>
                  <span className={styles.text}>Progress</span>
                  <div className="showProgress"></div>
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
                <div className={styles.infoTicket}>
                  <span className={styles.text}>END IN</span>
                  <span className={styles.timeEnd}>
                    2d : 20h : 31m
                  </span>
                </div>
                <div className={styles.infoTicket}>
                  <div className={styles.amountBuy}>
                    <span>Amount</span>
                    <div>
                      <span>-</span>
                      <span>3</span>
                      <span>+</span>
                    </div>
                  </div>
                  <button className={styles.buynow}>
                    buy now
                  </button>
                </div>
                <div className={clsx(styles.infoTicket, styles.finished)}>
                  <div className="img-finished">
                    <img src={finishedImg} alt="" />
                  </div>
                  <div className="soldout">
                    <img src={soldoutImg} alt="" />
                  </div>
                </div>
              </div>}

            </div>
          </div>
        </div>
        <div className={styles.displayContent}>
          <AboutTicket />
        </div>
      </div>
    </LandingLayout>
  )
}

export default withRouter(Ticket);
