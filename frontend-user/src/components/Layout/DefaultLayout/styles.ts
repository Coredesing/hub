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
      // background: '#171717',
      width: '100%',
      position: 'fixed',
      top: '90px',
      left: 0,
      zIndex: 1000,
      [theme.breakpoints.down('xs')]: {
        top: '70px',
      }
      
    },
    content: {
      color: '#fff',
      padding: '0px 10px',
      textAlign: 'center',
      backgroundImage: 'url(/images/banner-3.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 'normal',
      display: 'grid',
      placeContent: 'center',
      justifyContent: 'center',
      height: '70px',
      width: '100%',
      maxWidth: '1120px',
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%)',
      borderRadius: '4px'
    },
    wrapperText: {
      display: 'grid',
      gap: '10px',
      gridTemplateColumns: '245px auto',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        gap: '0px',
        gridTemplateColumns: 'auto',
      },
      '& h3': {
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        wordWrap: 'break-word',
        wordBreak: 'break-all',
        '&:nth-child(2)': {
          display: 'grid',
          gridTemplateColumns: 'auto auto auto',
          gap: '6px',
          '& img': {
            width: '18px',
            height: '18px',
          }
        }
      }
    },
    link: {
      color: '#fff',
      textDecoration: 'underline',
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 'normal',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
      '&:hover': {
        color: '#fff',
      }
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
        position: "absolute", // fix tren safari
      },
    },
  };
});

export default useStyles;
