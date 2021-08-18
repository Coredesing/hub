import useStyles from './style';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@material-ui/core';

const ModalWhitelistCancel = (props: any) => {
  const styles = useStyles();
  const {poolCancel, openModalCancel, onCloseModalCancel, onCancelPool} = props;

  return (
    <Dialog
      open={openModalCancel}
      keepMounted
      className={styles.modalWhitelistCancel}
      onClose={() => onCloseModalCancel()}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className={styles.headModalWhitelistCancel}>
        <img className={styles.iconModal} src="/images/account_v3/icons/icon_whitelist_cancel.svg" alt="" />
        <div className={styles.titleModal}>Whitelist Cancel</div>
        <Button className={styles.btnColseModal} variant="contained" onClick={() => onCloseModalCancel()} aria-label="close">
          <img src="/images/account_v3/icons/icon_close_modal.svg" alt="" />
        </Button>
      </DialogTitle>
      <DialogContent className={styles.comtentModalWhitelistCancel}>
        Are you sure to cancel your {poolCancel?.title} whitelist application? You cannot re-apply after you cancel.
      </DialogContent>
      <DialogActions className={styles.footerModalWhitelistCancel}>
        <Button variant="contained"  onClick={() => onCancelPool(poolCancel)}>Yes,Sure</Button>
        <Button variant="contained" onClick={() => onCloseModalCancel()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalWhitelistCancel;
