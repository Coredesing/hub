import useStyles from './style';
const arrowRightIcon = '/images/icons/arrow-right.svg';
const arrowRightBlue = '/images/icons/arrow_right-blue.svg';

const BackgroundComponent = (props: any) => {
  const styles = useStyles();

  return (
    <div className={styles.backgroundComponent}>
      <div className={styles.mainContent}>
        <h1 className="title">Join <img src="/images/polkasmith.png" alt=""/> on Kusama <br/> Parachain Auction</h1>
        <p className="description">
          PolkaSmith is the one-stop production hub for DeFi and NFT dApps on Kusama. It aims to provide all the necessary features, services, integrations, and tools for all DeFi and NFT experiments, innovations, and real-world solutions. PolkaSmith is no newcomer but a canary network of PolkaFoundry on Kusama.
        </p>
        <div className={styles.info}>
          <div className={styles.infoDetail}>
            <p>Total Raise</p>
            <p>700,000 KSM</p>
          </div>
          <div className={styles.infoDetail}>
            <p>Min Contribute</p>
            <p>0.1 KSM</p>
          </div>
          <div className={styles.infoDetail}>
            <p>Max Contribute</p>
            <p>700,000 KSM</p>
          </div>
        </div>
        <div className={styles.buttonArea}>
          <a href="https://polkasmith.polkafoundry.com" target="_blank" className="btn btn-learn" rel="noreferrer">
            Learn more about PolkaSmith&nbsp;
            <img src={arrowRightBlue} alt=""/></a>
          <a href="https://redkite.polkafoundry.com/#/join-polkasmith" target="_blank" className="btn btn-crowdloan" rel="noreferrer">
            PolkaSmith Crowdloan&nbsp;
            <img src={arrowRightIcon} alt=""/>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BackgroundComponent;
