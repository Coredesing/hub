import React, { useMemo, useState } from 'react';
import MainDefaultLayout from '../../Base/MainDefaultLayout';
import HeaderDefaultLayout from '../../Base/HeaderDefaultLayout';
import FooterLayout from '../../Base/FooterLayout';
import { useCommonStyle } from '../../../styles';
import { Button, Link as LinkMui, useMediaQuery, useTheme } from "@material-ui/core";
// import Particles from "react-tsparticles";
// import { ParticlesOptions } from './constant';

// import useStyles from './styles';
// import { ChainDefault, GAMEFI_ADDRESS } from '../../../constants/network';
// import { getExplorerTransactionAddress } from "../../../utils/network";
const DefaultLayout = ({ style, children, hiddenFooter = false, ...props }: any) => {
  const theme = useTheme();
  // const matchXs = useMediaQuery(theme.breakpoints.down("xs"));
  const commonStyle = useCommonStyle();
  // const styles = useStyles();
  const particlesInit = (main: any) => {
    // console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  };

  const particlesLoaded = (container: any) => {
    // console.log(container);
  };
  return (
    <div className={commonStyle.DefaultLayout} style={style}>
      <div className={commonStyle.bgBody}>
        {/* <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={ParticlesOptions as any} /> */}
        <HeaderDefaultLayout />
        <MainDefaultLayout >{children}</MainDefaultLayout>
        {!hiddenFooter && <FooterLayout />}

      </div>
    </div>
  );
};

export default DefaultLayout;
