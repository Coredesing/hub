import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: any) => {
  return {
    section: {
      position: "relative",
      paddingTop: "80px",
      paddingBottom: "160px",
      paddingLeft: "160px",
      paddingRight: "160px",
      [theme.breakpoints.down("xs")]: {
        paddingLeft: "28px",
        paddingRight: "28px",
      },
      "& .rectangle": {
        position: "absolute",
        width: "100%",
        top: "100px",
        left: 0,
        "& img": {
          width: "100%",
        },
        [theme.breakpoints.down("xs")]: {
          top: "50px",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },

        "&.bl::before": {
          background:
            "linear-gradient(180deg, #0A0A0A 0%, rgba(23, 23, 23, 0) 0.01%, #0A0A0A 57.29%)",
        },
        "&.gr::before": {
          background:
            "linear-gradient(180deg, #0A0A0A 0%, rgba(23, 23, 23, 0) 0.01%, #171717 57.29%)",
        },
      },
    },
    banner: {
      background: "#0A0A0A",
      paddingTop: "130px",
      paddingBottom: "130px",
      "& .large-text": {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginBottom: "24px",
        "& h1": {
          // maxWidth: '890px',
          color: "#fff",
          fontFamily: "Space Ranger",
          fontWeight: "bold",
          fontSize: "82px",
          fontStyle: "normal",
          lineHeight: "62px",
          letterSpacing: "0.02em",
          textAlign: "center",
        },
        [theme.breakpoints.down("xs")]: {
          "& h1": {
            fontSize: "48px",
            lineHeight: "40px",
            letterSpacing: "0.02em",
            textAlign: "center",
          },
        },

        // '& svg': {
        //   [theme.breakpoints.up('md')]: {
        //     width: '200px',
        //     height: '200px',
        //   },
        //   [theme.breakpoints.down('md')]: {
        //     minWidth: '150px',
        //     minHeight: '150px',
        //   }
        // }
      },
      "& .small-text": {
        color: "#fff",
        fontFamily: "Firs Neue",
        fontWeight: 600,
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "28px",
        letterSpacing: "0.02em",
        textAlign: "center",
        [theme.breakpoints.down("xs")]: {
          fontSize: "16px",
          lineHeight: "22px",
        },
        "& .launchpad": {
          color: "#72F34B",
        },
      },
      [theme.breakpoints.down("xs")]: {
        paddingBottom: "100px",
      },
    },
    bannerContent: {
      width: "100%",
      maxWidth: "1120px",
      [theme.breakpoints.down("xs")]: {},
    },
    wrapperImgBanner: {
      width: "100%",
      position: "absolute",
      top: "10px",
      left: 0,
      display: "grid",
      placeContent: "center",
      paddingLeft: "84px",
      paddingRight: "84px",
      [theme.breakpoints.down("xs")]: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    imgBanner: {
      // left: '0px',
      // width: '100%',
      maxWidth: "1120px",
      minHeight: "80px",
      backgroundImage: "url(/images/banner-2.png), url(/images/banner-1.png)",
      "background-position": "right top, center",
      "background-repeat": "no-repeat, repeat",
      backgroundSize: "40%, cover",
      position: "relative",
      display: "flex",
      gap: "45px",
      alignItems: "center",
      paddingLeft: "62px",
      paddingRight: "102px",
      justifyContent: "center",
      [theme.breakpoints.down("sm")]: {
        gap: "10px",
        flexDirection: "column",
        backgroundSize: "40%, contain",
        alignItems: "center",
        paddingTop: "10px",
        paddingBottom: "10px",
      },
      [theme.breakpoints.down("xs")]: {
        gap: "10px",
        flexDirection: "column",
        backgroundSize: "40%, contain",
        alignItems: "center",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "28px",
        paddingRight: "28px",
        width: "100%",
      },
      "& .text": {
        "& h4": {
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: "12px",
          lineHeight: "14px",
          textTransform: "uppercase",
          color: "#fff",
          marginBottom: "4px",
        },
        "& h3": {
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "20px",
          lineHeight: "28px",
          color: "#fff",
        },
        [theme.breakpoints.down("sm")]: {
          "& h4, & h3": {
            textAlign: "center",
          },
          "& h3": {
            fontSize: "16px",
            lineHeight: "22px",
            textAlign: "center",
          },
        },
      },
      "& .btn-join": {
        background: "#0A0A0A",
        borderRadius: "4px",
        border: "1px solid #ff0095",
        color: "#fff",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "24px",
        mixBlendMode: "normal",
        height: "40px",
        minWidth: "180px",
        width: "fit-content",
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": {
          textDecoration: "unset",
        },
      },
    },
    btnCloseBanner: {
      position: "absolute",
      right: "7px",
      top: "7px",
      minWidth: "unset",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "#D4D4D4",
      "& img": {
        width: "18px",
        height: "18px",
      },
    },
    ticketSales: {
      paddingTop: "120px",
      paddingBottom: "130px",
      background: "#171717",
      [theme.breakpoints.down("xs")]: {
        paddingTop: "40px",
      },
    },
    tokenSales: {
      background: "#0A0A0A",
      paddingLeft: "0",
      paddingRight: "0",
      paddingTop: "120px",
      paddingBottom: "130px",
    },
    partners: {
      paddingTop: "120px",
      paddingBottom: "130px",
    },
    perfomance: {
      paddingTop: "60px",
      paddingBottom: "130px",
      background: "#171717",

      "& .rectangle": {
        top: 0,
        left: 0,
      },
    },
    wrapperContent: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginTop: "28px",
    },
    content: {
      display: "flex",
      gap: "70px",
      position: "relative",
      maxWidth: "1120px",
      width: "100%",

      "&.horizontal": {},
      "&.vertical": {
        display: "grid",
        gap: "40px",
        // gridTemplateColumns: '1fr',
      },
    },
    contentTitle: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      "& h3": {
        color: "#fff",
        fontFamily: "Firs Neue",
        fontWeight: 600,
        fontSize: "44px",
        lineHeight: "54px",
        fontStyle: "normal",
      },
      "& h5": {
        color: "#fff",
        fontFamily: "Firs Neue",
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "32px",
      },
      [theme.breakpoints.down("xs")]: {
        "& h3": {
          color: "#fff",
          fontFamily: "Firs Neue",
          fontWeight: 600,
          fontSize: "28px",
          lineHeight: "36px",
          fontStyle: "normal",
        },
        "& h5": {
          color: "#fff",
          fontFamily: "Firs Neue",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "14px",
          lineHeight: "22px",
        },
      },
      "&.left": {
        "& h3": {
          textAlign: "left",
        },
        "& h5": {
          textAlign: "left",
        },
      },
      "&.center": {
        alignItems: "center",
        "& h3": {
          textAlign: "center",
        },
        "& h5": {
          textAlign: "center",
          padding: "0px calc((100% - (400px * 2)) / 2)",
        },
      },
    },
    btnDiscover: {
      outline: "none",
      border: "none",
      borderRadius: "2px",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "26px",
      textAlign: "center",
      minWidth: "180px",
      cursor: "pointer",
      height: "44px",
      color: "#000",
      background: "#72f348",
      width: "fit-content",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      "&:hover": {
        color: "#000",
        textDecoration: "unset",
      },
    },

    tbCellProject: {
      display: "flex !important",
      gap: "10px !important",

      "& img": {
        width: "40px",
        height: "40px",
      },

      "& > div": {
        display: "flex",
        flexDirection: "column !important",
        alignItems: "flex-start !important",
        gap: "0px !important",

        "& h3": {
          color: "#fff",
          fontFamily: "Firs Neue",
          fontWeight: 600,
          fontStyle: "normal",
          fontSize: "16px",
          // lineHeight: '28px',
        },
        "& h5": {
          color: "#fff",
          fontFamily: "Firs Neue",
          fontWeight: "normal",
          fontStyle: "normal",
          fontSize: "14px",
          lineHeight: "22px",
        },
      },
    },
  };
});

