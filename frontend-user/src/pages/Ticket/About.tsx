import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
// import SwipeableViews from 'react-swipeable-views';
import { withStyles, useMediaQuery } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import { debounce } from "../../utils";
const shareIcon = "/images/icons/share.svg";
const telegramIcon = "/images/icons/telegram-1.svg";
const twitterIcon = "/images/icons/twitter-1.svg";
const mediumIcon = "/images/icons/medium-1.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#171717",
  },
  tabName: {
    fontFamily: "Firs Neue",
    fontWeight: 600,
    fontStyle: "normal",
    fontSize: "16px",
    lineHeight: "28px",
    // color: "#72F34B",
    mixBlendMode: "normal",
    textTransform: "unset",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
    },
  },
  appbar: {
    background: "transparent",
    boxShadow: "none",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "24px",
      paddingRight: "24px",
    },
  },
  tabPaneContent: {
    fontFamily: "Firs Neue",
    fontWeight: "normal",
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#d1d1d1",
    mixBlendMode: "normal",
  },
  desc: {
    marginBottom: "20px",
  },
  links: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  link: {
    display: "grid",
    gridTemplateColumns: "80px auto",
    gap: "2px",
    alignItems: "center",

    "& .text": {
      fontFamily: "Firs Neue",
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      color: "#fff",
      mixBlendMode: "normal",
    },
  },
  weblink: {
    "& a": {
      background: "#2E2E2E",
      borderRadius: "4px",
      padding: "4px 8px",
      fontFamily: "Firs Neue",
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      color: "#fff",
      mixBlendMode: "normal",
      display: "inline-flex",
      gap: "7px",
    },
  },
  socials: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, 28px)",
    gap: "10px",
    "& a": {
      display: "grid",
      "& img": {
        width: "24px",
        height: "24px",
      },
    },
  },
  paginationNav: {
    marginTop: '32px',
    marginBottom: '10px',
    background: 'transparent',
  },
  ulPagination: {
    '& button': {
      background: 'transparent',
      color: '#AEAEAE',
      fontSize: '14px',
      lineHeight: '24px',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,

      '&[aria-label^="page"]': {
        background: '#72F34B',
        color: '#000000',
        '&:hover': {
          background: '#4fa934',
        }
      }
    }
  }
}));

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
          <Typography>{children}</Typography>
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

const AboutTicket = ({ info = {} }: any) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const matchSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [isGetWinner, setIsGetWinner] = useState(false);
  const [searchWinner, setSearchWinner] = useState('');
  const limitPage = 10;
  const isClaim = info?.process === "only-claim";
  const { data: winner = {} as PaginationResult } = useFetchV1(`/user/winner-list/${info.id}?page=${page}&limit=${limitPage}&search_term=${searchWinner}`, isGetWinner);
  useEffect(() => {
    if (isClaim && info?.campaign_hash) {
      setIsGetWinner(true);
    }
  }, [isClaim, info])

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
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
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant={matchSM ? "fullWidth" : "standard"}
        >
          <Tab
            className={classes.tabName}
            label="Rule Introduction"
            style={value === 0 ? { color: "#72F34B" } : {}}
            {...a11yProps(0)}
          />
          <Tab
            className={classes.tabName}
            label="About project"
            style={value === 1 ? { color: "#72F34B" } : {}}
            {...a11yProps(1)}
          />
          {isClaim &&
            <Tab
              className={classes.tabName}
              label={`Winner (${winner.total || 0})`}
              style={value === 1 ? { color: "#72F34B" } : {}}
              {...a11yProps(1)}
            />
          }
        </AntTabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ul className={classes.tabPaneContent}>
          {getRules(info.rule).map((rule, idx) => (
            <li key={idx}>
              {idx + 1}. {rule}
            </li>
          ))}
        </ul>
      </TabPanel>
      <TabPanel value={value} index={1}>
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
      <TabPanel value={value} index={2}>
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
              </TableRowHead>
            </TableHead>
            <TableBody>
              {(winner.data || []).map((row, idx) => (
                <TableRowBody key={row.id}>
                  <TableCell component="th" scope="row"> {((+winner.page - 1) * limitPage + idx + 1)} </TableCell>
                  <TableCell align="left">{row.wallet_address}</TableCell>
                </TableRowBody>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={Math.ceil(+winner.total || 0 / limitPage)} shape="rounded"
          onChange={onChangePage}
          className={classes.paginationNav}
          classes={{
            ul: classes.ulPagination
          }}
        />
      </TabPanel>
    </div>
  );
}

export default React.memo(AboutTicket);