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
import { SearchBox } from "@base-components/SearchBox";
import { numberWithCommas } from "@utils/formatNumber";
import CountDownTimeV1 from "@base-components/CountDownTime";
const readableNumber = require("readable-numbers");

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

  const { data: performanceData = {} as ObjectType<any>, loading: loadingcompletePools } =
    useFetchV1("/home/performances");

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

  const getLimitPerformances = (arr: any[] = [], limit = 15) => {
    return arr.slice(0, limit);
  }

  useEffect(() => {
    if (!loadingcompletePools && Object.keys(performanceData).length) {
      let performances = getLimitPerformances(performanceData?.performances);
      performances = performances.map((data: ObjectType<any>) => {
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
      setListPerfomance(performances);
    }
  }, [performanceData, loadingcompletePools]);

  const [fieldSorted, setFieldSorted] = useState<{
    field: keyof Data;
    order?: "asc" | "desc";
  }>({ field: "" });
  const onSortListPerfomance = (field: keyof Data) => {
    const performances = getLimitPerformances(performanceData?.performances);
    if (field === fieldSorted.field) {
      const sorted = performances.sort((a: any, b: any) => {
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
      const sorted = performances.sort((a: any, b: any) => {
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

  const formatChangePercent = (number: number) => {
    if (!number || +number === 0) return <span style={{ color: '#fff', marginLeft: '5px' }}>0%</span>
    if (+number > 0) {
      return <span className={clsx(styles.percent, "up")}>
        <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.6038 0.514683C2.80395 0.254679 3.19605 0.254679 3.3962 0.514682L5.84442 3.695C6.09751 4.02379 5.86313 4.5 5.44821 4.5L0.551788 4.5C0.136869 4.5 -0.0975128 4.02379 0.155586 3.695L2.6038 0.514683Z" fill="#72F34B" />
        </svg>
        {numberWithCommas(number, 3)}%
      </span>
    }
    return <span className={clsx(styles.percent, "down")}>
      <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.3962 4.48532C3.19605 4.74532 2.80395 4.74532 2.6038 4.48532L0.155585 1.305C-0.0975138 0.976212 0.136868 0.5 0.551788 0.5L5.44821 0.5C5.86313 0.5 6.09751 0.976213 5.84441 1.305L3.3962 4.48532Z" fill="#F24B4B" />
      </svg>
      {numberWithCommas(Math.abs(+number) + '', 3)}%
    </span>
  }
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
            <div className={clsx(styles.cards, styles.performanceRanks)}>
              <div className="header">
                <div className="top">
                  <div className="logo">
                    <img src={performanceData.gamefi?.image} alt="" />
                    <span>GameFi</span>
                  </div>
                  <div className="socials">
                    <a href="https://gamefi.org" rel="noreferrer" target="_blank">
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 13C25 19.6275 19.6275 25 13 25C6.3725 25 1 19.6275 1 13C1 6.3725 6.3725 1 13 1C19.6275 1 25 6.3725 25 13Z" stroke="#AEAEAE" />
                        <path d="M15.1411 10.6774C14.7903 8.51694 13.9629 7 13 7C12.0371 7 11.2097 8.51694 10.8589 10.6774H15.1411ZM10.6774 13C10.6774 13.5371 10.7065 14.0524 10.7573 14.5484H15.2403C15.2911 14.0524 15.3202 13.5371 15.3202 13C15.3202 12.4629 15.2911 11.9476 15.2403 11.4516H10.7573C10.7065 11.9476 10.6774 12.4629 10.6774 13ZM18.5331 10.6774C17.8411 9.03468 16.4403 7.76452 14.7105 7.25161C15.3008 8.06935 15.7073 9.30081 15.9202 10.6774H18.5331ZM11.2871 7.25161C9.55968 7.76452 8.15645 9.03468 7.46694 10.6774H10.0798C10.2903 9.30081 10.6968 8.06935 11.2871 7.25161ZM18.7919 11.4516H16.0169C16.0677 11.9597 16.0968 12.4798 16.0968 13C16.0968 13.5202 16.0677 14.0403 16.0169 14.5484H18.7895C18.9226 14.0524 18.9976 13.5371 18.9976 13C18.9976 12.4629 18.9226 11.9476 18.7919 11.4516ZM9.90323 13C9.90323 12.4798 9.93226 11.9597 9.98306 11.4516H7.20806C7.07742 11.9476 7 12.4629 7 13C7 13.5371 7.07742 14.0524 7.20806 14.5484H9.98064C9.93226 14.0403 9.90323 13.5202 9.90323 13ZM10.8589 15.3226C11.2097 17.4831 12.0371 19 13 19C13.9629 19 14.7903 17.4831 15.1411 15.3226H10.8589ZM14.7129 18.7484C16.4403 18.2355 17.8435 16.9653 18.5355 15.3226H15.9226C15.7097 16.6992 15.3032 17.9306 14.7129 18.7484ZM7.46694 15.3226C8.15887 16.9653 9.55968 18.2355 11.2895 18.7484C10.6992 17.9306 10.2927 16.6992 10.0798 15.3226H7.46694Z" fill="#AEAEAE" />
                      </svg>
                    </a>
                    <a href="https://t.me/GameFi_Official" rel="noreferrer" target="_blank">
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 13C25 19.6275 19.6275 25 13 25C6.3725 25 1 19.6275 1 13C1 6.3725 6.3725 1 13 1C19.6275 1 25 6.3725 25 13Z" stroke="#AEAEAE" />
                        <path d="M11.9867 14.7954L17.5557 19L20.3669 7L6 12.6513L10.3717 14.0993L18.3501 8.74758L11.9867 14.7954Z" fill="#AEAEAE" />
                        <path d="M10.3711 14.1002L11.5684 18.4087L11.9861 14.7963L18.3495 8.74854L10.3711 14.1002Z" fill="#AEAEAE" />
                        <path d="M13.796 16.1624L11.5684 18.4083L11.986 14.7959L13.796 16.1624Z" fill="#AEAEAE" />
                      </svg>
                    </a>
                    <a href="https://twitter.com/GameFi_Official" rel="noreferrer" target="_blank">
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 13C25 19.6275 19.6275 25 13 25C6.3725 25 1 19.6275 1 13C1 6.3725 6.3725 1 13 1C19.6275 1 25 6.3725 25 13Z" stroke="#AEAEAE" />
                        <path d="M10.6435 19C16.2157 19 19.2628 14.3836 19.2628 10.3807C19.2628 10.2495 19.2602 10.1191 19.2541 9.98925C19.8456 9.5615 20.3597 9.02798 20.7653 8.42065C20.2224 8.66181 19.6384 8.82431 19.0255 8.89744C19.6511 8.52257 20.1312 7.92914 20.3578 7.22174C19.7723 7.56883 19.1243 7.82103 18.4343 7.95709C17.8813 7.36834 17.0941 7 16.2231 7C14.5499 7 13.1931 8.35673 13.1931 10.0291C13.1931 10.2669 13.2197 10.498 13.2716 10.7199C10.7541 10.5932 8.5215 9.38762 7.02754 7.55477C6.76714 8.00244 6.61736 8.52257 6.61736 9.07734C6.61736 10.1283 7.15222 11.0563 7.96539 11.599C7.46852 11.5838 7.0016 11.4471 6.59343 11.22C6.59276 11.2327 6.59276 11.2454 6.59276 11.2586C6.59276 12.726 7.63704 13.9508 9.02305 14.2285C8.76868 14.2977 8.50091 14.3351 8.22445 14.3351C8.02931 14.3351 7.83954 14.3156 7.65495 14.2805C8.04069 15.4839 9.15894 16.3598 10.485 16.3846C9.44796 17.1971 8.14194 17.6813 6.72263 17.6813C6.47829 17.6813 6.23714 17.6674 6 17.6393C7.34066 18.4984 8.93252 19 10.6435 19Z" fill="#AEAEAE" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="rate">
                  <div className="item current-price">
                    <div className="sub-item">
                      <span className="label">
                        Current Price
                      </span>
                    </div>
                    <div className="sub-item">
                      <span className="price">
                        ${numberWithCommas(performanceData.gamefi?.price || 0, 3)}
                      </span>
                      {formatChangePercent(performanceData.gamefi?.price_change_24h)}

                    </div>
                  </div>
                  <div className="item market-cap">
                    <div className="sub-item">
                      <span className="label">
                        Market Cap:
                      </span>
                      <span className="bold">
                        {+performanceData.gamefi?.market_cap ? '$' + readableNumber(+((+performanceData.gamefi?.market_cap).toFixed(0))) : 'N/A'}
                      </span>
                      {/* <span className="percent up">
                        <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.6038 0.514683C2.80395 0.254679 3.19605 0.254679 3.3962 0.514682L5.84442 3.695C6.09751 4.02379 5.86313 4.5 5.44821 4.5L0.551788 4.5C0.136869 4.5 -0.0975128 4.02379 0.155586 3.695L2.6038 0.514683Z" fill="#72F34B" />
                        </svg>
                        2.32%
                      </span> */}
                    </div>
                    <div className="sub-item">
                      <span className="label">
                        Vol (24h):
                      </span>
                      <span className="bold">
                        {+performanceData.gamefi?.market_cap ? '$' + readableNumber(+((+performanceData.gamefi?.volume_24h).toFixed(0))) : 'N/A'}
                      </span>
                      {formatChangePercent(+performanceData.gamefi?.volume_change_24h)}
                    </div>
                  </div>
                  <div className="item raise">
                    <div className="sub-item">
                      <span className="label">
                        Raised:
                      </span>
                      <span className="bold">
                        {performanceData?.gamefi?.raised}
                      </span>
                    </div>
                    <div className="sub-item">
                      <span className="label">
                        IDO Price:
                      </span>
                      <span className="bold">
                        ${performanceData?.gamefi?.ido_price || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="item roi foundation">
                    <div className="sub-item">
                      <span className="label">
                        IDO ROI:
                      </span>
                      <span className="bold">
                        {numberWithCommas(performanceData?.gamefi?.ido_roi, 3)}x
                      </span>
                    </div>
                    <div className="sub-item">
                      <span className="label">
                        Native Token:
                      </span>
                      <span className="bold logo-foundation">
                        <img src={performanceData?.gamefi?.image} className="" alt="" />
                        GAFI
                      </span>
                    </div>
                  </div>
                  {/* <div className="item foundation">
                    <div className="sub-item">
                      <span className="label">
                        Foundation Date:
                      </span>
                      <span className="bold">
                        4 Oct, 2021
                      </span>
                    </div>

                  </div> */}
                </div>
              </div>
              {/* <div className="filter">
                <div className="search">
                  <SearchBox placeholder="Search token" />
                </div>
              </div> */}
              <div className="body">
                <TableContainer
                // style={{ maxHeight: "calc(57px * 10)" }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRowHead>
                        <TableCell>
                          <TableSortLabel onClick={() => onSortListPerfomance("rank")}
                            order={
                              fieldSorted.field === "rank"
                                ? fieldSorted.order
                                : null
                            }
                          >
                            CMC Rank
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>
                          <TableSortLabel onClick={() => onSortListPerfomance("price")}
                            order={
                              fieldSorted.field === "price"
                                ? fieldSorted.order
                                : null
                            }
                          >
                            Price
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel onClick={() => onSortListPerfomance("price_change_24h")}
                            order={
                              fieldSorted.field === "price_change_24h"
                                ? fieldSorted.order
                                : null
                            }
                          >
                            Chg 24H
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel onClick={() => onSortListPerfomance("price_change_7d")}
                            order={
                              fieldSorted.field === "price_change_7d"
                                ? fieldSorted.order
                                : null
                            }
                          >
                            Chg 7D
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel onClick={() => onSortListPerfomance("market_cap")}
                            order={
                              fieldSorted.field === "market_cap"
                                ? fieldSorted.order
                                : null
                            }
                          >
                            Market Cap
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel onClick={() => onSortListPerfomance("volume_24h")}
                            order={
                              fieldSorted.field === "volume_24h"
                                ? fieldSorted.order
                                : null
                            }
                          >
                            Vol (24h)
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel onClick={() => onSortListPerfomance("ido_roi")}
                            order={
                              fieldSorted.field === "ido_roi"
                                ? fieldSorted.order
                                : null
                            }
                          >
                            IDO ROI
                          </TableSortLabel>
                        </TableCell>
                        {/* <TableCell>ATH IDO ROI</TableCell>
                        <TableCell>IDO Date</TableCell>
                        <TableCell onClick={() => onSortListPerfomance("ath")}>
                          <TableSortLabel
                            order={
                              fieldSorted.field === "ath"
                                ? fieldSorted.order
                                : null
                            }
                          >
                            Raised
                          </TableSortLabel>
                        </TableCell> */}
                      </TableRowHead>
                    </TableHead>
                    <TableBody>
                      {listPerfomance.map((row, id) => (
                        <TableRowBody key={id}>
                          <TableCell align="left">{row.rank}</TableCell>
                          <TableCell component="th" scope="row">
                            <div className={styles.tbCellProject}>
                              <img src={row.image} alt="" />
                              <div>
                                <h3>{row.symbol}</h3>
                                <h5>{row.name}</h5>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="left"> ${numberWithCommas(row.price, 3)} </TableCell>
                          <TableCell align="left"> {formatChangePercent(row.price_change_24h)} </TableCell>
                          <TableCell align="left"> {formatChangePercent(row.price_change_7d)} </TableCell>
                          <TableCell align="left"> {+row.market_cap ? '$' + readableNumber(+((+row.market_cap).toFixed(0))) : 'N/A'} </TableCell>
                          <TableCell align="left"> {+row.volume_24h ? '$' + readableNumber(+((+row.volume_24h).toFixed(0))) : 'N/A'} </TableCell>
                          <TableCell align="left"> {numberWithCommas(row.ido_roi, 3)}x </TableCell>
                        </TableRowBody>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default withWidth()(withRouter(Home));
