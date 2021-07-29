import React, { useEffect, useState } from 'react';
import useStyles from "../style";
import {renderErrorCreatePool} from "../../../utils/validate";

function TokenLogo(props: any) {
  const classes = useStyles();
  const {
    register, errors,
    poolDetail, watch, setValue, getTokenInforDetail
  } = props;
  const renderError = renderErrorCreatePool;

  const [disabled, setDisabled] = useState<boolean>(false)
  const wacthTokenAddress = watch('token')

  useEffect(()=>{
    if (!wacthTokenAddress) {
      return 
    }

    getTokenInforDetail(wacthTokenAddress)
    .then((tokenInfo: any)  => {
      if (tokenInfo.symbol) {
        setValue('token_symbol', tokenInfo.symbol);
        setDisabled(true);
      }
    })
    .catch((e: any)=>{
      console.log(e)
    })
  }, [getTokenInforDetail, wacthTokenAddress, setValue]);

  return (
    <>
    {JSON.stringify(poolDetail?.tokenInfo)}
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Tokens Symbol</label>
        <input
          type="text"
          name='token_symbol'
          disabled={disabled}
          defaultValue={poolDetail?.symbol}
          ref={register({ required: true })}
          className={classes.formControlInput}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'token_symbol')
          }
        </p>
      </div>
    </>
  );
}

export default TokenLogo;
