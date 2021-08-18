import {useSelector} from 'react-redux';
import useStyles from './style';
import withWidth from '@material-ui/core/withWidth';
import useAuth from '../../../hooks/useAuth';

const swapIcon = '/images/account_v3/icons/swap.svg';

const Tiers = (props: any) => {
  const styles = useStyles();
  const { connectedAccount} = useAuth();

  const {data: rates} = useSelector((state: any) => state.rates);

  return (
    <div className={styles.tierInfomation}>
      <div className={styles.conversionRate}>
        <h3 className={styles.title}>* Conversion Rate :</h3>
        {connectedAccount && rates?.data?.map((rate: any) => {
          if (rate.symbol === 'sPKF' || rate.symbol === 'Red Kite Point (KSM)') {
            return <></>;
          }
          return <div className={styles.group} key={rate.symbol}>
            <span>1 {rate.name}</span>
            <img src={swapIcon} className={styles.iconT} alt=""/>
            <span className={styles.textRate}>{rate.rate} GameFi Power</span>
          </div>
        })}
      </div>
    </div>
  );
};

export default withWidth()(Tiers);
