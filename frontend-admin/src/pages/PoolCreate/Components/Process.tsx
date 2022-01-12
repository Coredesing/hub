import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";

function Process(props: any) {
  const classes = useStyles();
  const {
    setValue, control, watch,
    poolDetail
  } = props;

  useEffect(() => {
    if (poolDetail && poolDetail.process) {
      setValue('process', poolDetail.process);
    }
  }, [poolDetail]);

  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Process</label>

          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue="all"
            name="process"
            as={
              <RadioGroup row>
                <FormControlLabel
                  value="all" control={<Radio />}
                  label="All"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value="only-buy" control={<Radio />}
                  label="Only Buy"
                  disabled={isDeployed}
                />
                <FormControlLabel
                  value="only-claim" control={<Radio />}
                  label="Only Claim"
                  disabled={isDeployed}
                />
                <FormControlLabel
                    value="only-stake" control={<Radio />}
                    label="Only Stake"
                    disabled={isDeployed}
                />
                <FormControlLabel
                    value="only-auction" control={<Radio />}
                    label="Only Auction"
                    disabled={isDeployed}
                />
              </RadioGroup>
            }
          />
        </FormControl>
      </div>
    </>
  );
}

export default Process;
