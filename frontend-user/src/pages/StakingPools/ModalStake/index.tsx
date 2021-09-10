import _, { set } from 'lodash';
import { useEffect, useState } from 'react';
import useStyles from './style';
import usePoolStyles from '../Pool/style';
import useCommonStyle from '../../../styles/CommonStyle';
import Button from '../Button';
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core';
import { numberWithCommas } from '../../../utils/formatNumber';

const closeIcon = '/images/icons/close.svg'

const ModalStake = (props: any) => {
  const styles = useStyles();
  const poolStyles = usePoolStyles();
  const commonStyles = useCommonStyle();

  const {
    open,
    onConfirm,
    onClose,
    amount,
    setAmount,
    tokenDetails,
    stakingAmount,
    min,
    max,
    tokenBalance,
    logo,
  } = props;

  
  const [progress, setProgress] = useState('0');
  useEffect(() => {
    setProgress((Number(amount) / Number(tokenBalance) * 100).toFixed(0))
  }, [amount, tokenBalance, setProgress])

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
          <div className="title">Stake</div>
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
          {
            stakingAmount && Number(stakingAmount) > 0 && 
            <div className="token-type">
              <div>
                Staking
              </div>
              <div className="token-detail">
                {stakingAmount}
              </div>
            </div>
          }
          {
            min && Number(min) > 0 && 
            <div className="token-type">
              <div>
                Min Stake
              </div>
              <div className="token-detail">
                {min}
              </div>
            </div>
          }
          {
            max && Number(max) > 0 && 
            <div className="token-type">
              <div>
                Max Stake
              </div>
              <div className="token-detail">
                {max}
              </div>
            </div>
          }
          <div className="subtitle">
            Stake Amount
          </div>
          <div className="input-group">
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value) }
              type="number"
              min="0"
            />
          </div>
          <div className="token-balance">Balance: {numberWithCommas(tokenBalance, 4)} {tokenDetails?.symbol}</div>

          <div className={poolStyles.progressArea} style={{width: '100%', marginTop: '20px'}}>
            <div className={poolStyles.progress}>
              <span
                className={`${poolStyles.currentProgress} ${
                  parseFloat(progress) > 0 ? "" : "inactive"
                }`}
                style={{
                  width: `${
                    parseFloat(progress) > 99
                      ? 100
                      : Math.round(parseFloat(progress))
                  }%`,
                }}
              >
                <img
                  className={poolStyles.iconCurrentProgress}
                  src="/images/icons/icon_progress.svg"
                  alt=""
                />
              </span>
            </div>
            <div className={poolStyles.currentPercentage}>({Number(progress).toFixed(0)}%)</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
            <Button
              text="25%"
              onClick={() => setAmount(Number(tokenBalance) * 0.25 + '')}
              backgroundColor="#545459"
              style={{
                height: '32px',
                width: '67px',
                margin: 'auto 0px 10px',
                borderRadius: '4px',
                // padding: '12px 30px',
              }}
            />
            <Button
              text="50%"
              onClick={() => setAmount(Number(tokenBalance) * 0.50 + '')}
              backgroundColor="#545459"
              style={{
                height: '32px',
                width: '67px',
                margin: 'auto 0px 10px',
                borderRadius: '4px',
                // padding: '12px 30px',
              }}
            />
            <Button
              text="75%"
              onClick={() => setAmount(Number(tokenBalance) * 0.75 + '')}
              backgroundColor="#545459"
              style={{
                height: '32px',
                width: '67px',
                margin: 'auto 0px 10px',
                borderRadius: '4px',
                // padding: '12px 30px',
              }}
            />
            <Button
              text="100%"
              onClick={() => setAmount(tokenBalance)}
              backgroundColor="#545459"
              style={{
                height: '32px',
                width: '67px',
                margin: 'auto 0px 10px',
                borderRadius: '4px',
                // padding: '12px 30px',
              }}
            />
          </div>

        </DialogContent>
        <DialogActions className="modal-content__foot">
          <Button
            text="Stake"
            onClick={onConfirm}
            backgroundColor="#3232DC"
            style={{
              height: '42px',
              width: '280px',
              margin: 'auto',
              borderRadius: '36px',
              padding: '12px 30px',
            }}
            disabled={isNaN(amount) || Number(amount) <= 0}
          />
          {/* <Button
            text="Get PKF"
            onClick={()=> window.open(`https://app.uniswap.org/#/swap?outputCurrency=${tokenDetails?.address}&use=V2`)}
            backgroundColor="#38383F"
            style={{
              height: '42px',
              width: '144px',
              color: '#6398FF',
              border: '1px solid #6398FF',
              margin: 'auto 0px 10px 6px',
              borderRadius: '36px',
              padding: '12px 30px',
            }}
          /> */}
        </DialogActions>
        {/* {transactionHashes[0].isApprove && <p className={styles.notice}>Please be patient and no need to approve again, you can check the transaction status on Etherscan.</p>} */}
      </div>
    </Dialog>
  );
};

export default ModalStake;
