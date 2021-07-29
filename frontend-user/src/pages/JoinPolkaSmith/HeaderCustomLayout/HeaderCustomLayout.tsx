import useStyles from './styles';
import React, { useState } from 'react'
import {Link, withRouter} from "react-router-dom";
import withWidth, {isWidthDown} from "@material-ui/core/withWidth";
import ButtonLink from "../../../components/Base/ButtonLink";


const BrightStartIcon = "bright-star.svg";
const logo = "/images/logo-red-kite.svg";
const iconClose = "/images/icons/close.svg";
const iconHamburger = "/images/icons/hamburger.svg";
const iconAccount = "icons/account.svg";


const HeaderCustomLayout: React.FC<any> = (props: any) => {
  const styles = useStyles();
  const [openSideBar, setOpenSideBar] = useState(false);

  const handleClickPoolList = (e: any) => {
    console.log('props', props.location.pathname);
    if (props?.location?.pathname === '/dashboard') {
      window.location.reload();
    }
  };
  return (
    <>
      <div>
        <div className={styles.navBar}>
          <div>
            <Link to={'/'} className={styles.navbarLink}>
              <img src={logo} className={styles.navbarLogo}/>
            </Link>
          </div>
          {isWidthDown('xs', props.width) && <img src={iconHamburger} onClick={() => setOpenSideBar(true)}/>}
          <div className={styles.rightBar + (openSideBar ? ' active' : '')}>
            {isWidthDown('xs', props.width) &&
            <>
              <img src={logo} className={styles.sideBarLogo}/>
              <img src={iconClose} className={styles.closeBtn} onClick={() => setOpenSideBar(false)}/></>}
            <ButtonLink text="Pool" to={'/dashboard'} icon={BrightStartIcon} className={`${styles.btn} start`} onClick={handleClickPoolList}/>
            <ButtonLink text="My Account" to={'/account'} icon={iconAccount} className={`${styles.btn} start my-account`} />
          </div>
        </div>
      </div>
    </>
  );
};

export default withWidth()(withRouter(HeaderCustomLayout));
