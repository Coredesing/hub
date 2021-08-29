import { FC, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Hidden } from "@material-ui/core";
import { numberWithCommas } from "../../../utils/formatNumber";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  convertTimeToStringFormat,
  convertTimeToStringFormatWithoutGMT,
} from "../../../utils/convertDate";
import useStyles from "./styles";
import {ACCEPT_CURRENCY, POOL_STATUS} from "../../../constants";
import BigNumber from "bignumber.js";
import {getTotalRaiseByPool, showTotalRaisePrice} from "../../../utils/campaign";

type Props = {
  poolDetails: any;
};

const headers = ["Tier", "Start Buy Time", "End Buy Time"];

const BuyTokenPoolDetails: FC<Props> = ({ poolDetails }) => {
  const styles = useStyles();
  const [openModal, setOpenModal] = useState(false);

  const startBuyTimeInDate = poolDetails?.startBuyTime
    ? new Date(Number(poolDetails?.startBuyTime) * 1000)
    : undefined;
  const releaseTimeInDate = poolDetails?.releaseTime
    ? new Date(Number(poolDetails?.releaseTime) * 1000)
    : undefined;
  const minTier = poolDetails?.minTier || 0;

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <section className={styles.sectionBuyTokenPoolDetails}>
      {/* <div className={styles.topSection}>
        <h2 className={styles.title}>Pool Details</h2>
      </div> */}

      <div className={styles.midSection}>
        <ul className={styles.listContent}>
          <li className={styles.itemListContent}>
            <span className={styles.nameItemListContent}>Token Swap Time</span>
            <span>
              {startBuyTimeInDate
                ? convertTimeToStringFormat(startBuyTimeInDate)
                : "TBA"}
            </span>
          </li>
          <li className={styles.itemListContent}>
            <span className={styles.nameItemListContent}>Type</span>
            <span style={{ textTransform: "capitalize" }}>
              {poolDetails?.type}
            </span>
          </li>
          {poolDetails?.website && (
            <li className={styles.itemListContent}>
              <span className={styles.nameItemListContent}>Website</span>
              <a
                target="_blank"
                href={poolDetails?.website ?? ""}
                rel="noreferrer"
              >
                {poolDetails?.website ?? "TBA"}
                {poolDetails?.website && (
                  <img
                    className={styles.iconBrank}
                    src="/images/icon_brank.svg"
                    alt=""
                  />
                )}
              </a>
            </li>
          )}
          <li className={styles.itemListContent}>
            <span className={styles.nameItemListContent}>Token Claim Time</span>
            <span>
              {releaseTimeInDate
                ? convertTimeToStringFormatWithoutGMT(releaseTimeInDate)
                : "TBA"}{" "}
            </span>
          </li>
        </ul>
        <ul className={styles.listContent}>
          {/* <li className={styles.itemListContent}>
            <span className={styles.nameItemListContent}>
              Schedule by Tiers
            </span>
            <span
              className={styles.btnOpenModal}
              onClick={() => setOpenModal(true)}
            >
              Click here to see details
            </span>
          </li> */}
          <li className={styles.itemListContent}>
            <span className={styles.nameItemListContent}>Total Raise</span>
            <span>
              {/*{(poolDetails?.poolStatus === POOL_STATUS.TBA ||*/}
              {/*  poolDetails?.poolStatus === POOL_STATUS.UPCOMING ||*/}
              {/*  poolDetails?.poolStatus === POOL_STATUS.IN_PROGRESS) &&*/}
              {/*}*/}
              {showTotalRaisePrice(poolDetails)}

              {/*{poolDetails.purchasableCurrency === ACCEPT_CURRENCY.ETH &&*/}
              {/*  numberWithCommas(*/}
              {/*    new BigNumber(poolDetails?.amount || 0)*/}
              {/*      .multipliedBy(poolDetails?.priceUsdt)*/}
              {/*      .decimalPlaces(0, BigNumber.ROUND_CEIL)*/}
              {/*      .toFixed()*/}
              {/*  )}*/}
              {/*{poolDetails.purchasableCurrency !== ACCEPT_CURRENCY.ETH &&*/}
              {/*  numberWithCommas(*/}
              {/*    new BigNumber(poolDetails?.amount || 0)*/}
              {/*      .multipliedBy(poolDetails.ethRate)*/}
              {/*      .decimalPlaces(0, BigNumber.ROUND_CEIL)*/}
              {/*      .toFixed()*/}
              {/*  )}{" "}*/}
              {/*$*/}
            </span>
          </li>
          <li className={styles.itemListContent}>
            <span className={styles.nameItemListContent}>Lock Schedule</span>
            <a
              className={styles.btnOpenModal}
              target="_blank"
              href={poolDetails?.lockSchedule}
              style={{ color: "#72F34B" }}
              rel="noreferrer"
            >
              View token release schedule
            </a>
          </li>
          <li className={styles.itemListContent}>
            <span className={styles.nameItemListContent}>Social</span>
            <div className={styles.rightTopSection}>
              <a
                target="_blank"
                href={poolDetails?.socialNetworkSetting?.telegram_link}
                className={styles.itemSocsial}
                rel="noreferrer"
              >
                <img src="/images/socsials/instagram.svg" alt="" />
              </a>
              <a
                target="_blank"
                href={poolDetails?.socialNetworkSetting?.twitter_link}
                className={styles.itemSocsial}
                rel="noreferrer"
              >
                <img src="/images/socsials/twitter.svg" alt="" />
              </a>
              <a
                target="_blank"
                href={poolDetails?.socialNetworkSetting?.medium_link}
                className={styles.itemSocsial}
                rel="noreferrer"
              >
                <img src="/images/socsials/m.svg" alt="" />
              </a>
            </div>
          </li>
        </ul>
      </div>

      {poolDetails?.description && (
        <>
          <div className={styles.titleBot}>Project Information</div>
          <div className={styles.botSection}>{poolDetails?.description}</div>
        </>
      )}
{/* 
      <Dialog
        open={openModal}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={styles.modalTiers}
      >
        <div className={styles.modalContentTiers}>
          <DialogTitle className={styles.headerModal}>
            Schedule by Tiers
            <img
              src="/images/icons/close.svg"
              alt=""
              className={styles.btnCloseModal}
              onClick={handleClose}
            />
          </DialogTitle>
          <DialogContent className={styles.contentModal}>
            <Hidden mdUp>
              {poolDetails?.tiersWithDetails?.length > 0 &&
                poolDetails?.tiersWithDetails?.map(
                  (row: any, index: number) => {
                    if (index < minTier) {
                      return <></>;
                    }
                    return (
                      <div className={styles.boxTierMobile} key={index}>
                        <div className={styles.itemTierMobile}>
                          <div className={styles.nameItemTierMobile}>Tier</div>
                          <div className={styles.valueItemTierMobile}>
                            {row.name}
                            {row.name !== "-" && (
                              <img
                                className={styles.iconTable}
                                src={`/images/icons/${row?.name?.toLowerCase()}.png`}
                                alt=""
                              />
                            )}
                          </div>
                        </div>

                        <div className={styles.itemTierMobile}>
                          <div className={styles.nameItemTierMobile}>
                            Start Buy Time
                          </div>
                          <div className={styles.valueItemTierMobile}>
                            {!row.startTime && "--"}
                            {row.startTime &&
                              convertTimeToStringFormat(
                                new Date(row.startTime * 1000)
                              )}
                          </div>
                        </div>

                        <div className={styles.itemTierMobile}>
                          <div className={styles.nameItemTierMobile}>
                            End Buy Time
                          </div>
                          <div className={styles.valueItemTierMobile}>
                            {!row.endTime && "--"}
                            {row.endTime &&
                              convertTimeToStringFormat(
                                new Date(row.endTime * 1000)
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </Hidden>

            <Hidden smDown>
              <TableContainer
                component={Paper}
                className={styles.tableContainer}
              >
                <Table className={styles.table} aria-label="simple table">
                  <TableHead className={styles.tableHeaderWrapper}>
                    <TableRow>
                      {headers.map((header) => (
                        <TableCell key={header} className={styles.tableHeader}>
                          <span>{header}</span>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {poolDetails?.tiersWithDetails?.length > 0 &&
                      poolDetails?.tiersWithDetails?.map(
                        (row: any, index: number) => {
                          if (index < minTier) {
                            return <></>;
                          }
                          return (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {row.name}
                                {row.name !== "-" && (
                                  <img
                                    className={styles.iconTable}
                                    src={`/images/icons/${row?.name?.toLowerCase()}.png`}
                                    alt=""
                                  />
                                )}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {!row.startTime && "--"}
                                {row.startTime &&
                                  convertTimeToStringFormat(
                                    new Date(row.startTime * 1000)
                                  )}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {!row.endTime && "--"}
                                {row.endTime &&
                                  convertTimeToStringFormat(
                                    new Date(row.endTime * 1000)
                                  )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Hidden>
          </DialogContent>
        </div>
      </Dialog> */}
    </section>
  );
};

export default BuyTokenPoolDetails;
