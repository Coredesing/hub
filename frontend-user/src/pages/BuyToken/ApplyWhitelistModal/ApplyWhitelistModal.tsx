import React, { useState, useEffect } from 'react'
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { alertFailure, alertSuccess } from '../../../store/actions/alert'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { BaseRequest } from '../../../request/Request'
import { apiRoute } from "../../../utils"

import useStyles from './style'
import WhiteListGuideText from "./WhiteListGuideText"
import WhitelistFollowSocial from "./WhitelistFollowSocial"
import Button from "../Button"
import { typeDisplayFlex } from '../../../styles/CommonStyle'

const titleStyles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      background: '#38383F',
      paddingTop: 0,
      textAlign: 'center'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: 'black',
      backgroundColor: '#4B4B4B',
      padding: 4,
      "&:hover": {
        backgroundColor: '#D4D4D4'
      }
    },
    svgIcon: {
      fontSize: 5
    },

  })

const alertStyles = makeStyles({
  alert: {
    ...typeDisplayFlex,
    marginBottom: '1rem'
  }
})

export interface DialogTitleProps extends WithStyles<typeof titleStyles> {
  id: string
  children: React.ReactNode
  onClose: () => void
  customClass: string,
  networkAvailable?: string,
}

export interface ComponentProps {
  opened: boolean,
  handleClose: () => void
}

const DialogTitle = withStyles(titleStyles)((props: DialogTitleProps) => {
  const { children, classes, customClass, onClose, ...other } = props

  const customStyles = {
    color: 'white',
    fontSize: '28px',
    fontWeight: 700
  }

  return (
    <MuiDialogTitle disableTypography className={`${classes.root} ${customClass}`} {...other} >
      <Typography variant="h5" style={customStyles}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    color: '#FFFFFF'
  },
}))(MuiDialogContent)

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
    justifyContent: 'center',
    marginTop: theme.spacing(5),
    '& > :not(:first-child)': {
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& > :not(:first-child)': {
        marginLeft: 0,
        marginTop: theme.spacing(1),
      },
    },
  },
}))(MuiDialogActions)

const PendingAlert = () => {
  const styles = alertStyles();
  return (
    <div className={styles.alert}>
      <svg width="14" height="14" style={{ marginTop: '.1rem', minWidth: '14px', minHeight: '14px' }} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 0C3.14005 0 0 3.14005 0 7C0 10.86 3.14005 14 7 14C10.86 14 14 10.86 14 7C14 3.14005 10.86 0 7 0ZM10.3291 10.6207C10.2153 10.7345 10.066 10.7917 9.9167 10.7917C9.76738 10.7917 9.61795 10.7345 9.5043 10.6207L6.5876 7.7041C6.47791 7.59505 6.4167 7.44679 6.4167 7.2917V3.5C6.4167 3.17743 6.67796 2.9167 7 2.9167C7.32204 2.9167 7.5833 3.17743 7.5833 3.5V7.0502L10.3291 9.7959C10.5571 10.024 10.5571 10.3927 10.3291 10.6207Z" fill="#FFD058" />
      </svg>
      <p style={{ marginLeft: '.5rem', color: '#FFD058', fontSize: '14px' }}>
        Your whitelist application is pending approval. We will check and verify later in a short time.<br />
        Please kindly wait. Email to support@gamefi.com if you need further assistance.
      </p>
    </div>
  )
}

const RejectedAlert = () => {
  const styles = alertStyles();
  return (
    <div className={styles.alert}>
      <svg width="14" height="14" style={{ marginTop: '.1rem', minWidth: '14px', minHeight: '14px' }} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.02734 0C3.18254 0 0 3.12785 0 6.97266C0 10.8175 3.18254 14 7.02734 14C10.8721 14 14 10.8175 14 6.97266C14 3.12785 10.8721 0 7.02734 0ZM10.4787 9.26379C10.7986 9.58371 10.7986 10.1041 10.4787 10.4243C10.1612 10.7414 9.64086 10.7466 9.3182 10.4243L7.02734 8.13258L4.68152 10.4245C4.3616 10.7445 3.84125 10.7445 3.52105 10.4245C3.20113 10.1046 3.20113 9.58426 3.52105 9.26406L5.81246 6.97266L3.52105 4.68125C3.20113 4.36105 3.20113 3.8407 3.52105 3.52078C3.84125 3.20086 4.3616 3.20086 4.68152 3.52078L7.02734 5.81273L9.3182 3.52078C9.63758 3.20141 10.1579 3.20031 10.4787 3.52078C10.7986 3.8407 10.7986 4.36105 10.4787 4.68125L8.18727 6.97266L10.4787 9.26379Z" fill="#D01F36" />
      </svg>
      <p style={{ marginLeft: '.5rem', color: '#D01F36', fontSize: '14px' }}>
        You haven't followed or subscribed to these accounts.
      </p>
    </div>
  )
}

