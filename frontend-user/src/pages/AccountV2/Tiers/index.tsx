import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import {CONVERSION_RATE, TIERS} from '../../../constants';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import {getUserTierAlias} from '../../../utils/getUserTierAlias';
import useAuth from '../../../hooks/useAuth';
import withWidth, {isWidthDown, isWidthUp} from '@material-ui/core/withWidth';
import {getTiers, getUserInfo, getUserTier} from '../../../store/actions/sota-tiers';
import Tooltip from '@material-ui/core/Tooltip';
import {numberWithCommas} from '../../../utils/formatNumber';

const noticeIcon = '/images/icons/notice.svg';
const tickIcon = '/images/tick1.svg';
const noTickIcon = '/images/no-tick.svg';

const Tiers = (props: any) => {
  const styles = useStyles();
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();

  const {data: tiers = {}} = useSelector((state: any) => state.tiers);
  const {data: userInfo = {}} = useSelector((state: any) => state.userInfo);
  const {data: userTier = 0} = useSelector((state: any) => state.userTier);
  const [loading, setLoading] = useState(true);
  const {isAuth, connectedAccount, wrongChain} = useAuth();
  const {data: rates} = useSelector((state: any) => state.rates);

  const [tooltip, setTooltip] = useState(false)

  const showTooltip = (e: any) => {
    e.preventDefault();
    setTooltip(true)
    setTimeout(() => {
      setTooltip(false)
    }, 2000)
  }

  const {
    showMoreInfomation = false,
    tiersBuyLimit,
    tokenSymbol,
    verifiedEmail,
    total,
    hideStatistics,
  } = props;

  const [currentProcess, setCurrentProcess] = useState(undefined) as any;

  useEffect(() => {
    console.log(userTier, 'userTier')
  }, [userTier])

  const calculateProcess = (ListData: any, current: any) => {
    let tierA = 0;
    let tierB = 0;
    let overTier = true;
    for (let i = 0; i < ListData.length; i++) {
      if (ListData[i] > parseFloat(current) && overTier) {
        if (i == 0) {
          tierA = 0;
          tierB = ListData[0];
        } else {
          tierA = ListData[i - 1];
          tierB = ListData[i];
        }
        overTier = false;
      }
    }
    if (overTier) {
      return 100;
    }
    let process = (parseFloat(current) - tierA) * 100 / ((tierB - tierA))
    if (process > 100) process = 100
    return process;
  }

  useEffect(() => {
    if (!_.isEmpty(tiers)) {
      setLoading(false);
    }
    // if (wrongChain || !isAuth || !connectedAccount) {
    //   setCurrentProcess(0)
    //   return
    // }
    if (showMoreInfomation && userTier) {
      // let process = userTier*100/(tiersBuyLimit.length - 1)
      setCurrentProcess(0);
      return;
    }
    if (!showMoreInfomation && userInfo?.totalStaked) {
      let process = calculateProcess(tiers, userInfo?.totalStaked);
      setCurrentProcess(process);
    }
  }, [tiers, userTier, userInfo, tiersBuyLimit, showMoreInfomation, tokenSymbol, connectedAccount, isAuth, wrongChain, total])

  useEffect(() => {
    dispatch(getTiers());
    connectedAccount != '' && connectedAccount != undefined && dispatch(getUserInfo(connectedAccount));
    connectedAccount != '' && connectedAccount != undefined && dispatch(getUserTier(connectedAccount));
  }, [isAuth, wrongChain, connectedAccount])

  useEffect(() => {
    if (currentProcess != undefined) setLoading(false)
    console.log('userTier', userTier)
  }, [currentProcess, userTier])

  return (
    <div
      className={styles.tierComponent + (!loading ? ' active' : ' inactive') + (showMoreInfomation ? ' bg-none' : '')}
    >
      <div className={styles.tierTitle}>
        My Tier
      </div>
      <div className={styles.tierDetail}>
        <p>You are in Tier {TIERS[userTier]?.name} <img alt="" style={{marginLeft: '4px'}} src={TIERS[userTier]?.icon}/>
        </p>
        <p>Please stake tokens in your wallet balance to upgrade your tier!</p>
      </div>
      <ul className={styles.tierList}>
        <li className={`${styles.tierInfo} active first-tier`}>
          <div>
            <div className="icon" style={{color: TIERS[0].bgColor}}>
              <div className="icon-inner">
                <img src={TIERS[0].icon}/>
                <img className="icon-tick" src={tickIcon}/>
              </div>
            </div>
            <div className="info">
              <span className="tier-name">{TIERS[0].name}</span>
              <span className="tier-name"/>
            </div>
          </div>
          {isWidthUp('sm', props.width) && connectedAccount && <span
            className={"progress-bar"}
            style={{
              backgroundColor: '#B8B8FF',
              width: userTier > 0 ? 'calc(100% - 1px)' : `${currentProcess || 0}%`
            }}
          />}
          {isWidthDown('xs', props.width) && connectedAccount && <span
            className={"progress-bar" + (loading ? ' inactive' : ' active')}
            style={{
              backgroundColor: '#B8B8FF',
              height: userTier > 0 ? 'calc(100% - 1px)' : `${currentProcess || 0}%`
            }}
          />}
        </li>
        {tiers.length > 0 && tiers.map((tier: any, idx: any) => {
          if (tier != 0) {
            return <li key={tier}
                       style={{color: userTier > idx  ? TIERS[idx+1].bgColor : '#44454B'}}
                       className={styles.tierInfo + (userTier > idx ? ' active ' : ' ') + TIERS[idx + 1].name + (hideStatistics ? ' hide-statistics' : '')}>
              {+userTier > idx + 1 && connectedAccount && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: TIERS[idx + 1].bgColor,
                  transition: `all 1s ease ${idx + 1}s`
                }}
              />}
              {+userTier === idx + 1 && connectedAccount && !showMoreInfomation && isWidthUp('sm', props.width) && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: TIERS[idx + 1].bgColor,
                  width: `${currentProcess}%`
                }}
              />}
              {+userTier === idx + 1 && connectedAccount && !showMoreInfomation && isWidthDown('xs', props.width) && <span
                className={"progress-bar" + (loading ? ' inactive' : ' active')}
                style={{
                  backgroundColor: TIERS[idx + 1].bgColor,
                  height: `${currentProcess}%`
                }}
              />}
              <div>
                <div className="icon">
                  <div className="icon-inner">
                    <img src={TIERS[idx + 1].icon}/>
                    <img className="icon-tick" src={userTier > idx  ? tickIcon : noTickIcon}/>
                  </div>
                </div>
                <div className="info">
                  <span className={(userTier > idx) ? "tier-name" : ""}>{TIERS[idx + 1].name}</span>
                  {!showMoreInfomation && <span>{numberWithCommas(tier)} Points</span>}
                  {showMoreInfomation && !hideStatistics &&
                  <span>{numberWithCommas(tiersBuyLimit[idx + 1])} Points</span>}
                </div>
              </div>
            </li>
          }
        })}
      </ul>

      {!showMoreInfomation && <div className={styles.tierNote}>
        <h3 className="title">
          Total Red Kite Points&nbsp;&nbsp;
          <Tooltip placement="top-start" classes={{tooltip: commonStyle.tooltip}}
                   open={tooltip} onClick={showTooltip} onMouseEnter={showTooltip}
                   title={<p style={{font: 'normal normal normal 12px/18px Helvetica'}}>
                     Total Red Kite Points = PKF*1
                     {rates.data && rates.data.map((rate: any) => {
                       if (rate.symbol == 'sPKF') return '';
                       return ` + ${rate.symbol}*${rate.rate}`
                     })}
                   </p>}>
            <img src={noticeIcon}/>
          </Tooltip>
        </h3>
        <span className="subtitle">{numberWithCommas(userInfo?.totalStaked || 0)} Points</span>
      </div>}
    </div>
  );
};

export default withWidth()(Tiers);
