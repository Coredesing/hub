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
import { getSeedRound } from "../../utils";

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
  ];

  const [isShowImgBanner, setIsShowImgModal] = useState(true);
  const onCloseImgBanner = () => {
    setIsShowImgModal(false);
  };

  const [listPerfomance, setListPerfomance] = useState<Data[]>([]);

  useEffect(() => {
    if (!loadingcompletePools) {
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
    <DefaultLayout>
      <section className={clsx(styles.banner, styles.section)}>
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

        <div className={styles.wrapperContent} style={!isShowImgBanner ? {marginTop: -50} : {}}>
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
      <Instruction />
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
                Ticket is an item that allows you to join IDO pools. To view
                information about other Ticket pools, click the Discover button
                below.
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
      <section className={clsx(styles.tokenSales, styles.section)}>
        <div className="rectangle bl">
          <img src="/images/token-sales-text.svg" alt="" />
        </div>
        <div className={styles.wrapperContent}>
          <div className={clsx(styles.content, "vertical")}>
            <div className={clsx(styles.contentTitle, "center")}>
              <h3>Token Sales</h3>
              <h5>
                Make sure you have a Ticket to join IDO. To view information
                about other IDO pools, click the Discover button below.
              </h5>
              <Link href="/#/pools/token" className={styles.btnDiscover}>Discover</Link>
            </div>
            <div className={clsx(styles.cards, styles.cardsTokenSales)}>
              {(tokenSales.data || []).map((card, id) => (
                <Card card={card} key={id} className={styles.cardTokenSale}
                title={<div className="card-token-title">
                  <h4>{card.title}</h4>
                  <span>{getSeedRound(card.is_private)}</span>
                </div>}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
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
                        onClick={() => onSortListPerfomance("holders")}
                      >
                        <TableSortLabel
                          order={
                            fieldSorted.field === "holders"
                              ? fieldSorted.order
                              : null
                          }
                        >
                          Holders
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
