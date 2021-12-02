import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Backdrop, CircularProgress } from '@material-ui/core';
import { withRouter } from "react-router-dom";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import useStyles from "./style";
import useAuth from "../../hooks/useAuth";
import { USER_STATUS } from "../../constants";
import { ChainId } from "../../constants/network";
import axios from '../../services/axios';
import { MenuLeft } from "./constants";
import clsx from 'clsx';
import _ from 'lodash';
import Assets from "./Assets";
import Offers from "./Offers";
import Listings from "./Listings";

const AccountV2 = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch(); 
  const query = new URLSearchParams(props.location.search);
  const currentTab = query.get('tab') as string;
  const currentTabMenu = MenuLeft[currentTab] || MenuLeft.assets;
  const [tabAccount] = useState(Object.values(MenuLeft));
  const [activeMenuAccount, setActiveMenuAccount] = useState(currentTabMenu.key);
  const [updatedSuccess, setUpdatedSuccess] = useState(false);

  useEffect(() => {
    setUpdatedSuccess(false);
  }, [activeMenuAccount]);

  const selectTab = (name: any) => {
    setActiveMenuAccount(name)
    props.history.push('/inventory?tab=' + name)
  }

  return (
    <DefaultLayout>
      <div className={clsx(classes.accountContainer,  'custom-scroll')}>
        {updatedSuccess &&
          <div className={classes.messageUpdateSuccess}>
            <img src="/images/account_v3/icons/icon_updated_success.svg" alt="" />
            Your profile has been updated successfully
          </div>
        }
        <div className={clsx(classes.bodyContentMyAccount, 'custom-scroll')}>
          <div className={classes.leftAccount}>
            <div className={classes.titlLeft}>Inventory</div>
            <nav className={classes.tabAccount}>
              {
                tabAccount.map((item, index) => {
                  return (
                    <li
                      className={clsx(classes.itemTabAccount, {
                        active: activeMenuAccount === item.key
                      })}
                      key={index}
                      onClick={() => selectTab(item.key)}
                    >
                      <div
                        className={clsx(classes.iconItemTabAccount, {
                          active: activeMenuAccount === item.key
                        })}
                        style={{
                          WebkitMaskImage: `url(${item.icon})`,
                          maskImage: `url(${item.icon})`,
                        }}></div>
                      {item.name}
                    </li>
                  )
                })
              }
            </nav>
          </div>

          <div className={classes.rightAccount}>
            {activeMenuAccount === MenuLeft.assets.key && <Assets />}
            {activeMenuAccount === MenuLeft.listings.key && <Listings />}
            {activeMenuAccount === MenuLeft.offers.key && <Offers />}
          </div>
        </div>
      </div>

      {/* <Backdrop open={ loadingUserProfile} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </DefaultLayout>
  );
};

export default withRouter(AccountV2);
