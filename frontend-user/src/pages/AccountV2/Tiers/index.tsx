import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link, Hidden } from '@material-ui/core';
import _ from 'lodash';
import {TIERS} from '../../../constants';
import useStyles from './style';
import useAuth from '../../../hooks/useAuth';
import withWidth from '@material-ui/core/withWidth';
import TierList from "../TierList";
import ManageTier from "../ManageTier";
import TierInfomation from "../TierInfomation";
import PointHistory from "../PointHistory";
import TierBenefits from "../TierBenefits";

const tabMenu = ['Overview', 
// 'GameFi Power History', 'Tier Benefits'
];

const Tiers = (props: any) => {
  const styles = useStyles();
  const [loading, setLoading] = useState(true);
  const {isAuth, connectedAccount, wrongChain} = useAuth();
  const [tabMyTier] = useState(tabMenu);
  const [acitveTab, setAcitveTab] = useState<Number>(0);

  const {
    showMoreInfomation = false,
    tiersBuyLimit,
    tokenSymbol,
    total,
    hideStatistics,
    emailVerified,
    isKYC,
    userInfo,
    userTier,
    tiers,
    totalRedKitePoints,
    pointsLeftToNextTier,
  } = props;

  const [currentProcess, setCurrentProcess] = useState(undefined) as any;

  const calculateProcess = (ListData: any, current: any) => {
    let tierA = 0;
    let tierB = 0;
    let overTier = true;
    for (let i = 0; i < ListData.length; i++) {
      if (ListData[i] > parseFloat(current) && overTier) {
        if (i === 0) {
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
    if (showMoreInfomation && userTier) {
      setCurrentProcess(0);
      return;
    }
    if (!showMoreInfomation && userInfo?.totalStaked) {
      let process = calculateProcess(tiers, userInfo?.totalStaked);
      setCurrentProcess(process);
    }
  }, [tiers, userTier, userInfo, tiersBuyLimit, showMoreInfomation, tokenSymbol, connectedAccount, isAuth, wrongChain, total])

  useEffect(() => {
    if (currentProcess !== undefined) setLoading(false)
  }, [currentProcess, userTier]);

  return (
    <div
      className={styles.tierComponent + (!loading ? ' active' : ' inactive') + (showMoreInfomation ? ' bg-none' : '')}
    >
      <div className={styles.tierTitle}>
        My Tier
      </div>

      <ul className={styles.listInfo}>
        <li className={styles.itemInfo}>
          <div className={styles.nameItemInfo}>Current Tier</div>
          <div className={styles.valueItemInfo}>
            {
              connectedAccount ? 
              <><img alt="" className={styles.iconUserTier} src={TIERS[userTier]?.icon}/> {TIERS[userTier]?.name}</>
              :
              ''  
            }
          </div>
        </li>
        <li className={styles.itemInfo}>
          <div className={styles.nameItemInfo}>GameFi Power</div>
          <div className={styles.valueItemInfo}>
            {connectedAccount ? totalRedKitePoints : ''}
          </div>
        </li>
        <li className={styles.itemInfo}>
          <div className={styles.nameItemInfo}>Power left to next tier</div>
          <div className={styles.valueItemInfo}>
            {
              connectedAccount ? 
              <>{userTier > 3 ? '0' : pointsLeftToNextTier}</>
              :
              ''
            }
          </div>
        </li>
      </ul>

      <div className={styles.message}>
        <img src="/images/account_v3/icons/icon_notice.svg" alt="" />
        Total GameFi Power = Your Staked Amount + Σ GameFi Power you achieved
      </div>

      <nav className={styles.menuTier}>
        {
          tabMyTier.length > 1 &&
          tabMyTier.map((item, index) => {
            return (
              <li
                className={`${styles.itemTabMyTier} ${index === acitveTab ? 'active' : ''}`}
                key={index} 
                onClick={() => setAcitveTab(index)}
              >
                <Hidden smDown>
                  {item}
                </Hidden>
                <Hidden mdUp>
                  {index === 1 ? 'GPs History' : item}
                </Hidden>
              </li>
            )
          })
        }
      </nav>

      <div className={styles.bodyPage}>
        {
          acitveTab === 0 && 
          <>
            <TierList 
              tiersBuyLimit={tiersBuyLimit}
              tiers={tiers}
              userTier={userTier}
              loading={loading}
              currentProcess={currentProcess}
              showMoreInfomation={showMoreInfomation}
              hideStatistics={hideStatistics}
            />
            {/* <ManageTier
              emailVerified={emailVerified}
              isKYC={isKYC}
            /> */}
            {/* <TierInfomation /> */}

            {/* <Link 
              className={styles.btnHow}
              target="_blank"
              href={`https://medium.com/polkafoundry/new-tier-policy-updates-for-red-kite-launchpad-2b8a1d0c1fac`}
              >
              <img className={styles.iconBtnHow} src="/images/account_v3/icons/icon_how.svg" alt="" />
              Learn more about GameFi Tiers
              <ChevronRightIcon className={styles.iconArrowRight} />
            </Link> */}
          </>
        }

        {
          acitveTab === 1 && 
          <>
            <PointHistory />

            <Link 
              className={styles.btnHow}
              target="_blank"
              href={`https://medium.com/polkafoundry/users-reputation-system-on-red-kite-feb4b4890df0`}>
              <img className={styles.iconBtnHow} src="/images/account_v3/icons/icon_how.svg" alt="" />
              Learn more about User’s Reputation System
              <ChevronRightIcon className={styles.iconArrowRight} />
            </Link>
          </>
        }

        { 
          acitveTab === 2 && 
          <TierBenefits />
        }
        
        
      </div>
    </div>
  );
};

export default withWidth()(Tiers);
