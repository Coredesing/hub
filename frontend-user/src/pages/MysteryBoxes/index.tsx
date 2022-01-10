import React, { useCallback, useEffect, useState } from 'react';
import { withRouter, useParams, Link } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth from '@material-ui/core/withWidth';
import { useFetchV1 } from '../../hooks/useFetch';
import { TOKEN_TYPE } from '../../constants';
import { PaginationResult, Item } from '../../types/Pagination';
import { Backdrop, CircularProgress, useTheme, Button, useMediaQuery } from '@material-ui/core';
import CountDownTimeV1, { CountDonwRanges } from '@base-components/CountDownTime';
import SlideCard from './components/SlideCard';
import { numberWithCommas } from '@utils/formatNumber';
import { getCurrencyByNetwork } from '@utils/index';
import { getCountdownInfo } from './utils';
import { Helmet } from "react-helmet";
import { Swiper, SwiperSlide } from "swiper/react";
import WrapperContent from '@base-components/WrapperContent';
import { ObjectType } from '@app-types';
import { getIconCurrencyUsdt } from '@utils/usdt';
import Carousel from './components/Carousel'

const MysteryBoxes = (props: any) => {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const styles = { ...useStyles() };
  const [recall, setRecall] = useState(false);
  const refresh = useCallback(() => {
    setRecall(true);
  }, [setRecall]);

  const {
    data: misteryBoxes = {} as PaginationResult,
    loading: loadingcompletePools
  } = useFetchV1(`/pools/mysterious-box?token_type=${TOKEN_TYPE.Box}&limit=10`);

  const [currentBox, setCurrentBox] = useState<{ [k: string]: any }>({ upcoming: true });

  const handleSelectBox = (box: { [k: string]: any }) => {
    const { currencyIcon, currencyName } = getIconCurrencyUsdt({ purchasableCurrency: box.accept_currency, networkAvailable: box.network_available });
    box.currencyName = currencyName;
    setCurrentBox(box);
  }

  const onSelectBox = (box: any) => {
    handleSelectBox(box);
  }

  const [time, setTime] = useState<CountDonwRanges & { title?: string, [k: string]: any }>({ date1: 0, date2: 0 });
  const [compareTime] = useState(Date.now());
  useEffect(() => {
    if ('id' in currentBox) {
      setTime(getCountdownInfo(currentBox, compareTime))
    }
  }, [currentBox]);


  const [mysteryBoxList, setMysteryBoxList] = useState<Item[]>([]);
  useEffect(() => {
    if (misteryBoxes?.data) {
      const listOnSale: Item[] = [];
      const listUpComing: Item[] = [];
      const listFinished: Item[] = [];
      misteryBoxes.data.forEach((pool: Item) => {
        const time = getCountdownInfo(pool, compareTime);
        if (time.isOnsale) {
          listOnSale.push(pool);
        } else if (time.isUpcoming) {
          listUpComing.push(pool)
        } else if (time.isFinished) {
          listFinished.push(pool);
        }
      });
      setMysteryBoxList([...listOnSale, ...listUpComing, ...listFinished]);
    }
  }, [misteryBoxes]);

  useEffect(() => {
    if (mysteryBoxList.length) {
      handleSelectBox(mysteryBoxList[0]);
    }
  }, [mysteryBoxList]);

  return (
    <DefaultLayout hiddenFooter>
      {/*<Helmet>*/}
      {/*  <meta charSet="utf-8" />*/}
      {/*  <title>GameFi - Mystery boxes</title>*/}
      {/*  <meta property="og:image" content="https://gamefi-public.s3.amazonaws.com/mech-banner-new.jpg" />*/}
      {/*</Helmet>*/}

      <WrapperContent useShowBanner={false}>
        {loadingcompletePools && !currentBox?.title ?
          <Backdrop open={loadingcompletePools} style={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, }}>
            <CircularProgress color="inherit" />
          </Backdrop> :
          <section className={styles.section}>
            <Carousel items={mysteryBoxList}></Carousel>
          </section>
        }
      </WrapperContent>
    </DefaultLayout>

  );
};

export default withWidth()(withRouter(MysteryBoxes));
