import React, { useCallback, useEffect, useState } from 'react';
import { withRouter, useParams, Link } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth from '@material-ui/core/withWidth';
import { useFetchV1 } from '../../hooks/useFetch';
import { TOKEN_TYPE } from '../../constants';
import { PaginationResult } from '../../types/Pagination';
import { Backdrop, CircularProgress, useTheme, Button } from '@material-ui/core';
import CountDownTimeV1, { CountDonwRanges } from '@base-components/CountDownTime';
import SlideCard from './components/SlideCard';
import { numberWithCommas } from '@utils/formatNumber';
import { getTimelineOfPool, getCurrencyByNetwork } from '@utils/index';

const MysteryBoxes = (props: any) => {
  const theme = useTheme();
  const styles = { ...useStyles() };
  const [recall, setRecall] = useState(false);
  const refresh = useCallback(() => {
    setRecall(true);
  }, [setRecall]);

  const {
    data: misteryBoxes = {} as PaginationResult,
    loading: loadingcompletePools
  } = useFetchV1(`/pools/mysterious-box?token_type=${TOKEN_TYPE.Box}`);

  const [currentBox, setCurrentBox] = useState<{ [k: string]: any }>({ upcoming: true });

  const handleSelectBox = (box: { [k: string]: any }) => {
    const currentBox = box;
    currentBox.countdownTime = { date1: 0, date2: 0 };
    if (!currentBox.start_time || +currentBox.start_time * 1000 > Date.now()) {
      currentBox.upcoming = true;
      if (currentBox.start_time && +currentBox.start_time * 1000 > Date.now()) {
        currentBox.countdownTime.date1 = +currentBox.start_time * 1000;
        currentBox.countdownTime.date2 = Date.now();
      }
    } else if (+currentBox.finish_time * 1000 > Date.now()) {
      currentBox.sale = true;
      currentBox.countdownTime.date1 = +currentBox.finish_time * 1000;
      currentBox.countdownTime.date2 = Date.now();
    } else {
      currentBox.over = true;
    }
    setCurrentBox(currentBox);
  }
  useEffect(() => {
    if (misteryBoxes?.data) {
      handleSelectBox(misteryBoxes?.data[0]);
    }
  }, [misteryBoxes]);

  const onSelectBox = (box: any) => {
    handleSelectBox(box);
  }

  const [time, setTime] = useState<CountDonwRanges & { title?: string }>({ date1: 0, date2: 0 });
  useEffect(() => {
    if ('id' in currentBox) {
      const time = getTimelineOfPool(currentBox);
      if (time.startJoinPooltime > Date.now()) {
        return setTime({ date1: time.startJoinPooltime, date2: Date.now(), title: 'Whitelist start in' })
      }
      if (time.startBuyTime > Date.now()) {
        return setTime({ date1: time.startBuyTime, date2: Date.now(), title: 'Open buy in' })
      }
      if (time.finishTime > Date.now()) {
        return setTime({ date1: time.finishTime, date2: Date.now(), title: 'End buy in' })
      }
      setTime({ date1: 0, date2: 0, title: 'Finished' })
    }
  }, [currentBox]);

  return (
    <DefaultLayout>
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
                  {/* MECH MASTER <br />
                MYSTERY NFT BOXES SALE */}
                  {currentBox.title}
                </h1>
                <div className={clsx("status", { upcoming: true /*currentBox.upcoming, sale: currentBox.sale, over: currentBox.over */ })}>
                  <span>
                    {/* Upcoming */}
                    {currentBox.upcoming && 'Upcoming'}
                    {currentBox.sale && 'ON SALE'}
                    {currentBox.over && 'Sold Out'}
                  </span>
                </div>
                <div className="desc">
                  {currentBox.description || `In the Mech universe, you are challenged to collect giant fighting machines and futuristic weapons to save the world.
                Being an experienced pilot in Augmented Reality, you set yourself apart from other players with unique tactics and sharp decision making skill.`}
                  {/* In the Mech universe, you are challenged to collect giant fighting machines and futuristic weapons to save the world.
                Being an experienced pilot in Augmented Reality, you set yourself apart from other players with unique tactics and sharp decision making skill. */}
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
            <div className="slides">
              {(misteryBoxes?.data || []).map((item) => <SlideCard onSelectItem={onSelectBox} key={item.id} active={currentBox.id === item.id} item={item} />)}
            </div>
          </div>
        </section>
      }
    </DefaultLayout>

  );
};

export default withWidth()(withRouter(MysteryBoxes));
