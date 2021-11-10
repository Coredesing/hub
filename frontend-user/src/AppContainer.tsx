import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import InstallMetameask from './components/Base/InstallMetamask';
import BigNumber from 'bignumber.js';
import {adminRoute, checkIsAdminRoute, checkIsInvestorRoute, publicRoute} from "./utils";
BigNumber.config({ EXPONENTIAL_AT: 50 });
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });


const AppContainer = (props: any) => {
  return (
    <>
      {props.children}
    </>
  );
};

export default withRouter(AppContainer);
