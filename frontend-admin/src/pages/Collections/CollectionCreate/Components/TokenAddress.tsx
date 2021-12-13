import React from 'react'
import useStyles from "../style";


function TokenAddress(props: any) {
  const classes = useStyles();
  const { register, collectionDetail } = props;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Token Address</label>
        <div className={classes.formControlInputLoading}>
          <input
            type="text"
            name='token_address'
            maxLength={255}
            ref={register({ required: true })}
            defaultValue={collectionDetail?.token_address}
            className={classes.formControlInput}
          />
        </div>
      </div>
    </>
  );
}

export default TokenAddress;
