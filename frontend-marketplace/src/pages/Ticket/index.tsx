import React, { useCallback, useEffect, useState } from "react";
import { withRouter, useParams } from "react-router-dom";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import { useFetchV1 } from "../../hooks/useFetch";
import { TOKEN_TYPE } from "../../constants";
import NotFoundPage from "../NotFoundPage/ContentPage";
import { Backdrop, CircularProgress, useTheme } from '@material-ui/core';
import ContentTicket from './Ticket';
import TicketBid from './TicketBid';
import MysteryBox from './MysteryBox';
import { isBidorStake, isMysteryBox } from "./utils";
import WrapperContent from "@base-components/WrapperContent";

const Ticket: React.FC<any> = (props: any) => {
  const params = useParams<{ [k: string]: any }>();
  const id = params.id;
  const theme = useTheme();
  const [checkParamType, setCheckParamType] = useState({
    checking: true,
    valid: false,
  });
  const { data: dataTicket = null, loading: loadingTicket } = useFetchV1<any>(
    `/pool/${id}`,
  );
  useEffect(() => {
    if (!loadingTicket) {
      const result = {
        checking: false,
        valid: false
      }
      if (dataTicket) {
        result.valid = [TOKEN_TYPE.ERC721, TOKEN_TYPE.Box].includes(dataTicket.token_type);
      }
      setCheckParamType(result);
    }
  }, [loadingTicket, dataTicket]);

  const render = useCallback((processType, tokenType, id) => {
    if (isMysteryBox(tokenType)) return <MysteryBox id={id} />;
    if (isBidorStake(processType)) return <TicketBid id={id} />;
    return <ContentTicket id={id} />;
  }, []);
  return (
    <DefaultLayout>
      <WrapperContent useShowBanner={false}>
        {
          checkParamType.checking ?
            <Backdrop open={checkParamType.checking} style={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, }}>
              <CircularProgress color="inherit" />
            </Backdrop>
            : (checkParamType.valid ? (
              render(dataTicket?.process, dataTicket?.token_type, id)
            ) : <NotFoundPage />)
        }
      </WrapperContent>
    </DefaultLayout>
  );
};

export default withRouter(Ticket);
