import { useEffect, useState } from 'react';
import useStyles from './style';
import usePoolStyles from '../Pool/style';
import useCommonStyle from '../../../styles/CommonStyle';
import Button from '../Button';
import { Dialog, DialogTitle, DialogContent, DialogActions, Link } from '@material-ui/core';
import { BigNumber, utils } from 'ethers';
import Progress from '@base-components/Progress'
import { numberWithCommas } from '@utils/formatNumber';
import { useDispatch, useSelector } from 'react-redux';
import { getUserTier } from '@store/actions/sota-tiers';
import useAuth from '@hooks/useAuth';
import clsx from 'clsx';
import BN from 'bignumber.js';
import { FormInputNumber } from '@base-components/FormInputNumber';
const closeIcon = '/images/icons/close.svg';
const ONE_DAY_IN_SECONDS = 86400;

const ModalStake = (props: any) => {
  const styles = useStyles();
  const poolStyles = usePoolStyles();
  const commonStyles = useCommonStyle();
  const dispatch = useDispatch();
  const { connectedAccount, wrongChain } = useAuth();

  const {
    open,
    onConfirm,
    onClose,
    amount,
    setAmount,
    pendingReward,
    delayDuration,
    tokenDetails,
    stakingAmount,
    logo,
    onBack,
  } = props;

  const { data: userTier } = useSelector((state: any) => state.userTier);
  const { data: delayTiers = [] } = useSelector((state: any) => state.delayTiers);
  useEffect(() => {
    dispatch(getUserTier(!wrongChain && connectedAccount ? connectedAccount : ''));
  }, [wrongChain, connectedAccount, dispatch]);

  const [progress, setProgress] = useState('0');
  useEffect(() => {
    if (Number(utils.formatEther(stakingAmount || '0')) <= 0) {
      return;
    }
    setProgress((Number(amount) / Number(utils.formatEther(stakingAmount)) * 100).toFixed(0))
  }, [amount, stakingAmount, setProgress])

  const [error, setError] = useState('');
  const onChangeAmount = (e: any) => {
    const amount = e.target.value;
    setAmount(amount)
    if (isNaN(amount)) {
      setError('Amount invalid');
    } else if (new BN(amount).gt(utils.formatEther(stakingAmount))) {
      setError('Insufficient balance');
    } else {
      setError('');
    }
  }

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={clsx(commonStyles.modal, styles.modalStake)}
      classes={{
        paper: 'paperModal'
      }}
    >
      <div className="modal-content custom-scroll">
        <DialogTitle id="alert-dialog-slide-title" className="modal-content__head">
          <img src={closeIcon} alt="" onClick={onClose} className="btn-close" />
          <div className="title">Unstake</div>
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
              Staking
            </div>
            <div className="token-detail">
              <div>{!BigNumber.from(stakingAmount || '0').eq(BigNumber.from('0')) && numberWithCommas(utils.formatEther(stakingAmount), 4)}</div>
            </div>
          </div>
          {
            !BigNumber.from(pendingReward || '0').eq(BigNumber.from('0')) &&
            <div className="token-type">
              <div>
                Current Profit
              </div>
              <div className="token-detail">
                <div>{numberWithCommas(utils.formatEther(pendingReward), 4)}</div>
              </div>
            </div>
          }
          {
            Number(userTier - 1) >= 0 &&
            <div className="token-type">
              <div>
                Withdrawal delay time
              </div>
              <div className="token-detail">
                <div> {delayTiers[userTier - 1]}  days</div>
              </div>
            </div>
          }
          <div className="subtitle">
            Unstake Amount {amount}
          </div>
          <div className="input-group">
            <FormInputNumber
              value={amount}
              onChange={onChangeAmount}
              min={0}
              isPositive
            />
          </div>
          {
            error && <div className='text-danger font-12px firs-neue-font mt-6px'>
              {error}
            </div>
          }
          <div className={poolStyles.progressArea} style={{ width: '100%', marginTop: '20px' }}>
            <Progress progress={+progress} />
            <div className={poolStyles.currentPercentage}>({Number(+progress || 0).toFixed(0)}%)</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button
              text="25%"
              onClick={() => setAmount(Number(utils.formatEther(stakingAmount)) * 0.25 + '')}
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
              onClick={() => setAmount(Number(utils.formatEther(stakingAmount)) * 0.50 + '')}
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
              onClick={() => setAmount(Number(utils.formatEther(stakingAmount)) * 0.75 + '')}
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
              onClick={() => setAmount(Number(utils.formatEther(stakingAmount)) + '')}
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

          {
            Number(userTier - 1) >= 0 &&
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '20px 0', color: '#fed469' }}>
              <li>
                {/* Be aware that there is a delay when you <strong>Unstake</strong> tokens depending on your  <strong>Rank</strong> */}
                There is an Withdrawal delay time before you can <strong>Withdraw</strong> your Staked tokens. Following that Withdrawal delay time you will be able to withdraw.
              </li>
              <li style={{ marginTop: '10px' }}>
                Staking Rewards will stop being earned for the amount you unstake as soon as you click "<strong>Unstake</strong>" and initiate the Unstaking process
              </li>
              <li style={{ marginTop: '10px', listStyle: 'none' }}>
                <Link href="https://medium.com/gamefi-official/new-staking-and-unstaking-policy-updates-on-gamefi-launchpad-77c67c536627" target={"_blank"} className="text-green-imp bold">
                  Read more Policy
                </Link>
              </li>
            </ul>
          }
          {/* <div className="delay-notes">
            <div>
                Be aware that there is a delay when you unstake tokens depending on your rank
            </div>
          </div> */}

        </DialogContent>
        <DialogActions className="modal-content__foot">
          <Button
            text="Back"
            onClick={onBack}
            backgroundColor="#1e1e1e"
            style={{
              height: '42px',
              width: '280px',
              color: '#fff',
              // border: '1px solid #72F34B',
              margin: 'auto 0px 10px 10px',
              borderRadius: '36px',
              padding: '12px 30px',
            }}
          />
          <Button
            text="Unstake"
            onClick={onConfirm}
            backgroundColor="#72F34B"
            style={{
              height: '42px',
              width: '280px',
              color: '#000',
              border: '1px solid #72F34B',
              margin: 'auto 0px 10px 10px',
              borderRadius: '36px',
              padding: '12px 30px',
            }}
            disabled={isNaN(amount) || Number(amount) <= 0 || new BN(amount).gt(utils.formatEther(stakingAmount))}
          />
        </DialogActions>
        {/* {transactionHashes[0].isApprove && <p className={styles.notice}>Please be patient and no need to approve again, you can check the transaction status on Etherscan.</p>} */}
      </div>
    </Dialog>
  );
};

export default ModalStake;
