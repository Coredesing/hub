import React, { useState } from 'react';
import MainDefaultLayout from '../../Base/MainDefaultLayout';
import HeaderDefaultLayout from '../../Base/HeaderDefaultLayout';
import FooterLandingLayout from '../../Base/FooterLandingLayout';
import { useCommonStyle } from '../../../styles';
import { Button, Link as LinkMui, useMediaQuery, useTheme } from "@material-ui/core";
import useStyles from './styles';
import { ChainDefault, GAMEFI_ADDRESS } from '../../../constants/network';
import { getEtherscanTransactionAddress } from "../../../utils/network";
const DefaultLayout = ({ style, children, hiddenFooter = false, ...props }: any) => {
  const theme = useTheme();
  const matchXs = useMediaQuery(theme.breakpoints.down("xs"));
  const commonStyle = useCommonStyle();
  const [isShowBannerContract, setShowBannerContract] = useState(!!GAMEFI_ADDRESS);
  const onCloseBannerContract = () => {
    setShowBannerContract(false);
  }
  const styles = useStyles();
  const isMultiChildren = (children: any) => {
    return Array.isArray(children);
  }
  return (
    <div className={commonStyle.DefaultLayout} style={style}>
      <div className={commonStyle.bgBody} style={isShowBannerContract ? { paddingTop: matchXs ? '140px' : '160px' } : {}}>

        <HeaderDefaultLayout isShowBannerContract={isShowBannerContract} />
        {isShowBannerContract &&
          <div className={styles.bannerContract}>
            <div className={styles.content}>
              <Button
                onClick={onCloseBannerContract}
                color="primary"
                className={styles.btnCloseBanner}
              >
                <img src={"/images/icons/close.svg"} alt="" />
              </Button>
              <div className={styles.wrapperText}>
                <h3 style={{ marginBottom: '5px' }}>Official GAFI contract address:</h3>
                <h3>
                  <img src={ChainDefault.icon} alt="" />
                  <span>{ChainDefault.name} </span>
                  <LinkMui className={styles.link} target="_blank" href={getEtherscanTransactionAddress({ appChainID: ChainDefault.id, address: GAMEFI_ADDRESS })}>{GAMEFI_ADDRESS}</LinkMui>
                </h3>
              </div>
            </div>
          </div>
        }
        <MainDefaultLayout >{
          isMultiChildren(children) ? children : React.cloneElement(children, {
            ...props,
            isShowBannerContract
          })

        }</MainDefaultLayout>
        {!hiddenFooter && <FooterLandingLayout />}

      </div>
    </div>
  );
};

export default DefaultLayout;