const ApplyWhitelistModal: React.FC<any> = (props: any) => {
  const { poolDetails, connectedAccount, alreadyJoinPool, joinPoolSuccess, joinPool, handleClose, whitelistSubmission, previousWhitelistSubmission, onCheckKyc, dataUser } = props
  const styles = useStyles()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [rejectedSubmission, setRejectedSubmission] = useState(undefined)
  const [pendingSubmission, setPendingSubmission] = useState(false)

  const [inputTwitter, setInputTwitter] = useState('')
  const [inputTelegram, setInputTelegram] = useState('')

  const [invalidTwitter, setInvalidTwitter] = useState(false)
  const [invalidTelegram, setInvalidTelegram] = useState(false)

  const [ solanaAddress, setSolanaAddress] = useState();
  console.log(dataUser)
  useEffect(() => {
    setSolanaAddress(dataUser?.user?.solana_address)
  },[dataUser])

  useEffect(() => {
    if (!alreadyJoinPool && !joinPoolSuccess) {
      if (previousWhitelistSubmission) {
        setInputTwitter(previousWhitelistSubmission?.user_twitter)
        setInputTelegram(previousWhitelistSubmission?.user_telegram)
      }
      return
    }

    if (whitelistSubmission) {
      setPendingSubmission(true)
      setInputTwitter(whitelistSubmission?.user_twitter)
      setInputTelegram(whitelistSubmission?.user_telegram)
      return
    }

  }, [alreadyJoinPool, joinPoolSuccess, whitelistSubmission, previousWhitelistSubmission])

  const verifyAndSubmit = async () => {
    if (!connectedAccount) {
      return
    }

    setInvalidTwitter(!inputTwitter)
    setInvalidTelegram(!inputTelegram)

    if (!inputTwitter || !inputTelegram) {
      return
    }

    await handleApply()
  }

  const handleApply = async () => {
    const baseRequest = new BaseRequest()
    setLoading(true)
    setRejectedSubmission(undefined)

    let solanaSignature
    if (poolDetails.airdropNetwork === 'solana' && solanaAddress) {
      solanaSignature = await solanaSign(solanaAddress)
      if (!solanaSignature) {
        return
      }
    }

    const response = await baseRequest.post(apiRoute(`/whitelist-apply/${poolDetails.id}`), {
      wallet_address: connectedAccount,
      user_twitter: inputTwitter,
      user_telegram: inputTelegram,
      solana_address: solanaAddress,
      solana_signature: solanaSignature?.signature
    }) as any
    const resObj = await response.json()
    setLoading(false)

    if (resObj.status && resObj.status === 200) {
      handleClose()
      joinPool(solanaSignature)
    } else {
      dispatch(alertFailure(resObj.message))
      setRejectedSubmission(resObj.data)
    }
  }

  const solanaSign = async (address:any) => {
    const encodedMessage = new TextEncoder().encode(process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE);
    // @ts-ignore
    const provider = window.solana
    if (!provider) {
      dispatch(alertFailure('Phantom extension not installed'))
      return
    }
    let connectWallet = await provider.connect()
    if (connectWallet?.publicKey?.toString() !== address) {
      dispatch(alertFailure('You have not properly connected the linked solana wallet address.'))
      return
    }
    const signedMessage = await provider.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
        display: "utf8",
      },
    });
    return signedMessage
  }

  const handleSolanaConnect = async () => {
    // @ts-ignore
    const provider = window?.solana
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

  return (
    <Dialog open fullWidth={true} maxWidth={'md'} className={styles.socialDialog}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose} customClass={styles.dialogTitle} >
        Welcome to {poolDetails?.title} IDO on GameFi
      </DialogTitle>
      <DialogContent>
        <div>
          {!whitelistSubmission && <WhiteListGuideText />}
        </div>
        <div>
          <WhitelistFollowSocial poolDetails={poolDetails} whitelistSubmission={whitelistSubmission || rejectedSubmission} />
        </div>
        {pendingSubmission && <PendingAlert />}
        {rejectedSubmission && <RejectedAlert />}
        <div>
          <div className="socialForm">

            {
              poolDetails?.socialRequirement?.self_retweet_post && <>
                <div className={styles.socialStep}>
                  <div className={styles.socialStepNunber}>
                    02
                  </div>
                  <p style={{ fontWeight: 700 }}>
                    Like and retweet the &nbsp;
                    <a target="_blank" rel="noopener noreferrer"
                      className={styles.socialAnchorlink}
                      href={poolDetails?.socialRequirement?.self_retweet_post}>
                      {poolDetails?.title} IDO announcement
                    </a> on GameFi’s Twitter
                    {
                      poolDetails?.socialRequirement?.self_retweet_post_hashtag &&
                      <span>
                        &nbsp;with the hashtags <span style={{ color: 'rgb(99, 152, 255)' }}>{poolDetails?.socialRequirement?.self_retweet_post_hashtag}</span>
                      </span>
                    }
                  </p>
                </div>
              </>
            }

            {
              poolDetails?.socialRequirement?.partner_retweet_post && <>
                <div className={styles.socialStep}>
                  <div className={styles.socialStepNunber}>
                    {poolDetails?.socialRequirement?.self_retweet_post ? '03' : '02'}
                  </div>
                  <p style={{ fontWeight: 700 }}>
                    Like and retweet the &nbsp;
                    <a target="_blank" rel="noopener noreferrer"
                      className={styles.socialAnchorlink}
                      href={poolDetails?.socialRequirement?.partner_retweet_post}>
                      {poolDetails?.title} IDO announcement
                    </a> on {poolDetails?.title}’s Twitter
                    {
                      poolDetails?.socialRequirement?.partner_retweet_post_hashtag &&
                      <span>
                        &nbsp;with the hashtags <span style={{ color: 'rgb(99, 152, 255)' }}>{poolDetails?.socialRequirement?.partner_retweet_post_hashtag}</span>
                      </span>
                    }
                  </p>
                </div>
              </>
            }

            <div className="row">
              <div className="input-group">
                <div className="label">Your Twitter Account <span style={{ color: '#D01F36' }}>*</span> </div>
                <input
                  type="text"
                  disabled={alreadyJoinPool || joinPoolSuccess}
                  value={inputTwitter}
                  onChange={e => setInputTwitter(e.target.value)}
                  placeholder="E.g: username"
                  maxLength={60}
                />
                {invalidTwitter && <div style={{ color: '#D01F36' }}>Invalid username</div>}
              </div>
              <div className="input-group">
                <div className="label">Your Telegram Account <span style={{ color: '#D01F36' }}>*</span> </div>
                <input
                  type="text"
                  disabled={alreadyJoinPool || joinPoolSuccess}
                  value={inputTelegram}
                  onChange={e => setInputTelegram(e.target.value)}
                  placeholder="E.g: username"
                  maxLength={60}
                />
                {invalidTelegram && <div style={{ color: '#D01F36' }}>Invalid username</div>}
              </div>
            </div>
            { poolDetails.airdropNetwork === 'solana' &&
            <div className="input-group d-block">
              <div className="label">Your Solana Wallet Address (will receive the airdrop) <span style={{color: '#D01F36'}}>*</span><div style={{float:"right"}}><a href="https://phantom.app/" style={{color: '#6398FF'}}>Get Phantom extension?</a></div></div>
              {
                !solanaAddress ?
                    <div><Button
                        //backgroundColor={''}
                        onClick={handleSolanaConnect}
                        text={'Connect Solana Wallet'}
                        style={{
                          width: '100%',
                          border: '1px solid #72F34B',
                          color: '#72F34B',
                          padding: '13px 30px',
                        }}
                    />
                      </div>
                    :
                    (<input
                        type="text"
                        disabled={alreadyJoinPool || joinPoolSuccess}
                        value={solanaAddress}
                        readOnly={true}
                        maxLength={60}
                    />)
              }
            </div>
            }
          </div>
        </div>
      </DialogContent>
      {
        !alreadyJoinPool && !joinPoolSuccess &&
        <DialogActions>
          <Button
            text={'Submit'}
            onClick={verifyAndSubmit}
            loading={loading}
            disabled={loading || !inputTelegram || !inputTwitter || (poolDetails.airdropNetwork === 'solana' && !solanaAddress)}
            backgroundColor={'#72F34B'}
            style={{
              minWidth: 200,
              padding: '13px 30px',
              color: '#000',
            }}
          />

          <Button
            text={'Cancel'}
            onClick={handleClose}
            backgroundColor={'#727272'}
            style={{
              minWidth: 200,
              padding: '13px 30px',
            }}
          />
        </DialogActions>
      }
    </Dialog>
  )
}

export default ApplyWhitelistModal
