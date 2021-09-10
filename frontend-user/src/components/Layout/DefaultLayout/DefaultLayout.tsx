import React, { useState } from 'react';
import MainDefaultLayout from '../../Base/MainDefaultLayout';
import HeaderDefaultLayout from '../../Base/HeaderDefaultLayout';
import FooterLandingLayout from '../../Base/FooterLandingLayout';
import { useCommonStyle } from '../../../styles';
import { Button, Link as LinkMui } from "@material-ui/core";
import useStyles from './styles';
import { ChainDefault, GAMEFI_ADDRESS } from '../../../constants/network';
import { getEtherscanTransactionAddress } from "../../../utils/network";
const DefaultLayout = (props: any) => {
  const commonStyle = useCommonStyle();
  const [isShowBannerContract, setShowBannerContract] = useState(!!GAMEFI_ADDRESS);
  const onCloseBannerContract = () => {
    setShowBannerContract(false);
  }
  const styles = useStyles();
  return (
    <div className={commonStyle.DefaultLayout}>
      <div className={commonStyle.bgBody}>
        {isShowBannerContract &&
          <div className={styles.bannerContract}>
            <Button
              onClick={onCloseBannerContract}
              color="primary"
              className={styles.btnCloseBanner}
            >
              <img src={"/images/icons/close.svg"} alt="" />
            </Button>
            <div>
              <h3 style={{ marginBottom: '5px' }}>Official GAFI contract address:</h3>
              <h3>
                {ChainDefault.name}: <LinkMui className={styles.link} target="_blank" href={getEtherscanTransactionAddress({ appChainID: ChainDefault.id, address: GAMEFI_ADDRESS })}>{GAMEFI_ADDRESS}</LinkMui>
              </h3>
            </div>
          </div>
        }
        <HeaderDefaultLayout isShowBannerContract={isShowBannerContract} heightBannerContract={"100px"}/>
        <MainDefaultLayout isShowBannerContract={isShowBannerContract} heightBannerContract={"100px"}>{props.children}</MainDefaultLayout>
        <FooterLandingLayout />
      </div>
    </div>
  );
};

export default DefaultLayout;
