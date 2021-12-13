import React, {useEffect} from 'react';
import useStyles from "../style";
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";
import { Radio } from 'antd';
import {withRouter} from "react-router";

function CollectionType(props: any) {
  const classes = useStyles();
  const {
    setValue, control,
    collectionDetail,
    register
  } = props;
  
  const options = [
    { label: 'NFT', value: 'nft' },
    { label: 'Box', value: 'box' },
  ];

  useEffect(() => {
    if (!collectionDetail?.type && options?.length) {
      setValue('type', options[0]?.value );
      return;
    }

    setValue('type', collectionDetail?.type );
  }, [collectionDetail]);

  const changeDisplay = async (value: any) => {
    if (!value) {
      return value;
    }
    setValue('type', value);
    return value;
  };

  return (
    <>
      <FormControl className={classes.formControl} component="fieldset">
        <label className={classes.formControlLabel}>Type</label>
        <Controller
          control={control}
          name="type"
          render={(field) => {
            const { value } = field;
            return (
              <Radio.Group
                options={options}
                onChange={ async (event) => {
                  await changeDisplay(event?.target?.value);
                }}
                ref={register({ required: false })}
                value={value}
                optionType="button"
                buttonStyle="solid"
              />
            )
          }}
        />
      </FormControl>
    </>
  );
}

export default withRouter(CollectionType);
