import React from 'react';
import MainDefaultLayout from '../../../components/Base/MainDefaultLayout';
import HeaderCustomLayout from '../HeaderCustomLayout';
import FooterLandingLayout from '../../../components/Base/FooterLandingLayout';
import { useCommonStyle } from '../../../styles';

const CustomLayout = (props: any) => {
  const commonStyle = useCommonStyle();

  return (
    <div className={commonStyle.DefaultLayout}>
      <HeaderCustomLayout/>
      <MainDefaultLayout>{props.children}</MainDefaultLayout>
      <FooterLandingLayout/>
    </div>
  );
};

export default CustomLayout;
