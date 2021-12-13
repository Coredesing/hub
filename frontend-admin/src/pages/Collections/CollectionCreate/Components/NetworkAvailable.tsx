import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {renderErrorCreatePool} from "../../../../utils/validate";
import { NETWORK_AVAILABLE } from "../../../../constants";

function NetworkAvailable(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control,
    collectionDetail,
    register,
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (collectionDetail && collectionDetail.network) {
      setValue('network', collectionDetail.network);
    }
  }, [collectionDetail, setValue]);

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Network</label>

          <Controller
            rules={{
              required: true
            }}
            control={control}
            defaultValue="bsc"
            ref={register({ required: false })}
            name="network"
            as={
              <RadioGroup row>
                <FormControlLabel
                    value={NETWORK_AVAILABLE.BSC} control={<Radio />}
                    label="BSC"
                />
                <FormControlLabel
                  value={NETWORK_AVAILABLE.ETH} control={<Radio />}
                  label="Ether"
                />
                <FormControlLabel
                    value={NETWORK_AVAILABLE.POLYGON} control={<Radio />}
                    label="Polygon"
                />
              </RadioGroup>
            }
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'network')
            }
            {
              renderError(errors, 'networkNotMatch')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default NetworkAvailable;
