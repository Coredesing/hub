/* eslint-disable @typescript-eslint/no-unused-expressions */
import clsx from "clsx";
import Link from "@material-ui/core/Link";
import useStyles from "./style";
import { useCardStyles } from "../style";
import Image from "../../../components/Base/Image";
import { TOKEN_TYPE } from "../../../constants";
import { formatCampaignStatus, getDiffTime } from "@utils/index";
import React, { useCallback, useEffect, useState } from "react";
import { CountDownTimeV2, DHMSType } from '@base-components/CountDownTime'
import { useMediaQuery, useTheme } from "@material-ui/core";

type Props = {
  card: { [k: string]: any };
  title?: string | React.ReactElement;
  [k: string]: any;
};
export const Card = ({ card, title, ...props }: Props) => {
  const theme = useTheme();
  const matchXS = useMediaQuery(theme.breakpoints.down("xs"));

  const styles = { ...useStyles(), ...useCardStyles() };
  const [titleTime, setTitleTime] = useState('');
  const [timer, setTimer] = useState<DHMSType>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [refresh, setReresh] = useState(true);
  // const isOpen = card.campaign_status === "Filled";
  const isTicket = card.token_type === TOKEN_TYPE.ERC721;
  useEffect(() => {
    if (refresh && card) {
      let timer: number = 0;
      if (card.start_join_pool_time && +card.start_join_pool_time * 1000 > Date.now()) {
        timer = +card.start_join_pool_time * 1000;
        setTitleTime('Whitelist Open in');
      } else if (card.end_join_pool_time && +card.end_join_pool_time * 1000 > Date.now()) {
        timer = +card.end_join_pool_time * 1000;
        setTitleTime('Whitelist End in');
      } else if (card.start_time && +card.start_time * 1000 > Date.now()) {
        setTitleTime('Start Buy in');
        timer = +card.start_time * 1000;
      } else if (card.finish_time) {
        const finish_time = +card.finish_time * 1000;

        if (finish_time > Date.now()) {
          setTitleTime('End Buy in');
          timer = +card.finish_time * 1000;
        }
        if (finish_time <= Date.now()) {
          setTitleTime('Finished')
        }
      } else {
        setTitleTime('Coming soon');
      }
      if (timer && timer > Date.now()) {
        setTimer(getDiffTime(timer, Date.now()));
      }
      setReresh(false);
    }
  }, [card, refresh]);

  const onRefresh = useCallback(() => {
    setReresh(true);
  }, [])

  return (
    <div className={clsx(styles.card, props.className, styles.cardOpening)}>
      <div className={clsx(styles.cardImg, styles.cardImgUpcoming)}>
        <h4>{formatCampaignStatus(card.campaign_status)}</h4>
        <Image src={card.banner} />
      </div>

      <div className="title" style={{ marginBottom: '5px' }}>
        {title}
      </div>
      <CountDownTimeV2 time={timer} title={titleTime} isDislayTime={titleTime !== 'Finished' && titleTime !== 'Coming soon'} dislayType={matchXS ? "vertical" : "horizontal"} onFinish={onRefresh} />
      <Link
        href={`/#/${isTicket ? "buy-nft" : "buy-token"}/${card.id}`}
        className={clsx(styles.btnDetail, "btn-detail")}
      >
        Detail
      </Link>
    </div>
  );
};
