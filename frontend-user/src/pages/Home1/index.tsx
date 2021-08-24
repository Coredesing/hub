import React, { useState } from 'react';
import { Button, TextField, Link } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import useStyles, { useCardStyles } from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import { useFetchV1 } from '../../hooks/useFetch';
import { Card } from './Card';
import { PartnerCard } from './PartnerCard';
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRowBody,
  TableRowHead,
  TableSortLabel,
} from '../../components/Base/Table';

type Data = { [k: string]: any }
type ResponseData = {
  data: Data[],
  lastPage: number,
  page: number,
  perPage: number,
  total: number
}

const Home = (props: any) => {
  const styles = { ...useStyles(), ...useCardStyles() };

  const {
    data: ticketSales = {} as ResponseData,
    loading: loadingActivePools
  } = useFetchV1('/pools/token-type?token_type=erc721&page=1&limit=4');
  const {
    data: tokenSales = {} as ResponseData,
    loading: loadingUpcomingPools
  } = useFetchV1('/pools/token-type?token_type=erc20&page=1&limit=5');
  const {
    data: perfomances = [] as Data[],
    loading: loadingcompletePools
  } = useFetchV1('/home/performance');

  const cards = [
    { banner: '/images/pools/pool-0.png', seed: 'Private', status: 'Opening' },
    { banner: '/images/pools/pool-1.png', seed: 'Private', status: 'Upcoming' },
    { banner: '/images/pools/pool-2.png', seed: 'Private', status: 'Opening' },
    { banner: '/images/pools/pool-3.png', seed: 'Private', status: 'Opening' },
  ]
  return (
    <DefaultLayout>
      <section className={clsx(styles.banner, styles.section)}>
        <div className="large-text">
          <h1>Dedicated Gaming Launchpad & IGO</h1>
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="url(#paint0_radial)" />
            <g clip-path="url(#clip0)">
              <path d="M48.7619 153.022C49.9194 153.022 50.8577 152.084 50.8577 150.927C50.8577 149.769 49.9194 148.831 48.7619 148.831C47.6044 148.831 46.666 149.769 46.666 150.927C46.666 152.084 47.6044 153.022 48.7619 153.022Z" fill="#72F34B" />
              <path d="M102.293 99.8643C103.448 99.8643 104.385 98.9278 104.385 97.7726C104.385 96.6174 103.448 95.6809 102.293 95.6809C101.138 95.6809 100.201 96.6174 100.201 97.7726C100.201 98.9278 101.138 99.8643 102.293 99.8643Z" fill="#72F34B" />
              <path d="M129.684 71.2562C128.002 69.5745 125.766 68.6487 123.389 68.6487C121.011 68.6487 118.775 69.5749 117.094 71.2562C113.622 74.7274 113.622 80.3754 117.094 83.8464C118.829 85.5821 121.109 86.4496 123.389 86.4496C125.668 86.4496 127.948 85.5816 129.684 83.8464C133.155 80.3752 133.155 74.7272 129.684 71.2562ZM126.726 80.8883C124.886 82.7283 121.891 82.7283 120.051 80.8883C118.211 79.0483 118.211 76.0541 120.051 74.2139C120.943 73.3224 122.128 72.8316 123.389 72.8316C124.649 72.8316 125.834 73.3224 126.726 74.2139C128.566 76.0541 128.566 79.0483 126.726 80.8883Z" fill="#72F34B" />
              <path d="M72.7936 132.385C71.7594 131.87 70.504 132.291 69.989 133.325L67.4977 138.328C66.4144 140.504 64.2356 141.958 61.811 142.124L58.9135 142.322C58.4237 142.355 58.1017 142.111 57.9527 141.962C57.8037 141.813 57.5592 141.49 57.5925 141.001L57.7908 138.104C57.9569 135.679 59.4115 133.5 61.5865 132.417L66.5894 129.926C67.6236 129.411 68.0444 128.155 67.5294 127.121C67.0146 126.087 65.759 125.666 64.7248 126.181L59.7219 128.672C56.2235 130.415 53.8844 133.919 53.6173 137.818L53.4189 140.715C53.3119 142.279 53.886 143.812 54.9944 144.92C56.0148 145.94 57.395 146.508 58.8283 146.508C58.9515 146.508 59.0754 146.504 59.1992 146.496L62.0967 146.297C65.9958 146.03 69.5 143.691 71.2421 140.193L73.7334 135.19C74.2484 134.156 73.8275 132.9 72.7936 132.385Z" fill="#72F34B" />
              <path d="M151.889 48.371C150.908 47.4042 149.556 46.8985 148.182 46.9879L146.235 47.1121C128.773 48.2269 112.43 56.6558 101.398 70.238L96.8142 75.8815L84.8177 75.5292C84.7973 75.5286 84.7767 75.5284 84.7565 75.5284C75.2423 75.5284 66.2975 79.2334 59.5698 85.9609L47.2827 98.2482C46.6983 98.8326 46.5127 99.7066 46.8093 100.478C47.106 101.249 47.8289 101.774 48.6543 101.816L74.6635 103.152L73.6031 104.458C73.0687 105.116 72.9842 106.031 73.3894 106.776C73.7969 107.525 74.224 108.262 74.6694 108.988L68.5014 116.31C67.9742 116.936 67.8606 117.812 68.2104 118.552C69.5577 121.399 71.3458 123.957 73.5258 126.155C75.7587 128.407 78.3698 130.248 81.2861 131.628C81.5711 131.763 81.8767 131.829 82.1804 131.829C82.6515 131.829 83.1186 131.67 83.4986 131.362C84.8273 130.284 86.3592 129.006 87.8409 127.769C88.8969 126.888 89.9773 125.987 90.9871 125.155C91.5898 125.518 92.2 125.87 92.8194 126.207C93.1327 126.377 93.4763 126.461 93.8186 126.461C94.274 126.461 94.7265 126.313 95.1011 126.022L96.5267 124.916L97.8688 151.034C97.9113 151.86 98.4357 152.583 99.2069 152.879C99.4511 152.973 99.7048 153.019 99.9569 153.019C100.502 153.019 101.037 152.806 101.436 152.406L113.724 140.119C120.451 133.391 124.156 124.446 124.156 114.932V103.475L129.003 99.7132C143.53 88.4403 152.378 71.4415 153.277 53.0752L153.327 52.0573C153.395 50.6815 152.87 49.3381 151.889 48.371ZM53.5668 97.8799L62.5277 88.919C68.4579 82.9888 76.3408 79.7196 84.7263 79.7115L93.494 79.969L77.9294 99.1316L53.5668 97.8799ZM85.1609 124.557C84.069 125.468 82.9496 126.402 81.9108 127.257C79.9017 126.169 78.0842 124.811 76.4958 123.209C74.9575 121.658 73.6481 119.892 72.5923 117.947L77.1081 112.586C78.4735 114.418 79.9681 116.153 81.5827 117.778C81.584 117.78 81.5852 117.781 81.5865 117.782C81.5869 117.782 81.5873 117.783 81.5877 117.783C81.5883 117.784 81.589 117.785 81.5896 117.785C83.3798 119.587 85.3054 121.24 87.3481 122.735C86.6269 123.334 85.8879 123.951 85.1609 124.557ZM119.974 114.932C119.974 123.329 116.704 131.223 110.766 137.161L101.805 146.122L100.555 121.79L119.973 106.721V114.932H119.974ZM149.099 52.8708C148.26 70.0161 140.001 85.8849 126.439 96.4084L93.6352 121.865C90.9148 120.275 88.3792 118.398 86.0586 116.272L97.1182 105.212C97.9348 104.395 97.9348 103.071 97.1182 102.254C96.3013 101.437 94.9769 101.437 94.16 102.254L83.1109 113.303C81.0794 111.054 79.2802 108.607 77.7483 105.99L104.645 72.8753C114.944 60.1963 130.2 52.3275 146.501 51.2871L148.449 51.1629C148.704 51.1471 148.875 51.2738 148.953 51.3513C149.032 51.4285 149.162 51.5967 149.149 51.8531L149.099 52.8708Z" fill="#72F34B" />
            </g>
            <defs>
              <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 100) rotate(90) scale(100)">
                <stop stop-color="#1C4612" />
                <stop offset="1" stop-color="#1C4612" stop-opacity="0" />
              </radialGradient>
              <clipPath id="clip0">
                <rect width="106.667" height="106.667" fill="white" transform="translate(46.666 46.6667)" />
              </clipPath>
            </defs>
          </svg>

        </div>
        <h4 className="small-text">
          GameFi is the <span className="launchpad">first IGO launchpad</span>, with tools to facilitate the success of games.
        </h4>
      </section>
      <section className={clsx(styles.ticketSales, styles.section)}>
        <div className="rectangle">
          <img src="/images/ticket-sale-text.svg" alt="" />
        </div>
        <div className={clsx(styles.content, 'horizontal')}>
          <div className={clsx(styles.contentTitle, 'left')}>
            <h3>Ticket Sales</h3>
            <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque iaculis et magna ut feugiat. Pellentesque varius sagittis velit eget blandit.</h5>
            <Link href="/#/pools/ticket" className={styles.btnDiscover}>Discover</Link>
          </div>
          <div className={clsx(styles.cards, styles.cardsTicketSales)}>
            {
              (ticketSales.data || []).map((card, id) => <Card card={card} key={id} />)
            }

          </div>
        </div>

      </section>
      <section className={clsx(styles.tokenSales, styles.section)}>
        <div className="rectangle">
          <img src="/images/token-sales-text.svg" alt="" />
        </div>
        <div className={clsx(styles.content, 'vertical')}>
          <div className={clsx(styles.contentTitle, 'center')}>
            <h3>Token Sales</h3>
            <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque iaculis et magna ut feugiat. Pellentesque varius sagittis velit eget blandit.</h5>
            <Link href="/#/pools/token" className={styles.btnDiscover}>Discover</Link>
          </div>
          <div className={clsx(styles.cards, styles.cardsTokenSales)}>
            {
              (tokenSales.data || []).map((card, id) => <Card card={card} key={id} className={styles.cardTokenSale} />)
            }
          </div>
        </div>
      </section>
      <section className={clsx(styles.partners, styles.section)}>
        <div className="rectangle">
          <img src="/images/partnership-text.svg" alt="" />
        </div>
        <div className={clsx(styles.content, 'vertical')}>
          <div className={clsx(styles.contentTitle, 'center')}>
            <h3>Partnership</h3>
          </div>
          <div className={clsx(styles.cards, styles.cardsPartnerShip)}>
            {
              cards.map((card, id) => <PartnerCard card={card} key={id} />)
            }
            {
              cards.map((card, id) => <PartnerCard card={card} key={id} />)
            }
            {
              cards.map((card, id) => <PartnerCard card={card} key={id} />)
            }
          </div>
        </div>
      </section>
      <section className={clsx(styles.perfomance, styles.section)}>
        <div className="rectangle">
          <img src="/images/landing/rectangle-1.png" alt="" />
        </div>
        <div className={clsx(styles.content, 'vertical')}>
          <div className={clsx(styles.contentTitle, 'center')}>
            <h3>Perfomance</h3>
          </div>
          <div className={clsx(styles.cards)}>
            <TableContainer style={{ maxHeight: 'calc(57px * 6)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRowHead>
                    <TableCell>Project</TableCell>
                    <TableCell align="left">
                      IDO Price
                    </TableCell>
                    <TableCell align="left">
                      <TableSortLabel order={"asc"}>ATH</TableSortLabel>
                    </TableCell>
                    <TableCell align="left"><TableSortLabel>Holders</TableSortLabel></TableCell>
                    <TableCell align="left"><TableSortLabel>Daily Volume</TableSortLabel></TableCell>
                  </TableRowHead>
                </TableHead>
                <TableBody >
                  {perfomances.map((row, id) => (
                    <TableRowBody key={id}>
                      <TableCell component="th" scope="row">
                        <div className={styles.tbCellProject}>
                          <img src={row.logo} alt="" />
                          <div>
                            <h3>{row.symbol}</h3>
                            <h5>{row.name}</h5>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="left">{row.price}</TableCell>
                      <TableCell align="left"> {row.ath} </TableCell>
                      <TableCell align="left">{row.holders}</TableCell>
                      <TableCell align="left"> {row.volume} </TableCell>
                    </TableRowBody>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default withWidth()(withRouter(Home));
