import { Card } from "../Card";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.min.css";
import useStyles from "./style";

import SwiperCore, { Pagination } from "swiper";
import { getSeedRound } from "../../../utils";
SwiperCore.use([Pagination]);

const TicketSlide = ({ data }: any) => {
  const styles = { ...useStyles() };

  return (
    <div className={styles.container}>
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={10}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
      >
        {(data || []).map((card: any, id: any) => (
          <SwiperSlide>
            <Card
              card={card}
              key={id}
              className={styles.cardTokenSale}
              title={
                <div className="card-token-title">
                  <h4>{card.title}</h4>
                  <span>{getSeedRound(card.is_private)}</span>
                </div>
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TicketSlide;
