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
    bannerContract: {
      width: '100%',
      padding: '20px 10px',
      textAlign: 'center',
      background: '#171717',
      color: '#fff',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 'normal'
    },
    link: {
      color: '#fff',
      textDecoration: 'underline',
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 'normal',
      '&:hover': {
        color: '#fff',
      }
    },
    btnCloseBanner: {
      position: "absolute",
      right: "14px",
      top: "14px",
      minWidth: "unset",
      width: "25px",
      height: "25px",
      borderRadius: "50%",
      background: "#D4D4D4",
      "& img": {
        width: "25px",
        height: "25px",
        position: "absolute", // fix tren safari
      },
    },
  };
});

export default useStyles;
