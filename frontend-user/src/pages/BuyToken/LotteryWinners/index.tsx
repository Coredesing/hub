import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import useFetch from '../../../hooks/useFetch';
import { numberWithCommas } from '../../../utils/formatNumber';
import { debounce } from 'lodash';
/* import { CircularProgress } from '@material-ui/core'; */
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Tooltip from '@material-ui/core/Tooltip';
import Pagination from '@material-ui/lab/Pagination';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import useStyles from './style';
import Recapcha from '@base-components/Recapcha';
import { SearchBox } from '@base-components/SearchBox';
import { ButtonBase } from '@base-components/Buttons';
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableRowBody,
  TableRowHead,
  TableHead
} from '@base-components/Table';
import clsx from 'clsx';
import axios from '@services/axios'
import { utils } from 'ethers';
import NotFoundItem from '@base-components/NotFoundItem';
import { Backdrop } from '@material-ui/core';
import CircularProgress from '@base-components/CircularProgress';
import CongratulationsIcon from '@base-components/CongratulationsIcon';
import { FailedIcon, SuccessIcon, WarningIcon } from '@base-components/Icon';

const headers = ['No', 'Wallet Address'];

type LotteryWinnersProps = {
  poolId: number | undefined;
  width: any;
  userWinLottery: boolean | undefined;
  pickedWinner?: boolean;
  maximumBuy: number | undefined;
  purchasableCurrency: string | undefined;
  verifiedEmail?: boolean | undefined;
  handleWiners: (total: number) => void;
}

const shortenAddress = (address: string, digits: number = 4) => {
  return `${address.substring(0, digits)}************************${address.substring(41 - digits)}`
}

