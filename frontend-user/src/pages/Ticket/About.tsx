import React, { useCallback, useEffect, useMemo, useState } from "react";

import PropTypes from "prop-types";
// import SwipeableViews from 'react-swipeable-views';
import { withStyles, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Pagination from '@material-ui/lab/Pagination';
import { useFetchV1 } from "../../hooks/useFetch";
import {
  TableCell,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRowBody,
  TableRowHead
} from '../../components/Base/Table';
import { PaginationResult } from "../../types/Pagination";
import { SearchBox } from "../../components/Base/SearchBox";
import { cvtAddressToStar, debounce, escapeRegExp, formatNumber } from "../../utils";
import { numberWithCommas } from "../../utils/formatNumber";
import { useAboutStyles } from "./style";
import { isBidorStake } from "./utils";
import { convertTimeToStringFormat } from "../../utils/convertDate";
import { boxes, timelines } from "./data";
import clsx from 'clsx';
import { TimelineType } from "./types";
import ModalSeriesContent from "./components/ModalSeriesContent";
import ModalBoxCollection from "./components/ModalBoxCollection";
import { HashLoader } from "react-spinners";
import { CountDownTimeV1 } from '@base-components/CountDownTime'
import { ButtonBase } from '@base-components/Buttons/ButtonBase'
import PresaleBoxAbi from '@abi/PreSaleBox.json';
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { getContract } from "@utils/contract";
import { alertFailure, alertSuccess, alertWarning } from "@store/actions/alert";
import TransactionSubmitModal from "@base-components/TransactionSubmitModal";
const shareIcon = "/images/icons/share.svg";
const telegramIcon = "/images/icons/telegram-1.svg";
const twitterIcon = "/images/icons/twitter-1.svg";
const mediumIcon = "/images/icons/medium-1.svg";
function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  indicator: {
    backgroundColor: "#72F34B",
    height: "3px",
    borderRadius: "20px",
  },
})(Tabs);



type Props = {
  info: { [k: string]: any },
  [k: string]: any
}

const sliceArr = (arr: any[], from: number, to: number) => arr.slice(from, to)

