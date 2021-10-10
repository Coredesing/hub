import React, {useEffect} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import {MenuItem, Select} from "@material-ui/core";
import {renderErrorCreatePool} from "../../../utils/validate";
import {TIERS} from "../../../constants";

function MinTier(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail) {
      setValue('minTier', poolDetail.min_tier);
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <FormControl component="fieldset">
        <label className={classes.formControlLabel}>Min Ranking</label>
        <Controller
          rules={{ required: true }}
          control={control}
          defaultValue={poolDetail ? poolDetail.min_tier : 1}
          name="minTier"
          as={
            <Select
              labelId="minTier"
              id="minTier"
              name="minTier"
              value={poolDetail ? poolDetail.min_tier : 1}
              // onChange={handleChange}
              disabled={isDeployed}
            >
              {
                TIERS.map((value, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={index}
                    >
                      {value}
                    </MenuItem>
                  )
                })
              }
            </Select>
          }
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'minTier')
          }
        </p>
      </FormControl>
      <br/>
    </>
  );
}

export default MinTier;
