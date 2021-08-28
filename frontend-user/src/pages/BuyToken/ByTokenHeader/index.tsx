import { FC, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import usePoolJoinAction from '../hooks/usePoolJoinAction';
import Button from '../Button';
import { getEtherscanTransactionAddress } from "../../../utils/network";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID } from '../../../constants/network';
import useStyles from "./styles";
import { Hidden } from "@material-ui/core";

const poolImage = "/images/pool_circle.svg";
const copyImage = "/images/copy.svg";

type Props = {
  poolDetailsMapping: any;
  poolDetails: any;
};

const HeaderByToken: FC<Props> = ({ poolDetailsMapping, poolDetails }) => {
  const styles = useStyles();
  // const [copiedAddress, setCopiedAddress] = useState(false);
  const navHeader = useState(poolDetailsMapping);
  const [disableAllButton, setDisableAllButton] = useState<boolean>(false);

  const { appChainID } = useTypedSelector(state => state.appNetwork).data;


  useEffect(() => {
    let appNetwork;
    switch (appChainID) {
      case BSC_CHAIN_ID:
        appNetwork = 'bsc';
        break;
      case POLYGON_CHAIN_ID:
        appNetwork = 'polygon';
        break;
      case ETH_CHAIN_ID:
        appNetwork = 'eth';
        break;
    }
    
    setDisableAllButton(appNetwork !== poolDetails?.networkAvailable);
  }, [appChainID, poolDetails])
  

  var currentTime = new Date();
  var eventEndTime = new Date(Number(poolDetails?.startBuyTime) * 1000);
  var duration = eventEndTime.valueOf() - currentTime.valueOf();
  var durationShow = Math.ceil(duration / (1000 * 60 * 60 * 24));

  // console.log('durationShow', durationShow)

  return (
  <>
    {/*<section className={styles.headerComponent}>*/}

      <div className={`${styles.top}`} >
        <img
          className={styles.iconToken}
          src={poolDetails?.banner || poolImage}
          alt=""
        />
        <h2 className={styles.title}>{poolDetails?.title}</h2>
      </div>

      {/* {poolDetails?.tokenDetails?.address && (
        <div className={styles.address}>
          <a
            target="_blank"
            href={getEtherscanTransactionAddress({
              appChainID: poolDetails?.networkAvailable,
              address: poolDetails?.tokenDetails?.address,
            })}
            rel="noreferrer"
          >
            {poolDetails?.tokenDetails?.address.slice(0, 9)}...
            {poolDetails?.tokenDetails?.address.slice(-8)}
          </a>

          <CopyToClipboard
            text={poolDetails?.tokenDetails?.address}
            onCopy={() => {
              setCopiedAddress(true);
              setTimeout(() => {
                setCopiedAddress(false);
              }, 2000);
            }}
          >
            {!copiedAddress ? (
              <img src={copyImage} alt="copy-icon" />
            ) : (
              <p style={{ color: "#72F34B", marginLeft: 10 }}>Copied</p>
            )}
          </CopyToClipboard>
        </div>
      )} */}

      <ul className={styles.navHeaderComponent}>
        <li className={styles.item}>
          <img
            className={styles.iconItem}
            src={`${navHeader[0]?.deposited?.image}`}
            alt=""
          />
          {navHeader[0]?.deposited?.display}
        </li>

        <Hidden smDown>
          <li className={styles.item}>
            <img
              className={styles.iconItem}
              src={`${navHeader[0]?.minTier?.image}`}
              alt=""
            />
            {navHeader[0]?.minTier?.display}
            &nbsp;at Min Tier
          </li>

          <li className={styles.item}>
            <img
              className={styles.iconItem}
              src={poolDetails?.networkIcon}
              alt=""
            />
            {
              {
                'eth': 'Ethereum',
                'bsc': 'Binance Smart Chain',
                'polygon': 'Polygon',
              }[`${poolDetails?.networkAvailable}`] || 'Ethereum'
            }
            {/* {poolDetails?.networkAvailable === 'eth' ? 'Ethereum' : 'Binance Smart Chain'} */}
          </li>
        </Hidden>
        
        <Hidden mdUp>
          <li className={styles.item}>
            <img
              className={styles.iconItem}
              src={poolDetails?.networkIcon}
              alt=""
            />
            {
              {
                'eth': 'Ethereum',
                'bsc': 'Binance Smart Chain',
                'polygon': 'Polygon',
              }[`${poolDetails?.networkAvailable}`] || 'Ethereum'
            }
          </li>
          <li className={styles.item}>
            <img
              className={styles.iconItem}
              src={`${navHeader[0]?.minTier?.image}`}
              alt=""
            />
            {navHeader[0]?.minTier?.display}
            &nbsp;at Min Tier
          </li>
        </Hidden>

        {durationShow > 1 && (
          <li className={styles.item}>
            <img
              className={styles.iconItem}
              src="/images/icons/icon_launching.svg"
              alt=""
            />
            Launching in {durationShow} day
          </li>
        )}
      </ul>

    {/*</section>*/}
  </>
  );
};

export default HeaderByToken;
