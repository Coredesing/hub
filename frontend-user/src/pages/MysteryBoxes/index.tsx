import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth from '@material-ui/core/withWidth';
import useFetch from '../../hooks/useFetch';
import { TOKEN_TYPE } from '../../constants';
import { PaginationResult } from '../../types/Pagination';
import { useRef } from 'react'
import { Backdrop, CircularProgress, useTheme } from '@material-ui/core';
import WrapperContent from '@base-components/WrapperContent';
import Carousel from './components/Carousel'
import List from './components/List'
import ListAuction from './components/ListAuction'

const MysteryBoxes = (props: any) => {
  const theme = useTheme();

  const [url] = useState<string>(`/pools/mysterious-box?token_type=${TOKEN_TYPE.Box}&limit=10&is_featured=1`)

  const {
    data: misteryBoxes = {} as PaginationResult,
    loading
  } = useFetch(url)


  const [now, setNow] = useState<Date>(new Date())
  let interval = useRef<number | undefined>()
  useEffect(() => {
    interval.current = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval.current)
  }, [])

  return (
    <DefaultLayout hiddenFooter style={{backgroundColor: '#15171E'}}>
      <WrapperContent useShowBanner={false}>
        {loading ?
          <Backdrop open={true} style={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, }}>
            <CircularProgress color="inherit" />
          </Backdrop> :
          <>
            <Carousel items={misteryBoxes?.data} style={{paddingBottom: '2rem'}} now={now}></Carousel>
            <ListAuction now={now} />
            <List />
          </>
        }
      </WrapperContent>
    </DefaultLayout>

  );
};

export default withWidth()(withRouter(MysteryBoxes));
