import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { getEtherscanTransactionLink, getNetworkInfo } from '../../utils/network';
const closeIcon = '/images/icons/close.svg';
const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 'unset',
    minWidth: '300px',
    position: 'relative',
    background: '#171717',
    fontFamily: 'Firs Neue',
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: '20px 10px'
  },
  btnClose: {
    position: 'absolute',
    right: '6px',
    top: '6px',
    minWidth: 'unset',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
  },
  btnView: {
    padding: '7px 10px',
    fontFamily: 'inherit',
    background: '#72F34B',
    color: '#000',
    fontSize: '15px',
    borderRadius: '4px',
    '&:hover': {
      background: '#5ec73e',
      color: '#000',
    }
  },
  content: {
    [theme.breakpoints.down('xs')]: {
      flex: 'unset',
    },
    marginTop: '45px',
    '& h3': {
      textAlign: 'center',
      fontSize: '20px',
      marginBottom: '20px',
      fontFamily: 'inherit',
      color: '#fff'
    },
    '& h5': {
      textAlign: 'center',
      fontSize: '16px',
      marginBottom: '15px',
      fontFamily: 'inherit',
      color: '#fff'
    },
    '& p': {
      textAlign: 'center',
      fontSize: '15px',
      fontFamily: 'inherit',
      color: '#fff',
      padding: '10px',
      borderRadius: '4px',
      background: '#2E2E2E',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
      whiteSpace: 'pre-line',
    }
  },
  actions: {
    display: 'grid',
    justifyContent: 'center',
  }
}))

const TicketModal = ({ open, ...props }: any) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleClose = () => {
    props.onClose()
  };
  const info = getNetworkInfo(props.networkName);
  const transactionLink = getEtherscanTransactionLink({
    appChainID: info.id,
    transactionHash: props.transaction,
  })

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      classes={{
        paper: classes.paper
      }}
    >
      <Button autoFocus onClick={handleClose} color="primary" className={classes.btnClose}>
        <img src={closeIcon} alt="" />
      </Button>
      <DialogContent  className={classes.content}>
        <h3>Transaction Submitted</h3>
        <h5>Tx Hash</h5>
        <p>{props.transaction}</p>

      </DialogContent>
      <DialogActions className={classes.actions}>
        <Link href={transactionLink} target="_blank" className={classes.btnView}>
          View on {info.explorerName}
        </Link>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(TicketModal);