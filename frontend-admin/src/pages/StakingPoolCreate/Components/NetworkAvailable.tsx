import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Controller } from "react-hook-form";
import {renderErrorCreatePool} from "../../../utils/validate";
import {
  POLYGON_NETWORK_ACCEPT_CHAINS,
  BSC_NETWORK_ACCEPT_CHAINS,
  ETH_NETWORK_ACCEPT_CHAINS,
  NETWORK_AVAILABLE
} from "../../../constants";
import {useSelector} from "react-redux";

function NetworkAvailable(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control, isEdit,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  const { currentNetworkId } = useSelector((state: any) => state).userCurrentNetwork;

  useEffect(() => {
    if (poolDetail && poolDetail.network_available) {
      setValue('network_available', poolDetail.network_available);
    }
  }, [poolDetail]);

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Network Available</label>

          <Controller
            rules={{
              required: true,
              validate: {
                networkNotMatch: value => {
                  // Validate Only click Deploy button
                  let acceptNet = '';
                  switch (value) {
                    case 'bsc':
                      acceptNet = BSC_NETWORK_ACCEPT_CHAINS[currentNetworkId]
                      break
                    case 'polygon':
                      acceptNet = POLYGON_NETWORK_ACCEPT_CHAINS[currentNetworkId]
                      break
                    default:
                      acceptNet = ETH_NETWORK_ACCEPT_CHAINS[currentNetworkId]
                  }

                  if (!acceptNet) {
                    console.log('Network Deploy not match!!!');
                    return false;
                  }
                  return true;
                }
              }
            }}
            control={control}
            defaultValue="bsc"
            name="network_available"
            as={
              <RadioGroup row>
                <FormControlLabel
                    value={NETWORK_AVAILABLE.BSC} control={<Radio />}
                    label="BSC"
                />
                <FormControlLabel
                  value={NETWORK_AVAILABLE.ETH} control={<Radio />}
                  label="Ether"
                  disabled={isEdit && poolDetail?.network_available}
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
              renderError(errors, 'network_available')
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
