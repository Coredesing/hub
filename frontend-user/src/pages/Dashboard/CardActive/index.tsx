import React, {useCallback, useEffect, useState} from "react";
import {Tooltip} from "@material-ui/core";
import useStyles from "./styles";
import {numberWithCommas} from "../../../utils/formatNumber";
import {Link} from "react-router-dom";
import {getPoolCountDown} from "../../../utils/getPoolCountDown";
import {ACCEPT_CURRENCY, NETWORK} from "../../../constants";
import useFetch from "../../../hooks/useFetch";
import {getIconCurrencyUsdt} from "../../../utils/usdt";
import {PoolStatus} from "../../../utils/getPoolStatus";
import {
  getAccessPoolText,
  getProgressWithPools,
  getTokenSold,
  showTotalRaisePrice,
} from "../../../utils/campaign";
import BigNumber from "bignumber.js";
import CountdownSort from "../../../components/Base/CountdownSort";
import useTokenSoldProgress from "../../BuyToken/hooks/useTokenSoldProgress";
import {getPoolStatusByPoolDetail} from "../../../utils/getPoolStatusByPoolDetail";

const EthereumIcon = "/images/ethereum.svg";
const BSCIcon = "/images/bsc.svg";
const PolygonIcon = "/images/polygon-matic.svg";

const CardActive = (props: any): JSX.Element => {
  const styles = useStyles();
  const {pool, autoFetch} = props;

  const {data: participants} = useFetch<any>(`/user/counting/${pool.id}`);

  const [progress, setProgress] = useState("0");
  const [tokenSold, setTokenSold] = useState("0");
  const [totalSoldCoin, setTotalSoldCoin] = useState("0");
  useEffect(() => {
    const getTokenProgressInfoByPool = async () => {
      console.log("Run getTokenProgressInfoByPool========>");
      if (autoFetch) {
        pool.token_sold = await getTokenSold(pool);
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

  const {currencyName} = getIconCurrencyUsdt({
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

  const {soldProgress} = useTokenSoldProgress(
    pool?.campaign_hash,
    pool?.total_sold_coin,
    pool?.network_available,
    pool
  );


  const joinTimeInDate = pool?.start_join_pool_time ? new Date(Number(pool?.start_join_pool_time) * 1000) : undefined;
  const endJoinTimeInDate = pool?.end_join_pool_time ? new Date(Number(pool?.end_join_pool_time) * 1000) : undefined;
  const startBuyTimeInDate = pool?.start_time ? new Date(Number(pool?.start_time) * 1000) : undefined;
  const endBuyTimeInDate = pool?.finish_time ? new Date(Number(pool?.finish_time) * 1000) : undefined;
  const announcementTime = pool?.whitelistBannerSetting?.announcement_time ? new Date(Number(pool?.whitelistBannerSetting?.announcement_time) * 1000) : undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const releaseTimeInDate = pool?.release_time ? new Date(Number(pool?.release_time) * 1000) : undefined;

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
    [pool, poolStatus, releaseTimeInDate, soldProgress]
  );

  const {date: countDownDate, displayShort} = displayCountDownTime(
    pool?.buy_type,
    joinTimeInDate,
    endJoinTimeInDate,
    startBuyTimeInDate,
    endBuyTimeInDate
  );

  return (
    // <Link to={`/buy-token/${pool.id}`}>
    <div className={styles.cardActive}>
      <div className={`${styles.poolStatusWarning}`}>
        {getAccessPoolText(pool)}
      </div>
      <div className={styles.cardActiveBanner}>
        <img src={pool.banner} alt=""/>
      </div>

      <div className={styles.cardActiveRight}>
        <div className={styles.cardActiveHeaderLeft}>
          <Tooltip
            classes={{tooltip: styles.tooltip}}
            title={pool.title}
            arrow
            placement="top"
          >
            <h3 className={styles.title}>{pool.title}</h3>
          </Tooltip>
          {
            {
              'eth': <img className={styles.iconCoin} src={EthereumIcon} alt=""/>,
              'bsc': <img className={styles.iconCoin} src={BSCIcon} alt=""/>,
              'polygon': <img className={styles.iconCoin} src={PolygonIcon} alt=""/>,
            }[`${pool?.network_available}`] || <img className={styles.iconCoin} src={EthereumIcon} alt=""/>
          }
        </div>

        <ul className={styles.listInfo}>
          <li className={styles.itemInfo}>
            <span className={styles.nameInfo}>Total Raise</span>
            <span className={`${styles.valueInfo} is`}>
              {showTotalRaisePrice(pool)}
            </span>
          </li>

          {pool.status === PoolStatus.Progress && (
            <>
              <li className={styles.itemInfo}>
                <span className={styles.nameInfo}>Exchange Rate</span>
                <span className={styles.valueInfo}>
                  1&nbsp;{tokenDetails?.symbol}
                  &nbsp;=&nbsp;
                  {pool?.ether_conversion_rate} &nbsp;{currencyName}
                </span>
              </li>
              <li className={styles.itemInfo}>
                <span className={styles.nameInfo}>Supported</span>
                <span className={styles.valueInfo}>{currencyName}</span>
              </li>
            </>
          )}

          {(pool.status === PoolStatus.Filled ||
            pool.status === PoolStatus.Claimable) && (
            <>
              <li className={styles.itemInfo}>
                <span className={styles.nameInfo}>Participants</span>
                <span className={styles.valueInfo}>{participants}</span>
              </li>
            </>
          )}
        </ul>

        <div className={styles.progressArea}>
          <div className={styles.progressAreaHeader}>
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
              />
            </span>
          </div>
          <div className={styles.progressInfo}>
              <span>
                {new BigNumber(progress).gte(100)
                  ? new BigNumber(progress).toFixed(0)
                  : new BigNumber(progress).toFixed(0)}
                %
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

        <div className={styles.groupBtnBottom}>
          {pool.status === PoolStatus.Claimable ? (
            <div className={styles.endIn}>
              <span className={styles.endInTextClaimable}>CLAIMABLE</span>
            </div>
          ) : (
            <div className={styles.endIn}>
              <span className={styles.endInText}>{displayShort}</span>
              <span className={styles.endInCountdown}>
                
                <CountdownSort startDate={countDownDate}/>
              </span>
            </div>
          )}

          <Link
            to={`/buy-token/${pool.id}`}
            className={`${styles.btnSwapNow} ${
              pool.status === PoolStatus.Filled && styles.btnDetail
            }`}
          >
            {pool.status === PoolStatus.Progress && "Swap Now"}
            {pool.status === PoolStatus.Filled && "Detail"}
            {pool.status === PoolStatus.Claimable && "Claim Now"}
            {pool.status === PoolStatus.Closed && "Ended"}
            <img
              src={`/images/icons/${
                pool.status === PoolStatus.Filled
                  ? "arrow-right-bold-blue.svg"
                  : "arrow-right-bold.svg"
              }`}
              alt=""
            />
          </Link>
        </div>
      </div>
    </div>
    // </Link>
  );
};

export default CardActive;
