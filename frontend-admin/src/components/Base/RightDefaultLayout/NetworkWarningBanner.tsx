import React from 'react';
import useStyles from './styles';
import {useSelector} from "react-redux";
import {
  ACCEPT_NETWORKS,
  APP_NETWORK_NAMES,
  CHAIN_ID_NAME_MAPPING,
  NETWORK_BSC_NAME,
  NETWORK_ETH_NAME,
  NETWORK_POLYGON_NAME,
} from "../../../constants";

const NetworkWarningBanner: React.FC<any> = (props: any) => {
  const styles = useStyles();
  const { userCurrentNetwork } = useSelector((state: any) => state);
  const currentNetworkId = userCurrentNetwork?.currentNetworkId;
  console.log('currentNetworkId: ', currentNetworkId);
  // console.log('APP_NETWORK_NAMES', APP_NETWORK_NAMES, currentNetworkId);

  if (currentNetworkId === '') return null;
  if (Object.values(ACCEPT_NETWORKS).includes(currentNetworkId)) {
    return null;
  }

  return (
    <>
      <div className={styles.loginErrorBanner}>
        <img src="/images/red-warning.svg" alt="red-warning icon" />
        <span className={styles.loginErrorBannerText}>
          Please change to correct network
          (Accepted networks: {NETWORK_ETH_NAME} and {NETWORK_BSC_NAME} and {NETWORK_POLYGON_NAME}).
          {' '}
          Current Network: {CHAIN_ID_NAME_MAPPING[currentNetworkId]} ({currentNetworkId})
        </span>
      </div>
    </>
  );
};

export default NetworkWarningBanner;
