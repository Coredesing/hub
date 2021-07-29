import React from 'react';
import WhitelistSocialField from "./WhitelistSocialField";
import useStyles from "../../style";

function WhitelistSocialRequirement(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, control,
    poolDetail,
  } = props;

  return (
    <>
      <div><label className={classes.exchangeRateTitle}>Whitelist Social Requirements</label></div>
      <WhitelistSocialField
        fieldName={'self_twitter'}
        placeholder={'E.g: PolkaFoundry'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'self_group'}
        placeholder={'E.g: PolkaFoundry'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'self_channel'}
        placeholder={'E.g: PolkaFoundryANN'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'self_retweet_post'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'self_retweet_post_hashtag'}
        placeholder={'E.g: #RedKite $PKF'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'partner_twitter'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'partner_group'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'partner_channel'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'partner_retweet_post'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <WhitelistSocialField
        fieldName={'partner_retweet_post_hashtag'}
        placeholder={'E.g: #RedKite $PKF'}
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />
    </>
  );
}

export default WhitelistSocialRequirement;
