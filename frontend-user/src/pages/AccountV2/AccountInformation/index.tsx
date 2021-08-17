import { useEffect, useState } from 'react';
import _ from 'lodash';
import useAuth from '../../../hooks/useAuth';
import ModalVerifyEmail from '../ModalVerifyEmail';
import {Button, withWidth, TextField, Hidden} from '@material-ui/core';
import { KYC_STATUS } from '../../../constants';
import useWalletSignature from '../../../hooks/useWalletSignature';
import axios from '../../../services/axios';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { alertFailure } from '../../../store/actions/alert';
import {useForm} from 'react-hook-form';
import useStyles from './style';

const AccountInformation = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [openModalVerifyEmail, setOpenModalVerifyEmail] = useState(false);
  const { connectedAccount} = useAuth();
  const [onEditProfile, setOnEditProfile] = useState(false);
  const { signature, signMessage } = useWalletSignature();
  const { account } = useWeb3React();

  const handleKYC = () => {
    window.open('https://verify-with.blockpass.org/?clientId=red_kite_kyc_7a0e6&serviceName=Red%20Kite%20KYC&env=prod', '_blank');
  }

  const {
    email,
    setEmail,
    setEmailVeryfied,
    kycStatus,
    twitter,
    telegram,
    setUpdatedSuccess,
    notEth,
    isKYC,
  } = props;

  useEffect(() => {
    if(!connectedAccount) {
      setOnEditProfile(false)
    }
  },[connectedAccount])

  const { register, errors, handleSubmit } = useForm({
    mode: 'onChange'
  });
  
  const onSetEditProfile = async () => {
    if(!signature) {
      await signMessage();
    } else {
      setOnEditProfile(true);
      setUpdatedSuccess(false);
    }
  };
  
  useEffect(() => {
    if(signature && connectedAccount) {
      setOnEditProfile(true);
      setUpdatedSuccess(false);
    }
  },[signature, connectedAccount]);

  const handleFormSubmit = async (data: any) =>  {
    if (signature) {
      const config = {
        headers: {
          msgSignature: process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE
        }
      }

      const response = await axios.put(`/user/update-profile`, {
        signature,
        wallet_address: account,
        user_twitter: data?.twitter,
        user_telegram: data?.telegram,
      }, config as any) as any;

      if (response.data) {
        if (response.data.status === 200) {
          setOnEditProfile(false);
          setUpdatedSuccess(true);
        }

        if (response.data.status !== 200) {
          dispatch(alertFailure(response.data.message));
        }
      }
    }
  }

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
        <h2 className={styles.title}>My profile</h2>
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
          <span style={{wordBreak: 'break-word'}}>{connectedAccount}</span>
        </div>

        <div className={styles.inputGroup}>
          <span>KYC Status</span>
          {connectedAccount && <div className="flex">
            {(!kycStatus || kycStatus === KYC_STATUS.INCOMPLETE) && 
              <span className="unverified">
                Unverified
                <img className={styles.iconStatus} src="/images/account_v3/icons/icon_unverified.svg" alt="" />
              </span>
            }
            {(!kycStatus || kycStatus === KYC_STATUS.INCOMPLETE) && <button className="verify-email" onClick={handleKYC}>KYC Now</button>}

            {kycStatus === KYC_STATUS.APPROVED && 
              <span className="verified">
                Verified
                <img className={styles.iconStatus} src="/images/account_v3/icons/icon_verified.svg" alt="" />
              </span>
            }

            {kycStatus === KYC_STATUS.RESUBMIT && <span style={{ color: 'red', overflow: 'unset' }}>Rejected</span>}
          </div>}
        </div>
        <div className={styles.inputGroup}>
          <span>Email Address</span>
          {
            connectedAccount && <>
              {
                (!kycStatus || kycStatus === KYC_STATUS.INCOMPLETE)
                  ?
                  <span>Your email used to complete KYC on Blockpass will be automatically reflected here. <br/>Please complete KYC first.</span>
                  :
                  <span className={styles.nameSocial}>{email}</span>
              }
            </>
          }
        </div>

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
                            required: true ,
                            maxLength: {
                              value: 60,
                              message: "max 60 characters"
                            }
                          })} 
                      />
                      <span className={styles.errorInput}>
                        {
                          errors.twitter && errors.twitter.type !== 'required' ? errors.twitter.message: renderErrorRequired(errors, 'twitter')
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
                            required: true ,
                            maxLength: {
                              value: 60,
                              message: "max 60 characters"
                            }
                          })} 
                      />
                      <span className={styles.errorInput}>
                        {
                          errors.telegram && errors.telegram.type !== 'required' ? errors.telegram.message: renderErrorRequired(errors, 'telegram')
                        }
                      </span>
                    </div>
                    :
                    <span>{telegram ?? '-'}</span>
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
            {kycStatus === KYC_STATUS.RESUBMIT && 'Please send information to support@polkafoundry.com to resubmit KYC.'}
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
        setEmail={setEmail}
        open={openModalVerifyEmail}
        setEmailVeryfied={setEmailVeryfied}
      />
    </div>
  );
};

export default withWidth()(AccountInformation);
