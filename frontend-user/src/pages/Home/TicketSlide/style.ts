import { makeStyles } from "@material-ui/core";
import { typeDisplayFlex } from "../../../styles/CommonStyle";
// import { isSafari } from "react-device-detect";

const useStyles = makeStyles((theme: any) => {
  return {
    container: {
      display: "flex",
      "& .swiper-container": {
        paddingLeft: "50px",
        paddingRight: "50px",
      },
      "& .swiper-slide": {
        width: "315px",
        height: "100%",
        [theme.breakpoints.down("sm")]: {
          width: "280px",
        },
        [theme.breakpoints.down("xs")]: {
          width: "156px",
        },
      },
    },
    cardTokenSale: {
      width: "315px",
      height: "100%",
      [theme.breakpoints.down("sm")]: {
        width: "280px",
      },
      [theme.breakpoints.down("xs")]: {
        width: "156px",
      },

      "& .card-token-title": {
        ...typeDisplayFlex,
        justifyContent: "space-between",
        alignItems: "center",
        "& h4": {
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "16px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: "28px",
          color: "#fff",

          [theme.breakpoints.down("xs")]: {
            fontWeight: "normal",
            fontSize: "12px",
            lineHeight: "14px",
          },
        },
        "& span": {
          display: "block",
          padding: "6px 8px",
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: "12px",
          color: "#fff",
          borderRadius: "2px",
          background: "#28481E",
          textTransform: "uppercase",
          [theme.breakpoints.down("xs")]: {
            fontSize: "8px",
            padding: "4px 4px",
          },
        },
      },
    },
    swiperSlide: {
      '& .swiper-button-disabled': {
          border: '2px solid rgba(104, 104, 104, 0.4) !important',
          background:'#555555 !important',
      },
      '& .swiper-button-prev, & .swiper-button-next': {
          background: 'radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)',
          display: 'grid',
          placeItems: 'center',
          border: '2px solid #686868',
          width: '32px',
          height: '32px',
          backdropFilter: 'blur(80px)',
          borderRadius: '50%',
          // transform: 'matrix(-1, 0, 0, 1, 0, 0)',
          // background: 'rgba(217, 217, 217, 0.9)',
          transition: '.3s',
          '&:hover': {
              border: '2px solid #686868',
              background: '#c6c2c2',
          }
      },
      '& .swiper-button-prev:after, & .swiper-button-next:after': {
          display: 'none',
      },
      '& .swiper-button-prev:before, & .swiper-button-next:before': {
          
      },
      '& .swiper-button-prev:before': {
          content: 'url(/images/icons/prev-icon.svg)',

      },
      '& .swiper-button-next:before': {
          content: 'url(/images/icons/next-icon.svg)',
      }
  },
  };
});

export default useStyles;
