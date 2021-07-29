import {useSelector} from 'react-redux';
import useStyles from './style';
import withWidth from '@material-ui/core/withWidth';

const swapIcon = '/images/icons/swap.svg';

const Tiers = (props: any) => {
  const styles = useStyles();

  const {data: rates} = useSelector((state: any) => state.rates);

  return (
    <div className={styles.tierInfomation}>
      <div className={styles.conversionRate}>
        <h3 className="title">* Conversion Rate :</h3>
        {rates.data && rates.data.map((rate: any) => {
          if (rate.symbol === 'sPKF' || rate.symbol === 'Red Kite Point (KSM)') {
            return <></>;
          }
          return <div className="group" key={rate.symbol}>
            <span>1 {rate.name}</span>
            <img src={swapIcon} className={styles.iconT} alt=""/>
            <span className={styles.textRate}>{rate.rate} Points</span>
          </div>
        })}
      </div>
    </div>
  );
};

export default withWidth()(Tiers);
