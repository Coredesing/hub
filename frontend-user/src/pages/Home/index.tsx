import React, { useEffect, useState } from "react";
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
        } catch (e) {}

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

  return (
    <DefaultLayout style={{ background: "#0A0A0A" }}>
      <section
        className={clsx(styles.banner, styles.section)}
        style={isShowImgBanner ? { paddingTop: "10px" } : {}}
      >
        {isShowImgBanner && (
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
        )}

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

      {mysteryBoxes?.data?.length && (
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
                className={clsx(styles.contentTitle, isSmScreen ? "center": undefined)}
                style={{ display: "flex", textAlign: isSmScreen ? "center" : undefined }}
              >
                <h3>Mystery Boxes</h3>
                <h5 style={{maxWidth: isSmScreen ? undefined : '480px'}}>
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
              <MysteryBoxes mysteryBoxes={mysteryBoxes?.data}/>
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
