import React, { useCallback, useEffect, useState } from 'react';
import { withRouter, useParams, Link } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth from '@material-ui/core/withWidth';
import { useFetchV1 } from '../../hooks/useFetch';
import { TOKEN_TYPE } from '../../constants';
import { PaginationResult } from '../../types/Pagination';
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


  const [mysteryBoxList, setMysteryBoxList] = useState<ObjectType<any>[]>([]);
  useEffect(() => {
    if (misteryBoxes?.data) {
      const listOnSale: ObjectType<any>[] = [];
      const listUpComing: ObjectType<any>[] = [];
      const listFinished: ObjectType<any>[] = [];
      misteryBoxes.data.forEach((pool) => {
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
            <div className={styles.contentBox}>
              <div className="banner" style={{ backgroundImage: `url(${currentBox.banner})` }}>
              </div>
              <div className={styles.content}>
                <div className="detail-box">
                  <h1>
                    {currentBox.title}
                  </h1>
                  <div className={clsx("status", { upcoming: time.isUpcoming, sale: time.isOnsale, over: time.isFinished })}>
                    <span>
                      {time.isUpcoming && 'Upcoming'}
                      {time.isOnsale && 'ON SALE'}
                      {time.isFinished && 'Sold Out'}
                    </span>
                  </div>
                  <div className="desc">
                    {currentBox.description}
                  </div>

                  <div className="detail-items">
                    <div className="item">
                      <label>TOTAL SALE</label>
                      <span>{numberWithCommas(currentBox.total_sold_coin || 0)} Boxes</span>
                    </div>
                    <div className="item">
                      <label>PRICE</label>
                      <span>{currentBox.token_conversion_rate} {getCurrencyByNetwork(currentBox.network_available)}</span>
                    </div>
                    <div className="item">
                      <label>SUPPORTED</label>
                      <span className="icon">{currentBox.network_available} <img src={`/images/icons/${(currentBox.network_available || '').toLowerCase()}.png`} alt="" /></span>
                    </div>
                  </div>
                  <Link to={`/mystery-box/${currentBox.id}`} className={styles.btnJoin}>
                    JOIN NOW
                  </Link>
                </div>
              </div>
              <div className="detail-countdown-box">
                <div className="wrapper-countdown">
                  <span>{time.title}</span>
                  {
                    time.date1 &&
                    <CountDownTimeV1 time={{ date1: time.date1, date2: time.date2 }} className="countdown" />
                  }
                </div>
              </div>
            </div>
            <div className={styles.wrapperSlideBoxes}>
              <div className="slides custom-scroll">
                {
                  isSmScreen ? <Swiper
                    slidesPerView={"auto"}
                    spaceBetween={6}
                    freeMode={true}
                    pagination={{
                      clickable: true,
                    }}
                  >
                    {mysteryBoxList.map((item) => <SwiperSlide style={{ width: '220px' }} key={item.id}> <SlideCard onSelectItem={onSelectBox} key={item.id} active={currentBox.id === item.id} item={item} compareTime={compareTime} /> </SwiperSlide>)}
                  </Swiper> :
                    mysteryBoxList.map((item) => <SlideCard onSelectItem={onSelectBox} key={item.id} active={currentBox.id === item.id} item={item} compareTime={compareTime} />)
                }
              </div>
            </div>
          </section>
        }
      </WrapperContent>
    </DefaultLayout>

  );
};

export default withWidth()(withRouter(MysteryBoxes));
