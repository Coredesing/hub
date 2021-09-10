import React, { useState } from 'react';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import Button from '../Button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import SelectBox from '../../../components/Base/SelectBox';
import { numberWithCommas } from '../../../utils/formatNumber';

const closeIcon = '/images/icons/close.svg'

const ModalSwitchPool = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();

  const {
    open,
    onClose,
    tokenDetails,
    stakingAmount,
    tokenBalance,
    poolsList,
    idSwitched,
  } = props;

  const [toId, setToId] = useState<string>('');
  const onChangeToId = (evt: any) => {
    setToId(evt.target.value);
  }
  const onSwitchPool = () => {
    props.onConfirm(+idSwitched, +toId);
  }

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
          <img src={closeIcon} alt="" onClick={onClose} className="btn-close" />
          <div className="title">Switch pool</div>
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
          <div className="subtitle">
            Switch to Pool
          </div>
          <SelectBox
            classesCustom={{ formControl: styles.fullWidth }}
            value={toId}
            fullWidth
            items={(poolsList || []).filter((p: any) => +p.pool_id > +idSwitched)}
            itemNameShowValue="title"
            itemNameValue="pool_id"
            onChange={onChangeToId} />
          <div className="token-balance">Balance: {numberWithCommas(tokenBalance, 4)} {tokenDetails?.symbol}</div>

        </DialogContent>
        <DialogActions className="modal-content__foot">
          <Button
            text="Switch"
            onClick={onSwitchPool}
            backgroundColor="#3232DC"
            style={{
              height: '42px',
              width: '280px',
              margin: 'auto',
              borderRadius: '36px',
              padding: '12px 30px',
            }}
            disabled={!toId}
          />

        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ModalSwitchPool;
