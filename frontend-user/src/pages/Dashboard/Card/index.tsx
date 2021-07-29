import React, { useCallback, useEffect, useState } from "react";
import { Tooltip } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { getPoolCountDown } from "../../../utils/getPoolCountDown";
import useStyles from "./style";
import { numberWithCommas } from "../../../utils/formatNumber";
import { Link } from "react-router-dom";
import { ACCEPT_CURRENCY, BUY_TYPE, NETWORK } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import { getIconCurrencyUsdt } from "../../../utils/usdt";
import { PoolStatus } from "../../../utils/getPoolStatus";
import {
  checkPoolIsFinish,
  getAccessPoolText,
  getProgressWithPools,
  getTokenSold,
  showTotalRaisePrice,
} from "../../../utils/campaign";
import BigNumber from "bignumber.js";
import CountdownSort from "../../../components/Base/CountdownSort";
import useTokenSoldProgress from "../../BuyToken/hooks/useTokenSoldProgress";
import { getPoolStatusByPoolDetail } from "../../../utils/getPoolStatusByPoolDetail";

const dotIcon = "/images/icons/dot.svg";
const EthereumIcon = "/images/ethereum.svg";
const BSCIcon = "/images/bsc.svg";
const PolygonIcon = "/images/polygon-matic.svg";

