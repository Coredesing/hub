import { FC } from 'react';
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
            {numberWithCommas(new BigNumber(soldProgress).gte(100) ? '100': soldProgress)}%
          </div>
          <div className={styles.rightBotSec}>
            {
              numberWithCommas(new BigNumber(tokenSold).gt(`${poolDetails?.amount}`) ? `${poolDetails?.amount}`: tokenSold, 2)}&nbsp;
              / {numberWithCommas(`${poolDetails?.amount}` || "0", 2)
            }
          </div>
        </div>

        <div className={styles.progress}>
          <div className={styles.achieved} style={{ width: `${new BigNumber(soldProgress).gte(100) ? '100': soldProgress}%` }}></div>
        </div>
      </div>
    </section>
  );
};

export default BuyTokenPoolSwapInfo;
