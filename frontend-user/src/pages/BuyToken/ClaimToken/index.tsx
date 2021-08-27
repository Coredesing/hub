import React, {useEffect, useState} from "react";
import {useWeb3React} from "@web3-react/core";
import Button from "../Button";
import TransactionSubmitModal from "../../../components/Base/TransactionSubmitModal";
import useStyles from "./style";

import {TokenType} from "../../../hooks/useTokenDetails";
import useUserRemainTokensClaim from "../hooks/useUserRemainTokensClaim";
import useTokenClaim from "../hooks/useTokenClaim";
import {buildMomentTimezone, convertTimeToStringFormat, convertTimeToStringFormatWithoutGMT} from "../../../utils/convertDate";
import {numberWithCommas} from "../../../utils/formatNumber";
import {useDispatch} from "react-redux";
import {alertFailure} from "../../../store/actions/alert";
import ClaimInfo from "./ClaimInfo";
import useDetectClaimConfigApplying from "../hooks/useDetectClaimConfigApplying";
import BigNumber from "bignumber.js";
import {updateUserClaimInfo} from "../../../store/actions/claim-user-info";
import {Tooltip} from "@material-ui/core";
import withWidth, {isWidthDown} from "@material-ui/core/withWidth";

type ClaimTokenProps = {
  releaseTime: Date | undefined;
  tokenDetails: TokenType | undefined;
  poolAddress: string | undefined;
  ableToFetchFromBlockchain: boolean | undefined;
  buyTokenSuccess: boolean | undefined;
  poolId: number | undefined;
  disableAllButton: boolean;
  poolDetails: any;
  currencyName: any,
  startBuyTimeInDate: any;
  width: any,
  isKyc?: boolean,
};

const tickIcon = "/images/icons/tick_claim.svg";

