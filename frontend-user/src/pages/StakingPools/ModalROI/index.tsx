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
    onClose,
    linear,
    apr,
    rewardTokenPrice,
    rewardToken,
    acceptedToken
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
          <div className="title">ROI</div>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div className={styles.grid} style={{ color: '#AEAEAE', marginBottom: '15px'}}>
            <div>Timeframe</div>
            <div>ROI</div>
            <div>{rewardToken?.symbol} per $1K</div>
          </div>

          <div className={styles.grid}>
            <div>1 day</div>
            <div>{(apr/365).toFixed(2)}%</div>
            <div>{((apr * 10) / (rewardTokenPrice * 365)).toFixed(2)}</div>
          </div>
          <div className={styles.grid}>
            <div>7 day</div>
            <div>{(apr/365*7).toFixed(2)}%</div>
            <div>{((apr * 10) / (rewardTokenPrice * 365) * 7).toFixed(2)}</div>
          </div>
          <div className={styles.grid}>
            <div>30 days</div>
            <div>{(apr/365*30).toFixed(2)}%</div>
            <div>{((apr * 10) / (rewardTokenPrice * 365) * 30).toFixed(2)}</div>
          </div>
          <div className={styles.grid}>
            <div>365 days (APR)</div>
            <div>{apr.toFixed(2)}%</div>
            <div>{((apr * 10) / rewardTokenPrice).toFixed(2)}</div>
          </div>

          {
            !linear &&
            <ul style={{listStyleType: 'disc', paddingLeft: '20px', margin: '20px 0'}}>
              <li>
                Calculated based on current rates.
              </li>
              <li style={{marginTop: '10px'}}>
                All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.
              </li>
            </ul>
          }
          
        </DialogContent>
        <DialogActions className="modal-content__foot">
          <Button
            text={`Get ${acceptedToken?.symbol}`}
            onClick={()=> window.open(`https://app.uniswap.org/#/swap?outputCurrency=${acceptedToken?.address}&use=V2`)}
            backgroundColor="#38383F"
            style={{
              height: '42px',
              width: '80%',
              color: '#6398FF',
              border: '1px solid #6398FF',
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
