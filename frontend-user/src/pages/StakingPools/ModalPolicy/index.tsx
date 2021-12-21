import { useEffect, useMemo, useState } from 'react';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import Button from '../Button';
import { Dialog, DialogTitle, DialogContent, DialogActions, Link, Box } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getUserTier } from '@store/actions/sota-tiers';
import useAuth from '@hooks/useAuth';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
const closeIcon = '/images/icons/close.svg';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ModalPolicy = (props: Props) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();
  const dispatch = useDispatch();
  const { connectedAccount, wrongChain } = useAuth();

  const {
    open,
    onConfirm,
    onClose,
  } = props;
  useEffect(() => {
    dispatch(getUserTier(!wrongChain && connectedAccount ? connectedAccount : ''));
  }, [wrongChain, connectedAccount, dispatch]);

  const listPolicy = useMemo(() => {
    return [
      'You will get a refund if you lose all future token releases in an IGO pool due to an unstake lowering your rank. The refund is calculated based on the number of tokens left in the pool, which you are not eligible to claim, and the token’s IGO price.',
      'Within the last three working days of the month that you lost your ability to claim, this refund will be airdropped directly to your wallet address.',
      'The forfeited token vestings will be redistributed to the GameFi Development fund, further developing the GameFi platform and ecosystem.'
    ]
  }, [])

  const [check, setCheck] = useState<Map<number, boolean>>(new Map([]));
  const [warningText, setWarningText] = useState('');
  const onToggleCheck = (key: number) => {
    setCheck((data) => {
      const newMap = new Map(data);
      if (newMap.has(key)) {
        newMap.delete(key)
      } else {
        newMap.set(key, true);
      }
      return newMap;
    })
  }

  const onNext = () => {
    if (check.size < 2) {
      setWarningText('');
      return;
    }
    setWarningText('');
    onConfirm && onConfirm();
  }

  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className={commonStyles.modal + ' ' + styles.modal}
      classes={{
        paper: 'paperModal'
      }}
    >
      <div className="modal-content">
        <DialogTitle id="alert-dialog-slide-title" className="modal-content__head">
          <img src={closeIcon} alt="" onClick={onClose} className="btn-close" />
          <div className="title">Warning</div>
        </DialogTitle>
        <DialogContent className="modal-content__body">
          <div className="policy-list">
            <ul className='grid grid-c-1fr' style={{ gap: '10px' }}>
              {
                listPolicy.map((text, id) => <li key={id}>
                  <Box display={"grid"} gridTemplateColumns={"10px auto"} gridGap={"6px"}>
                    <span style={{ display: 'block', width: '6px', height: '6px', borderRadius: '50%', background: '#fff', opacity: '0.4', marginTop: '5px' }}></span>
                    <p className='text-white firs-neue-font font-14px'>{text}</p>
                  </Box>
                </li>)
              }
            </ul>
          </div>
          <div className="checked-policy">
            <List>

              <ListItem
                className='pointer'
                classes={{
                  root: 'pd-0-imp'
                }}
                onClick={() => onToggleCheck(1)}
              >
                <ListItemIcon
                  classes={{ root: styles.rootItemIcon }}
                >
                  <Checkbox
                    edge="start"
                    color="default"
                    tabIndex={-1}
                    checked={check.has(1)}
                    disableRipple
                    classes={{
                      root: styles.rootCheckbox,
                      checked: styles.checkedCheckbox
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={<>
                  <span className='firs-neue-font font-14px'>
                    I have read full policy at&nbsp;
                    <Link onClick={(e) => {e.stopPropagation()}} href="https://medium.com/gamefi-official/new-staking-and-unstaking-policy-updates-on-gamefi-launchpad-77c67c536627" target={"_blank"} className="text-green-imp bold">
                      New staking policy
                    </Link>.
                  </span>
                </>} />
              </ListItem>
              <ListItem
                className='pointer'
                classes={{
                  root: 'pd-0-imp'
                }}
                onClick={() => onToggleCheck(2)}
              >
                <ListItemIcon
                  classes={{ root: styles.rootItemIcon }}
                >
                  <Checkbox
                    edge="start"
                    color="default"
                    checked={check.has(2)}
                    tabIndex={-1}
                    disableRipple
                    classes={{
                      root: styles.rootCheckbox,
                      checked: styles.checkedCheckbox
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={<>
                  <span className='firs-neue-font font-14px'>
                    I have understood and agree to the policy.
                  </span>
                </>} />
              </ListItem>
            </List>
            {
              warningText &&
              <Box marginTop={"10px"}>
                <p className='text-danger font-12px firs-neue-font'>{warningText}</p>
              </Box>
            }
          </div>
        </DialogContent>
        <DialogActions className="modal-content__foot">
          <Button
            text="Cancel"
            onClick={onClose}
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
            text="Next"
            onClick={onNext}
            disabled={check.size < 2}
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
          />
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ModalPolicy;
