import { FC, useState } from 'react';
import BigNumber from 'bignumber.js';
import {formatRoundUp, numberWithCommas} from '../../../utils/formatNumber';
import useUserPurchased from '../hooks/useUserPurchased';
import {getIconCurrencyUsdt} from "../../../utils/usdt";
import useStyles from './styles';

type Props = {
  poolDetails: any,
  poolDetailsMapping: any,
  maximumBuy: any,
};

const BuyTokenSwapTokens: FC<Props> = ({poolDetails, poolDetailsMapping, maximumBuy}) => {
  const styles = useStyles();
  const navHeader = useState(poolDetailsMapping);
  const [userPurchased, setUserPurchased] = useState<number>(0);



  return (
    <section className={styles.sectionBuyTokenSwapTokens}>
      <div className="">
        <h2>Swap Tokens</h2>
        <div className="">
          <div className={styles.allowcationWrap}>
            <span className={styles.allowcationTitle}>Max Allocation: </span>
            <span className={styles.allocationContent}>
              {numberWithCommas(new BigNumber(maximumBuy).toFixed())} {poolDetails?.title}
            </span>
          </div>

          <div className={styles.allowcationWrap}>
            <span className={styles.allowcationTitle}>Have Bought: </span>
            <span className={styles.allocationContent}>
              {numberWithCommas(new BigNumber(maximumBuy).toFixed())} {poolDetails?.title}
              {numberWithCommas(
                formatRoundUp(
                  new BigNumber(userPurchased).multipliedBy(poolDetails?.ethRate)
                ) // Round UP with 2 decimal places: 1.369999 --> 1.37
              )}
              {poolDetails?.title}
            </span>
          </div>

          <div className={styles.allowcationWrap}>
            <span className={styles.allowcationTitle}>Remaining: </span>
            <span className={styles.allocationContent}>
              {numberWithCommas(new BigNumber(maximumBuy).toFixed())} {poolDetails?.title}
            </span>
          </div>

          <div className={styles.allowcationWrap}>
            <span className={styles.allowcationTitle}>{navHeader[0]?.minTier?.display} Rank Buy Time: </span>
            <span className={styles.allocationContent}>
              {numberWithCommas(new BigNumber(maximumBuy).toFixed())} {poolDetails?.title}
            </span>
          </div>
        </div>
        {/* <p className={styles.buyTokenFormTitle}>
            <div className={styles.allowcationWrap}>
              <span className={styles.allowcationTitle}>Max Allocation: </span>
              <span className={styles.allocationContent}>
                {numberWithCommas(new BigNumber(maximumBuy).toFixed())} {currencyName}
              </span>
            </div>

            <div className={styles.allowcationWrap}>
              <span className={styles.allowcationTitle}>Have Bought: </span>
              <span className={styles.allocationContent}>
                {numberWithCommas(
                  new BigNumber(userPurchased).multipliedBy(rate)
                    .decimalPlaces(2, BigNumber.ROUND_CEIL) // Round UP with 2 decimal places: 1.369999 --> 1.37
                    .toFixed()
                )} {currencyName}
              </span>
            </div>

            <div className={styles.allowcationWrap}>
              <span className={styles.allowcationTitle}>Remaining: </span>
              <span className={styles.allocationContent}>
                {numberWithCommas(
                  new BigNumber(maximumBuy).minus(new BigNumber(userPurchased).multipliedBy(rate)).lte(0)
                    ? '0'
                    : (
                      new BigNumber(maximumBuy).minus(new BigNumber(userPurchased).multipliedBy(rate))
                        .decimalPlaces(2, BigNumber.ROUND_FLOOR) // Round DOWN with 2 decimal places: 1.369999 --> 1.36
                        .toFixed()
                    )
                )} {currencyName}
              </span>
            </div>

            <div className={styles.allowcationWrap}>
              <span className={styles.allowcationTitle}>Tier Buy Time: </span>
              <span className={styles.allocationContent}>
              {!!currentUserTier && !!currentUserTier.start_time && !!currentUserTier.end_time &&
                <>
                  { convertUnixTimeToDateTime(currentUserTier.start_time, 1) }
                  {' '} to {' '}
                  { convertUnixTimeToDateTime(currentUserTier.end_time, 1) }
                </>
              }
              </span>
            </div>

          </p> */}
      </div>
    </section>
  );
};

export default BuyTokenSwapTokens;
