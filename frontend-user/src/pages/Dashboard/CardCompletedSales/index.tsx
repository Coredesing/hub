import React, { useCallback, useEffect, useState } from "react";
import { Tooltip } from "@material-ui/core";
import useStyles from "./styles";
import { numberWithCommas } from "../../../utils/formatNumber";
import { Link } from "react-router-dom";
import { BUY_TYPE, ACCEPT_CURRENCY } from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import { getIconCurrencyUsdt } from "../../../utils/usdt";
import { PoolStatus } from "../../../utils/getPoolStatus";
import {
  getAccessPoolText,
  getProgressWithPools,
  getTokenSold,
  showTotalRaisePrice
} from "../../../utils/campaign";
import BigNumber from "bignumber.js";

const CardCompletedSales = (props: any): JSX.Element => {
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
  }, [autoFetch, pool]);

  const { currencyName } = getIconCurrencyUsdt({
    purchasableCurrency: pool?.accept_currency,
    networkAvailable: pool?.network_available,
  });

  return (
    <Link to={`/buy-token/${pool.id}`}>
      <div className={styles.cardCompletedSales}>
        <div className={styles.leftCard}>
          <img src={pool.token_images} className={styles.icon} alt="" />
          <div className={styles.introCard}>
            <div className={styles.listStatus}>
              <div className={`${styles.poolStatusWarning}`}>
                {getAccessPoolText(pool)}
              </div>
              /
              {pool.status === PoolStatus.Closed && (
                <div className={`${styles.poolStatus} ended`}>
                  <span>{PoolStatus.Closed}</span>
                </div>
              )}
              {pool.status === PoolStatus.TBA && (
                <div className={`${styles.poolStatus} tba`}>TBA</div>
              )}
              {pool.status === PoolStatus.Filled && (
                <div className={`${styles.poolStatus} time`}>
                  <span>{PoolStatus.Filled}</span>
                </div>
              )}
              {pool.status === PoolStatus.Progress && (
                <div className={`${styles.poolStatus} in-progress`}>
                  <span>{PoolStatus.Progress}</span>
                </div>
              )}
              {(pool.status === PoolStatus.Joining ||
                pool.status === PoolStatus.Upcoming) && (
                <div className={`${styles.poolStatus} joining`}>
                  Whitelisting
                </div>
              )}
              {pool.status === PoolStatus.Claimable && (
                <div className={`${styles.poolStatus} claimable`}>
                  <span>{PoolStatus.Claimable}</span>
                </div>
              )}
            </div>
            <Tooltip
              classes={{ tooltip: styles.tooltip }}
              title={pool.title}
              arrow
              placement="top"
            >
              <h3 className={styles.title}>{pool.title}</h3>
            </Tooltip>
          </div>
        </div>

        <div className={styles.midCard}>
          <ul className={styles.listInfo}>
            <li className={styles.itemInfo}>
              <span className={styles.nameInfo}>Total Raise</span>
              <span className={styles.valueInfo}>
                {showTotalRaisePrice(pool)}
              </span>
            </li>
            <li className={styles.itemInfo}>
              <span className={styles.nameInfo}>Participants</span>
              <span className={styles.valueInfo}>
                {pool.buy_type === BUY_TYPE.WHITELIST_LOTTERY
                  ? numberWithCommas(participants)
                  : "All"}
              </span>
            </li>
          </ul>
        </div>

        <div className={styles.rightCard}>
          <div className={styles.progressArea}>
            <div className={styles.headProgressArea}>
              <p className={styles.titleProgressArea}>Progress</p>
            </div>
            <div className={styles.progress}>
              <span
                className={`${styles.currentProgress} ${
                  parseFloat(progress) > 0 ? "" : "inactive"
                }`}
                style={{
                  width: `${
                    parseFloat(progress) > 99
                      ? 100
                      : Math.round(parseFloat(progress))
                  }%`,
                }}
              >
                <img
                  className={styles.iconCurrentProgress}
                  src="/images/icons/icon_progress.svg"
                  alt=""
                ></img>
              </span>
            </div>
            <div className={styles.progressInfo}>
              <span>
                ({new BigNumber(progress).gte(100)
                  ? new BigNumber(progress).toFixed(0)
                  : new BigNumber(progress).toFixed(0)}
                %)
              </span>
              <span>
                {numberWithCommas(tokenSold, 0)}
                &nbsp;/&nbsp;
                {numberWithCommas(totalSoldCoin)}
                &nbsp;
                {pool.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardCompletedSales;
