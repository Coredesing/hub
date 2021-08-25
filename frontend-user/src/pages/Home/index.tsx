import React, { useState } from 'react';
import { Button, TextField, Link } from '@material-ui/core';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
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
import { TOKEN_TYPE } from '../../constants';

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
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {
    data: ticketSales = {} as ResponseData,
    loading: loadingActivePools
  } = useFetchV1(`/pools/token-type?token_type=${TOKEN_TYPE.ERC721}&page=1&limit=4`);
  const {
    data: tokenSales = {} as ResponseData,
    loading: loadingUpcomingPools
  } = useFetchV1(`/pools/token-type?token_type=${TOKEN_TYPE.ERC20}&page=1&limit=5`);
  const {
    data: perfomances = [] as Data[],
    loading: loadingcompletePools
  } = useFetchV1('/home/performance');

  const partnerships = [
    { banner: '/images/partnerships/step-hero.png', name: 'Step Hero', website: 'https://stephero.io/' },
    { banner: '/images/partnerships/kaby-arena.png', name: 'Kaby Arena', website: 'https://kabyarena.com/' },
    { banner: '/images/partnerships/bunicorn.png', name: 'Bunicorn', website: 'https://buni.finance/' },
  ]

  const [isShowImgBanner, setIsShowImgModal] = useState(true);
  const onCloseImgBanner = () => {
    setIsShowImgModal(false);
  }
  return (
    <DefaultLayout>
      <section className={clsx(styles.banner, styles.section)}>
        {isShowImgBanner &&
          <div className={styles.wrapperImgBanner}>
            <div className={styles.imgBanner}>
              <Button onClick={onCloseImgBanner} color="primary" className={styles.btnCloseBanner}>
                <img src={'/images/icons/close.svg'} alt="" />
              </Button>
              <div className="text">
                <h4>Parachain Crowdloan</h4>
                <h3>Support the projects by locking your KSM/ DOT & earn tokens as rewards</h3>
              </div>
              <Button className="btn-join">
                Join NOW
              </Button>
            </div>
          </div>
        }

        <div className={styles.wrapperContent}>
          <div className={clsx(styles.bannerContent)}>
          <div className="large-text">
            <h1>Dedicated Gaming Launchpad & IGO</h1>
          </div>
          <h4 className="small-text">
            GameFi is the <span className="launchpad">first IGO launchpad</span>, with tools to facilitate the success of games.
          </h4>
          </div>
        </div>
      </section>
      <section className={clsx(styles.ticketSales, styles.section)}>
        <div className="rectangle gr">
          <img src="/images/ticket-sale-text.svg" alt="" />
        </div>
        <div className={styles.wrapperContent}>
          <div className={clsx(styles.content, {
            'horizontal': !isMdScreen,
            'vertical': isMdScreen
          })}>
            <div className={clsx(styles.contentTitle, {
              'left': !isMdScreen,
              'center': isMdScreen,
            })}>
              <h3>Ticket Sales</h3>
              <h5>Ticket is an item that allows you to join IDO pools. To view information about other Ticket pools, click the Discover button below.</h5>
              <Link href="/#/pools/ticket" className={styles.btnDiscover}>Discover</Link>
            </div>
            <div className={clsx(styles.cards, styles.cardsTicketSales)}>
              {
                (ticketSales.data || []).map((card, id) => <Card card={card} key={id} />)
              }

            </div>
          </div>
        </div>
      </section>
      <section className={clsx(styles.tokenSales, styles.section)}>
        <div className="rectangle bl">
          <img src="/images/token-sales-text.svg" alt="" />
        </div>
        <div className={styles.wrapperContent}>
          <div className={clsx(styles.content, 'vertical')}>
            <div className={clsx(styles.contentTitle, 'center')}>
              <h3>Token Sales</h3>
              <h5>Make sure you have a Ticket to join IDO. To view information about other IDO pools, click the Discover button below.</h5>
              {/* <Link href="/#/" className={styles.btnDiscover}>Discover</Link> */}
            </div>
            <div className={clsx(styles.cards, styles.cardsTokenSales)}>
              {
                (tokenSales.data || []).map((card, id) => <Card card={card} key={id} className={styles.cardTokenSale} />)
              }
            </div>
          </div>
        </div>
      </section>
      <section className={clsx(styles.partners, styles.section)}>
        <div className="rectangle gr">
          <img src="/images/partnership-text.svg" alt="" />
        </div>
        <div className={styles.wrapperContent}>
          <div className={clsx(styles.content, 'vertical')}>
            <div className={clsx(styles.contentTitle, 'center')}>
              <h3>Partnership</h3>
            </div>
            <div className={clsx(styles.cards, styles.cardsPartnerShip)}>
              {
                partnerships.map((card, id) => <PartnerCard card={card} key={id} />)
              }
            </div>
          </div>
        </div>
      </section>
      <section className={clsx(styles.perfomance, styles.section)}>
        <div className="rectangle">
          <img src="/images/landing/rectangle.png" alt="" />
        </div>
        <div className={styles.wrapperContent}>
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
        </div>
      </section>
    </DefaultLayout>
  );
};

export default withWidth()(withRouter(Home));
