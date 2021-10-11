import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Backdrop, CircularProgress } from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { getBalance } from "../../store/actions/balance";
import {
  getUserTier,
  // getTiers,
  getUserInfo,
} from "@store/actions/sota-tiers";
import { getAllowance } from "../../store/actions/sota-token";
import Tiers from "./Tiers";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import AccountInformation from "./AccountInformation";
import useStyles from "./style";
import useAuth from "../../hooks/useAuth";
// import useTokenDetails from "../../hooks/useTokenDetails";
// import useFetch from "../../hooks/useFetch";
import { USER_STATUS } from "../../constants";
// import useUserTier from "../../hooks/useUserTier";
// import { trimMiddlePartAddress } from "../../utils/accountAddress";
import { ChainId } from "../../constants/network";
// import NftTicket from "./NftTicket";
import CardsTicket from "./NftTicket/Cards";
import NeedHelp from "./NeedHelp";
import IdoPools from "./IdoPools";
import axios from '../../services/axios';
// import { numberWithCommas } from '../../utils/formatNumber';
import { AlertKYC } from "../../components/Base/AlertKYC";
import { WrapperAlert } from "../../components/Base/WrapperAlert";
import { MenuLeft } from "./constants";
import clsx from 'clsx';
import IdoPoolProvider from "./context/IdoPoolProvider";
import _ from 'lodash';

// const TOKEN_ADDRESS = process.env.REACT_APP_PKF || "";
// const TOKEN_UNI_ADDRESS = process.env.REACT_APP_UNI_LP || "";
// const TOKEN_MANTRA_ADDRESS = process.env.REACT_APP_MANTRA_LP || "";

// const iconWarning = "/images/warning-red.svg";

