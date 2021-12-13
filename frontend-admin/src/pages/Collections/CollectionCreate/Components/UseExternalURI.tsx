import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import {Checkbox} from "@material-ui/core";
import {renderErrorCreateCollections} from "../../../../utils/validate";

function UseExternalURI(props: any) {
  const classes = useStyles();
  const {
    register, errors, setValue,
    watch, collectionDetail,
  } = props;
  const renderError = renderErrorCreateCollections;
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(Number(watch('use_external_uri')) > 0)
  })

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Use External URI</label>
        <Checkbox 
          checked={checked}
          onChange={(event) => {
            setValue('use_external_uri', event.target.checked ? 1 : 0)
          }}
        />
        <div>
        </div>
        <input
          type="number"
          name="use_external_uri"
          defaultValue={collectionDetail?.use_external_uri}
          min={0}
          ref={register({ required: false })}
          style={{display: 'none'}}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'use_external_uri')
          }
        </p>
      </div>
    </>
  );
}

export default UseExternalURI;
