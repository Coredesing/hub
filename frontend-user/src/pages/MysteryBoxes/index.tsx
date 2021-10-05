import React, { useCallback, useEffect, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import clsx from 'clsx';
import useStyles from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth from '@material-ui/core/withWidth';
import { useFetchV1 } from '../../hooks/useFetch';
import { TOKEN_TYPE } from '../../constants';
import { PaginationResult } from '../../types/Pagination';
import { Backdrop, CircularProgress, Link, useTheme, Button } from '@material-ui/core';
import { getRoute } from './utils';
import CountDownTimeV1 from '@base-components/CountDownTime';

const MysteryBoxes = (props: any) => {
  const theme = useTheme();
  const styles = { ...useStyles() };
  const [recall, setRecall] = useState(false);
  const refresh = useCallback(() => {
    setRecall(true);
  }, [setRecall]);

  const {
    data: compeltePools = {} as PaginationResult,
    loading: loadingcompletePools
  } = useFetchV1(`/pools/complete-sale-pools?token_type=${TOKEN_TYPE.ERC721}&limit=10&page=1`);

  const slides = [
    { img: '/images/mystery-boxes/img1.png', },
    { img: '/images/mystery-boxes/img2.png', },
    { img: '/images/mystery-boxes/img3.png', },
    { img: '/images/mystery-boxes/img4.png', },
    { img: '/images/mystery-boxes/img5.png', },
  ]

  return (
    <DefaultLayout>
      <section className={styles.section}>
        <div className="box-shadow"></div>
        <div className="banner" style={{ backgroundImage: 'url("/images/mystery-boxes/robot-banner.png")' }}>
        </div>

        <div className={styles.content}>
          <div className="detail-box">
            <h1>MECH MASTER MYSTERY NFT BOXES SALE ROUND 1</h1>
            <div className={clsx("status", { upcoming: true, sale: false, over: false })}>
              <span>Upcoming</span>
            </div>
            <div className="desc">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
            </div>

            <div className="detail-items">
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
            </div>
            <div className="countdown-box">
              <div className="countdown">
                <CountDownTimeV1 time={{ days: 1, hours: 1, minutes: 1, seconds: 44 }} />
              </div>
              <Button className="btn">
                JOIN NOW
              </Button>
            </div>
          </div>
        </div>
        <div className="wrapper-slides">
          <div className="slides">
            {slides.map((sl, id) => <div key={id} className="slide">
              <img src={sl.img} alt="" />
            </div>)}

          </div>
        </div>

      </section>
    </DefaultLayout>

  );
};

export default withWidth()(withRouter(MysteryBoxes));
