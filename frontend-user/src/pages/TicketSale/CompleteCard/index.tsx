import clsx from "clsx";
import useStyles from "./style";
import { useCardStyles } from "../style";
import { formatNumber, getDiffTime, getSeedRound } from "../../../utils";
import { useEffect, useState } from "react";
import { Progress } from "../../../components/Base/Progress";
import Image from "../../../components/Base/Image";
import { calcProgress } from "../utils";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { numberWithCommas } from "../../../utils/formatNumber";
import BigNumber from 'bn.js';

type Props = {
  card: { [k: string]: any };
  [k: string]: any;
};
export const CompleteCard = ({ card, ...props }: Props) => {
  const styles = { ...useStyles(), ...useCardStyles() };
  const theme = useTheme();
  const matchXS = useMediaQuery(theme.breakpoints.down("xs"));

  const [openTime, setOpenTime] = useState<{ [k in string]: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (card) {
      const openTime = +card.start_time * 1000;
      const finishTime = +card.finish_time * 1000;

      if (openTime > Date.now()) {
        setOpenTime(getDiffTime(openTime, Date.now()));
      }
    }
  }, [card]);

  const getTotalSold = (card: any) => {
    if(card.token_sold_display && new BigNumber(card.token_sold_display).gten(0)) {
      const totalSold = new BigNumber(card.token_sold).add(new BigNumber(card.token_sold_display));
      if(totalSold.gte(new BigNumber(card.total_sold_coin))) {
        return card.total_sold_coin;
      }
      return new BigNumber(card.token_sold).add(new BigNumber(card.token_sold_display)).toNumber().toFixed(1);
    }
    return card.token_sold;
  }

  return (
    <div className={clsx(styles.card, styles.cardComp)}>
      <div className={styles.cardCompBody}>
        {!matchXS && (
          <div className={clsx(styles.cardCompItem, styles.cardCompImg)}>
            <Image src={card.banner} />
          </div>
        )}
        {!matchXS && (
          <div className={clsx(styles.cardCompItem, styles.cardCompTitle)}>
            <span className={styles.compText}>
              <span className="seed">{getSeedRound(card.is_private)}</span>
              <span className="claim">/{card.pool_type}</span>
            </span>
            <h4>{card.title}</h4>
          </div>
        )}
        {matchXS && (
          <div className={styles.bannerTitleRow}>
            <div className={clsx(styles.cardCompItem, styles.cardCompImg)}>
              <Image src={card.banner} />
            </div>
            <div className={clsx(styles.cardCompItem, styles.cardCompTitle)}>
              <span className={styles.compText}>
                <span className="seed">{getSeedRound(card.is_private)}</span>
                <span className="claim">/{card.pool_type}</span>
              </span>
              <h4>{card.title}</h4>
            </div>
          </div>
        )}
        <div className={styles.cardCompItem}>
          <span className={clsx(styles.text, styles.compText)}>
            Total sales
          </span>
          <span
            className={styles.textBold}
            style={{ fontSize: "20px", lineHeight: "28px" }}
          >
            {numberWithCommas(card.total_sold_coin || 0, 0)}
          </span>
        </div>
        <div className={clsx(styles.cardCompItem, styles.cardCompProgress)}>
          <div className="title">
            <span
              style={{ paddingTop: "5px" }}
              className={clsx(styles.text, styles.compText)}
            >
              PROGRESS
            </span>
            <span>
              <span className={clsx(styles.textBold, "percent")}>
                ({calcProgress(+getTotalSold(card), +card.total_sold_coin)}%)
              </span>
              <span className={clsx(styles.text, styles.compText)}>
                {numberWithCommas(+getTotalSold(card) + '' || 0, 0)}/{numberWithCommas(card.total_sold_coin || 0)}{" "}
                {card.tokenSymbol}
              </span>
            </span>
          </div>
          <div className="progress">
            <Progress
              progress={calcProgress(+getTotalSold(card), +card.total_sold_coin)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
