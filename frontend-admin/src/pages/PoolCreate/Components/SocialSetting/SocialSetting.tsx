import React from 'react';
import useStyles from "../../style";
import TwitterLink from "./TwitterLink";
import TelegramLink from "./TelegramLink";
import MediumLink from "./MediumLink";

function SocialSetting(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, control,
    poolDetail,
  } = props;

  return (
    <div className={classes.exchangeRate}>
      <div><label className={classes.exchangeRateTitle}>Social Setting</label></div>

      <TwitterLink
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <TelegramLink
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <MediumLink
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />
    </div>
  );
}

export default SocialSetting;
