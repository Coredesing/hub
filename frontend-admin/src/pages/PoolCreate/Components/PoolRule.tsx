import React, {useEffect, useState} from 'react';
import useStyles from "../style";

function PoolRule(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors,
    poolDetail
  } = props;

  const defaultValue = '';
  const [rule, setRule] = useState(defaultValue);

  useEffect(() => {
    if (poolDetail && poolDetail.rule) {
      setValue('rule', poolDetail.rule);
      setRule(poolDetail.rule);
    }
  }, [poolDetail]);
  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formCKEditor}>
        <label className={classes.formControlLabel}>Rule: </label>

        <textarea
          value={rule}
          name="rule"
          ref={register({
          })}
          onChange={e => setRule(e?.target?.value)}
          className={classes.formControlInput}
          rows={10}
          cols={50}
          // maxLength={1000}
        />

      </div>
    </>
  );
}

export default PoolRule;
