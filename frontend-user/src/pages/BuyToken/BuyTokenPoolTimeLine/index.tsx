import { FC, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { convertTimeToStringFormat } from '../../../utils/convertDate';
import { poolStatus } from '../../../utils/getPoolStatus';
import Countdown from '../../../components/Base/Countdown';
import useStyles from './styles';
import { ClickAwayListener, Hidden } from '@material-ui/core';

type Props = {
  currentStatus?: poolStatus | undefined,
  display: string | undefined,
  poolDetails: any,
  countDownDate: Date | undefined,
  onFinishCountdown?: Function
};

const BuyTokenPoolTimeLine: FC<Props> = ({currentStatus, display, poolDetails, countDownDate, onFinishCountdown}) => {
  const [avtiveTooltTip, setAvtiveTooltTip] = useState(-1);
  const [openToolTip, setOpenToolTip] = useState(false);
  const styles = useStyles();
  const joinTimeInDate = poolDetails?.joinTime ? new Date(Number(poolDetails?.joinTime) * 1000) : undefined;
  // const endJoinTimeInDate = poolDetails?.endJoinTime ? new Date(Number(poolDetails?.endJoinTime) * 1000) : undefined;
  const startBuyTimeInDate = poolDetails?.startBuyTime ? new Date(Number(poolDetails?.startBuyTime) * 1000) : undefined;
  // const endBuyTimeInDate = poolDetails?.endBuyTime ? new Date(Number(poolDetails?.endBuyTime) * 1000) : undefined;
  /* const tierStartBuyInDate = new Date(Number(currentUserTier?.start_time) * 1000); */
  /* const tierEndBuyInDate = new Date(Number(currentUserTier?.end_time) * 1000); */
  const releaseTimeInDate = poolDetails?.releaseTime ? new Date(Number(poolDetails?.releaseTime) * 1000) : undefined;

  const statusBarSteps: { name: string, value: string, active: string, tooltip: string }[] = [
    {
      name: 'Upcoming', 
      value: '1', 
      active: 'Upcoming',
      tooltip: `This status is displayed before the pool is opened for swapping. 
                You must apply the Whitelist to join the pool.<br/> 
                ${`Whitelist Application Time: <span>${joinTimeInDate ? convertTimeToStringFormat(joinTimeInDate) : 'TBA'}</span>`}`,
    },
    {
      name: 'Swap', 
      value: '2', 
      active: 'Swap',
      tooltip: `You can start buying tokens when the pool is changed to Swap status.<br/> 
                ${`Token Swap Time is: <span>${startBuyTimeInDate ? convertTimeToStringFormat(startBuyTimeInDate) : 'TBA'}</span>`}`,
    },
    {
      name: 'Filled', 
      value: '3', 
      active: 'Filled',
      tooltip: `Filled status is displayed when the pool reaches its maximum swap value (100%).`,
    },
    {
      name: 'Claimable', 
      value: '4', 
      active: 'Claimable',
      tooltip: `You can claim your purchased tokens when the pool has Claimable status.<br/> 
                ${`Token claim time: <span>${releaseTimeInDate ? convertTimeToStringFormat(releaseTimeInDate) : 'TBA'}</span>`}`,
    },
    {
      name: 'End', 
      value: '5', 
      active: 'Ended',
      tooltip: `The pool will become End after users have claimed their tokens.`,
    },
  ]


  const onClickOutItemTooltip = (index: number) => {
    // console.log(index)
    // if(index !== avtiveTooltTip) {
    //   setOpenToolTip(true)
    // }
  }

  return (
    <section className={styles.sectionBuyTokenPoolTimeLine}>
      <h2 className={styles.title}>Pool Timeline</h2>
      <ul className={styles.statusBarSteps}>
        {
          statusBarSteps?.map((item, index) => {
            return (
              <li key={index} className={`${styles.itemStatusBarSteps} ${item.active === currentStatus ? 'active' : ''}`}>

                <Hidden mdUp>
                  <ClickAwayListener onClickAway={() => onClickOutItemTooltip(index)}>
                    <Tooltip
                      PopperProps={{
                        disablePortal: true,
                      }}
                      onClose={() => setAvtiveTooltTip(-1)}
                      open={(avtiveTooltTip === index)}
                      disableTouchListener
                      title={
                        <span>
                          <div className={styles.nameToolTip}>{item.name}</div>
                          <div className={styles.desToolTip} dangerouslySetInnerHTML={{__html: item.tooltip}}></div>
                        </span>
                      }
                      classes={{ tooltip: styles.customToolTip }}
                      placement="bottom-start"
                    >
                      <span onClick={() => setAvtiveTooltTip(index)} className={`${styles.itemValue} ${item.active === currentStatus ? 'active' : ''}`}>{item.value}</span>
                    </Tooltip>
                    </ClickAwayListener>
                </Hidden>

                <Hidden smDown>
                  <Tooltip 
                    title={
                      <span>
                        <div className={styles.nameToolTip}>{item.name}</div>
                        <div className={styles.desToolTip} dangerouslySetInnerHTML={{__html: item.tooltip}}></div>
                      </span>
                    }
                    classes={{ tooltip: styles.customToolTip }}
                    placement="bottom"
                  >
                    <span className={`${styles.itemValue} ${item.active === currentStatus ? 'active' : ''}`}>{item.value}</span>
                  </Tooltip>
                </Hidden>
                <span className={`${styles.itemName} itemName`}>{item.name}</span>
              </li>
            )
          })
        }
      </ul>

      <h2 className={styles.title2}>{display}</h2>
      { 
        display 
        ? 
          <Countdown startDate={countDownDate} onFinish={onFinishCountdown}/>
        : 
        (
          <>
            {!currentStatus ? <span className={styles.erroCountdown}>TBA. Stay tuned for further updates!</span> : ''}
            {currentStatus === 'Claimable' ? <span className={styles.erroCountdown}>Pool is Claimable</span> : ''}
            {currentStatus === 'Ended' ? <span className={styles.erroCountdown}>Pool is ended</span> : ''}
          </>
        )
      }
    </section>
  );
};

export default BuyTokenPoolTimeLine;