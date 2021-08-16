import useStyles from './styles';
import { Link } from 'react-router-dom';
import DefaultLayout from "../../Layout/DefaultLayout";
const byTokenLogo = '/images/logo-red-kite.svg';
const iconArrow = "/images/icons/arrow_up-white.svg"
const telegramIcon = '/images/icons/telegram-2.svg';
const twitterIcon = '/images/icons/twitter-2.svg';
const logoPage = '/images/gamefi.png';

const FooterLandingLayout = () => {
  const styles = useStyles();

  function scrollTop() {
    window.scroll({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.aboutPage}>
          <div className="img">
            <img src={logoPage} alt="" />
          </div>
          <p>
            From the labs behind Red Kite launchpad and several NFT games
          </p>
          <div className="socials">
            <a href="/">
              <img src={telegramIcon} alt="" />
            </a>
            <a href="/">
              <img src={twitterIcon} alt="" />
            </a>
          </div>
        </div>
        <div className={styles.navFooter}>
          <div className={styles.navLinks}>
            <h4>OUR TEAM</h4>
            <ul className="link">
              <li><a href="/">Features</a></li>
              <li><a href="/">Roadmap</a></li>
              <li><a href="/">Our Team</a></li>
              <li><a href="/">Advisors</a></li>
            </ul>
          </div>
          <div className={styles.navLinks}>
            <h4>TOKEN</h4>
            <ul className="link">
              <li><a href="/">Token Metrics</a></li>
              <li><a href="/">Token Utilities</a></li>
            </ul>
          </div>
          <div className={styles.navLinks}>
            <h4>Contact</h4>
            <ul className="link">
              <li><a href="/">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className={styles.subContent}>
        <a href='https://redkite.polkafoundry.com/#/terms' target='_blank'>Terms of Service</a>
        <a href='https://redkite.polkafoundry.com/#/privacy' target='_blank'>Privacy Policy</a>
        <a href='mailto:support@polkafoundry.com'>support@polkafoundry.com</a>
      </div> */}
      <div className={styles.endContent}>
        <p className={styles.copyRight}>© Icetea Labs, 2021</p>
      </div>
      <div className={styles.btnToTop} onClick={scrollTop}>
        <img src={iconArrow} alt="" />
        <p>Back to Top</p>
      </div>
    </div>
  );
};

export default FooterLandingLayout;
