import { useEffect, useState } from "react";
import useStyles from "./styles";
import clsx from "clsx";
import { getCountdownInfo } from "@pages/MysteryBoxes/utils";
import CountDownTimeV1, {
  CountDonwRanges,
} from "@base-components/CountDownTime";
import { Hidden } from "@material-ui/core";
import './style.css';
// import { useMediaQuery, useTheme } from "@material-ui/core";

type ObjectType = { [k: string]: any };
type Props = {
  mysteryBoxes: ObjectType[],
  [k: string]: any,
}
const MysteryBoxes = ({ mysteryBoxes }: Props) => {
  const styles = useStyles();
  //   const theme = useTheme();
  //   const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  //   const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
  //   const isXsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [currentBox, setCurrentBox] = useState<{ [k: string]: any }>(mysteryBoxes[0]);

  const [time, setTime] = useState<
    CountDonwRanges & { title?: string;[k: string]: any }
  >({ date1: 0, date2: 0 });
  const [compareTime] = useState(Date.now());
  useEffect(() => {
    if ("id" in currentBox) {
      setTime(getCountdownInfo(currentBox, compareTime));
    }
  }, [compareTime, currentBox]);

  let isHandlingShowImg = false;

  const handleShowImg = (newBox: ObjectType, from: 'right-to-left' | 'left-to-right') => {
    if (isHandlingShowImg) return;
    const wrapperImg = document.querySelector('.wrapper-img div');
    isHandlingShowImg = true;
    if (wrapperImg) {
      let elemImg: any = wrapperImg.querySelector('img');
      if (!elemImg) return;
      const newElmImg = document.createElement('img');
      newElmImg.src = newBox.banner;
      if (from === 'right-to-left') {
        elemImg.classList.remove('r-t-l');
        elemImg.classList.add('h-r-t-l');
        newElmImg.classList.add('r-t-l')
      } else {
        elemImg.classList.remove('l-t-r')
        elemImg.classList.add('h-l-t-r');
        newElmImg.classList.add('l-t-r')
      }
      setTimeout(() => {
        setCurrentBox(newBox);
        wrapperImg.removeChild(elemImg);
        wrapperImg.appendChild(newElmImg);
        isHandlingShowImg = false;
      }, 200)

    }
  }

  const onPrevBox = () => {
    const idxCurr = mysteryBoxes.findIndex(b => b.id === currentBox.id);
    const newBox = idxCurr === 0 ? mysteryBoxes.slice(-1)[0] : mysteryBoxes[idxCurr - 1];
    console.log(newBox);

    handleShowImg(newBox, 'right-to-left');
  }
  const onNextBox = () => {
    const idxCurr = mysteryBoxes.findIndex(b => b.id === currentBox.id);
    const newBox = idxCurr === mysteryBoxes.length - 1 ? mysteryBoxes[0] : mysteryBoxes[idxCurr + 1];
    console.log(newBox);

    handleShowImg(newBox, 'left-to-right');
  }

  return (
    <div className={styles.container}>
      <div
        className="banner"
        // style={{ backgroundImage: `url(${currentBox.banner})` }}
      >
        <div className="wrapper-img">
          <div>
            <img src={currentBox.banner} alt="" />
          </div>
        </div>
        <div className={styles.boxContent}>
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
        <div className={styles.changeBanner}>
          <span className="prev" onClick={onPrevBox}>
            <svg width="20" height="9" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.11586 4.14412L4.56019 0.0931301C4.68368 -0.00716257 4.81867 -0.0264591 4.9653 0.0352813C5.11176 0.0971028 5.1853 0.208908 5.1853 0.371023V2.96363H19.6296C19.7377 2.96363 19.8265 2.99829 19.8959 3.06774C19.9652 3.13714 20 3.22592 20 3.33391V5.55608C20 5.66404 19.9653 5.75282 19.8959 5.82214C19.8264 5.89154 19.7376 5.9262 19.6297 5.9262H5.18522V8.51877C5.18522 8.6733 5.11156 8.78511 4.96518 8.85435C4.81843 8.91633 4.68343 8.8929 4.55995 8.78511L0.115616 4.68758C0.0384712 4.61048 0 4.51805 0 4.40993C0 4.30988 0.0387135 4.22126 0.11586 4.14412Z" fill="#72F34B" />
            </svg>
          </span>
          <span className="next" onClick={onNextBox}>
            <svg width="20" height="9" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.8841 4.14412L15.4398 0.0931301C15.3163 -0.00716257 15.1813 -0.0264591 15.0347 0.0352813C14.8882 0.0971028 14.8147 0.208908 14.8147 0.371023V2.96363H0.370361C0.262285 2.96363 0.173506 2.99829 0.104144 3.06774C0.0348227 3.13714 0 3.22592 0 3.33391V5.55608C0 5.66404 0.0346606 5.75282 0.104103 5.82214C0.173627 5.89154 0.262407 5.9262 0.370321 5.9262H14.8148V8.51877C14.8148 8.6733 14.8884 8.78511 15.0348 8.85435C15.1816 8.91633 15.3166 8.8929 15.44 8.78511L19.8844 4.68758C19.9615 4.61048 20 4.51805 20 4.40993C20 4.30988 19.9613 4.22126 19.8841 4.14412Z" fill="#72F34B" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MysteryBoxes;
