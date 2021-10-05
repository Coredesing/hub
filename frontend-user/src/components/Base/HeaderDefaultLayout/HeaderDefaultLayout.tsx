import React, { useState, useEffect, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/core";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import useStyles from "./styles";

import ButtonLink from "../ButtonLink";
import { APP_NETWORKS_SUPPORT, ChainDefault } from "../../../constants/network";
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
import { LINK_SWAP_TOKEN, TIERS } from "@app-constants";
import useAuth from "../../../hooks/useAuth";
import { getUserTier } from "../../../store/actions/sota-tiers";
import { useMediaQuery, useTheme, Link as LinkMui } from "@material-ui/core";
import { WrapperAlert } from "../WrapperAlert";

// const BrightStartIcon = "bright-star.svg";
// const WalletIcon = "/images/wallet.svg";
const logo = '/images/gamefi.png';
const ethIcon = '/images/icons/eth.svg';
// const iconClose = "/images/icons/close.svg";
const iconHamburger = "/images/icons/hamburger.svg";
// const iconAccount = "/images/icons/account.svg";
// const EthereumIcon = "/images/ethereum.svg";

const HeaderDefaultLayout: React.FC<any> = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [switchNetworkDialog, setSwitchNetworkDialog] =
    useState<boolean>(false);
  const [disconnectDialog, setDisconnectDialog] = useState<boolean>(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const { appChainID } = useSelector((state: any) => state.appNetwork).data;
  const walletsInfo = useSelector((state: any) => state.wallet).entities;
  const [openSideBar, setOpenSideBar] = useState(false);
  const [toggleNavbar, setToggleNavbar] = useState(false);
  const { data: message = "" } = useSelector((state: any) => state.messages);
  const [chainLogo, setChainLogo] = useState<string>(ChainDefault.icon);
  const [chainName, setChainName] = useState<string>(ChainDefault.name);
  const [chainCurrency, setChainCurrency] = useState<string>(ChainDefault.currency || '');

  const { connectedAccount } = useAuth();


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

    setChainLogo(networkInfo.icon);
    setChainName(networkInfo.name);
    setChainCurrency(networkInfo.currency || '');
  }, [appChainID]);

  const handleClickPoolList = (e: any) => {
    console.log("props", props.location.pathname);
    if (props?.location?.pathname === "/dashboard") {
      window.location.reload();
    }
  };

  const hideNavMenu = () => {
    if (isMdScreen && toggleNavbar) {
      setToggleNavbar(false);
    }
  }



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
          
          <div className={styles.navBarGF} style={props.isShowBannerContract ? {top: props.heightBannerContract}: {}}>
            <div className="logo">
              <a href={"#/"}><img src={logo} alt="" /></a>
            </div>
            <nav className={`${styles.headerNav} ${toggleNavbar ? 'show' : ''}`}>
              <ul className={styles.headerLinks}>
                <li className={styles.headerLink} onClick={hideNavMenu}><Link to="/">Home</Link></li>
                <li className={styles.headerLink} onClick={hideNavMenu}><Link to="/pools/ticket">Ticket sales</Link></li>
                <li className={styles.headerLink} onClick={hideNavMenu}><Link to="/pools/token">Token sales</Link></li>
                <li className={styles.headerLink} onClick={hideNavMenu}><Link to="/pools/mystery-boxes">Mystery boxes</Link></li>
                <li className={styles.headerLink} onClick={hideNavMenu}><Link to="/staking-pools">Staking</Link></li>
                <li className={styles.headerLink} onClick={hideNavMenu}><Link to="/mystery-boxes">Mystery boxes</Link></li>
                {/* <li className={styles.headerLink} onClick={hideNavMenu}><Link to="/pools/items">Items Sales</Link></li> */}
                {/* <li className={styles.headerLink}><Link href="#">Marketplace</Link></li> */}
                {/* <li className={styles.headerLink}><Link href="#">Stake</Link></li> */}
              </ul>
              <div className={styles.headerAccount} onClick={hideNavMenu}>
                {connectedAccount && <>
                  <LinkMui className={styles.headerAccText} href={LINK_SWAP_TOKEN} target="_blank" rel="noreferrer">Buy GAFI</LinkMui>
                  <Link to="/account" className={styles.headerAccText}>My Account </Link>
                </>
                }

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
            <div className={styles.hamburger} onClick={() => setToggleNavbar(!toggleNavbar)}>
              <svg width="28" height="19" viewBox="0 0 28 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.2052 10.6398H1.7949C0.803359 10.6398 0 10.0132 0 9.23986C0 8.46651 0.803359 7.83984 1.7949 7.83984H26.2052C27.1966 7.83984 28 8.46646 28 9.23986C28 10.0133 27.1966 10.6398 26.2052 10.6398Z" fill="#0A0A0A" />
                <path d="M13.104 2.8H1.45602C0.651683 2.8 0 2.17335 0 1.4C0 0.626654 0.651683 0 1.45602 0H13.104C13.9083 0 14.56 0.626611 14.56 1.4C14.56 2.17339 13.9083 2.8 13.104 2.8Z" fill="#0A0A0A" />
                <path d="M26.5434 18.4799H14.8955C14.0911 18.4799 13.4395 17.8533 13.4395 17.0799C13.4395 16.3066 14.0911 15.6799 14.8955 15.6799H26.5434C27.3477 15.6799 27.9995 16.3065 27.9995 17.0799C27.9995 17.8533 27.3477 18.4799 26.5434 18.4799Z" fill="#0A0A0A" />
              </svg>


              {/* <img
                src={iconHamburger}
                onClick={() => setToggleNavbar(!toggleNavbar)}
                alt=""
              /> */}
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
        <WrapperAlert>
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
        </WrapperAlert>
      )}
      {(window.location.href.indexOf("buy-token") > -1 || window.location.href.indexOf("buy-nft") > -1) &&
        !loginError &&
        message !== "" && (
          <WrapperAlert type="error">
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
          </WrapperAlert>
        )}
    </>
  );
};

export default withWidth()(withRouter(HeaderDefaultLayout));
