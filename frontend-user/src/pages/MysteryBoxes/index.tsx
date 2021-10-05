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
import CountDownTimeV1 from '@base-components/CountDownTime';

const MysteryBoxes = (props: any) => {
  const theme = useTheme();
  const styles = { ...useStyles() };
  const [recall, setRecall] = useState(false);
  const refresh = useCallback(() => {
    setRecall(true);
  }, [setRecall]);

  // const {
  //   data: misteryBoxes = {} as PaginationResult,
  //   loading: loadingcompletePools
  // } = useFetchV1(`/pools/mysterious-box`);
  // console.log('mistyryBoxes', misteryBoxes)

  const slides = [
    { img: '/images/mystery-boxes/img1.png', },
    { img: '/images/mystery-boxes/img2.png', },
    { img: '/images/mystery-boxes/img3.png', },
    { img: '/images/mystery-boxes/img4.png', },
    { img: '/images/mystery-boxes/img5.png', },
  ]

  const [currentBox, setCurrentBox] = useState<{ [k: string]: any }>({upcoming: true});
  // useEffect(() => {
  //   if (misteryBoxes?.data) {

  //   }
  // }, [misteryBoxes]);
  const handleSelectBox = (box: { [k: string]: any }) => {
    const boxCurrent = box;
    if (!boxCurrent.start_time || boxCurrent.start_time * 1000 > Date.now()) {
      boxCurrent.upcoming = true;
    } else if (boxCurrent.finish_time * 1000 > Date.now()) {
      boxCurrent.sale = true;
    } else {
      boxCurrent.over = true;
    }
    setCurrentBox(boxCurrent);
  }
  const onSelectBox = (box: any) => {
    console.log(box);
    handleSelectBox(box);
  }

  return (
    <DefaultLayout>
      {/* {loadingcompletePools && !currentBox?.title ?
        <Backdrop open={loadingcompletePools} style={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, }}>
          <CircularProgress color="inherit" />
        </Backdrop> : */}
      <section className={styles.section}>
        <div className="banner" style={{ backgroundImage: 'url("/images/mystery-boxes/robot1.jpg")' }}>
        </div>

        <div className={styles.content}>
          <div className="detail-box">
            <h1>
              {/* {currentBox.title} */}
              MECH MASTER<br /> MYSTERY NFT BOXES SALE
            </h1>
            <div className={clsx("status", { upcoming: currentBox.upcoming, sale: currentBox.sale, over: currentBox.over })}>
              <span>
                {currentBox.upcoming && 'Upcoming'}
                {currentBox.sale && 'ON SALE'}
                {currentBox.over && 'Sold Out'}
              </span>
            </div>
            <div className="desc">
              In the Mech universe, you are challenged to collect giant fighting machines and futuristic weapons to save the world. 
              Being an experienced pilot in Augmented Reality, you set yourself apart from other players with unique tactics and sharp decision making skill.
            </div>

            {/* <div className="detail-items">
                <div className="item">
                  <label>TOTAL SALE</label>
                  <span>5,0000 Boxes</span>
                </div>
                <div className="item">
                  <label>PRICE</label>
                  <span>0.5 ETH</span>
                </div>
                <div className="item">
                  <label>SUPPORTED</label>
                  <span className="icon">POLYGON <img src="/images/polygon.svg" alt="" /></span>
                </div>
              </div> */}
            <div className="countdown-box">
              <CountDownTimeV1 time={{ date1: 1633528800000, date2: Date.now() }} className="countdown" />
              {/* <Link to="/mystery-box/88" className="btn">
                  JOIN NOW
                </Link> */}
            </div>
          </div>
        </div>
        {/* <div className="wrapper-slides">
            <div className="slides">
              {slides.map((sl, id) => <div key={id} className={clsx("slide", { active: id === 1 })}>
                <img src={sl.img} alt="" />
                <div className={clsx("detail")}>
                  <div className={clsx("info", { upcoming: true })}>
                    <h3>Upcoming</h3>
                    <h2>Mech Master Mystery Box </h2>
                    <div className="countdown">
                      <span>OPEN IN</span>
                      <div className="time">20h : 31m</div>
                    </div>
                  </div>
                </div>
              </div>)}

            </div>
          </div> */}

      </section>

      {/* } */}
    </DefaultLayout>

  );
};

export default withWidth()(withRouter(MysteryBoxes));
