import { useEffect, useState } from 'react';
import _ from 'lodash';
import useAuth from '../../../hooks/useAuth';
import ModalVerifyEmail from '../ModalVerifyEmail';
import { Button, withWidth, TextField, Hidden } from '@material-ui/core';
import { KYC_STATUS } from '../../../constants';
import useWalletSignature from '../../../hooks/useWalletSignature';
import axios from '../../../services/axios';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { alertFailure } from '../../../store/actions/alert';
import { useForm } from 'react-hook-form';
import useStyles from './style';
import { useTabStyles } from '../style';

const AccountInformation = (props: any) => {
  const styles = useStyles();
  const tabStyles = useTabStyles();
  const dispatch = useDispatch();
  const [openModalVerifyEmail, setOpenModalVerifyEmail] = useState(false);
  const { connectedAccount } = useAuth();
  const [onEditProfile, setOnEditProfile] = useState(false);
  const { signature, signMessage } = useWalletSignature();
  const { account } = useWeb3React();

  const handleKYC = () => {
    window.open('https://verify-with.blockpass.org/?clientId=red_kite_kyc_7a0e6&serviceName=Red%20Kite%20KYC&env=prod', '_blank');
  }

  const {
    email,
    // setEmail,
    // setEmailVeryfied,
    kycStatus,
    twitter,
    telegram,
    setUpdatedSuccess,
    notEth,
    isKYC,
    setRenewUserProfile,
    solanaWallet,
    terraWallet,
  } = props;

  const [ solanaAddress, setSolanaAddress] = useState(solanaWallet);

  useEffect(() => {
    setSolanaAddress(solanaWallet)
  },[solanaWallet])

  useEffect(() => {
    if (!connectedAccount) {
      setOnEditProfile(false)
    }
  }, [connectedAccount])

  const { register, errors, handleSubmit } = useForm({
    mode: 'onChange'
  });

  const onSetEditProfile = async () => {
    if (!signature) {
      await signMessage();
    } else {
      setOnEditProfile(true);
      setUpdatedSuccess(false);
    }
  };

  useEffect(() => {
    if (signature && connectedAccount) {
      setOnEditProfile(true);
      setUpdatedSuccess(false);
    }
  }, [signature, connectedAccount]);

  const handleFormSubmit = async (data: any) => {
    if (signature) {
      const config = {
        headers: {
          msgSignature: process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE
        }
      }

      let solanaSignature
      if (!!solanaAddress) {
        solanaSignature = await solanaSign()
      }

      const response = await axios.put(`/user/update-profile`, {
        signature,
        wallet_address: account,
        user_twitter: data?.twitter,
        user_telegram: data?.telegram,
        solana_address: solanaSignature?.publicKey ?? '',
        solana_signature: solanaSignature?.signature  ?? '',
      }, config as any) as any;

      if (response.data) {
        if (response.data.status === 200) {
          setOnEditProfile(false);
          setUpdatedSuccess(true);
          setRenewUserProfile(true);
        }

        if (response.data.status !== 200) {
          dispatch(alertFailure(response.data.message));
        }
      }
    }
  }

  const solanaSign = async () => {
    const encodedMessage = new TextEncoder().encode(process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE);
    // @ts-ignore
    const signedMessage = await window.solana.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
        display: "utf8",
      },
    });
    return signedMessage
  }

  const handleSolanaDisconnect = () => {
    // @ts-ignore
    if (!window.solana) {
      return
    }
    // @ts-ignore
    window.solana.request({ method: "disconnect" })
    setSolanaAddress(null)
  }

  const handleSolanaConnect = async () => {
    const provider = getSolanaProvider()
    if (!provider) {
      dispatch(alertFailure('Phantom extension is not installed!'))
      return
    }
    try {
      let resp
      resp = await provider.connect()
      if (!resp) {
        resp = await provider.request({ method: "connect"});
      }
      setSolanaAddress(resp.publicKey.toString())
    } catch (err) {
      dispatch(alertFailure('User rejected the request!'))
    }
  }

  const getSolanaProvider = () => {
    if ("solana" in window) {
      // @ts-ignore
      const provider = window?.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  };

  const renderErrorRequired = (errors: any, prop: string) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return 'This field is required';
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headPage}>
        <h2 className={tabStyles.tabTitle}>My profile</h2>
        {
          connectedAccount && !onEditProfile && isKYC &&
          <Hidden smDown>
            <Button variant="contained" className={styles.btnEditProfile} onClick={() => onSetEditProfile()}>
              <img src="/images/account_v3/icons/icon_edit.svg" alt="" />
              Edit Profile
            </Button>
          </Hidden>
        }
      </div>

      <div className={styles.mainInfomation}>
        <div className={styles.inputGroup}>
          <span>Your Wallet Address</span>
          <span style={{ wordBreak: 'break-word' }}>{connectedAccount}</span>
        </div>
        {(!kycStatus || kycStatus === KYC_STATUS.INCOMPLETE) &&
          <div className={styles.inputGroup}>
            <span>KYC</span>
            <span style={{ wordBreak: 'break-word' }}>KYC is only required when you apply for the IGO Whitelists.</span>
          </div>
        }
        {
          connectedAccount && kycStatus === KYC_STATUS.APPROVED && <div className={styles.inputGroup}>
            <span>KYC Status</span>
            <div className="flex">
              {/* {(!kycStatus || kycStatus === KYC_STATUS.INCOMPLETE) &&
              <span className="unverified">
                Unverified
                <img className={styles.iconStatus} src="/images/account_v3/icons/icon_unverified.svg" alt="" />
              </span>
            }
            {(!kycStatus || kycStatus === KYC_STATUS.INCOMPLETE) && <button className="verify-email" onClick={handleKYC}>KYC Now</button>} */}

              {kycStatus === KYC_STATUS.APPROVED &&
                <span className="verified">
                  Verified
                  <img className={styles.iconStatus} src="/images/account_v3/icons/icon_verified.svg" alt="" />
                </span>
              }

              {kycStatus === KYC_STATUS.RESUBMIT && <span style={{ color: 'red', overflow: 'unset' }}>Rejected</span>}
            </div>
          </div>
        }

        {connectedAccount && kycStatus === KYC_STATUS.APPROVED &&
          <div className={styles.inputGroup}>
            <span>Email Address</span>
            {
              connectedAccount && <>
                <span className={styles.nameSocial}>{email}</span>
                {/* {
                  (!kycStatus || kycStatus === KYC_STATUS.INCOMPLETE)
                    ?
                    <span>Your email used to complete KYC on Blockpass will be automatically reflected here. <br />Please complete KYC first.</span>
                    :
                    <span className={styles.nameSocial}>{email}</span>
                } */}
              </>
            }
          </div>
        }
        {
          connectedAccount && kycStatus === KYC_STATUS.APPROVED &&
          <form id="hook-form" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className={styles.inputGroup}>
              <span>Twitter Account</span>
              {
                connectedAccount &&
                <>
                  {
                    onEditProfile
                      ?
                      <div className={styles.groupInput}>
                        <TextField
                          className={styles.inputNewValue}
                          defaultValue={twitter}
                          placeholder="Enter your account name, EX: account"
                          name="twitter"
                          inputRef={register({
                            required: true,
                            maxLength: {
                              value: 60,
                              message: "max 60 characters"
                            }
                          })}
                        />
                        <span className={styles.errorInput}>
                          {
                            errors.twitter && errors.twitter.type !== 'required' ? errors.twitter.message : renderErrorRequired(errors, 'twitter')
                          }
                        </span>
                      </div>
                      :
                      <span className={styles.nameSocial}>{twitter ?? '-'}</span>
                  }
                </>
              }
            </div>

            <div className={styles.inputGroup}>
              <span>Telegram Account</span>
              {
                connectedAccount &&
                <>
                  {
                    onEditProfile
                      ?
                      <div className={styles.groupInput}>
                        <TextField
                          className={styles.inputNewValue}
                          defaultValue={telegram}
                          placeholder="Enter your account name, EX: account"
                          name="telegram"
                          inputRef={register({
                            required: true,
                            maxLength: {
                              value: 60,
                              message: "max 60 characters"
                            }
                          })}
                        />
                        <span className={styles.errorInput}>
                          {
                            errors.telegram && errors.telegram.type !== 'required' ? errors.telegram.message : renderErrorRequired(errors, 'telegram')
                          }
                        </span>
                      </div>
                      :
                      <span>{telegram ?? '-'}</span>
                  }
                </>
              }
            </div>

            <div className={styles.inputGroup}>
            <span>Solana Wallet Address<br/>(Optional)</span>
            {
              connectedAccount &&
              <>
                {
                  onEditProfile ?
                      <div className={styles.solanaGroup}>
                        <span>{ !!solanaAddress ? solanaAddress : ''}</span>
                        {
                          !solanaAddress ?
                              <div style={{position: "relative"}}>
                              <button className={styles.connectBTN} type="button" onClick={handleSolanaConnect}>Connect</button>
                              <div className={styles.getExtension}><a href="https://phantom.app/" style={{color: '#6398FF'}}>Get Phantom extension?</a></div>
                              </div>
                              :
                              <button className={styles.disconnectBTN} type="button" onClick={handleSolanaDisconnect}>Disconnect</button>
                        }
                      </div>
                      :
                      <span>{ !!solanaAddress ? solanaAddress : 'Not Connected'}</span>
                }
              </>
            }
          </div>
          </form>
        }

        <div className={styles.inputGroup} style={{ marginBottom: 5 }}>
          <span></span>
          {connectedAccount && <>
            <span style={{ color: 'red', display: 'inline-block' }}>
              {kycStatus === KYC_STATUS.RESUBMIT && 'Please send information to support@gamefi.org to resubmit KYC.'}
            </span>
          </>}
        </div>
      </div>

      {
        connectedAccount && !onEditProfile && kycStatus === KYC_STATUS.APPROVED &&
        <Hidden mdUp>
          <Button variant="contained" className={styles.btnEditProfile} onClick={() => onSetEditProfile()}>
            <img src="/images/account_v3/icons/icon_edit.svg" alt="" />
            Edit Profile
          </Button>
        </Hidden>
      }

      {
        connectedAccount && onEditProfile && kycStatus === KYC_STATUS.APPROVED &&
        <div className={styles.footerPage}>
          <Button
            form="hook-form"
            type="submit"
            variant="contained"
            className={styles.btnUpdateProfile} onClick={() => handleFormSubmit}>
            Update Profile
          </Button>
        </div>
      }

      <ModalVerifyEmail
        setOpenModalVerifyEmail={setOpenModalVerifyEmail}
        email={email}
        // setEmail={setEmail}
        open={openModalVerifyEmail}
        // setEmailVeryfied={setEmailVeryfied}
        setRenewUserProfile={setRenewUserProfile}
      />
    </div>
  );
};

export default withWidth()(AccountInformation);
