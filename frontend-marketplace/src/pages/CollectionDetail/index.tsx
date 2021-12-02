import React, { useCallback, useEffect, useState } from "react";
import { withRouter, useParams } from "react-router-dom";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import { useFetchV1 } from "../../hooks/useFetch";
import { TOKEN_TYPE } from "../../constants";
import NotFoundPage from "../NotFoundPage/ContentPage";
import { Backdrop, CircularProgress, useTheme } from '@material-ui/core';
import MarketplaceNFT from './NFT';
import WrapperContent from "@base-components/WrapperContent";
import useStyles from './style';

const Page: React.FC<any> = (props: any) => {
  const params = useParams<{ [k: string]: any }>();
  const style = useStyles();
  // const id = params.id;
  // const theme = useTheme();
  // const [checkParamType, setCheckParamType] = useState({
  //   checking: true,
  //   valid: false,
  // });
  // const { data: dataTicket = null, loading: loadingTicket } = useFetchV1<any>(
  //   `/pool/${id}`,
  // );
  // useEffect(() => {
  //   if (!loadingTicket) {
  //     const result = {
  //       checking: false,
  //       valid: false
  //     }
  //     if (dataTicket) {
  //       result.valid = [TOKEN_TYPE.ERC721, TOKEN_TYPE.Box].includes(dataTicket.token_type);
  //     }
  //     setCheckParamType(result);
  //   }
  // }, [loadingTicket, dataTicket]);

  const render = useCallback(() => {
    return <MarketplaceNFT id={params.id} projectAddress={params.projectAddress} />
  }, [params]);
  return (
    <DefaultLayout className={style.backgroundLayout}>
      <WrapperContent useShowBanner={false}>
        {/* {
          checkParamType.checking ?
            <Backdrop open={checkParamType.checking} style={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, }}>
              <CircularProgress color="inherit" />
            </Backdrop>
            : (checkParamType.valid ? ( */}
              {render()}
            {/* ) : <NotFoundPage />)
        } */}
      </WrapperContent>
    </DefaultLayout>
  );
};

export default withRouter(Page);