const AccountV2 = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data: balance = {} } = useSelector((state: any) => state.balance);
 
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  // const [loadingGetHistory, setLoadingGetHistory] = useState(false);

  // const { tokenDetails: tokenPKFDetails } = useTokenDetails(
  //   TOKEN_ADDRESS,
  //   "eth"
  // );

  // const { tokenDetails: tokenUniLPDetails } = useTokenDetails(
  //   TOKEN_UNI_ADDRESS,
  //   "eth"
  // );
  // const { tokenDetails: tokenMantraLPDetails } = useTokenDetails(
  //   TOKEN_MANTRA_ADDRESS,
  //   "eth"
  // );
  const query = new URLSearchParams(props.location.search);
  const currentTab = query.get('tab') as string;
  const currentTabMenu = MenuLeft[currentTab] || MenuLeft.profile;
  const [emailVerified, setEmailVeryfied] = useState(USER_STATUS.ACTIVE);
  const [isKYC, setIsKYC] = useState(true);
  // const [listTokenDetails, setListTokenDetails] = useState([]) as any;
  const { data: appChainID } = useSelector((state: any) => state.appNetwork)
  // const { currentTier, totalUnstaked, total } = useUserTier(connectedAccount || '', 'eth');
  const [tabAccount] = useState(Object.values(MenuLeft));
  const [activeMenuAccount, setActiveMenuAccount] = useState(currentTabMenu.key);
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  // const [dataHistories, setDataHistories] = useState({}) as any;
  // const { data: tiers = {} } = useSelector((state: any) => state.tiers);
  const { data: userTier } = useSelector((state: any) => state.userTier);
  // const { data: userInfo } = useSelector((state: any) => state.userInfo);
  const [userProfile, setUserProfile] = useState<{ [k in string]: any }>({});
  const [loadingUserProfile, setRenewUserProfile] = useState(false);
  useEffect(() => {
    dispatch(getUserTier(!wrongChain && connectedAccount ? connectedAccount : ''));
  }, [wrongChain, connectedAccount, dispatch]);

  useEffect(() => {
    setRenewUserProfile(!!connectedAccount);
  }, [connectedAccount]);
  useEffect(() => {
    if (!connectedAccount) {
      setUserProfile({});
      setIsKYC(false);
      setEmailVeryfied(USER_STATUS.UNVERIFIED);
      return;
    }
    if (loadingUserProfile && connectedAccount) {
      axios.get(`/user/profile?wallet_address=${connectedAccount}`)
        .then((res) => {
          const user = res.data.data?.user || {};
          setUserProfile({
            ...user,
          });
          setIsKYC(user.is_kyc === 1);
          setEmailVeryfied(user.status);
        }).catch(() => {
          setUserProfile({});
          setIsKYC(false);
          setEmailVeryfied(USER_STATUS.UNVERIFIED);
        }).finally(() => {
          setRenewUserProfile(false);
        })
    }
  }, [connectedAccount, loadingUserProfile]);

  useEffect(() => {
    if (isAuth && connectedAccount && !wrongChain) {
      dispatch(getBalance(connectedAccount));
      dispatch(getAllowance(connectedAccount));
    }
  }, [isAuth, wrongChain, connectedAccount, dispatch]);

  // useEffect(() => {
  //   setListTokenDetails([tokenPKFDetails, tokenUniLPDetails]);
  // }, [tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);

  useEffect(() => {
    setUpdatedSuccess(false);
  }, [activeMenuAccount]);



  const selectTab = (name: any) => {
    setActiveMenuAccount(name)
    props.history.push('/account?tab=' + name)
  }

  // useEffect(() => {
  //   const getUserHistory = async () => {
  //     setLoadingGetHistory(true);
  //     const response = await axios.get(`/reputation/histories/${connectedAccount}?hideZeroTx=flase&page=1&limit=10`);

  //     if (response.data) {
  //       setLoadingGetHistory(false);
  //       if (response.data.status === 200) {
  //         setDataHistories(response?.data?.data);
  //       }

  //       if (response.data.status !== 200) {
  //         setDataHistories({});
  //       }
  //     }
  //   };
  //   connectedAccount ? getUserHistory() : setDataHistories({});
  // }, [connectedAccount]);


  // useEffect(() => {
  //   connectedAccount && dispatch(getUserInfo(connectedAccount));
  // }, [connectedAccount, dispatch]);


  return (
    <DefaultLayout isKYC={isKYC}>
      <div className={classes.accountContainer}>
        {/* {
          !isKYC && !loadingUserProfile && connectedAccount && <AlertKYC connectedAccount={connectedAccount} className={classes.kycAlert} />
        } */}

        {/* appChainID > KOVAN ID => Not Ethereum mainnet/testnet */}
        {/* {(+appChainID?.appChainID > ChainId.KOVAN) && isKYC && activeMenuAccount === 'My Tier' && (
          <WrapperAlert type='error'>
            <span>Please switch to the ETH network to Stake/Unstake</span>
          </WrapperAlert>
        )} */}


        {updatedSuccess &&
          <div className={classes.messageUpdateSuccess}>
            <img src="/images/account_v3/icons/icon_updated_success.svg" alt="" />
            Your profile has been updated successfully
          </div>
        }

        {/* {cancelWhitelistSuccess &&
          <div className={classes.messageUpdateSuccess}>
            <img src="/images/account_v3/icons/icon_updated_success.svg" alt="" />
            You have successfully cancelled your whitelist application.
          </div>
        } */}

        <div className={classes.bodyContentMyAccount}>
          <div className={classes.leftAccount}>
            <div className={classes.titlLeft}>My Account</div>
            <nav className={classes.tabAccount}>
              {
                tabAccount.map((item, index) => {
                  if(item.key === MenuLeft.ticket.key && userTier < 3) return null;
                  return (
                    <li
                      className={clsx(classes.itemTabAccount, {
                        active: activeMenuAccount === item.key
                      })}
                      key={index}
                      onClick={() => selectTab(item.key)}
                    >
                      <div
                        className={clsx(classes.iconItemTabAccount, {
                          active: activeMenuAccount === item.key
                        })}
                        style={{
                          WebkitMaskImage: `url(${item.icon})`,
                          maskImage: `url(${item.icon})`,
                        }}></div>
                      {item.name}
                    </li>
                  )
                })
              }
            </nav>
          </div>

          <div className={classes.rightAccount}>
            {activeMenuAccount === MenuLeft.profile.key && !loadingUserProfile &&
              <AccountInformation
                notEth={(+appChainID?.appChainID > ChainId.KOVAN)}
                classNamePrefix="account-infomation"
                balance={balance}
                // userInfo={userInfo}
                // tokenPKFDetails={tokenPKFDetails}
                email={userProfile.email}
                twitter={userProfile.user_twitter}
                telegram={userProfile.user_telegram}
                emailVerified={emailVerified}
                // setEmail={setEmail}
                // setEmailVeryfied={setEmailVeryfied}
                isKYC={isKYC}
                kycStatus={userProfile.is_kyc}
                setUpdatedSuccess={setUpdatedSuccess}
                setRenewUserProfile={setRenewUserProfile}
              />
            }

            {activeMenuAccount === MenuLeft.rank.key &&
              <div className={classes.tier}>
                <Tiers
                  showMoreInfomation={false}
                  // tokenSymbol={tokenPKFDetails?.symbol}
                  // total={total}
                  isKYC={isKYC}
                  // tiers={tiers}
                  // userInfo={userInfo}
                  // userTier={userTier}
                  emailVerified={emailVerified}
                  connectedAccount={connectedAccount}
                // dataHistories={dataHistories}
                // totalRedKitePoints={totalRedKitePoints}
                // pointsLeftToNextTier={pointsLeftToNextTier}
                />
              </div>
            }
            <IdoPoolProvider>
              {activeMenuAccount === MenuLeft.pool.key && <IdoPools />}
            </IdoPoolProvider>
            {activeMenuAccount === MenuLeft.ticket.key && userTier > 3 && <>
              {/* <NftTicket /> */}
              <CardsTicket />
            </>}

            {
              activeMenuAccount === MenuLeft.help.key &&
              <NeedHelp />
            }

          </div>
        </div>
      </div>

      <Backdrop open={/*loadingGetHistory ||*/ loadingUserProfile} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </DefaultLayout>
  );
};

export default withRouter(AccountV2);