const AboutTicket = ({ info = {}, connectedAccount, token, ...props }: Props) => {
  const classes = useAboutStyles();
  const [tabCurrent, setTab] = React.useState(props.defaultTab || 0);
  const theme = useTheme();
  const matchSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [isGetWinner, setIsGetWinner] = useState(true);
  const [searchWinner, setSearchWinner] = useState('');
  const [pagination, setPagination] = useState<{
    total: number, list: { [k: string]: any }[],
  }>({ total: 0, list: [] });
  const limitPage = 10;
  const [cachedRecallCount, setCachedRecallCount] = useState(0);
  const isTicketBid = isBidorStake(info.process);
  const url = (() => {
    if (isTicketBid) {
      return `/pool/${info.id}/top-bid?wallet_address=${connectedAccount}`
    }
    return `/user/winner-list/${info.id}?page=${page}&limit=${limitPage}&search_term=${searchWinner}`
  })();
  const { data: winner = {} as PaginationResult & { [k: string]: any } } = useFetchV1(url, isGetWinner);
  useEffect(() => {
    if (info?.campaign_hash) {
      setIsGetWinner(true);
    }
  }, [info, connectedAccount])

  useEffect(() => {
    if (winner?.data || winner?.top) {
      setIsGetWinner(false);
    }
  }, [winner]);

  useEffect(() => {
    if (props.recallCount > cachedRecallCount) {
      setCachedRecallCount(props.recallCount);
      setIsGetWinner(true);
    }
  }, [props.recallCount, cachedRecallCount, isGetWinner]);

  useEffect(() => {
    if (!isTicketBid && winner?.data) {
      setPagination({ total: +winner.total, list: winner.data })
    }
  }, [winner, isTicketBid])

  useEffect(() => {
    if (!isTicketBid || !props.setRankUser) return;
    if ('rank' in winner) {
      props.setRankUser(+winner.rank >= 0 ? winner.rank : -1)
    } else {
      props.setRankUser(-1);
    }
  }, [isTicketBid, winner, props]);

  useEffect(() => {
    if (isTicketBid && winner.top) {
      let arr = winner.top || [];
      if (searchWinner) {
        const regex = new RegExp(escapeRegExp(searchWinner), 'i');
        arr = arr.filter((item: any) => regex.test(item.wallet_address));
      }

      setPagination({
        total: arr.length,
        list: sliceArr(arr, (page - 1) * limitPage, page * limitPage),
      })
    }
  }, [isTicketBid, page, winner, searchWinner])

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue);
  };

  const getRules = (rule = "") => {
    if (typeof rule !== "string") return [];
    return rule.split("\n").filter((r) => r.trim());
  };

  const onChangePage = (event: any, page: number) => {
    setPage(page);
  }

  const onSearchWinner = (event: any) => {
    const value = event.target?.value;
    setSearchWinner(value);
    setPage(1);
  }

  const onSearch = debounce(onSearchWinner, 1000);

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="static">
        <AntTabs
          centered={matchSM ? true : false}
          value={tabCurrent}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant={matchSM ? "fullWidth" : "standard"}
        >
          <Tab
            className={clsx(classes.tabName, { active: tabCurrent === 0 })}
            label="Rule Introduction"
            {...a11yProps(0)}
          />
          <Tab
            className={clsx(classes.tabName, { active: tabCurrent === 1 })}
            label="About project"
            {...a11yProps(1)}
          />
          <Tab
            className={clsx(classes.tabName, { active: tabCurrent === 2 })}
            label={
              isTicketBid ? `Top Users (${numberWithCommas(pagination.total, 0)})` : `Winners (${numberWithCommas(winner ? winner.total || 0 : 0, 0)})`
            }
            {...a11yProps(1)}
          />
        </AntTabs>
      </AppBar>
      <TabPanel value={tabCurrent} index={0}>
        <ul className={classes.tabPaneContent}>
          {getRules(info.rule).map((rule, idx) => (
            <li key={idx}>
              {idx + 1}. {rule}
            </li>
          ))}
        </ul>
      </TabPanel>
      <TabPanel value={tabCurrent} index={1}>
        <div className={classes.desc}>
          <p className={classes.tabPaneContent}>{info.description}</p>
        </div>

        <div className={classes.links}>
          <div className={classes.link}>
            <span className="text">Website</span>
            <div className={classes.weblink}>
              <a href={info.website} target="_blank" rel="noreferrer">
                {info.website}
                <img src={shareIcon} alt="" />{" "}
              </a>
            </div>
          </div>
          <div className={classes.link}>
            <span className="text">Social</span>
            <div className={classes.socials}>
              <a
                href={info.socialNetworkSetting?.telegram_link}
                target="_blank"
                rel="noreferrer"
              >
                <img src={telegramIcon} alt="" />
              </a>
              <a
                href={info.socialNetworkSetting?.twitter_link}
                target="_blank"
                rel="noreferrer"
              >
                <img src={twitterIcon} alt="" />
              </a>
              <a
                href={info.socialNetworkSetting?.medium_link}
                target="_blank"
                rel="noreferrer"
              >
                <img src={mediumIcon} alt="" />
              </a>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabCurrent} index={2}>
        <div style={{ maxWidth: '400px' }}>
          <SearchBox
            // value={searchWinner}
            onChange={onSearch}
            placeholder="Search first or last 14 digits of your wallet address"
          />
        </div>
        <TableContainer style={{ background: '#171717', marginTop: '7px' }}>

          <Table>
            <TableHead>
              <TableRowHead>
                <TableCell>No</TableCell>
                <TableCell align="left">Wallet Address</TableCell>
                {isTicketBid && <TableCell align="left">Amounts</TableCell>}
                {isTicketBid && <TableCell align="left">Last Time</TableCell>}
              </TableRowHead>
            </TableHead>
            <TableBody>
              {(pagination.list || []).map((row, idx) => (
                <TableRowBody key={idx}>
                  <TableCell component="th" scope="row"> {((page - 1) * limitPage + idx + 1)} </TableCell>
                  <TableCell align="left">{isTicketBid ? cvtAddressToStar(row.wallet_address) : row.wallet_address}</TableCell>
                  {isTicketBid && <TableCell align="left">{numberWithCommas((+row.amount / 10 ** token?.decimals) + '', 4)}</TableCell>}
                  {isTicketBid && <TableCell align="left">{convertTimeToStringFormat(new Date(+row.last_time * 1000))}</TableCell>}
                </TableRowBody>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={Math.ceil((pagination.total || 0) / limitPage)} shape="rounded"
          onChange={onChangePage}
          className={classes.paginationNav}
          page={page}
          classes={{
            ul: classes.ulPagination
          }}
        />
      </TabPanel>
    </div>
  );
}

export default React.memo(AboutTicket);

export const AboutMysteryBox = ({
  info = {},
  token,
  timelines = {} as { [k: number]: TimelineType },
  ownedBox = 0,
  collections = [],
  loadingCollection,
  handleRefreshCollection,
  boxTypeSelected = {},
  ...props }: Props) => {
  const dispatch = useDispatch();
  const classes = useAboutStyles();
  const [tabCurrent, setTab] = React.useState(props.defaultTab || 0);
  const theme = useTheme();
  const matchSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchXS = useMediaQuery(theme.breakpoints.down("xs"));
  // const [page, setPage] = useState(1);
  // const [searchWinner, setSearchWinner] = useState('');
  // const [pagination, setPagination] = useState<{
  //   total: number, list: { [k: string]: any }[],
  // }>({ total: 0, list: [] });
  const limitPage = 10;

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue);
  };

  const getRules = (rule = "") => {
    if (typeof rule !== "string") return [];
    return rule.split("\n").filter((r) => r.trim());
  };

  // const onChangePage = (event: any, page: number) => {
  //   setPage(page);
  // }

  // const onSearchWinner = (event: any) => {
  //   const value = event.target?.value;
  //   setSearchWinner(value);
  //   setPage(1);
  // }

  // const onSearch = debounce(onSearchWinner, 1000);

  const [currentSerie, setCurrentSerie] = useState<{ [k: string]: any }>({});

  const [openModalSerieContent, setOpenModalSerieContent] = useState(false);

  const [currentBox, setCurrentBox] = useState<{ [k: string]: any }>({});

  const [openModalBoxCollection, setOpenModalBoxCollection] = useState(false);

  const onSelectSerie = (serie: { [k: string]: any }) => {
    setCurrentSerie(serie);
    setOpenModalSerieContent(true);
  }

  const onCloseModalSerie = useCallback(() => {
    setOpenModalSerieContent(false);
  }, []);

  const onSelectBox = (box: { [k: string]: any }) => {
    setCurrentBox(box);
    setOpenModalBoxCollection(true);
  }

  const onCloseModalBox = useCallback(() => {
    setOpenModalBoxCollection(false);
  }, []);
  const seriesContentConfig = (info.seriesContentConfig || []);
  const firstSerie = seriesContentConfig[0];
  const isShowRateSerie = firstSerie && +firstSerie.rate > 0;
  const isShowAmountSerie = firstSerie && +firstSerie.amount > 0;
  const [isClaimed, setClaim] = useState(false);
  let timeClaim = info.campaignClaimConfig?.[0]?.start_time;
  const claimType = info.campaignClaimConfig?.[0]?.claim_type;
  const claimUrl = info.campaignClaimConfig?.[0]?.claim_url;
  const isClaimedOnGF = !claimType || +claimType === 0;
  const timeNow = Date.now();
  timeClaim = timeClaim ? +timeClaim * 1000 : 0;
  useEffect(() => {
    if (timeClaim && timeClaim < timeNow) {
      setClaim(true);
    }
  }, [timeClaim])
  const onFinishCountdown = () => {
    setClaim(true);
  }

  const { library, account: connectedAccount } = useWeb3React();
  const [txHash, setTxHash] = useState('');
  const [isShowModalTx, setShowModalTx] = useState(false);
  const onCloseModalTx = () => {
    setShowModalTx(false);
    setTxHash('');
  }
  const POOL_IDS_IS_CLAIMED_ONE_BY_ONE: any[] = useMemo(() => {
    try {
      return JSON.parse(process.env.REACT_APP_POOL_IDS_IS_CLAIMED_ONE_BY_ONE || '')
    } catch (error) {
      return [];
    }
  }, []);
  const onClaimBox = async () => {
    try {
      if (!isClaimed) return;
      const contract = getContract(info.campaign_hash, PresaleBoxAbi, library, connectedAccount as string);
      if (!contract) {
        console.error("Something went wrong");
        return
      }
      const tx = await contract.claimAllNFT();
      setShowModalTx(true);
      setTxHash(tx.hash);
      dispatch(alertWarning("Request is processing!"));
      await tx.wait(1);
      dispatch(alertSuccess("Request is completed!"));
      handleRefreshCollection();
    } catch (error: any) {
      console.error(error);
      dispatch(alertFailure(error?.data?.message || error.message));
    }
  }
  const onClaimBoxId = async (boxId: number) => {
    try {
      if (!isClaimed) return;
      const contract = getContract(info.campaign_hash, PresaleBoxAbi, library, connectedAccount as string);
      if (!contract) {
        console.error("Something went wrong");
        return
      }
      const tx = await contract.claimNFT(boxId);
      setShowModalTx(true);
      setTxHash(tx.hash);
      dispatch(alertWarning("Request is processing!"));
      await tx.wait(1);
      dispatch(alertSuccess("Request is completed!"));
      handleRefreshCollection();
    } catch (error: any) {
      console.error(error);
      dispatch(alertFailure(error?.data?.message || error.message));
    }
  }
  const listIndex = useMemo(() => {
    if (boxTypeSelected?.description) {
      return {
        ruleIntroduce: 0,
        boxInformation: 1,
        seriesContent: 2,
        timeline: 3,
        collection: 4,
      }
    }
    return {
      ruleIntroduce: 0,
      seriesContent: 1,
      timeline: 2,
      collection: 3,
    }
  }, [boxTypeSelected?.description])
  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="static">
        <AntTabs
          centered={matchXS ? undefined : matchSM ? true : false}
          value={tabCurrent}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant={matchXS ? "scrollable" : matchSM ? "fullWidth" : "standard"}
          scrollButtons={matchXS ? "auto" : undefined}
        >
          <Tab
            className={clsx(classes.tabName, { active: tabCurrent === listIndex.ruleIntroduce })}
            label="Rule Introduction"
            {...a11yProps(0)}
          />
          {
            boxTypeSelected?.description && <Tab
              className={clsx(classes.tabName, { active: tabCurrent === listIndex.boxInformation })}
              label="Box Information"
              {...a11yProps(1)}
            />
          }
          <Tab
            className={clsx(classes.tabName, { active: tabCurrent === listIndex.seriesContent })}
            label="Series Content"
            {...a11yProps(2)}
          />
          <Tab
            className={clsx(classes.tabName, { active: tabCurrent === listIndex.timeline })}
            label={"Timeline"}
            {...a11yProps(3)}
          />
          <Tab
            className={clsx(classes.tabName, { active: tabCurrent === listIndex.collection })}
            label={`Collection (${ownedBox})`}
            {...a11yProps(4)}
          />
        </AntTabs>
      </AppBar>
      <TabPanel value={tabCurrent} index={listIndex.ruleIntroduce}>
        <ul className={classes.tabPaneContent}>
          {getRules(info.rule).map((rule, idx) => (
            <li key={idx}>
              {idx + 1}. {rule}
            </li>
          ))}
        </ul>
      </TabPanel>
      {
        boxTypeSelected.description && <TabPanel value={tabCurrent} index={listIndex.boxInformation}>
          <p style={{fontSize: '14px', fontFamily: 'Firs Neue', color: '#d1d1d1'}}>
            {boxTypeSelected.description}
          </p>
        </TabPanel>
      }

      <TabPanel value={tabCurrent} index={listIndex.seriesContent}>
        <ModalSeriesContent
          open={openModalSerieContent}
          current={currentSerie}
          seriesContent={info.seriesContentConfig || []}
          onClose={onCloseModalSerie}
          isShowRateSerie={isShowRateSerie}
          isShowAmountSerie={isShowAmountSerie} />
        <TableContainer style={{ background: '#171717', marginTop: '7px' }}>
          <Table>
            <TableHead>
              <TableRowHead>
                <TableCell width="80px" style={{ paddingLeft: '28px' }}>No</TableCell>
                <TableCell width="300px" style={{ padding: '7px' }} align="left">Name</TableCell>
                {/* <TableCell align="left">Amount</TableCell> */}
                {isShowRateSerie && <TableCell align="left" style={{ padding: '7px' }}>Rare</TableCell>}
                {isShowAmountSerie && <TableCell align="left" style={{ padding: '7px' }}>Amount</TableCell>}
                <TableCell align="left" style={{ padding: '7px' }}>Description</TableCell>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {seriesContentConfig.map((row: any, idx: number) => (
                <TableRowBody key={idx}>
                  <TableCell width="80px" component="th" scope="row" style={{ paddingLeft: '28px' }}> {idx + 1} </TableCell>
                  <TableCell align="left" style={{ padding: '7px' }} className="text-uppercase">
                    <Box display="flex" alignItems="center" gridGap="20px">
                      <Box style={{ background: "#000", placeContent: 'center', borderRadius: '2px', cursor: 'pointer' }} display="grid" onClick={() => onSelectSerie(row)}>
                        <img src={row.icon} width='30' height="30" alt="" style={{ objectFit: 'contain' }} />
                      </Box>
                      <span className="text-weight-600">{row.name}</span>

                    </Box>
                  </TableCell>
                  {isShowRateSerie && <TableCell align="left" style={{ padding: '7px' }}>{row.rate}%</TableCell>}
                  {isShowAmountSerie && <TableCell align="left" style={{ padding: '7px' }}>{numberWithCommas(row.amount)}</TableCell>}
                  <TableCell align="left" style={{ padding: '7px' }}>{row.description}</TableCell>
                </TableRowBody>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Pagination count={Math.ceil((pagination.total || 0) / limitPage)} shape="rounded"
          onChange={onChangePage}
          className={classes.paginationNav}
          page={page}
          classes={{
            ul: classes.ulPagination
          }}
        /> */}
      </TabPanel>
      <TabPanel value={tabCurrent} index={listIndex.timeline}>
        <div className={classes.wrapperBoxTimeLine}>
          {
            (Object.values(timelines) as TimelineType[]).map((timeline, idx: number) => <div key={idx} className={clsx("box", { active: timeline.current })}>
              <div className="step"><span>{formatNumber(idx + 1, 2)}</span></div>
              <div className="title">{timeline.title}</div>
              <div className="desc">{timeline.desc}</div>
            </div>)
          }
        </div>
      </TabPanel>
      <TabPanel value={tabCurrent} index={listIndex.collection}>
        <ModalBoxCollection open={openModalBoxCollection} current={currentBox} boxesContent={collections || []} onClose={onCloseModalBox} />
        <TransactionSubmitModal opened={isShowModalTx} handleClose={onCloseModalTx} transactionHash={txHash} />
        {
          !!collections.length && timeClaim &&
          <div className="wrapperHeader">
            <div className={classes.wrapperCountdownCollection} style={!POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(info.id) ? { gridTemplateColumns: '1fr 1fr' } : { gridTemplateColumns: '1fr' }}>
              {
                (timeClaim > timeNow) ?
                  <CountDownTimeV1 time={{ date1: timeClaim, date2: timeNow }} onFinish={onFinishCountdown} className="countdown" />
                  : <div className="title"><h3>You can claim now</h3></div>
              }
              {
                !POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(info.id) &&
                (isClaimedOnGF ?
                  <ButtonBase color="green" onClick={onClaimBox} disabled={!isClaimed}>Claim on GameFi</ButtonBase> :
                  claimUrl ? <ButtonBase color="blue" onClick={() => window.open(claimUrl)}>Claim on External</ButtonBase> : null)
              }
            </div>
          </div>
        }

        <div className={classes.wrapperBox}>
          {
            loadingCollection ? <HashLoader loading={true} color={'#72F34B'} /> : collections.map((b: any, id: number) =>
              <div key={id} onClick={(e) => {
                e.stopPropagation();
                onSelectBox(b)
              }} className={clsx("box", { active: currentBox.idCollection === b.idCollection })}>
                <div className="img-box">
                  <img src={b.icon} alt="" />
                </div>
                <div>
                  <span className="id-box">
                    #{formatNumber(b.idCollection, 3)}
                  </span>
                  {
                    POOL_IDS_IS_CLAIMED_ONE_BY_ONE.includes(info.id) &&
                      isClaimedOnGF ?
                      (<ButtonBase
                        color="green"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClaimBoxId(b.idCollection)
                        }}
                        className="btn-claim-box text-transform-unset"
                        disabled={!isClaimed}
                      >  Claim on GameFi </ButtonBase>) :
                      (claimUrl ? <ButtonBase
                        color="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(claimUrl);
                        }}
                        className="btn-claim-box text-transform-unset"
                      // disabled={!isClaimed}
                      >
                        Claim on External
                      </ButtonBase> : null)
                  }
                </div>
              </div>
            )
          }

        </div>
      </TabPanel>
    </div>
  );
}