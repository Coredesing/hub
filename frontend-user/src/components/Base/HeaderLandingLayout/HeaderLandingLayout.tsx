import useStyles from './styles';

const logo = '/images/gamefi.png';
const ethIcon = '/images/icons/eth.svg';

const HeaderDefaultLayout = () => {
  const styles = useStyles();

  return (
    <>
      <div className={styles.navBar}>
        <div className="logo">
          <a href={"#/"}><img src={logo} alt="" /></a>
        </div>
        <nav className={styles.headerNav}>
          <ul className={styles.headerLinks}>
            <li className={styles.headerLink}><a href="#">Home</a></li>
            <li className={styles.headerLink}><a href="#">Token sales</a></li>
            <li className={styles.headerLink}><a href="#">Game Items Sales</a></li>
            <li className={styles.headerLink}><a href="#">Marketplace</a></li>
            <li className={styles.headerLink}><a href="#">Stake</a></li>
          </ul>
          <div className={styles.headerAccount}>
            <span className={styles.headerAccText}>My Account</span>
            <button className={styles.headerAccBtn}>
              <span className="logo-currency">
                <img src={ethIcon} alt="" />
              </span>
              <span className="balance">1.04263 ETH</span>
              <span className="address">0x49...e6c</span>
            </button>
          </div>
        </nav>
        {/*<div>
          <div className="pool">
            <a href="#/dashboard"><img src={BrightStartIcon} alt="" /></a>
            <a href="#/dashboard"><span>&nbsp;&nbsp;Pool</span></a>
          </div>
          <div className="logo">
            <a href={"#/"}><img src={logo} alt="" /></a>
          </div>
          <div className="connects">
            <a href="https://t.me/polkafoundry/" target="_blank"><i className="custom-icon-telegram"></i></a>
            <a href="https://twitter.com/polkafoundry/" target="_blank"><i className="custom-icon-twitter"></i></a>
             <a href="#"><i className="custom-icon-facebook"></i></a>
            <a href="#"><i className="custom-icon-github"></i></a> 
          </div>
        </div>
        */}
        {/*{showBanner && <div className={styles.banner}>*/}
        {/*  <img src="/images/icons/ring.svg" alt="red-warning icon" />*/}
        {/*  <img src={iconClose} onClick={() => setShowBanner(false)} className={styles.closeBtn}/>*/}
        {/*  <span className={styles.loginErrorBannerText}>*/}
        {/*  NFTify (N1) launches on 4 June.*/}
        {/*  &nbsp;&nbsp;<button*/}
        {/*    className={styles.btnChangeAppNetwork}*/}
        {/*    onClick={() => {window.open('#/buy-token/23', '_blank')}}*/}
        {/*  >*/}
        {/*    View Details*/}
        {/*  </button>*/}
        {/*  </span>*/}
        {/*</div>}*/}
      </div>
    </>
  );
};

export default HeaderDefaultLayout;
