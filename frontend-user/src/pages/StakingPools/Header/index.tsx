import { SearchBox } from '@base-components/SearchBox';
import { ButtonGroup, Button, Switch, FormControlLabel } from '@material-ui/core';
import { useEffect, useState } from 'react';
import useCommonStyle from '../../../styles/CommonStyle';
import { useSwitchStyle, useButtonGroupStyle } from './style';

const iconSearch = 'images/icons/search.svg';

export const DURATION_LIVE = 'live';
export const DURATION_FINISHED = 'finished';

export const POOL_TYPE_ALLOC = 'alloc';
export const POOL_TYPE_LINEAR = 'linear';

export const BENEFIT_ALL = 'all';
export const BENEFIT_IDO_ONLY = 'ido-only';
export const BENEFIT_REWARD_ONLY = 'reward-only';


const StakingHeader = (props: any) => {
  const { durationType, setDurationType, poolType, setPoolType, stakedOnly, setStakedOnly, benefitType, setBenefitType, searchString, setSearchString } = props;
  // const styles = useStyles();
  const commonStyles = useCommonStyle();
  const switchStyle = useSwitchStyle();
  const btnGroupStyle = useButtonGroupStyle();

  useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    const queryBenefit = query.get('benefit')
    switch (queryBenefit) {
      case BENEFIT_ALL:
      case BENEFIT_IDO_ONLY:
      case BENEFIT_REWARD_ONLY:
        setBenefitType(queryBenefit)
        break;
    }
  }, [])

  const selectBenefitType = (type: string) => {
    setBenefitType(type)
    props.history.push('/staking-pools?benefit=' + type)
  }


  return (
    <div className="controller-area">
      <div className="controller-area__left">
        <ButtonGroup color="primary" className={btnGroupStyle.group} aria-label="outlined primary button group">
          <Button
            className={durationType === DURATION_LIVE ? btnGroupStyle.btnActive : btnGroupStyle.btnDisabled}
            onClick={() => { setDurationType(DURATION_LIVE) }}
          >
            Live
          </Button>
          <Button
            className={durationType === DURATION_FINISHED ? btnGroupStyle.btnActive : btnGroupStyle.btnDisabled}
            onClick={() => { setDurationType(DURATION_FINISHED) }}
          >
            Finished
          </Button>
        </ButtonGroup>
        {/* <ButtonGroup color="primary" className={btnGroupStyle.group} aria-label="outlined primary button group">
          <Button 
            className={poolType === POOL_TYPE_ALLOC ? btnGroupStyle.btnActive : btnGroupStyle.btnDisabled}
            onClick={()=> { setPoolType(POOL_TYPE_ALLOC) }}
          >
            Allocation
          </Button>
          <Button 
            className={poolType === POOL_TYPE_LINEAR ? btnGroupStyle.btnActive : btnGroupStyle.btnDisabled}
            onClick={()=> { setPoolType(POOL_TYPE_LINEAR) }}
          >
            Linear Rate
          </Button>
        </ButtonGroup> */}
        <FormControlLabel
          className={switchStyle.formLabel}
          control={<Switch
            name="checkedB"
            checked={stakedOnly}
            onChange={(event) => { setStakedOnly(event.target.checked) }}
            classes={{
              root: switchStyle.root,
              switchBase: switchStyle.switchBase,
              thumb: switchStyle.thumb,
              track: switchStyle.track,
              checked: switchStyle.checked,
            }}
          />}
          label="My Staking Pools"
        />
      </div>
      <div className="controller-area__right">
        {/* <div className="form-control-label">
          <span>Benefits</span>
          <select name="select_benefit" id="select-benefit" value={benefitType} onChange={(e) => selectBenefitType(e.target.value)}>
            <option value="all">
              All
            </option>
            <option value="ido-only">
              With IGO
            </option>
            <option value="reward-only">
              Without IGO
            </option>
          </select>
        </div> */}
        <div className="form-control-label">
          {/* <span>Search</span> */}
          <div className="controller-area__search">
            <SearchBox value={searchString}
              onChange={(e: any) => setSearchString(e.target.value)}
              type="text"
              placeholder="Search pool name"
            // className={commonStyles.nnn1424h} 
            />
            {/* <input
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              type="text"
              placeholder="Search pool name"
              className={commonStyles.nnn1424h}
            /> */}
            {/* <img src={iconSearch} alt="" /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StakingHeader;