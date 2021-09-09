import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import Button from '../Button';
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core';
import {BigNumber, utils} from 'ethers';

const closeIcon = '/images/icons/close.svg';

const ModalClaim = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();

  const {
    open,
    onConfirm,
    onClose,
    pendingReward,
    tokenDetails,
    logo,
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
          <div className="title">Claim</div>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div className="token-type">
            <div>
              Token
            </div>
            <div className="token-detail">
              <div>{tokenDetails?.symbol}</div>
            </div>
          </div>
          <div className="token-type">
            <div>
              Current Profit
            </div>
            <div className="token-detail">
            <div>{!BigNumber.from(pendingReward || '0').eq(BigNumber.from('0')) && Number(utils.formatEther(pendingReward)).toFixed(1)}</div>
            </div>
          </div>

        </DialogContent>
        <DialogActions className="modal-content__foot">
          <Button
            text="Claim"
            onClick={onConfirm}
            backgroundColor="#FFD058"
            style={{
              height: '42px',
              width: '280px',
              color: '#090B1C',
              margin: 'auto 0px 10px 10px',
              borderRadius: '36px',
              padding: '12px 30px',
            }}
          />
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ModalClaim;
