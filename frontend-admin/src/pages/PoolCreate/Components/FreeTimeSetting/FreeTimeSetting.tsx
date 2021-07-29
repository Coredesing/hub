import React from 'react';
import useStyles from "../../style";
import StartTimeFreeBuy from "./StartTimeFreeBuy";
import MaxBonus from "./MaxBonus";

function FreeTimeSetting(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, control,
    poolDetail,
  } = props;

  return (
    <>
      <div className={classes.exchangeRate}>
        <div>
          <label className={classes.exchangeRateTitle}>Free Buy Time Settings</label>
          <div style={{ color: 'blue' }}>
            This section setting only apply for User Applied Whitelist
          </div>
        </div>

        <StartTimeFreeBuy
          poolDetail={poolDetail}
          register={register}
          setValue={setValue}
          errors={errors}
          control={control}
          watch={watch}
        />

        <MaxBonus
          poolDetail={poolDetail}
          register={register}
          setValue={setValue}
          errors={errors}
          control={control}
          watch={watch}
        />

      </div>

    </>
  );
}

export default FreeTimeSetting;
