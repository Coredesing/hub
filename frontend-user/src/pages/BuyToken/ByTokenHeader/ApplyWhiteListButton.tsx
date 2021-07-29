import React from 'react';
import Button from "../Button";
import BigNumber from "bignumber.js";
import {BeatLoader} from "react-spinners";
import {useWeb3React} from "@web3-react/core";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {BSC_CHAIN_ID, ETH_CHAIN_ID, POLYGON_CHAIN_ID} from "../../../constants/network";
import {NETWORK_AVAILABLE, PUBLIC_WINNER_STATUS} from "../../../constants";

function ApplyWhiteListButton(props: any) {
  const today = new Date();
  const {
    poolDetails,
    joinTimeInDate,
    endJoinTimeInDate,
    currentUserTier,
    connectedAccount,
    wrongChain,
    verifiedEmail,
    disableAllButton,

    alreadyJoinPool,
    joinPoolSuccess,
    poolJoinLoading,
    joinPool,
    isKYC,
    winnersList,
    ableToFetchFromBlockchain,
  } = props;

  const availableJoin = poolDetails?.method === 'whitelist' && joinTimeInDate && endJoinTimeInDate
    ? (
      today >= joinTimeInDate &&
      today <= endJoinTimeInDate &&
      currentUserTier &&
      connectedAccount &&
      !wrongChain &&
      new BigNumber(currentUserTier?.level || 0).gte(poolDetails?.minTier)
      && verifiedEmail
      && isKYC
    )
    : false;

  const { appChainID } = useTypedSelector((state: any) => state.appNetwork).data;
  const appNetwork = (()=>{
    switch (appChainID) {
      case BSC_CHAIN_ID:
        return NETWORK_AVAILABLE.BSC;
      case POLYGON_CHAIN_ID:
        return NETWORK_AVAILABLE.POLYGON;
      case ETH_CHAIN_ID:
      default:
        return NETWORK_AVAILABLE.ETH;
    }
  })();
  const matchNetwork = appNetwork == poolDetails.networkAvailable;
  const disableButton = (!availableJoin || alreadyJoinPool || joinPoolSuccess || disableAllButton || !matchNetwork);
  const readyJoin = alreadyJoinPool || joinPoolSuccess;

  const hideButton =
    ableToFetchFromBlockchain
    && verifiedEmail
    && (winnersList && winnersList.total > 0)
    && (poolDetails?.publicWinnerStatus == PUBLIC_WINNER_STATUS.PUBLIC);
  if (hideButton) {
    return <></>;
  }

  return (
    <>
      <Button
        text={readyJoin ? 'Applied Whitelist' : 'Apply Whitelist'}
        backgroundColor={readyJoin ? '#3232DC' : '#D01F36'}
        style={{
          width: 200,
          height: 42,
          backgroundColor: `${readyJoin ? '#3232DC' : '#D01F36'}`,
          borderRadius: 60,
          color: 'white',
          border: 'none',
          marginTop: 16,
          padding: 10,
          fontSize: 16,
          lineHeight: '24px',
          fontWeight: 500,
        }}
        loading={poolJoinLoading}
        onClick={joinPool}
        disabled={disableButton}
      />
    </>
  );
}

export default ApplyWhiteListButton;