const LotteryWinners: React.FC<LotteryWinnersProps> = (props: LotteryWinnersProps) => {
  const styles = useStyles();
  const { poolId, userWinLottery, maximumBuy, purchasableCurrency, verifiedEmail, pickedWinner, handleWiners } = props;
  const [inputAddress, setAddress] = useState("");
  const [searchedWinners, setSearchedWinners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalWinners, setTotalWinners] = useState(0);
  const { data: winnersList } = useFetch<any>(`/user/winner-list/${poolId}`);

  const searchDebounce = () => {
    if (winnersList) {
      setTotalPage(winnersList.lastPage);
      setCurrentPage(winnersList.page);
      setTotalWinners(winnersList.total);
      setSearchedWinners(winnersList.data);
      handleWiners(winnersList.total)
    }
  };

  useEffect(searchDebounce, [winnersList]);

  // const handleInputChange = debounce((e: any) => {
  //   ReactDOM.unstable_batchedUpdates(() => {
  //     setCurrentPage(1);
  //     setInput(e.target.value);
  //   });
  // }, 500);
  const recaptchaRef: any = useRef();
  const [captcha, setCaptcha] = useState('');
  const [resWinner, setWinner] = useState<{ isShowResult?: boolean, isWinner?: boolean, loading?: boolean, message?: string }>({ isShowResult: false, isWinner: false });
  const onSetAddress = (e: any) => {
    setAddress(e.target.value);
    if (resWinner.isShowResult) {
      setWinner({ isShowResult: false });
    }
  }

  const onVerifyCaptcha = (captcha: string) => {
    setCaptcha(captcha);
  }
  const onSubmitSearch = async () => {
    if (!captcha) return;
    if (!utils.isAddress(inputAddress.toLowerCase())) return;
    setWinner({ loading: true });
    try {
      setTimeout(() => {
        if (captcha && typeof recaptchaRef?.current?.resetCaptcha === 'function') {
          setCaptcha('');
          recaptchaRef.current.resetCaptcha();
        }
      }, 5000);
      const result = await axios.get(`/user/winner-search/${poolId}?wallet_address=${inputAddress}&captcha_token=${captcha}`);
      setWinner({ isShowResult: true, isWinner: result.data.data, message: result.data.message });
    } catch (error) {
      setWinner({ isShowResult: true });
    }
  }

  const onResetInput = () => {
    setAddress('');
    setWinner({ isShowResult: false });
  }

  const renderResultSearch = () => {
    if (!resWinner.isShowResult) {
      return <WarningIcon />;
    }
    if (resWinner.isWinner) {
      return <SuccessIcon title={`Congratulations, you are one of the ${totalWinners} winners`} />;
    }
    /**
     * isWinner == null if search error
     */
    if (resWinner.isWinner === null) {
      return <WarningIcon title={resWinner.message} />;
    }
    if (!resWinner.isWinner) {
      return <FailedIcon title={`Sorry! You are not one of the ${totalWinners} winners.`} />;
    }
  }

  if (!pickedWinner) return <></>;

  return (
    <div className={styles.LotteryWinners} id={'winner-list'}>
      {
        <Backdrop open={!!resWinner.loading} style={{ color: '#fff', zIndex: 1000, }}>
          <CircularProgress />
        </Backdrop>
      }
      {/* <Box display="grid" gridGap="10px">
        <div className={styles.tableSearchWrapper}>
          <input
            type="text"
            name="lottery-search"
            className={styles.tableSearch}
            placeholder="Search your wallet address"
            onChange={handleInputChange}
          />
          <img src="/images/search.svg" className={styles.tableSearchIcon} alt="search-icon" />
        </div>
        <Box>
          <h4 className="mb-6px">Verify captcha to search your wallet address</h4>

        </Box>
      </Box> */}
      <Box className={clsx(styles.boxContentWinner, 'custom-scroll')}>
        <Box className="search-box">
          <div className="mb-12px">
            <SearchBox
              placeholder="Enter your wallet address"
              onChange={onSetAddress}
              value={inputAddress}
              onReload={onResetInput}
            />
            {inputAddress && !utils.isAddress(inputAddress.toLowerCase()) && <p className="text-danger mt-6px">Invalid wallet address</p>}
          </div>
          <Recapcha className="mb-16px" onChange={onVerifyCaptcha} ref={recaptchaRef} />
          <Box>
            <ButtonBase style={{ height: '42px' }}
              className="text-transform-unset mt-0-important pd-0-imp"
              color="green"
              onClick={onSubmitSearch}
              disabled={!inputAddress || !utils.isAddress(inputAddress.toLowerCase()) || !captcha}
            >
              Search
            </ ButtonBase>
          </Box>
        </Box>
        <div className="divider"></div>
        <Box className="search-result">
          <TableContainer component={Paper} className={clsx("mt-0-important")}>
            <Table className={styles.table} aria-label="simple table">
              <TableHead >
                <TableRowHead>
                  <TableCell>
                    Wallet address
                  </TableCell>
                  <TableCell>
                    Results
                  </TableCell>
                </TableRowHead>
              </TableHead>
              <TableBody>
                <TableRowBody>
                  <TableCell component="th" scope="row" style={{ lineBreak: 'anywhere' }}>
                    {resWinner.isShowResult && shortenAddress(inputAddress, 10)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {inputAddress && resWinner.isShowResult && (resWinner.isWinner ? 'Winner' : 'Not Winner')}
                  </TableCell>
                </TableRowBody>
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="grid" justifyContent="center" textAlign="center" marginTop="10px">
            {renderResultSearch()}
          </Box>
        </Box>
      </Box>

      {/* 
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table} aria-label="simple table">
          <TableHead className={styles.tableHeaderWrapper}>
            <TableRow>
              {
                headers.map(header => (
                  <TableCell key={header} className={styles.tableHeader}>
                    <span>
                      {header}
                    </span>
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {searchedWinners && searchedWinners.length > 0 && searchedWinners.map((row: any, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {isWidthDown('sm', props.width) ?
                    <Tooltip title={<p>{row.wallet_address}</p>}>
                      <>
                        {shortenAddress(row.wallet_address)}
                      </>
                    </Tooltip>
                    : row.wallet_address
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </div>
  )
}

export default withWidth()(LotteryWinners);
