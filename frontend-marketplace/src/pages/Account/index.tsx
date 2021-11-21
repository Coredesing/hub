import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Backdrop, CircularProgress } from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { getBalance } from "../../store/actions/balance";
import {
  getUserTier,
} from "@store/actions/sota-tiers";
import { getAllowance } from "../../store/actions/sota-token";
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

const AccountV2 = (props: any) => {
  const classes = useStyles();
  const dispatch = useDispatch(); 
  const { isAuth, connectedAccount, wrongChain } = useAuth();
  const query = new URLSearchParams(props.location.search);
  const currentTab = query.get('tab') as string;
  const currentTabMenu = MenuLeft[currentTab] || MenuLeft.assets;
  const [tabAccount] = useState(Object.values(MenuLeft));
  const [activeMenuAccount, setActiveMenuAccount] = useState(currentTabMenu.key);
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  const { data: userTier } = useSelector((state: any) => state.userTier);
  const [loadingUserProfile, setRenewUserProfile] = useState(false);
  useEffect(() => {
    dispatch(getUserTier(!wrongChain && connectedAccount ? connectedAccount : ''));
  }, [wrongChain, connectedAccount, dispatch]);

  useEffect(() => {
    setRenewUserProfile(!!connectedAccount);
  }, [connectedAccount]);

  useEffect(() => {
    if (isAuth && connectedAccount && !wrongChain) {
      dispatch(getBalance(connectedAccount));
      dispatch(getAllowance(connectedAccount));
    }
  }, [isAuth, wrongChain, connectedAccount, dispatch]);

  useEffect(() => {
    setUpdatedSuccess(false);
  }, [activeMenuAccount]);



  const selectTab = (name: any) => {
    setActiveMenuAccount(name)
    props.history.push('/account?tab=' + name)
  }

  return (
    <DefaultLayout>
      <div className={classes.accountContainer}>
        {updatedSuccess &&
          <div className={classes.messageUpdateSuccess}>
            <img src="/images/account_v3/icons/icon_updated_success.svg" alt="" />
            Your profile has been updated successfully
          </div>
        }
        <div className={classes.bodyContentMyAccount}>
          <div className={classes.leftAccount}>
            <div className={classes.titlLeft}>My Account</div>
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
            {activeMenuAccount === MenuLeft.assets.key && <>
              <Assets />
              {/* <CardsTicket /> */}
            </>}
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
