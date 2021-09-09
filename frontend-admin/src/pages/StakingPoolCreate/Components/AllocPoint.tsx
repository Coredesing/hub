import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";
import {utils} from 'ethers'

function AllocPoint(props: any) {
  const classes = useStyles();
  const {
    register, errors, getValues, watch, isEdit,
    poolDetail, contractDetail, stakingPoolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  const [otherAllocPoint, setOtherAllocPoint] = useState(0);
  useEffect(() => {
    if (!isEdit) {
      setOtherAllocPoint(Number(contractDetail?.totalAllocPoint))
      return
    }
    setOtherAllocPoint(Number(contractDetail?.totalAllocPoint) - Number(stakingPoolDetail?.allocPoint))
  }, [contractDetail ,stakingPoolDetail, isEdit])

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Allocation Point</label>
        <input
          type="number"
          name="alloc_point"
          defaultValue={poolDetail?.alloc_point || 0}
          min={0}
          ref={register({ required: true })}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'alloc_point')
          }
        </p>

        <div className={classes.tokenInfo}>
          <div className="tokenInfoBlock">
            <span className="tokenInfoLabel">Total Alloc Point</span>
            <div className="tokenInfoContent">
              {otherAllocPoint + Number(watch('alloc_point'))}
            </div>
          </div>
          <div className="tokenInfoBlock">
            <span className="tokenInfoLabel">Reward per Block</span>
            <div className="tokenInfoContent">
              {utils.formatEther(contractDetail?.allocRewardPerBlock || '0')}
            </div>
          </div>
          <div className="tokenInfoBlock">
            <span className="tokenInfoLabel">Pool Alloc Point</span>
            <div className="tokenInfoContent">
              {Number(watch('alloc_point'))} / {otherAllocPoint + Number(watch('alloc_point'))}
            </div>
          </div>
          <div className="tokenInfoBlock">
            <span className="tokenInfoLabel">Pool Reward per Block</span>
            <div className="tokenInfoContent">
              {
                Number(watch('alloc_point')) * Number(utils.formatEther(contractDetail?.allocRewardPerBlock || '0')) / (otherAllocPoint + Number(watch('alloc_point')))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllocPoint;
