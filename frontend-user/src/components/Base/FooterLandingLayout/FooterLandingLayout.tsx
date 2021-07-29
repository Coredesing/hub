import useStyles from './styles';
import { Link } from 'react-router-dom';
import DefaultLayout from "../../Layout/DefaultLayout";
const byTokenLogo = '/images/logo-red-kite.svg';
const iconArrow = "/images/icons/arrow_up-white.svg"

const FooterLandingLayout = () => {
  const styles = useStyles();

  function scrollTop () {
    window.scroll({ top: 0, behavior: 'smooth'})
  }

  return (
    <div className={styles.footer}>
      <div className={styles.mainContent}>
        <div className={styles.infoRedKite}>
          <Link to={'/'}>
            <img className={styles.logo} src={byTokenLogo} alt="" />
          </Link>
          <p>Launch hand-picked projects and help them shine.</p>
          <ul className={styles.shareLink}>
            <li className={styles.teleGram}>
              <a href="https://t.me/polkafoundry/" target="_blank"><i className="custom-icon-telegram"></i></a>
            </li>
            <li className={styles.twitter}>
              <a href="https://twitter.com/polkafoundry/" target="_blank"><i className="custom-icon-twitter"></i></a>
            </li>
            {/* <li className={styles.facebook}>
              <a href="#"><i className="custom-icon-facebook"></i></a>
            </li>
            <li className={styles.github}>
              <a href="#"><i className="custom-icon-github"></i></a>
            </li> */}
          </ul>
        </div>
      </div>
      <div className={styles.subContent}>
        <a href='https://redkite.polkafoundry.com/#/terms' target='_blank'>Terms of Service</a>
        <a href='https://redkite.polkafoundry.com/#/privacy' target='_blank'>Privacy Policy</a>
        <a href='mailto:support@polkafoundry.com'>support@polkafoundry.com</a>
      </div>
      <div className={styles.endContent}>
        <p className={styles.copyRight}>Copyright © 2021 Icetea Labs. All rights reserved.</p>
      </div>
      <div className={styles.btnToTop} onClick={scrollTop}>
        <img src={iconArrow}/>
        <p>Back to Top</p>
      </div>
    </div>
  );
};

export default FooterLandingLayout;