const Card = (props: any): JSX.Element => {
  const styles = useStyles();
  const { pool, autoFetch } = props;
  const { data: participants } = useFetch<any>(`/user/counting/${pool.id}`);

  const [progress, setProgress] = useState("0");
  const [tokenSold, setTokenSold] = useState("0");
  const [totalSoldCoin, setTotalSoldCoin] = useState("0");
  useEffect(() => {
    const getTokenProgressInfoByPool = async () => {
      console.log("Run getTokenProgressInfoByPool========>");
      if (autoFetch) {
        pool.tokenSold = await getTokenSold(pool);
      }
      let {
        progress: progressPercent,
        tokenSold: totalTokenSold,
        totalSoldCoin: totalToken,
      } = getProgressWithPools(pool);

      setProgress(progressPercent);
      setTokenSold(totalTokenSold);
      setTotalSoldCoin(totalToken);
    };

    getTokenProgressInfoByPool();
    if (autoFetch) {
      const intervalProgress = setInterval(() => {
        getTokenProgressInfoByPool();
      }, 10000);

      return () => {
        intervalProgress && clearInterval(intervalProgress);
      };
    }
  }, [pool]);

  // useEffect(() => {
  //   const currentTime = moment().unix()
  //   let diffTime = 0;
  //   if(pool.start_join_pool_time > currentTime) {
  //     diffTime = parseInt(pool.start_join_pool_time) - currentTime;
  //   } else if(pool.start_time > currentTime) {
  //     diffTime = parseInt(pool.start_time) - currentTime;
  //   }

  //   let intervalCount: any;
  //   if (diffTime > 0) {
  //     let timeLeftToStart = diffTime * 1000
  //   const interval = 1000;

  //     intervalCount = setInterval(() => {
  //       timeLeftToStart -= interval;
  //       const timeLeftDuration = moment.duration(timeLeftToStart, 'milliseconds');
  //       let timeLeftString = '';
  //       if (timeLeftToStart >= 86400000) {
  //         timeLeftString = 'In ' + timeLeftDuration.days() + " days"
  //       } else {
  //         timeLeftString = 'In ' + timeLeftDuration.hours() + ":" + timeLeftDuration.minutes() + ":" + timeLeftDuration.seconds()
  //       }
  //       setTimeLeft(timeLeftString)
  //     }, interval);
  //   }

  //   return () => clearInterval(intervalCount);
  // }, [])

  const { currencyIcon, currencyName } = getIconCurrencyUsdt({
    purchasableCurrency: pool?.accept_currency,
    networkAvailable: pool?.network_available,
  });

  const tokenDetails =
    pool.token === "TBD"
      ? {
          symbol: "TBA",
          name: "TBA",
          decimals: 18,
          address: "Token contract not available yet.",
        }
      : {
          symbol: pool.symbol,
          name: pool.name,
          decimals: pool.decimals,
          address: pool.token,
        };

  const poolStatus = getPoolStatusByPoolDetail(pool, tokenSold);

  const { soldProgress } = useTokenSoldProgress(
    pool?.poolAddress,
    pool?.amount,
    pool?.networkAvailable,
    pool
  );

  const joinTimeInDate = pool?.start_join_pool_time
    ? new Date(Number(pool?.start_join_pool_time) * 1000)
    : undefined;
  const endJoinTimeInDate = pool?.end_join_pool_time
    ? new Date(Number(pool?.end_join_pool_time) * 1000)
    : undefined;
  const startBuyTimeInDate = pool?.start_time
    ? new Date(Number(pool?.start_time) * 1000)
    : undefined;
  const endBuyTimeInDate = pool?.finish_time
    ? new Date(Number(pool?.finish_time) * 1000)
    : undefined;
  const releaseTimeInDate = pool?.releaseTime
    ? new Date(Number(pool?.releaseTime) * 1000)
    : undefined;

  const displayCountDownTime = useCallback(
    (
      method: string | undefined,
      startJoinTime: Date | undefined,
      endJoinTime: Date | undefined,
      startBuyTime: Date | undefined,
      endBuyTime: Date | undefined
    ) => {
      return getPoolCountDown(
        startJoinTime,
        endJoinTime,
        startBuyTime,
        endBuyTime,
        releaseTimeInDate,
        method,
        poolStatus,
        pool,
        soldProgress
      );
    },
    []
  );

  const { date: countDownDate, displayShort } = displayCountDownTime(
    pool?.buy_type,
    joinTimeInDate,
    endJoinTimeInDate,
    startBuyTimeInDate,
    endBuyTimeInDate
  );

  return (
    <Link to={`/buy-token/${pool.id}`} className={styles.boxCard}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <img src={pool.banner} alt="" />
          <div className={styles.listStatus}>
            <div className={`${styles.poolStatusWarning}`}>
              {getAccessPoolText(pool)}
            </div>
            {/* {pool.status === PoolStatus.Closed && (
              <div className="time ended">
                <span>{PoolStatus.Closed}</span>
              </div>
            )}
            {pool.status === PoolStatus.TBA && (
              <div className="time tba">
                <span>TBA</span>
              </div>
            )}
            {pool.status === PoolStatus.Filled && (
              <div className="time filled">
                <span>{PoolStatus.Filled}</span>
              </div>
            )}
            {pool.status === PoolStatus.Progress && (
              <div className="time in-progress">
                <span>{PoolStatus.Progress}</span>
              </div>
            )}
            {(pool.status === PoolStatus.Joining ||
              pool.status === PoolStatus.Upcoming) && (
              <div className="time joining">Whitelisting</div>
            )}
            {pool.status === PoolStatus.Claimable && (
              <div className="time claimable">
                <span>Claimable</span>
              </div>
            )} */}
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardBodyHead}>
            <div className="card-content__title">
              <Tooltip
                classes={{ tooltip: styles.tooltip }}
                title={`${pool.title} (${pool.symbol})`}
                arrow
                placement="top"
              >
                <p>
                  {pool.title}
                  {` (${pool.symbol})`}
                </p>
              </Tooltip>
            </div>
            <div className={styles.network}>
              {
                {
                  'eth': <img src={EthereumIcon} alt="" />,
                  'bsc': <img src={BSCIcon} alt="" />,
                  'polygon': <img src={PolygonIcon} alt="" />,
                }[`${pool?.network_available}`] || <img src={EthereumIcon} alt="" />
              }
            </div>
          </div>
          <ul className="card-content__content">
            <li>
              <span>Total Raise</span>
              <span className="total">
                {showTotalRaisePrice(pool)}
              </span>
            </li>
            <li>
              <span>Exchange Rate</span>
              <span className="total">
                1&nbsp;{tokenDetails?.symbol}
                &nbsp;=&nbsp;
                {pool?.ether_conversion_rate} &nbsp;{currencyName}
              </span>
            </li>
            <li>
              <span>Supported</span>
              <span className="total">{currencyName}</span>
            </li>
          </ul>

          <Link to={`/buy-token/${pool.id}`} className={styles.btnApplied}>
            {displayShort ? (
              <>
                {displayShort}&nbsp;
                <img src="/images/icons/icon_btn_pool.svg" alt="" />
                <CountdownSort startDate={countDownDate} />
              </>
            ) : (
              <>
                <div>TBA</div>
              </>
            )}
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default Card;
