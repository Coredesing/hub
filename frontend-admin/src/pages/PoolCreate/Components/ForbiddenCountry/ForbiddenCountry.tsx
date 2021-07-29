import React, {useEffect} from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";
import { Controller } from "react-hook-form";

import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import {
  TextField,
  ListItemText,
  Checkbox,
  MenuItem,
  makeStyles
} from "@material-ui/core";


const countries = require('./countries.json');

function ForbiddenCountry(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail, control
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail?.forbidden_countries) {
      setValue('forbidden_countries', poolDetail?.forbidden_countries || []);
    }
  }, [poolDetail, setValue]);


  return (
    <>
      <div className={classes.exchangeRate}>
        <div><label className={classes.exchangeRateTitle}>Forbidden Countries Setting</label></div>

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Forbidden Countries</label>
          <Controller
            control={control}
            name="forbidden_countries"
            defaultValue={poolDetail?.forbidden_countries || ['USA','CHN','HKG','COD','IRN','MMR','SDN','IRQ','CIV','PRK','SYR','ZWE','CUB','BLR','LBR']}
            render={({ onChange, value }) => {
              return (
                <Select
                  label="Countries"
                  className={classes.formControlInput}
                  multiple
                  value={value}
                  onChange={onChange}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected: any) => (
                    <div>
                      {selected?.map((value: any) => (
                        <Chip key={value} label={value} style={{marginRight: '.5rem'}}/>
                      ))}
                    </div>
                  )}
                >
                  {countries.map((country: any) => (
                    <MenuItem key={country.code} value={country.code}>
                      <Checkbox checked={value?.includes(country.code)} />
                      <ListItemText primary={country.name} />
                    </MenuItem>
                  ))}
                </Select>
              );
            }}
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'forbidden_countries')
            }
          </p>
        </div>
      </div>
    </>
  );
}

export default ForbiddenCountry;