const ClaimToken: React.FC<ClaimTokenProps> = (props: ClaimTokenProps) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [openClaimModal, setOpenClaimModal] = useState<boolean>(false);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [userClaimInfo, setUserClaimInfo] = useState<any>();

  const { account: connectedAccount } = useWeb3React();
  const {
    releaseTime,
    poolDetails,
    tokenDetails,
    poolAddress,
    poolId,
    ableToFetchFromBlockchain,
    buyTokenSuccess,
    disableAllButton,
    currencyName,
    startBuyTimeInDate,
    isKyc,
  } = props;

  const nowTime = new Date();
  const nowTimeUnix = new Date().getTime();
  const {
    claimToken,
    setClaimTokenLoading,
    transactionHash,
    claimTokenSuccess,
    loading,
    error,
  } = useTokenClaim(poolAddress, poolId);
  const { retrieveClaimableTokens } = useUserRemainTokensClaim(
    tokenDetails,
    poolAddress,
    poolDetails?.networkAvailable || poolDetails?.network_available
  );
  const availableClaim = releaseTime ? nowTime >= releaseTime : false;

  useEffect(() => {
    const fetchUserPurchased = async () => {
      if (connectedAccount && poolAddress) {
        const userClaimInformations = await retrieveClaimableTokens(connectedAccount, poolAddress);
        // console.log("userClaimInformations", userClaimInformations);
        dispatch(updateUserClaimInfo(userClaimInformations));
        setUserClaimInfo(userClaimInformations);
        setUserPurchased(
          (userClaimInformations?.userPurchasedReturn || 0) as number
        );
      }
    };

    fetchUserPurchased();
  }, [
    connectedAccount,
    poolAddress,
    claimTokenSuccess,
    buyTokenSuccess,
  ]);

  useEffect(() => {
    if (error) {
      setOpenClaimModal(false);
      setClaimTokenLoading(false);
    }
  }, [error]);

  const userPurchasedValue = userClaimInfo?.userPurchased || 0;
  const userClaimed = userClaimInfo?.userClaimed || 0;
  const {
    currentClaim,
    currentClaimIndex,
    nextClaim,
    nextClaimIndex,
    maximumTokenClaimUtilNow,
  } = useDetectClaimConfigApplying(
    poolDetails,
    userPurchasedValue,
    userClaimed
  );

  const validateClaimable = () => {
    if (new BigNumber(userPurchased).lte(0)) {
      dispatch(alertFailure("You not enough claimable token!"));
      return false;
    }

    if (!availableClaim) {
      dispatch(alertFailure("You can not claim token at current time!"));
      return false;
    }

    if (nextClaim && new BigNumber(maximumTokenClaimUtilNow).lte(0)) {
      dispatch(alertFailure("Please wait until the next milestone to claim the tokens."));
      return false;
    }

    if (
      !nextClaim &&
      new BigNumber(maximumTokenClaimUtilNow).lte(0) // maximumTokenClaimUtilNow <= 0
    ) {
      dispatch(alertFailure("You not enough claimable token!"));
      return false;
    }

    if (disableAllButton) {
      dispatch(alertFailure("Please switch to correct network before Claim!"));
      return false;
    }
    return true;
  };

  const handleTokenClaim = async () => {
    if (!validateClaimable()) {
      return;
    }
    try {
      setOpenClaimModal(true);
      await claimToken();
    } catch (err) {
      setOpenClaimModal(false);
    }
  };

  const [progress, setProgress] = useState([
    {},
    { percent: 100, marked: true, tokenAmount: 10000, date: new Date(), showInfo: true },
  ]);

  const [policy, setPolicy] = useState("");

  useEffect(() => {
    //calculate progress
    const userPurchased = userClaimInfo?.userPurchased || 0;
    const userClaimed = userClaimInfo?.userClaimed || 0;
    const percentClaimed = (userClaimed / userPurchased) * 100;
    let lastMaxPercent = 0;
    let nextClaim = poolDetails.campaignClaimConfig.reduce((next: number, cfg: any) => {
      return (+cfg.max_percent_claim <= percentClaimed) ? next + 1 : next
    }, 0);
    const config = poolDetails.campaignClaimConfig.map((cfg: any, index: number) => {
      let percent = +cfg.max_percent_claim - lastMaxPercent,
        tokenAmount = (percent / 100) * userPurchased,
        date = new Date(cfg.start_time * 1000),
        marked = +cfg.max_percent_claim <= percentClaimed,
        showInfo = index === 0 || index === poolDetails.campaignClaimConfig.length - 1 || index === nextClaim;
      lastMaxPercent = +cfg.max_percent_claim;
      return { percent, tokenAmount, date, marked, showInfo };
    });
    if (config.length === 1) {
      if (userClaimed > 0) {
        config.unshift({ marked: true });
      } else {
        config.unshift({});
      }
    } //add 0% start for only 1 time claim
    setProgress(config);
    //calculate policy
    //TODO: get policy from backend
    let policy =
      poolDetails?.claimPolicy ||
      "You can claim all tokens after " +
        convertTimeToStringFormat(
          new Date(
            poolDetails.campaignClaimConfig[
              poolDetails.campaignClaimConfig?.length - 1
            ]?.start_time * 1000
          )
        );
    setPolicy(policy);
  }, [poolDetails, userClaimInfo]);

  if (!startBuyTimeInDate || (nowTime < startBuyTimeInDate)) {
    return <></>;
  }

  return (
    <div className={styles.poolDetailClaim}>
      <div className={styles.poolDetailClaimTitle}>Token Claim</div>

      {/*<div className={styles.poolDetailClaimInfo}>*/}
      {/*  <div className={styles.poolDetailClaimInfoBlock}>*/}
      {/*    <span>You can claim</span>*/}
      {/*    <span>{numberWithCommas(`${userPurchased}`)} {tokenDetails?.symbol}</span>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <ClaimInfo
        poolDetails={poolDetails}
        tokenDetails={tokenDetails}
        userClaimInfo={userClaimInfo}
        releaseTime={releaseTime}
        currentClaim={currentClaim}
        currentClaimIndex={currentClaimIndex}
        nextClaim={nextClaim}
        nextClaimIndex={nextClaimIndex}
        maximumTokenClaimUtilNow={maximumTokenClaimUtilNow}
        policy={policy}
        currencyName={currencyName}
      />

      <ul className={styles.poolDetailClaimProgress}>
        <li className={`first-item ${progress[0]?.marked ? "active" : ""}`}>
          <div className="mark">
            {progress[0]?.marked && <img src={tickIcon} alt=""/>}
          </div>
          <div className="info">
            <div>
              {progress[0]?.percent || 0}%&nbsp;
              {(progress[0]?.tokenAmount || progress[0]?.tokenAmount === 0)  && (
                <span>
                  ({numberWithCommas(`${progress[0].tokenAmount}`, 1)}{" "}
                  {tokenDetails?.symbol})
                </span>
              )}
            </div>
            {progress[0]?.date && (
              <div>{buildMomentTimezone(progress[0].date).format('h:mm A, DD/MM/YYYY')}</div>
            )}
          </div>
        </li>
        {progress.slice(1, progress.length).map((item, index) => {
          return (
            <li key={index}
                className={`item ${item.marked || (index === 0 && progress[0].marked) ? "active" : ""} ${progress.length === 2 ? "solo" : (index === progress.length-2) ? "last-item" : ""}`}>
              <div className="mark">
                {item.marked && <img src={tickIcon} alt="" />}
              </div>
              <div className={`info ${item.showInfo && !isWidthDown('xs', props.width) && progress.length > 2 ? "show" : ""}`}>
                {item.showInfo || isWidthDown('xs', props.width) ?
                  <>
                    <div>
                      {numberWithCommas((item?.percent + ''), 1)}% ({numberWithCommas(`${item?.tokenAmount + ''}`, 1)}{" "}
                      {tokenDetails?.symbol})
                    </div>
                    <div>
                      {item.date && convertTimeToStringFormatWithoutGMT(item.date)}
                    </div>
                  </>
                  :
                  <Tooltip title={<div>
                                    <p>{numberWithCommas(''+item.tokenAmount)} {tokenDetails?.symbol}</p>
                                    <p>{item.date && convertTimeToStringFormatWithoutGMT(item.date)}</p>
                                  </div>}>
                    <div>{numberWithCommas((item?.percent + ''), 1)}%</div>
                  </Tooltip>
                }
              </div>
            </li>
          );
        })}
      </ul>

      <Button
        style={{ marginTop: 8 }}
        text={"Claim Tokens"}
        backgroundColor={"#72F34B"}
        disabled={!availableClaim || userPurchased <= 0 || disableAllButton || !isKyc}
        // disabled={disableAllButton || !ableToFetchFromBlockchain} // If network is not correct, disable Claim Button
        loading={loading}
        onClick={isKyc ? handleTokenClaim : undefined}
      />

      <TransactionSubmitModal
        opened={openClaimModal}
        handleClose={() => {
          setOpenClaimModal(false);
          setClaimTokenLoading(false);
        }}
        transactionHash={transactionHash}
        networkAvailable={poolDetails?.networkAvailable}
      />
    </div>
  );
};

export default withWidth()(ClaimToken);