export default useStyles;

export const useCardStyles = makeStyles((theme) => ({
  cards: {
    fontFamily: "Firs Neue",
    gap: "20px",
    [theme.breakpoints.down("xs")]: {
      gap: "7px",
    },
  },
  cardsTicketSales: {
    display: "grid",
    gridTemplateColumns: "315px 315px",
    paddingTop: "40px",
    [theme.breakpoints.down("md")]: {
      placeContent: "center",
      paddingTop: "unset",
    },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "280px 280px",
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "auto auto",
    },
  },
  cardsTokenSales: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    overflow: "hidden",
  },
  cardsPartnerShip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, 201px)",
    placeContent: "center",
    gap: "80px",
    [theme.breakpoints.down("sm")]: {
      gap: "40px",
    },
    [theme.breakpoints.down("xs")]: {
      gap: "20px",
    },
  },
  cardTokenSale: {
    width: "315px",
    [theme.breakpoints.down("sm")]: {
      width: "280px",
    },
  },
  card: {
    padding: "19px",
    paddingTop: "26px",
    border: "1px solid #28481E",
    borderRadius: "4px",
    transition: ".3s",
    "&:hover": {
      border: "1px solid #72F34B",
      boxShadow: "0px 4px 40px rgba(114, 243, 75, 0.12)",
      background: "#000000",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "7px",
      paddingTop: "26px",
    },
  },
  cardImg: {
    position: "relative",
    width: "100%",
    height: "198px",
    [theme.breakpoints.down("sm")]: {
      height: "170px",
    },
    [theme.breakpoints.down("xs")]: {
      height: "148px",
    },
    "&::before, &::after": {
      content: '""',
      height: "9px",
      width: "120px",
      position: "absolute",
      background: "#458531",
      top: "-17.5px",
    },
    "&::before": {
      left: "3px",
      transform: "skew(-40deg)",
    },
    "&::after": {
      right: "3px",
      transform: "skew( 40deg )",
    },
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "4px",
    },
  },
}));
