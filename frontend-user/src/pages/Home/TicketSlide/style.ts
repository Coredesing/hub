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
  };
});

export default useStyles;
