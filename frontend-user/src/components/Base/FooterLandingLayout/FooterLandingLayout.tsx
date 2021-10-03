import useStyles from './styles';
import Link from '@material-ui/core/Link';
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
            <Link href="https://t.me/GameFi_Official" target="_blank">
              <img src={telegramIcon} alt="" />
            </Link>
            <Link href="https://twitter.com/GameFi_Official" target="_blank">
              <img src={twitterIcon} alt="" />
            </Link>
          </div>
        </div>
        <div className={styles.navFooter}>
          <div className={styles.navLinks}>
            <h4>OUR TEAM</h4>
            <ul className="link">
              <li><Link href="https://gamefi.org/#features" target="_blank">Features</Link></li>
              <li><Link href="https://gamefi.org/#roadmap" target="_blank">Roadmap</Link></li>
              <li><Link href="https://gamefi.org/#ourteam" target="_blank">Our Team</Link></li>
              <li><Link href="https://gamefi.org/#advisors" target="_blank">Advisors</Link></li>
            </ul>
          </div>
          <div className={styles.navLinks}>
            <h4>TOKEN</h4>
            <ul className="link">
              <li><Link href="https://docsend.com/view/wg9czts7ugkvrp99" target="_blank">Token Metrics</Link></li>
              <li><Link href="https://docsend.com/view/wg9czts7ugkvrp99" target="_blank">Token Utilities</Link></li>
            </ul>
          </div>
          <div className={styles.navLinks}>
            <h4>Contact</h4>
            <ul className="link">
              <li><Link href="https://t.me/GameFi_Official" target="_blank">Contact Us</Link></li>
              <li><Link href="https://faq.gamefi.org/" target="_blank">Help Center</Link></li>
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
        <a className={styles.copyRight} href="https://icetea.io/">© Icetea Labs, 2021</a>
      </div>
      <div className={styles.btnToTop} onClick={scrollTop}>
        <img src={iconArrow} alt="" />
        <p>Back to Top</p>
      </div>
    </div>
  );
};

export default FooterLandingLayout;
