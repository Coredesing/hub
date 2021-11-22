import React, { useState, useEffect } from 'react';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {ClipLoader} from "react-spinners";
import {useTypedSelector} from '../../../hooks/useTypedSelector';
import {ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID} from '../../../constants/network';

import useStyles from './style';

const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL || "";
const BCSSCAN_URL = process.env.REACT_APP_BSCSCAN_BASE_URL || "";
const POLSCAN_URL = process.env.REACT_APP_POLSCAN_BASE_URL || "";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      background: '#020616',
      paddingTop: 0
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: 'black',
      backgroundColor: '#4B4B4B',
      padding: 4,

      "&:hover" : {
        backgroundColor: '#D4D4D4'
      }
    },
    svgIcon: {
      fontSize: 5
    }
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose?: () => void;
  customClass: string,
  networkAvailable?: string,
}

export interface ComponentProps {
  opened: boolean,
  handleClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, customClass, onClose, ...other } = props;

  const customStyles = {
    color: 'white',
  }

  return (
    <MuiDialogTitle disableTypography className={`${classes.root} ${customClass}`} {...other} style={customStyles}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    color: '#999999'
  },
}))(MuiDialogContent);

const TransactionSubmitModal = (props: {
  transactionHash?: string,
  handleClose?: () => void,
  opened?: boolean,
  additionalText?: string,
  [k: string]: any
}) => {
  const styles = useStyles();
  const { appChainID } = useTypedSelector(state => state.appNetwork).data;
  const { opened = false, handleClose, transactionHash, additionalText, networkAvailable } = props;
  const [explorerUrl, setExplorerUrl] = useState<String>(ETHERSCAN_URL);
  const [explorerName, setExplorerName] = useState<String>("Etherscan");

  useEffect(()=>{
    switch(appChainID) {
      case BSC_CHAIN_ID:
        setExplorerUrl(BCSSCAN_URL);
        setExplorerName("Bscscan");
      break;

      case POLYGON_CHAIN_ID:
        setExplorerUrl(POLSCAN_URL);
        setExplorerName("Polygonscan");
      break;

      case ETH_CHAIN_ID:
      default:
        setExplorerUrl(ETHERSCAN_URL);
        setExplorerName("Etherscan");
        break;
    }
  }, [appChainID])

  return (
      <Dialog open={opened} onClose={handleClose} className={styles.dialog}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} customClass={styles.dialogTitle} >
          Transaction {transactionHash ? 'Submitted': 'Submitting'}
        </DialogTitle>
        <DialogContent>
          <div>
            {
              transactionHash ? (
                <>
                <span className={styles.dialogLabel}>TXn Hash</span>
                <input value={transactionHash} className={styles.dialogInput} disabled={true} />
                <a
                  href={`${explorerUrl}/tx/${transactionHash}`}
                  className={styles.dialogButton}
                  target="_blank" rel="noreferrer"
                >
                  View on {`${explorerName}`}
                </a>
                {
                  additionalText && (
                    <p style={{ marginTop: 30, fontWeight: 600, lineHeight: '18px', fontSize: 15.5, color: '#eaeaea', fontFamily: 'Firs Neue' }}>
                      {additionalText}
                    </p>
                  )
                }
                </>
              ): <ClipLoader color={'white'}/>
            }
          </div>
        </DialogContent>
      </Dialog>
  )
}

export default TransactionSubmitModal;
