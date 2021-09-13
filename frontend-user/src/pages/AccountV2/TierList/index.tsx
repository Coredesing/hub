import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import { TIERS } from '../../../constants';
import useAuth from '../../../hooks/useAuth';
import { numberWithCommas } from '../../../utils/formatNumber';
import useStyles from './style';

const tickIcon = '/images/icons/blue-tick.svg';
const lockIcon = '/images/icons/lock.svg';
const noTickIcon = '/images/no-tick.svg';

const TierList = (props: any) => {
  const styles = useStyles();
  const { connectedAccount } = useAuth();

  const {
    tiersBuyLimit,
    tiers,
    userTier,
    loading,
    currentProcess,
    showMoreInfomation,
    hideStatistics,
  } = props;
  console.log('usertier', userTier);
  return (
    <ul className={styles.tierList}>
      <li className={`${styles.tierInfo} active first-tier`}>
        <div>
          <div className="icon" style={{ color: '#72F34B' }}>
            <div className="icon-inner">
              <img src={TIERS[0].icon} className="tier-icon" alt="" />
              <img className="icon-tick" src={tickIcon} alt="" />
            </div>
          </div>
          <div className="info">
            <span className="tier-name">{TIERS[0].name}</span>
            <span>GP</span>
          </div>
        </div>
        {isWidthUp('sm', props.width) && connectedAccount && <span
          className={"progress-bar"}
          style={{
            backgroundColor: '#72F34B',
            width: userTier > 0 ? 'calc(100% - 1px)' : `${currentProcess || 0}%`
          }}
        />}
        {isWidthDown('xs', props.width) && connectedAccount && <span
          className={"progress-bar" + (loading ? ' inactive' : ' active')}
          style={{
            backgroundColor: '#72F34B',
            height: userTier > 0 ? 'calc(100% - 1px)' : `${currentProcess || 0}%`
          }}
        />}
      </li>
      {tiers.length > 0 && tiers.map((tier: any, idx: any) => {
        if (tier !== 0) {
          return (
            <li key={idx}
              style={{ color: userTier > idx ? '#72F34B' : '#44454B' }}
              className={styles.tierInfo + (userTier > idx ? ' active ' : ' ') + TIERS[idx + 1].name + (hideStatistics ? ' hide-statistics' : '')}>
              {+userTier > idx + 1 && connectedAccount && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: '#72F34B',
                  transition: `all 1s ease ${idx + 1}s`
                }}
              />}
              {+userTier > idx + 1  && connectedAccount && !showMoreInfomation && isWidthUp('sm', props.width) && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: '#72F34B',
                  width: `${currentProcess}%`
                }}
              />}
              {+userTier > idx + 1  && connectedAccount && !showMoreInfomation && isWidthDown('xs', props.width) && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: '#72F34B',
                  height: `${currentProcess}%`
                }}
              />}
              <div>
                <div className="icon">
                  <div className="icon-inner">
                    <img src={userTier > idx ? TIERS[idx + 1].icon : lockIcon} className="tier-icon" alt="" />
                    <img className="icon-tick" src={userTier > idx ? tickIcon : noTickIcon} alt="" />
                  </div>
                </div>
                <div className="info">
                  <span className={(userTier > idx) ? "tier-name" : ""}>{TIERS[idx + 1].name}</span>
                  {!showMoreInfomation && <span className="unit">{numberWithCommas(tier)} GP</span>}
                  {showMoreInfomation && !hideStatistics &&
                    <span className="unit">{numberWithCommas(tiersBuyLimit[idx + 1])} GP</span>}
                </div>
              </div>
            </li>
          )
        }
      })}
    </ul>
  );
};

export default withWidth()(TierList);
