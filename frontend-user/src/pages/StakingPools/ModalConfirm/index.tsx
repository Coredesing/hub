import _, { set } from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import Button from '../Button';
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core';

const closeIcon = '/images/icons/close.svg'

const ModalStake = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();

  const {
    open,
    onConfirm,
    onClose,
    text
  } = props;

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + ' ' + styles.modalStake}
    >
      <div className="modal-content">
        <DialogTitle id="alert-dialog-slide-title" className="modal-content__head">
          <img src={closeIcon} alt="" onClick={onClose} className="btn-close"/>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div className='firs-neue-font mb-12px' style={{textAlign: 'center'}}>
            {text}
          </div>
          <div className='firs-neue-font bold' style={{textAlign: 'center'}}>
            Are you sure you want to continue? 
          </div>

        </DialogContent>
        <DialogActions className="modal-content__foot" style={{border: 'none'}}>
          <Button
            text="Yes, Sure"
            onClick={onConfirm}
            backgroundColor="#72F34B"
            style={{
              height: '42px',
              width: '144px',
              margin: 'auto 0px 10px',
              borderRadius: '36px',
              color: '#000',
              padding: '12px 30px',
            }}
          />
          <Button
            text="Cancel"
            onClick={onClose}
            backgroundColor="#727272"
            style={{
              height: '42px',
              width: '144px',
              margin: 'auto 0px 10px 6px',
              borderRadius: '36px',
              padding: '12px 30px',
            }}
          />
        </DialogActions>
        {/* {transactionHashes[0].isApprove && <p className={styles.notice}>Please be patient and no need to approve again, you can check the transaction status on Etherscan.</p>} */}
      </div>
    </Dialog>
  );
};

export default ModalStake;
