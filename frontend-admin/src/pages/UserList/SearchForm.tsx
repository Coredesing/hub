import React from 'react';

import useStyles from './style';
import {useCommonStyle} from "../../styles";
// import {debounce} from "lodash";

const SearchForm = (props: any) => {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    handleSearch,
    seachValue
  } = props;

  return (
    <>
      <div className={classes.headerRight}>
        <div className={commonStyle.boxSearch}>
          <input className={commonStyle.inputSearch} value={seachValue} onChange={handleSearch} placeholder="Search" />
          <img className={commonStyle.iconSearch} src="/images/icon-search.svg" alt="" />
        </div>
      </div>
    </>
  )
};

export default SearchForm;
