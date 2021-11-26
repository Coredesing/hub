import React, { useState } from 'react';
import MainDefaultLayout from '../../Base/MainDefaultLayout';
import HeaderDefaultLayout from '../../Base/HeaderDefaultLayout';
import FooterLandingLayout from '../../Base/FooterLandingLayout';
import { useCommonStyle } from '../../../styles';
import { Button, Link as LinkMui, useMediaQuery, useTheme } from "@material-ui/core";
// import useStyles from './styles';
// import { ChainDefault, GAMEFI_ADDRESS } from '../../../constants/network';
// import { getExplorerTransactionAddress } from "../../../utils/network";
const DefaultLayout = ({ style, children, hiddenFooter = false, ...props }: any) => {
  const theme = useTheme();
  // const matchXs = useMediaQuery(theme.breakpoints.down("xs"));
  const commonStyle = useCommonStyle();
  // const styles = useStyles();
  return (
    <div className={commonStyle.DefaultLayout} style={style}>
      <div className={commonStyle.bgBody}>

        <HeaderDefaultLayout />
        <MainDefaultLayout >{children}</MainDefaultLayout>
        {!hiddenFooter && <FooterLandingLayout />}

      </div>
    </div>
  );
};

export default DefaultLayout;
