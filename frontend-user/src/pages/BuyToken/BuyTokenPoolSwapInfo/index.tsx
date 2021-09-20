import { FC, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import useTokenSoldProgress from '../hooks/useTokenSoldProgress';
import { numberWithCommas } from '../../../utils/formatNumber';
import useStyles from './styles';

type Props = {
  poolDetails: any,
  currencyName: any
};

const BuyTokenPoolSwapInfo: FC<Props> = ({poolDetails, currencyName}) => {
  const styles = useStyles();
  const { tokenSold, soldProgress } = useTokenSoldProgress(
    poolDetails?.poolAddress,
    poolDetails?.amount,
    poolDetails?.networkAvailable,
    poolDetails,
  );
  const showProgress = (sold:number, totalSold: number) => {
    const _sold = new BigNumber(sold);
    const _totalSold = new BigNumber(totalSold);
    const percent = _sold.multipliedBy(100).dividedBy(_totalSold)
    return percent.lt(100) ? +percent.toFixed(1) : 100;
  }
  return (
    <section className={styles.sectionBuyTokenPoolSwapInfo}>
      <h2 className={styles.title}>Swap Info</h2>

      <div className={styles.topSec}>
        <div className={styles.leftTopSec}>
          <h3 className={styles.titleSub}>
            Swap Amount
            <div className={styles.rightTopSec}>
              {
                poolDetails.purchasableCurrency ===  'eth'
                ?
                <>
                  {
                    poolDetails?.displayPriceRate
                    ?
                    <>
                      1&nbsp;{poolDetails?.tokenDetails?.symbol}
                      &nbsp;=&nbsp;
                      {poolDetails?.priceUsdt}&nbsp;USD
                      <br/>
                      1&nbsp;{poolDetails?.tokenDetails?.symbol}
                      &nbsp;=&nbsp;
                      {poolDetails?.ethRate} &nbsp;{currencyName}
                    </>
                    :
                    <>
                      1&nbsp;{poolDetails?.tokenDetails?.symbol}
                      &nbsp;=&nbsp;
                      {poolDetails?.priceUsdt}&nbsp;USD
                    </>
                  }
                </>
                :
                <>
                  1&nbsp;{poolDetails?.tokenDetails?.symbol}
                  &nbsp;=&nbsp;
                  {poolDetails?.ethRate} &nbsp;{currencyName}
                </>
              }
            </div>
          </h3>
          <div className={styles.valueLeftTopSec}>
            {numberWithCommas(poolDetails?.amount.toString())} {poolDetails?.tokenDetails?.symbol}
          </div>
        </div>
      </div>

      <div className={styles.botSec}>
        <h3 className={styles.titleSub2}>Swap Progress</h3>

        <div className={styles.jubValue}>
          <div className={styles.leftBotSec}>
            {/* {numberWithCommas(new BigNumber(soldProgress).gte(100) ? '100': soldProgress)}% */}
            { showProgress(+poolDetails.tokenSold || 0, +poolDetails.totalSoldCoin || 0)}%
          </div>
          <div className={styles.rightBotSec}>
            {
              numberWithCommas(new BigNumber(tokenSold).gt(`${poolDetails?.amount}`) ? `${poolDetails?.amount}`: tokenSold, 2)}&nbsp;
              / {numberWithCommas(`${poolDetails?.amount}` || "0", 2)
            }
          </div>
        </div>

        <div className={styles.progress}>
          <div className={styles.achieved} style={{ width: `${ showProgress(+poolDetails.tokenSold || 0, +poolDetails.totalSoldCoin || 0)}%` }}></div>
        </div>
      </div>
    </section>
  );
};

export default BuyTokenPoolSwapInfo;
