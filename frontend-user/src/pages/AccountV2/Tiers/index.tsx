import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link, Hidden } from '@material-ui/core';
import _ from 'lodash';
import { TIERS } from '../../../constants';
import useStyles from './style';
import useAuth from '../../../hooks/useAuth';
import withWidth from '@material-ui/core/withWidth';
import TierList from "../TierList";
// import ManageTier from "../ManageTier";
// import TierInfomation from "../TierInfomation";
import PointHistory from "../PointHistory";
import TierBenefits from "../TierBenefits";
import { useTabStyles } from '../style';
import { getTiers, getUserTier } from '../../../store/actions/sota-tiers';
import { numberWithCommas } from '../../../utils/formatNumber';

const tabMenu = ['Overview',
  // 'GameFi Power History', 'Tier Benefits'
];

const Tiers = (props: any) => {
  const dispatch = useDispatch();
  const styles = { ...useStyles(), ...useTabStyles() };
  const [loading, setLoading] = useState(true);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const [tabMyTier] = useState(tabMenu);
  const [acitveTab, setAcitveTab] = useState<Number>(0);
  const { data: userTier } = useSelector((state: any) => state.userTier);
  const { data: tiers } = useSelector((state: any) => state.tiers);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const {
    showMoreInfomation = false,
    tiersBuyLimit,
    tokenSymbol,
    total,
    hideStatistics,
    // emailVerified,
    // isKYC,
    // userInfo,
    // tiers,
    // totalRedKitePoints,
    // pointsLeftToNextTier,
  } = props;
  useEffect(() => {
    dispatch(getUserTier(!wrongChain && connectedAccount ? connectedAccount : ''));
  }, [wrongChain, connectedAccount, dispatch]);

  useEffect(() => {
    if (_.isEmpty(tiers)) {
      dispatch(getTiers());
    }
  }, [dispatch, tiers])

  const [currentProcess, setCurrentProcess] = useState(undefined) as any;
  const totalStaked = userInfo?.totalStaked || 0;
  const pointsLeftToNextTier = (() => {
    const lengTier = tiers?.length;
    if (!lengTier) return;
    if (userTier === lengTier - 1) {
      return 'NFT required'
    } else {
      return tiers?.[userTier] && tiers[userTier] > totalStaked ? tiers[userTier] - totalStaked : 0;
    }
  })();

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
  }, [tiers]);

  useEffect(() => {
    
    // if (showMoreInfomation && userTier) {
    //   setCurrentProcess(0);
    //   return;
    // }
    if(userInfo?.totalStaked <= 0) {
      return setCurrentProcess(0);
    }
    if (!showMoreInfomation && userInfo?.totalStaked) {
      let process = calculateProcess(tiers, userInfo?.totalStaked);
      setCurrentProcess(process);
    }
    
  }, [tiers, userInfo, showMoreInfomation, connectedAccount, isAuth, wrongChain, total])

  useEffect(() => {
    if (currentProcess !== undefined) setLoading(false)
  }, [currentProcess, userTier]);

  return (
    <div
      className={styles.tierComponent + (!loading ? ' active' : ' inactive') + (showMoreInfomation ? ' bg-none' : '')}
    >
      <h2 className={styles.tabTitle}> My Rank</h2>


      <ul className={styles.listInfo}>
        <li className={styles.itemInfo}>
          <div className={styles.nameItemInfo}>Current Rank</div>
          <div className={styles.valueItemInfo}>
            {
              connectedAccount ?
                <><img alt="" className={styles.iconUserTier} src={TIERS[userTier]?.icon} /> {TIERS[userTier]?.name}</>
                :
                ''
            }
          </div>
        </li>
        <li className={styles.itemInfo}>
          <div className={styles.nameItemInfo}>GAFI Staked</div>
          <div className={styles.valueItemInfo}>
            {connectedAccount ? numberWithCommas((userInfo?.totalStaked || 0) + '', 4) : ''}
          </div>
        </li>
        <li className={styles.itemInfo}>
          <div className={styles.nameItemInfo}>GAFI Left to next Rank</div>
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

      {/* <div className={styles.message}>
        <img src="/images/account_v3/icons/icon_notice.svg" alt="" />
        Total GameFi Power = Your Staked Amount + Σ GameFi Power you achieved
      </div> */}

      {tabMyTier.length > 1 &&
        <nav className={styles.menuTier}>
          {
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
      }
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
            {/* <div className={styles.infoRate}>
              <span>* </span>Conversion Rate : 1 GAFI - ETH LP <img src="/images/icons/direction.svg" alt="" /> 800 GameFi Power
            </div> */}
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
              Learn more about GameFi Ranks
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
