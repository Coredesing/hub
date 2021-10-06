import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import clsx from "clsx";
import { getCountdownInfo } from "@pages/MysteryBoxes/utils";
import CountDownTimeV1, {
  CountDonwRanges,
} from "@base-components/CountDownTime";
// import { useMediaQuery, useTheme } from "@material-ui/core";

const MysteryBoxes = ({ currentBox }: any) => {
  const styles = useStyles();
  //   const theme = useTheme();
  //   const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  //   const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
  //   const isXsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  // const [currentBox, setCurrentBox] = useState<{ [k: string]: any }>({ upcoming: true });
  const [time, setTime] = useState<
    CountDonwRanges & { title?: string; [k: string]: any }
  >({ date1: 0, date2: 0 });
  const [compareTime] = useState(Date.now());
  useEffect(() => {
    if ("id" in currentBox) {
      setTime(getCountdownInfo(currentBox, compareTime));
    }
  }, [currentBox]);

  return (
    <div className={styles.contentBox}>
      <div
        className="banner"
        style={{ backgroundImage: `url(${currentBox.banner})` }}
      >
        <div className={styles.content}>
          <div className="detail-box">
            <h1>{currentBox.title}</h1>
            <div
              className={clsx("status", {
                upcoming: time.isUpcoming,
                sale: time.isOnsale,
                over: time.isFinished,
              })}
            >
              <span>
                {time.isUpcoming && "Upcoming"}
                {time.isOnsale && "ON SALE"}
                {time.isFinished && "Sold Out"}
              </span>
            </div>
          </div>
          <div className="detail-countdown-box">
            <div className="wrapper-countdown">
              <span>{time.title}</span>
              {time.date1 && (
                <div className={styles.countDownContainer}>
                  <CountDownTimeV1
                    time={{ date1: time.date1, date2: time.date2 }}
                    className="countdown"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysteryBoxes;
