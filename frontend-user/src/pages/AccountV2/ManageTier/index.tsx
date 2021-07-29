import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import useStyles from "./style";
import {getUserInfo, getWithdrawPercent} from "../../../store/actions/sota-tiers";
import useAuth from "../../../hooks/useAuth";
import { numberWithCommas } from "../../../utils/formatNumber";
import { USER_STATUS, CONVERSION_RATE } from "../../../constants";
import { ETH_CHAIN_ID } from "../../../constants/network";
import {getBalance} from "../../../store/actions/balance";

const ManageTier = (props: any) => {
  const history = useHistory();
  const styles = useStyles();
  const dispatch = useDispatch();

  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { connectedAccount, isAuth, wrongChain } = useAuth();
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;

  const {
    classNamePrefix = '',
    emailVerified,
    listTokenDetails,
    listTokenDetailsUnstaked,
    totalUnstaked,
    total,
    isKYC,
  } = props;

  useEffect(() => {
    dispatch(getWithdrawPercent());
    connectedAccount && dispatch(getUserInfo(connectedAccount))
    connectedAccount &&dispatch(getBalance(connectedAccount))
  }, [connectedAccount, dispatch]);

  const renderToken = (symbol: string, balance: any, staked: any) => {
    return (
      <div className="group">
        <span>{symbol}</span>
        <span>{numberWithCommas(balance || 0)}</span>
        <span>{numberWithCommas(staked || 0)}</span>
      </div>
    );
  };

  return (
    <div className={`${classNamePrefix}__component`}>
      <div className={styles.content}>
        <div className="button-area">
          <Button
            className={`${styles.btn} btnStake`}
            disabled={emailVerified === USER_STATUS.UNVERIFIED || wrongChain || !isAuth || ETH_CHAIN_ID !== appChainID || !isKYC}
            onClick={() => history.push("/stake")}
          >
            Stake
          </Button>

          <Button
            className={`${styles.btn} btnUnstake`}
            disabled={emailVerified === USER_STATUS.UNVERIFIED || wrongChain || !isAuth || ETH_CHAIN_ID !== appChainID}
            onClick={() => history.push("/unstake")}
          >
            Unstake
          </Button>
        </div>
        <div className={styles.walletBalance}>
          <div className={styles.tableHead}>
            <div className="group">
              <span>Currency</span>
              <span>Wallet Balance</span>
              <span>Staked</span>
            </div>
          </div>
          <div className={styles.tableBody}>
            {renderToken("PKF", balance?.pkf, userInfo?.pkfStaked)}
            {renderToken(CONVERSION_RATE[0]?.symbol, balance?.uni, userInfo?.uniStaked)}
            {/*{renderToken(CONVERSION_RATE[1]?.symbol, balance?.mantra, userInfo?.mantraStaked)}*/}
            {renderToken(CONVERSION_RATE[1]?.symbol, 0, userInfo?.ePkf)}
          </div>
        </div>
        {/* <p className={styles.balance}>
          {(wrongChain || !isAuth) && <AnimatedNumber
            value={0}
            formatValue={numberWithCommas}
          />}
          {!wrongChain && isAuth && <AnimatedNumber
            value={balance.token}
            formatValue={numberWithCommas}
          />}
          &nbsp;{tokenDetails?.symbol}
        </p> */}
      </div>
    </div>
  );
};

export default ManageTier;
