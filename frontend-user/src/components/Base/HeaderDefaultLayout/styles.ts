import { makeStyles } from "@material-ui/core";
import { typeDisplayFlex } from "../../../styles/CommonStyle";
import { isSafari } from "react-device-detect";

const useStyles = makeStyles((theme) => {
  return {
    // navBar: {
    //   gridArea: 'header',
    //   width: '1120px',
    //   margin: '24px auto',
    //   maxWidth: 'calc(100vw - 80px)',
    //   backgroundColor: '#020616',
    //   ...typeDisplayFlex,
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    //   position: 'relative',
    //   [theme.breakpoints.only('xs')]: {
    //     flexDirection: 'column',
    //     margin: '10px auto',
    //     maxWidth: 'calc(100vw - 60px)',
    //   }
    // },
    navbarLink: {
      textAlign: "center",
      display: "inline-block",
    },
    navbarLogo: {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    },
    navbarBrand: {
      color: "white",
      fontSize: 15,
      textAlign: "center",
      fontWeight: 300,
      marginTop: 5,
    },
    navbarBrandBold: {
      color: "#D01F36",
    },
    rightBar: {
      ...typeDisplayFlex,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    btn: {
      fontStyle: "normal",
      fontWeight: 900,
      fontSize: "14px",
      lineHeight: "24px",
      letterSpacing: "1px",
      color: "#FFFFFF",
      mixBlendMode: "normal",
      backgroundColor: "none",
      border: "none",
      cursor: "pointer",

      "&:focus": {
        outline: "none",
      },
      "&.my-account": {
        ...typeDisplayFlex,
        alignItems: "center",

        "& img": {
          marginRight: 4,
        },

        "& .icon": {
          width: 20,
          filter: "brightness(0) invert(1)",
        },

        "& span": {
          ...typeDisplayFlex,
          alignItems: "center",
        },

        "&:hover": {
          color: "white",
        },

        [theme.breakpoints.only("xs")]: {
          marginTop: 16,
          marginBottom: 16,
        },
      },
    },
    btnNetwork: {
      fontFamily: "DM Sans",
      fontWeight: "bold",
      fontSize: 14,
      lineHeight: 18,
      padding: "0 16px",
      height: "36px",
      borderRadius: 20,
      ...typeDisplayFlex,
      alignItems: "center",
      color: "#FFFFFF",
      marginLeft: 40,
      background: "linear-gradient(180deg, #222228 44.79%, #040719 100%)",
      border: "1px solid #44454B",
      "& img": {
        width: "20px",
        height: "20px",
      },
      [theme.breakpoints.only("xs")]: {
        marginLeft: 0,
      },
    },
    btnConnect: {
      background: "#3232DC",
      height: "36px",
      ...typeDisplayFlex,
      alignItems: "center",
      padding: "0 14px",
      borderRadius: 20,
      marginLeft: 12,
      transition: ".2s all ease-out",
      font: "normal normal bold 14px/18px DM Sans",

      "&:hover": {
        background: "#1515ae",
      },
    },
    btnConnectText: {
      marginLeft: 10,
      ...typeDisplayFlex,
      alignItems: "center",
      justifyContent: "center",
      font: "normal normal normal 12px/18px Helvetica",
    },
    btnLogout: {
      background: "#3232DC",
      borderRadius: "8px",
      ...typeDisplayFlex,
      justifyContent: "center",
      alignItems: "center",
      border: "none",
      outline: "none",
      padding: "0 15px",
      height: 42,
    },
    btnAccount: {
      display: "inline-block",
      backgroundColor: "#0C1018",
      padding: "8px 10px",
      borderRadius: 20,
      marginRight: "-12px",
    },
    btnChangeAppNetwork: {
      padding: "6px 11px",
      border: "2px solid #FFFFFF",
      boxSizing: "border-box",
      borderRadius: 30,
      background: "transparent",
      fontWeight: 600,
      color: "white",
      cursor: "pointer",
      transition: ".2s all ease-in",
      font: "normal normal 700 12px/14px DM Sans",

      "&:focus": {
        outline: "none",
      },

      "&:hover": {
        backgroundColor: "white",
        color: "#D01F36",
      },
    },
    loginErrorBanner: {
      top: "100%",
      width: 1040,
      maxWidth: "calc(100vw - 80px)",
      margin: "8px auto",
      borderRadius: 8,
      backgroundColor: "#591425",
      fontSize: 14,
      color: "white",
      padding: 8,
      ...typeDisplayFlex,
      justifyContent: "center",
      alignItems: "center",
      fontWeight: 500,
      zIndex: 99999,
      minHeight: 42,
      lineHeight: "20px",

      [theme.breakpoints.down("xs")]: {
        width: "calc(100% - 36px)",
        maxWidth: "calc(100vw - 36px)",
        margin: "auto",
      },
    },

    iconWarning: {
      marginRight: 8,
    },

    loginErrorBannerText: {
      font: "normal normal 400 14px/24px Helvetica",
      color: "white",
      fontWeight: 500,
    },
    loginErrorGuide: {
      color: "white",
      textDecoration: "underline",

      "&:hover": {
        color: "white",
      },
    },
    spacer: {
      flex: "1 0 0",
    },

    rightHeadMobile: {
      ...typeDisplayFlex,
      justifyContent: "flex-end",
      alignItems: "center",
      [theme.breakpoints.only("xs")]: {
        "& .startMobile": {
          marginRight: 5,
        },
      },
    },

    [theme.breakpoints.only("xs")]: {
      rightBar: {
        position: "fixed",
        backgroundColor: "#030926",
        width: "100%",
        height: "100vh",
        top: 0,
        left: 0,
        margin: 0,
        padding: "113px 32px",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        display: "none",
        zIndex: 5,

        "&.active": {
          display: "flex",
        },
      },
      btnConnect: {
        margin: "20px 0",
      },
      btn: {
        "&.start p": {
          padding: 0,
          marginBottom: "20px",
        },
      },
      sideBarLogo: {
        position: "absolute",
        top: "10px",
        left: "32",
      },
      closeBtn: {
        position: "absolute",
        top: "28px",
        right: "20px",
      },
      navBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      navbarLink: {
        "& img": {
          height: 44,
        },
      },
      loginErrorBanner: {
        alignItems: "flex-start",
        "& > img": {
          marginTop: "5px",
        },
      },
    },
    navBarGF: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      minHeight: "80px",
      display: "grid",
      gridTemplateColumns: "173px auto",
      alignItems: "center",
      gap: "32px",
      padding: "10px 84px",
      background: "#000",
      color: "#FFFFFF",
      font: "normal normal bold 16px/24px DM Sans",
      // position: 'relative',
      zIndex: 1,
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "173px 60px",
        justifyContent: "space-between",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "0px 32px",
        minHeight: "60px",
        gridTemplateColumns: "auto auto",
        "& .logo img": {
          height: "16px",
        },
      },

      // '& > div': {
      //   ...typeDisplayFlex,
      //   flexDirection: 'row',
      //   alignItems: 'center',
      //   justifyContent: 'space-between',
      //   width: '100%',

      //   '& .pool ': {
      //     display: 'flex'
      //   },

      //   '& a': {
      //     color: '#FFFFFF'
      //   },

      //   '& .connects i': {
      //     marginLeft: '20px',

      //     '&::before': {
      //       color: '#9F9F9F'
      //     },

      //     '&:hover::before': {
      //       color: '#D01F37'
      //     }
      //   }
      // },
      // [theme.breakpoints.down('sm')]: {
      //   position: 'static',
      //   padding: '10px 40px',
      // },
      // [theme.breakpoints.down('xs')]: {
      //   padding: '0',
      //   flexDirection: 'column',
      //   position: 'relative',

      //   '& > div:first-child': {
      //     width: '100%',
      //     padding: '10px 32px',
      //     display: 'grid',
      //     gridTemplateColumns: '1fr auto auto',
      //     alignItems: 'center'
      //   },

      //   '& .logo img': {
      //     width: '30px',
      //   },

      //   '& .connects': {
      //     order: 3
      //   },

      //   '& .pool': {
      //     order: 2
      //   },

      //   '& .logo': {
      //     order: 1
      //   }
      // },
    },
    headerNav: {
      ...typeDisplayFlex,
      justifyContent: "space-between",
      alignItems: "center",
      gap: "32px",
      [theme.breakpoints.down("md")]: {
        display: "none",
        position: "absolute",
        top: "80px",
        left: 0,
        width: "100%",
        background: "#000",
        placeContent: "center",
        textAlign: "center",
        padding: "20px",
        "&.show": {
          display: "grid",
        },
      },
      [theme.breakpoints.down("xs")]: {
        top: "60px",
      },
    },
    headerLinks: {
      margin: 0,
      padding: 0,
      ...typeDisplayFlex,
      gap: "32px",
      flexWrap: "wrap",
      [theme.breakpoints.down("md")]: {
        display: "grid",
      },
    },
    headerLink: {
      [theme.breakpoints.down("lg")]: {
        marginRight: isSafari ? "32px" : 0,
      },
      [theme.breakpoints.down("md")]: {
        marginRight: 0,
      },
      "& a": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "24px",
        color: "#FFFFFF",
        mixBlendMode: "normal",
      },
    },
    headerAccount: {
      ...typeDisplayFlex,
      gap: "28px",
      alignItems: "center",
      [theme.breakpoints.down("md")]: {
        display: "grid",
      },
    },
    headerAccText: {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
      color: "#FFFFFF",
      mixBlendMode: "normal",
      "&:hover": {
        color: "#FFFFFF",
      },
    },
    headerAccBtn: {
      background: "#2E2E2E",
      borderRadius: "4px",
      outline: "none",
      border: "none",
      padding: "4px 4px 4px 8px",
      ...typeDisplayFlex,
      gap: "6px",
      alignItems: "center",

      "& .logo-currency": {
        outline: "none",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "grid",
      },
    },
    btnWallet: {
      marginLeft: isSafari ? "6px" : 0,
      outline: "none",
      background: "transparent",
      border: "none",
      ...typeDisplayFlex,
      alignItems: "center",
      cursor: "pointer",
      "& .balance": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "24px",
        color: "#FFFFFF",
        mixBlendMode: "normal",
        marginRight: "3px",
      },
      "& .address": {
        display: "block",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "22px",
        color: "#FFFFFF",
        mixBlendMode: "normal",
        padding: "7px 13px",
        background: "#000000",
        borderRadius: "4px",
      },
      "& .connect-wl": {
        ...typeDisplayFlex,
        gap: "3px",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "22px",
        color: "#FFFFFF",
        mixBlendMode: "normal",
        padding: "7px 0px",
        paddingRight: "4px",
      },
    },
    hamburger: {
      cursor: "pointer",
      display: "none",
      width: "60px",
      height: "60px",
      background: "#72F34B",
      [theme.breakpoints.down("md")]: {
        display: "grid",
        placeContent: "center",
      },
      [theme.breakpoints.down("xs")]: {
        position: "absolute",
        right: 0,
      },
    },
  };
});

export default useStyles;
