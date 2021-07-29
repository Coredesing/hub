import React, {useEffect, useState} from 'react';
import {Select} from 'antd';
import FormControl from '@material-ui/core/FormControl';
import useStyles from "../styles";
import {renderErrorCreatePool} from "../../../../utils/validate";

const { Option } = Select;
const countries = require('../../../../data/countries.json');

function Country(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, control,
    user
  } = props;
  const renderError = renderErrorCreatePool;
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (user && user.national_id_issuing_country) {
      setValue('country', user.national_id_issuing_country);
      setCountry(user.national_id_issuing_country);
    }
  }, [user]);

  const handleChange = (value: any) => {
    setCountry(value);
    console.log(`selected ${value}`);
  };

  return (
    <>
      <FormControl component="fieldset">
        <Select
          showSearch
          // mode="multiple"
          allowClear
          size={'large'}
          style={{ minWidth: 300 }}
          placeholder="Please select"
          defaultValue={[user.national_id_issuing_country]}
          onChange={handleChange}
          filterOption={(input, option) => {
            return option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
        >
          {countries.map((item: any) => {
            return (
              <Option key={item.code} value={item.code} label={item.name}>
                {item.name || ''}
              </Option>
            )
          })}
        </Select>

        <input
          type={'hidden'}
          value={country}
          ref={register({
            // required: true
          })}
          name={'national_id_issuing_country'}
        />

        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'national_id_issuing_country')
          }
        </p>
      </FormControl>
      <br/>
    </>
  );
}

export default Country;
