import React, { useState, useEffect, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/core";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import useStyles from "./styles";

import ButtonLink from "../ButtonLink";
import { APP_NETWORKS_SUPPORT } from "../../../constants/network";
import AppNetworkSwitch from "./AppNetworkSwitch";
import ConnectWalletModal from "./ConnectWalletModal";
import WalletDisconnect from "./WalletDisconnect";
import { HeaderContext } from "./context/HeaderContext";
import { AppContext } from "../../../AppContext";
import { trimMiddlePartAddress } from "../../../utils/accountAddress";
import {
  connectorsByName,
  connectorNames,
} from "../../../constants/connectors";
import { WalletConnectionState } from "../../../store/reducers/wallet";
import { TIERS } from "../../../constants";
import useAuth from "../../../hooks/useAuth";
import { getUserTier } from "../../../store/actions/sota-tiers";

const BrightStartIcon = "bright-star.svg";
const WalletIcon = "/images/wallet.svg";
const logo = '/images/gamefi.png';
const ethIcon = '/images/icons/eth.svg';
const iconClose = "/images/icons/close.svg";
const iconHamburger = "/images/icons/hamburger.svg";
const iconAccount = "/images/icons/account.svg";
const EthereumIcon = "/images/ethereum.svg";

const HeaderDefaultLayout: React.FC<any> = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [switchNetworkDialog, setSwitchNetworkDialog] =
    useState<boolean>(false);
  const [disconnectDialog, setDisconnectDialog] = useState<boolean>(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const walletsInfo = useSelector((state: any) => state.wallet).entities;
  const [openSideBar, setOpenSideBar] = useState(false);
  const [toggleNavbar, setToggleNavbar] = useState(false);
  const { data: message = "" } = useSelector((state: any) => state.messages);
  const { data: userTier } = useSelector((state: any) => state.userTier);

  const [chainLogo, setChainLogo] = useState<String>(ethIcon);
  const [chainName, setChainName] = useState<String>("Ethereum");
  const [chainCurrency, setChainCurrency] = useState<String>("ETH");

  const { isAuth, connectedAccount, wrongChain } = useAuth();

  useEffect(() => {
    if (isAuth && connectedAccount && !wrongChain) {
      dispatch(getUserTier(connectedAccount));
    }
  }, [isAuth, wrongChain, connectedAccount, dispatch]);

  const {
    handleProviderChosen,
    currentConnector,
    walletName,
    setWalletName,
    loginError,
    currentConnectedWallet,
    setCurrentConnectedWallet,
    openConnectWallet,
    setOpenConnectWallet,
    connectWalletLoading,
  } = useContext(AppContext);

  const currentAccount =
    currentConnectedWallet && currentConnectedWallet.addresses[0];
  const balance = currentConnectedWallet
    ? currentConnectedWallet.balances[currentAccount]
    : 0;
  const handleConnectWalletClose = () => {
    setOpenConnectWallet && setOpenConnectWallet(false);
  };

  const handleConnectWalletOpen = () => {
    setOpenConnectWallet && setOpenConnectWallet(true);
    setOpenSideBar(false);
  };

  const handleDisconnectDialogOpen = () => {
    setDisconnectDialog(true);
    setOpenSideBar(false);
  };

  /* const hamburgerStyle = (isSmartPhone: boolean) => { */
  /*   if(isSmartPhone) { */
  /*     return openSideBar ? 'flex' : 'none'; */
  /*   } */
  /*   else { */
  /*     return 'flex'; */
  /*   } */
  /* } */

  useEffect(() => {
    if (walletsInfo && walletName) {
      let currentWalletsName: string[] = [];
      let isFound = false;

      Object.keys(walletsInfo).forEach((key) => {
        const wallet = walletsInfo[key];

        if (
          wallet.addresses.length > 0 &&
          wallet.connectionState === WalletConnectionState.CONNECTED &&
          !isFound
        ) {
          isFound = true;
          setCurrentConnectedWallet && setCurrentConnectedWallet(wallet);
          currentWalletsName.push(key);
        }
      });

      if (
        currentWalletsName.length > 0 &&
        walletName.length === 0 &&
        !currentConnector
      ) {
        const chooseWallet = currentWalletsName[0] as connectorNames;

        setWalletName && setWalletName(currentWalletsName);
        handleProviderChosen &&
          handleProviderChosen(chooseWallet, connectorsByName[chooseWallet]);
      }
    }
  }, [walletsInfo, walletName]);

  useEffect(() => {
    const networkInfo = APP_NETWORKS_SUPPORT[Number(appChainID)];
    if (!networkInfo) {
      return;
    }

    setChainLogo(networkInfo.icon || ethIcon);
    setChainName(networkInfo.name || 'Ethereum');
    setChainCurrency(networkInfo.currency || 'ETH');
  }, [appChainID]);

  const handleClickPoolList = (e: any) => {
    console.log("props", props.location.pathname);
    if (props?.location?.pathname === "/dashboard") {
      window.location.reload();
    }
  };



  return (
    <>
      <div className={styles.navBar}>
        {/* {isWidthDown("md", props.width) ? (
          <>
            <div>
              <Link to={"/"} className={styles.navbarLink}>
                <img src={logo} alt="" />
              </Link>
            </div>
            <div className={styles.rightHeadMobile}>
              <ButtonLink
                text="Pool"
                to={"/dashboard"}
                icon={BrightStartIcon}
                className={`${styles.btn} startMobile`}
                onClick={handleClickPoolList}
              />
              <img
                src={iconHamburger}
                onClick={() => setOpenSideBar(true)}
                alt=""
              />
            </div>
            <div className={styles.rightBar + (openSideBar ? " active" : "")}>
              <>
                <img src={logo} className={styles.sideBarLogo} alt="logo" />
                <img
                  src={iconClose}
                  className={styles.closeBtn}
                  onClick={() => setOpenSideBar(false)}
                  alt="icon"
                />
              </>
              <ButtonLink
                text="Pool"
                to={"/dashboard"}
                icon={BrightStartIcon}
                className={`${styles.btn} start`}
                onClick={handleClickPoolList}
              />
              {currentAccount && (
                <a href={"#/account"}
                  className={`${styles.btn} start my-account`}
                >
                  <img className="icon" src={iconAccount} />
                  My Account
                  {TIERS[userTier] && <span>(<img src={TIERS[userTier]?.icon} />{TIERS[userTier]?.name})</span>}
                </a>
              )}
              <button
                className={`${styles.btn} ${styles.btnNetwork}`}
                onClick={() => {
                  setSwitchNetworkDialog(true);
                  setOpenSideBar(false);
                }}
              >
                <img
                  src={`${chainLogo}`}
                  alt=""
                />
                <span className={styles.btnConnectText}>
                  {chainName}
                </span>
              </button>
              <button
                className={`${styles.btn} ${styles.btnConnect}`}
                onClick={() => {
                  if (!connectWalletLoading) {
                    !currentAccount
                      ? handleConnectWalletOpen()
                      : handleDisconnectDialogOpen();
                  }
                }}
                disabled={connectWalletLoading}
              >
                {!connectWalletLoading ? (
                  <>
                    <span>
                      {currentAccount &&
                        (!loginError
                          ? `${balance} ${chainCurrency}`
                          : "0")}
                    </span>
                    {!currentAccount && <img src={WalletIcon} alt="wallet" />}
                    <span
                      className={`${styles.btnConnectText} ${currentAccount ? styles.btnAccount : ""
                        }`}
                    >
                      {(currentAccount &&
                        `${trimMiddlePartAddress(currentAccount)}`) ||
                        "Connect Wallet"}
                    </span>
                  </>
                ) : (
                  <BeatLoader
                    color={"white"}
                    css={css`
                      margin-top: 3px;
                    `}
                    size={10}
                  />
                )}
              </button>
            </div>
          </>
        ) : ( */}
        <>
          <div className={styles.navBarGF}>
            <div className="logo">
              <a href={"#/"}><img src={logo} alt="" /></a>
            </div>
            <nav className={`${styles.headerNav} ${toggleNavbar ? 'show' : ''}`}>
              <ul className={styles.headerLinks}>
                <li className={styles.headerLink}><a href="#">Home</a></li>
                <li className={styles.headerLink}><a href="#">Token sales</a></li>
                <li className={styles.headerLink}><a href="#">Game Items Sales</a></li>
                <li className={styles.headerLink}><a href="#">Marketplace</a></li>
                <li className={styles.headerLink}><a href="#">Stake</a></li>
              </ul>
              <div className={styles.headerAccount}>
                <span className={styles.headerAccText}>My Account</span>
                <div className={styles.headerAccBtn}>
                  <button
                    title="Switch network"
                    onClick={() => {
                      setSwitchNetworkDialog(true);
                      setOpenSideBar(false);
                    }}
                    className="logo-currency"
                  >
                    <span >
                      <img
                        src={`${chainLogo}`}
                        alt=""
                      />
                    </span>
                    {/* <span className={styles.btnConnectText}>
                                {chainName}
                              </span> */}
                  </button>
                  <button
                    title="Connect wallet"
                    className={styles.btnWallet}
                    disabled={connectWalletLoading}
                    onClick={() => {
                      if (!connectWalletLoading) {
                        !currentAccount
                          ? handleConnectWalletOpen()
                          : handleDisconnectDialogOpen();
                      }
                    }}>
                    {!connectWalletLoading ? (
                      currentAccount ? <>
                        <span className="balance">{currentAccount &&
                          (!loginError
                            ? `${balance} ${chainCurrency}`
                            : "0")}
                        </span>
                        <span className="address">{trimMiddlePartAddress(currentAccount || '')}</span>
                      </> : <span className="connect-wl">
                        {/* <img src={WalletIcon} alt="wallet" /> */}
                        Connect Wallet
                      </span>
                    ) : (
                      <BeatLoader
                        color={"white"}
                        css={css`
                            margin-top: 3px;
                          `}
                        size={10}
                      />
                    )}
                  </button>
                </div>
              </div>

            </nav>
            <div className={styles.hamburger}>
              <img
                src={iconHamburger}
                onClick={() => setToggleNavbar(!toggleNavbar)}
                alt=""
              />
            </div>
          </div>

        </>
        {/* )} */}
      </div>
      <HeaderContext.Provider value={{ agreedTerms, setAgreedTerms }}>
        <ConnectWalletModal
          opened={openConnectWallet as boolean}
          handleClose={handleConnectWalletClose}
        />
        <AppNetworkSwitch
          opened={switchNetworkDialog}
          handleClose={() => setSwitchNetworkDialog(false)}
        />
        <WalletDisconnect
          opened={disconnectDialog}
          handleClose={() => {
            setDisconnectDialog(false);
            setAgreedTerms(false);
            setOpenSideBar(false);
          }}
          currentWallet={currentConnectedWallet}
        />
      </HeaderContext.Provider>
      {loginError && (
        <div className={styles.loginErrorBanner}>
          <img
            src="/images/red-warning.svg"
            alt="red-warning icon"
            className={styles.iconWarning}
          />
          <span className={styles.loginErrorBannerText}>
            {loginError} Learn how to &nbsp;
            <a
              href="https://help.1inch.exchange/en/articles/4966690-how-to-use-1inch-on-bsc-binance-smart-chain"
              target="_blank"
              className={styles.loginErrorGuide} rel="noreferrer"
            >
              change network in wallet
            </a>
            &nbsp; or &nbsp;
            <button
              className={styles.btnChangeAppNetwork}
              onClick={() => {
                setOpenSideBar(false);
                setSwitchNetworkDialog(true);
              }}
            >
              Change App Network
            </button>
          </span>
        </div>
      )}
      {window.location.href.indexOf("buy-token") > -1 &&
        !loginError &&
        message != "" && (
          <div className={styles.loginErrorBanner}>
            <img
              src="/images/red-warning.svg"
              alt="red-warning icon"
              className={styles.iconWarning}
            />
            <span className={styles.loginErrorBannerText}>
              {message}&nbsp;&nbsp;
              <button
                className={styles.btnChangeAppNetwork}
                onClick={() => {
                  setOpenSideBar(false);
                  setSwitchNetworkDialog(true);
                }}
              >
                Change App Network
              </button>
            </span>
          </div>
        )}
    </>
  );
};

export default withWidth()(withRouter(HeaderDefaultLayout));
