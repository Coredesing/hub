import React, { useCallback, useEffect, useState } from "react";
import { Button, TextField, Link } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import clsx from "clsx";
import useStyles, { useCardStyles } from "./style";
import DefaultLayout from "../../components/Layout/DefaultLayout";
import withWidth, { isWidthDown, isWidthUp } from "@material-ui/core/withWidth";
import { useFetchV1 } from "../../hooks/useFetch";
import { Card } from "./Card";
import { PartnerCard } from "./PartnerCard";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRowBody,
  TableRowHead,
  TableSortLabel,
} from "../../components/Base/Table";
import { TOKEN_TYPE } from "../../constants";
import Instruction from "./Instruction";
import TicketSlide from "./TicketSlide";
import MysteryBoxes from "./MysteryBoxes";
import { ObjectType } from "@app-types";
import { getCountdownInfo } from "@pages/MysteryBoxes/utils";
import CountDownTimeV1 from "@base-components/CountDownTime";

type Data = { [k: string]: any };
type ResponseData = {
  data: Data[];
  lastPage: number;
  page: number;
  perPage: number;
  total: number;
};

const Home = (props: any) => {
  const styles = { ...useStyles(), ...useCardStyles() };
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUpScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmUpScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const {
    data: ticketSales = {} as ResponseData,
    loading: loadingActivePools,
  } = useFetchV1(
    `/pools/token-type?token_type=${TOKEN_TYPE.ERC721}&page=1&limit=4`
  );
  const {
    data: tokenSales = {} as ResponseData,
    loading: loadingUpcomingPools,
  } = useFetchV1(
    `/pools/token-type?token_type=${TOKEN_TYPE.ERC20}&page=1&limit=5`
  );
  const {
    data: mysteryBoxes = {} as ResponseData,
    loading: loadingMysteryBoxes,
  } = useFetchV1(`/pools/mysterious-box?token_type=${TOKEN_TYPE.Box}`);


  const [mysteryBoxList, setMysteryBoxList] = useState<ObjectType<any>[]>([]);
  useEffect(() => {
    if (mysteryBoxes?.data?.length) {
      const listOnSale: ObjectType<any>[] = [];
      const listUpComing: ObjectType<any>[] = [];
      const listFinished: ObjectType<any>[] = [];
      const compareTime = Date.now();
      mysteryBoxes.data.forEach((pool) => {
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
  }, [mysteryBoxes]);

  const { data: perfomances = [] as Data[], loading: loadingcompletePools } =
    useFetchV1("/home/performance");

  const partnerships = [
    {
      banner: "/images/partnerships/kaby-arena.png",
      name: "Kaby Arena",
      website: "https://kabyarena.com/",
    },
    // {
    //   banner: "/images/partnerships/bunicorn.png",
    //   name: "Bunicorn",
    //   website: "https://buni.finance/",
    // },
    {
      banner: "/images/partnerships/mechmaster.png",
      name: "Mech Master",
      website: "https://mechmaster.io/",
    },
    {
      banner: "/images/partnerships/deathroad.jpg",
      name: "Death Road",
      website: "https://deathroad.io/",
    },
    {
      banner: "/images/partnerships/heroverse.png",
      name: "Heroverse",
      website: "https://heroverse.io/",
    },
    {
      banner: "/images/partnerships/darkfrontier.png",
      name: "Dark Frontier",
      website: "https://www.darkfrontiers.com/",
    },
  ];

  const [isShowImgBanner, setIsShowImgModal] = useState(true);
  const onCloseImgBanner = () => {
    setIsShowImgModal(false);
  };

  const [listPerfomance, setListPerfomance] = useState<Data[]>([]);

  useEffect(() => {
    if (!loadingcompletePools) {
      perfomances.map((data) => {
        data.profit = "";
        if (data.ath === "N/A" || !data.ath || data.ath.length < 1) {
          return data;
        }

        if (data.price === "N/A" || !data.price || data.price.length < 1) {
          return data;
        }
        let profit = "";

        try {
          const floatPrice = parseFloat(
            data.price[0] === "$" ? data.price.slice(1) : data.price
          );
          const floatAth = parseFloat(
            data.ath[0] === "$" ? data.ath.slice(1) : data.ath
          );
          profit = (floatAth / floatPrice).toFixed(1);
        } catch (e) { }

        data.profit = profit;
        return data;
      });
      setListPerfomance(perfomances);
    }
  }, [perfomances, loadingcompletePools]);

  const [fieldSorted, setFieldSorted] = useState<{
    field: keyof Data;
    order?: "asc" | "desc";
  }>({ field: "" });
  const onSortListPerfomance = (field: keyof Data) => {
    if (field === fieldSorted.field) {
      const sorted = perfomances.sort((a: any, b: any) => {
        const numA =
          +String(a[field]).replace(/\$/i, "").replace(/,/gi, "") || 0;
        const numB =
          +String(b[field]).replace(/\$/i, "").replace(/,/gi, "") || 0;
        return fieldSorted.order === "asc"
          ? numA === numB
            ? -1
            : numA - numB
          : numA === numB
            ? 1
            : numB - numA;
      });
      setListPerfomance(sorted);
      setFieldSorted({
        field,
        order: fieldSorted.order === "asc" ? "desc" : "asc",
      });
    } else {
      const sorted = perfomances.sort((a: any, b: any) => {
        const numA =
          +String(a[field]).replace(/\$/i, "").replace(/,/gi, "") || 0;
        const numB =
          +String(b[field]).replace(/\$/i, "").replace(/,/gi, "") || 0;
        return numA === numB ? 1 : numA - numB;
      });
      setListPerfomance(sorted);
      setFieldSorted({ field, order: "desc" });
    }
  };

  // 11: 11 am utc
  const countdownTimestamp = 1635765060 * 1000;
  const [countdownTime, setCountdownTime] = useState({ date1: countdownTimestamp, date2: Date.now(), isFinish: countdownTimestamp <= Date.now() });
  const onFinishCountdown = useCallback(() => {
    setCountdownTime({ date1: 0, date2: 0, isFinish: true });
  }, [])

  const [isShowSubBanner, setShowSupBanner] = useState(true);
  const onCloseSubBanner = () => {
    setShowSupBanner(false);
  }

  return (
    <DefaultLayout style={{ background: "#0A0A0A" }}>
      <section
        className={clsx(styles.banner, styles.section)}
        style={isShowImgBanner ? { paddingTop: "10px" } : {}}
      >
        {/* {isShowImgBanner && (
          <div className={styles.wrapperImgBanner}>
            <div className={styles.imgBanner}>
              <Button
                onClick={onCloseImgBanner}
                color="primary"
                className={styles.btnCloseBanner}
              >
                <img src={"/images/icons/close.svg"} alt="" />
              </Button>
              <div className="text">
                <h4>Parachain Crowdloan</h4>
                <h3>
                  Support the projects by locking your KSM/ DOT & earn tokens as
                  rewards
                </h3>
              </div>
              <Link
                className="btn-join"
                href="https://polkasmith.polkafoundry.com/"
                target="_blank"
              >
                Join NOW
              </Link>
            </div>
          </div>
        )} */}

        <div className={styles.subBanners}>
          {
            !countdownTime.isFinish && isShowSubBanner && 
            <div className="item">
              <button className="btn-close" onClick={onCloseSubBanner}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.53355 3.83148L7.51736 0.847568C7.71154 0.653477 7.71154 0.339659 7.51736 0.145568C7.32327 -0.0485227 7.00945 -0.0485227 6.81536 0.145568L3.83145 3.12948L0.847636 0.145568C0.653454 -0.0485227 0.339727 -0.0485227 0.145636 0.145568C-0.0485454 0.339659 -0.0485454 0.653477 0.145636 0.847568L3.12945 3.83148L0.145636 6.81539C-0.0485454 7.00948 -0.0485454 7.3233 0.145636 7.51739C0.242364 7.6142 0.369545 7.66284 0.496636 7.66284C0.623727 7.66284 0.750818 7.6142 0.847636 7.51739L3.83145 4.53348L6.81536 7.51739C6.91218 7.6142 7.03927 7.66284 7.16636 7.66284C7.29345 7.66284 7.42055 7.6142 7.51736 7.51739C7.71154 7.3233 7.71154 7.00948 7.51736 6.81539L4.53355 3.83148Z" fill="black" />
                </svg>
              </button>
              <div className="wrapper-countdown wrapper-skew">
                <CountDownTimeV1 className="countdown skew" time={{ date1: countdownTime.date1, date2: countdownTime.date2 }} onFinish={onFinishCountdown} />
              </div>
              <div className="title title-countdown">
                <h5>to the very first $GAFI burning event</h5>
                <h3>🔥 34,400 $GAFI TO BURN 🔥</h3>
              </div>
            </div>
          }
          {
            countdownTime.isFinish && isShowSubBanner && 
            <div className="item">
              <button className="btn-close" onClick={onCloseSubBanner}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.53355 3.83148L7.51736 0.847568C7.71154 0.653477 7.71154 0.339659 7.51736 0.145568C7.32327 -0.0485227 7.00945 -0.0485227 6.81536 0.145568L3.83145 3.12948L0.847636 0.145568C0.653454 -0.0485227 0.339727 -0.0485227 0.145636 0.145568C-0.0485454 0.339659 -0.0485454 0.653477 0.145636 0.847568L3.12945 3.83148L0.145636 6.81539C-0.0485454 7.00948 -0.0485454 7.3233 0.145636 7.51739C0.242364 7.6142 0.369545 7.66284 0.496636 7.66284C0.623727 7.66284 0.750818 7.6142 0.847636 7.51739L3.83145 4.53348L6.81536 7.51739C6.91218 7.6142 7.03927 7.66284 7.16636 7.66284C7.29345 7.66284 7.42055 7.6142 7.51736 7.51739C7.71154 7.3233 7.71154 7.00948 7.51736 6.81539L4.53355 3.83148Z" fill="black" />
                </svg>
              </button>

              <div className="burnday">
                <h4>HAPPY BURN DAY!</h4>
                <div>
                  <span>01 November 2021 </span>
                  <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.749315 3.89812H12.9149C14.2811 3.89812 14.9636 2.24472 13.9952 1.28098C13.7018 0.98892 13.7006 0.514287 13.9927 0.220841C14.2847 -0.0726426 14.7594 -0.0737293 15.0529 0.218292L18.9699 4.11641C18.9701 4.11664 18.9703 4.1169 18.9705 4.11712C19.2632 4.40918 19.2642 4.88535 18.9706 5.17839C18.9704 5.17861 18.9702 5.17887 18.9699 5.1791L15.0529 9.07722C14.7595 9.3692 14.2849 9.36819 13.9928 9.07467C13.7007 8.78122 13.7018 8.30659 13.9953 8.01453C14.9637 7.05078 14.2812 5.39739 12.9149 5.39739H0.749315C0.335291 5.39739 -0.000322342 5.06178 -0.000322342 4.64775C-0.000322342 4.23373 0.335291 3.89812 0.749315 3.89812Z" fill="white" />
                  </svg>
                </div>
              </div>
              <div className="title wrapper-skew">
                <div className="skew">
                  <h3>🔥 34,400 $GAFI BURNT 🔥</h3>
                </div>
              </div>
            </div>
          }
        </div>

        <div
          className={styles.wrapperContent}
        // style={!isShowImgBanner ? { marginTop: -50 } : {}}
        >
          <div className={clsx(styles.bannerContent)}>
            <div className="large-text">
              <h1>Dedicated Gaming Launchpad & IGO</h1>
            </div>
            <h4 className="small-text">
              GameFi is the{" "}
              <span className="launchpad">first IGO launchpad</span>, with tools
              to facilitate the success of games.
            </h4>
          </div>
        </div>
      </section>
      {/* <Instruction /> */}

      {mysteryBoxList.length && (
        <section className={clsx(styles.tokenSales, styles.section)}>
          <div className="rectangle bl">
            <img src="/images/token-sales-text.svg" alt="" />
          </div>
          <div
            className={clsx(styles.wrapperContent, styles.mysteryBoxSection)}
          >
            <div
              className={clsx(styles.content, "vertical")}
              style={{ width: isMdUpScreen ? "40%" : undefined }}
            >
              <div
                className={clsx(styles.contentTitle, isSmScreen ? "center" : undefined)}
                style={{ display: "flex", textAlign: isSmScreen ? "center" : undefined }}
              >
                <h3>Mystery Boxes</h3>
                <h5 style={{ maxWidth: isSmScreen ? undefined : '480px' }}>
                  To view information about Mystery Boxes, click the Discover
                  button below.
                </h5>
                <Link href="/#/mystery-boxes" className={styles.btnDiscover}>
                  Discover
                </Link>
              </div>
              <div className={clsx(styles.cards, styles.cardsTokenSales)} />
            </div>
            <div
              style={{
                width: isMdUpScreen ? "55%" : "80%",
              }}
            >
              <MysteryBoxes mysteryBoxes={mysteryBoxList} />
            </div>
          </div>
        </section>
      )}

      {ticketSales?.data?.length && (
        <section className={clsx(styles.ticketSales, styles.section)}>
          <div className="rectangle gr">
            <img src="/images/ticket-sale-text.svg" alt="" />
          </div>
          <div className={styles.wrapperContent}>
            <div
              className={clsx(styles.content, {
                horizontal: !isMdScreen && !!(ticketSales.data || []).length,
                vertical: isMdScreen || !(ticketSales.data || []).length,
              })}
            >
              <div
                className={clsx(styles.contentTitle, {
                  left: !isMdScreen && !!(ticketSales.data || []).length,
                  center: isMdScreen || !(ticketSales.data || []).length,
                })}
              >
                <h3>Ticket Sales</h3>
                <h5>
                  To view information about other Ticket pools, click the
                  Discover button below.
                </h5>
                <Link href="/#/pools/ticket" className={styles.btnDiscover}>
                  Discover
                </Link>
              </div>
              <div className={clsx(styles.cards, styles.cardsTicketSales)}>
                {(ticketSales.data || []).map((card, id) => (
                  <Card card={card} key={id} title={<h5>{card.title}</h5>} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {tokenSales?.data?.length && (
        <section className={clsx(styles.tokenSales, styles.section)}>
          <div className="rectangle bl">
            <img src="/images/token-sales-text.svg" alt="" />
          </div>
          <div
            className={styles.wrapperContent}
            style={
              isSmScreen
                ? { paddingRight: "28px", paddingLeft: "28px" }
                : undefined
            }
          >
            <div className={clsx(styles.content, "vertical")}>
              <div className={clsx(styles.contentTitle, "center")}>
                <h3>Token Sales</h3>
                <h5>
                  To view information about other IGO pools, click the Discover
                  button below.
                </h5>
                <Link href="/#/pools/token" className={styles.btnDiscover}>
                  Discover
                </Link>
              </div>
              <div className={clsx(styles.cards, styles.cardsTokenSales)} />
            </div>
          </div>
          <TicketSlide data={tokenSales.data} />
        </section>
      )}
      <section className={clsx(styles.partners, styles.section)}>
        <div className="rectangle gr">
          <img src="/images/partnership-text.svg" alt="" />
        </div>
        <div className={styles.wrapperContent}>
          <div className={clsx(styles.content, "vertical")}>
            <div className={clsx(styles.contentTitle, "center")}>
              <h3>Partnership</h3>
            </div>
            <div className={clsx(styles.cards, styles.cardsPartnerShip)}>
              {partnerships.map((card, id) => (
                <PartnerCard card={card} key={id} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className={clsx(styles.perfomance, styles.section)}>
        <div className="rectangle">
          <img src="/images/landing/rectangle.png" alt="" />
        </div>
        <div className={styles.wrapperContent}>
          <div className={clsx(styles.content, "vertical")}>
            <div className={clsx(styles.contentTitle, "center")}>
              <h3>Performance</h3>
            </div>
            <div className={clsx(styles.cards)}>
              <TableContainer style={{ maxHeight: "calc(57px * 6)" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRowHead>
                      <TableCell>Project</TableCell>
                      <TableCell align="left">IDO Price</TableCell>
                      <TableCell
                        align="left"
                        onClick={() => onSortListPerfomance("ath")}
                      >
                        <TableSortLabel
                          order={
                            fieldSorted.field === "ath"
                              ? fieldSorted.order
                              : null
                          }
                        >
                          ATH
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        align="left"
                        onClick={() => onSortListPerfomance("volume")}
                      >
                        <TableSortLabel
                          order={
                            fieldSorted.field === "volume"
                              ? fieldSorted.order
                              : null
                          }
                        >
                          Daily Volume
                        </TableSortLabel>
                      </TableCell>
                    </TableRowHead>
                  </TableHead>
                  <TableBody>
                    {listPerfomance.map((row, id) => (
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
                        {/*<TableCell align="left"> {row.ath} <span>{row.profit ? `(X ${row.profit})` : ''}</span></TableCell>*/}
                        <TableCell align="left"> {row.ath}</TableCell>
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
