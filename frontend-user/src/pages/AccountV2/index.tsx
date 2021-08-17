import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { getBalance } from "../../store/actions/balance";
import {
  getUserTier,
  getRates,
} from "../../store/actions/sota-tiers";
import { getAllowance } from "../../store/actions/sota-token";
import Tiers from "./Tiers";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import AccountInformation from "./AccountInformation";
import ManageTier from "./ManageTier";
import useStyles from "./style";
import useAuth from "../../hooks/useAuth";
import useTokenDetails from "../../hooks/useTokenDetails";
import useFetch from "../../hooks/useFetch";
import TierInfomation from "./TierInfomation";
import { CONVERSION_RATE, USER_STATUS } from "../../constants";
import useUserTier from "../../hooks/useUserTier";
import { trimMiddlePartAddress } from "../../utils/accountAddress";
import {ChainId} from "../../constants/network";
import NftTicket from "./NftTicket";
import CardsTicket from "./NftTicket/Cards";

const TOKEN_ADDRESS = process.env.REACT_APP_PKF || "";
const TOKEN_UNI_ADDRESS = process.env.REACT_APP_UNI_LP || "";
const TOKEN_MANTRA_ADDRESS = process.env.REACT_APP_MANTRA_LP || "";

const iconWarning = "/images/warning-red.svg";
const iconClose = "/images/icons/close.svg";

const AccountV2 = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const { tokenDetails: tokenPKFDetails } = useTokenDetails(
    TOKEN_ADDRESS,
    "eth"
  );
  const { tokenDetails: tokenUniLPDetails } = useTokenDetails(
    TOKEN_UNI_ADDRESS,
    "eth"
  );
  const { tokenDetails: tokenMantraLPDetails } = useTokenDetails(
    TOKEN_MANTRA_ADDRESS,
    "eth"
  );
  const {
    data = {},
    loading,
  } = useFetch<any>(`/user/profile?wallet_address=${connectedAccount}`);

  const [emailVerified, setEmailVeryfied] = useState(0);
  const [email, setEmail] = useState<string>("");
  const [isKYC, setIsKYC] = useState(false);
  const [listTokenDetails, setListTokenDetails] = useState([]) as any;
  const [listTokenDetailsUnstaked, setListTokenDetailsUnstaked] = useState([]) as any;
  const { data: appChainID } = useSelector((state: any) => state.appNetwork)
  const [rates, setRates] = useState([]) as any;
  const { currentTier, totalStaked, totalUnstaked, total } = useUserTier(connectedAccount || '', 'eth')

  useEffect(() => {
    if (isAuth && connectedAccount && !wrongChain) {
      dispatch(getBalance(connectedAccount));
      dispatch(getUserTier(connectedAccount));
      dispatch(getAllowance(connectedAccount));
    }
  }, [isAuth, wrongChain, connectedAccount, dispatch]);

  useEffect(() => {
    setEmail("");
    setEmailVeryfied(USER_STATUS.UNVERIFIED);
    setIsKYC(false);
  }, [connectedAccount]);

  useEffect(() => {
    setListTokenDetails([tokenPKFDetails, tokenUniLPDetails]);
    setListTokenDetailsUnstaked([tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);
  }, [tokenPKFDetails, tokenUniLPDetails, tokenMantraLPDetails]);

  useEffect(() => {
    if (data && data.user && data.user) {
      setEmail(data.user.email);
      setEmailVeryfied(data.user.status);
      setIsKYC(data.user.is_kyc == 1 ? true : false);
    } else {
      setEmail("");
      setEmailVeryfied(USER_STATUS.UNVERIFIED);
      setIsKYC(false);
    }
  }, [data]);

  return (
    <DefaultLayout>
      <div className={classes.accountContainer}>
        {!isKYC && !loading && connectedAccount && (
          <div className={classes.alertVerifyEmail}>
            <img src={iconWarning} style={{ marginRight: "12px" }} alt="" />
            <span>
              The connected wallet address (
              {trimMiddlePartAddress(connectedAccount)}) is unverified.&nbsp;
              <a
                href="https://verify-with.blockpass.org/?clientId=red_kite_kyc_7a0e6&serviceName=Red%20Kite%20KYC&env=prod"
                target="_blank"
                rel="noreferrer"
              >
                Please sumbit KYC now
              </a>
              &nbsp;or switch to a verified address. Click{" "}
              <a
                href="https://medium.com/polkafoundry/what-to-do-before-joining-idos-on-red-kite-de9b0d778dbe"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>{" "}
              for more process details.
            </span>
          </div>
        )}

        {/* appChainID > KOVAN ID => Not Ethereum mainnet/testnet */}
        {(+appChainID?.appChainID > ChainId.KOVAN) && (
          <div className={`${classes.alertVerifyEmail} ${classes.errorSwich}`}>
            <img src={iconWarning} style={{ marginRight: "12px" }} alt="" />
            <span>Please switch to the ETH network to Stake/Unstake.</span>
          </div>
        )}
        <NftTicket />
        <CardsTicket />
        <AccountInformation
          classNamePrefix="account-infomation"
          balance={balance}
          userInfo={userInfo}
          tokenPKFDetails={tokenPKFDetails}
          email={email}
          emailVerified={emailVerified}
          setEmail={setEmail}
          setEmailVeryfied={setEmailVeryfied}
          isKYC={isKYC}
          kycStatus={data?.user?.is_kyc}
          userTier={currentTier}
        />
        <div className={classes.tier}>
          <Tiers
            showMoreInfomation={false}
            tokenSymbol={tokenPKFDetails?.symbol}
            userTier={currentTier}
            total={total}
            isKYC={isKYC}
          />
          <ManageTier
            listTokenDetails={listTokenDetails}
            emailVerified={emailVerified}
            totalUnstaked={totalUnstaked}
            total={total}
            appChainID={appChainID}
            isKYC={isKYC}
            connectedAccount={connectedAccount}
          />
          <TierInfomation />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default withRouter(AccountV2);
