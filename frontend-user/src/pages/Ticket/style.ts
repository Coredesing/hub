import { makeStyles } from "@material-ui/core";
import { typeDisplayFlex } from "../../styles/CommonStyle";

const useStyles = makeStyles((theme: any) => {
  return {
    content: {
      // display: 'grid',
      // gap: '45px',
      // paddingTop: '35px',
      // alignItems: 'center',
      // position: 'relative',
      // paddingLeft: 'calc(100% - (461px * 2))',
      // paddingRight: 'calc(100% - (461px * 2))'
    },
    contentCard: {
      width: '100%',
      display: 'grid',
      placeContent: 'center'
    },
    wrapperCard: {
      maxWidth: '1120px',
      width: '100%',
    },
    displayContent: {
      paddingLeft: "calc((100% - (461px * 2 + 40px)) / 2)",
      paddingRight: "calc((100% - (461px * 2 + 40px)) / 2)",
    },
    alert: {
      marginTop: "12px",
      background: "#591425",
      borderRadius: "2px",
      padding: "10px 40px",
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      textAlign: "center",
      color: " #fff",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      "& a": {
        "&.link": {
          textDecoration: "underline",
          fontFamily: "inherit",
          fontStyle: "inherit",
          color: "inherit",
        },
        "&.kyc-link": {
          fontFamily: "inherit",
          fontStyle: "inherit",
          color: "inherit",
          fontWeight: "bold",
        },
      },
    },
    card: {
      marginTop: "35px",
      marginBottom: "40px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, 461px)",
      placeContent: "center",
      gap: "30px",
      [theme.breakpoints.down("sm")]: {
        placeItems: "center",
        gap: "20px",
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "300px",
        marginTop: "28px",
      },
    },
    cardImg: {
      "& img": {
        width: "100%",
        maxHeight: "461px",
        height: "100%",
        objectFit: "contain",
        background: '#000',
      },
    },
    cardBody: {
      // paddingTop: '30px',
      ...typeDisplayFlex,
      flexDirection: "column",
      justifyContent: "space-between",
      width: "461px",
      gap: "20px",
      [theme.breakpoints.down("md")]: {
        // width: '461px',
      },
      [theme.breakpoints.down("xs")]: {
        width: "303px",
      },
    },
    cardBodyText: {
      display: "grid",
      placeContent: "center",
      placeItems: "center",
      gridTemplateColumns: '1fr',
      "& h4, & h3": {
        margin: 0,
        padding: 0,
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        textAlign: "center",
        mixBlendMode: "normal",
        width: '100%'
      },

      "& h3": {
        paddingLeft: '24px',
        fontWeight: "bold",
        fontSize: "28px",
        lineHeight: "36px",
        color: " #FFFFFF",
        position: 'relative',
        '& img': {
          position: 'absolute', top: '5px', left: 0, width: '24px', height: '24px'
        }
        // marginBottom: '4px',
      },
      "& h4": {
        fontWeight: "600",
        fontSize: "16px",
        lineHeight: "28px",
        color: " #FFFFFF",
        marginBottom: "16px",
        "& span": {
          fontWeight: "normal",
          fontSize: "12px",
          lineHeight: "16px",
        },
      },

      "& button": {
        border: "1px solid #72F34B",
        boxSizing: "border-box",
        borderRadius: "4px",
        background: "transparent",
        padding: "10px",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        textAlign: "center",
        color: " #72F34B",
        fontWeight: "600",
        fontSize: "20px",
        lineHeight: "28px",
        ...typeDisplayFlex,
        alignItems: "center",
        justifyContent: "center",
        minWidth: "190px",
        cursor: "pointer",

        "&.openBuy": {
          width: "fit-content",
          fontSize: "16px",
          lineHeight: "28px",
          padding: "4px 25px",

          "& .small-text": {
            fontSize: "12px",
            lineHeight: "16px",
          },
        },

        "& img": {
          marginRight: "8px",
        },
        "& .small-text": {
          color: "#D1D1D1",
          fontWeight: "normal",
          fontSize: "14px",
          lineHeight: "22px",
        },
      },
    },
    cardBodyDetail: {},
    cardBodyClock: {
      "& h5": {
        margin: 0,
        padding: 0,
        marginBottom: "8px",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        textAlign: "center",
        color: "#FFFFFF",
        fontWeight: "normal",
        fontSize: "12px",
        lineHeight: "16px",
        mixBlendMode: "normal",
        textTransform: "uppercase",
        ...typeDisplayFlex,
        justifyContent: "center",

        "& .open": {
          display: "block",
          maxWidth: "8px",
          maxHeight: "8px",
          borderRadius: "50%",
          marginLeft: "11px",
          marginTop: "1px",
          position: "relative",
          width: "fit-content",
          height: "fit-content",

          // '&:before': {
          //   position: 'absolute',
          //   content: '""',
          //   width: '8px',
          //   height: '8px',
          //   filter: 'blur(5px)',
          //   background: '#72F34B',
          //   left: '-1.4px',
          //   top: '-1.3px'
          // }
        },
      },
      "& .times": {
        ...typeDisplayFlex,
        justifyContent: "space-around",
        gap: "12px",
        background: "#2E2E2E",
        borderRadius: "4px",

        "& .dot": {
          display: "block",
          marginTop: "8px",
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "20px",
          lineHeight: "28px",
          color: "#fff",
        },

        "& .time": {
          // display: 'grid',
          // gap: '1px',
          display: "block",
          textAlign: "center",
          width: "60px",
          paddingTop: "6px",
          paddingBottom: "6px",

          "& .number, & .text": {
            fontStyle: "normal",
            mixBlendMode: "normal",
            display: "block",
          },
          "& .number": {
            color: "#fff",
            fontWeight: "600",
            fontSize: "24px",
            lineHeight: "36px",
            fontFamily: "Firs Neue",
          },
          "& .text": {
            color: "#D1D1D1",
            fontWeight: "600",
            fontSize: "8px",
            lineHeight: "12px",
            fontFamily: "Hanken Grotesk",
            textTransform: "uppercase",
          },
        },
      },
    },

    cardBodyProgress: {
      display: "grid",
      gap: "4px",
      [theme.breakpoints.down("xs")]: {
        display: "block",
      },
    },
    progressItem: {
      display: "grid",
      gap: "10px",

      "& .total .amount": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        color: " #aeaeae",
        fontWeight: "normal",
        fontSize: "16px",
        lineHeight: "24px",
        mixBlendMode: "normal",
      },
    },
    text: {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      color: " #fff",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "16px",
      mixBlendMode: "normal",
      textTransform: "uppercase",
    },
    textBold: {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      color: " #fff",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      mixBlendMode: "normal",
    },
    infoTicket: {
      ...typeDisplayFlex,
      justifyContent: "space-between",
      [theme.breakpoints.down("xs")]: {
        marginTop: "5px",
      },
    },
    buyBox: {
      [theme.breakpoints.down("xs")]: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "5px",
      },
    },
    timeEnd: {
      display: "block",
      padding: "3px 8px",
      borderRadius: "4px",
      background: "#2E2E2E",
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      color: " #fff",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      mixBlendMode: "normal",
    },
    amountBuy: {
      [theme.breakpoints.down("xs")]: {
        display: "grid",
        " grid-template-columns": "40px auto",
        "place-content": "space-between",
      },

      "& > span": {
        textTransform: "uppercase",
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        color: " #aeaeae",
        fontWeight: "normal",
        fontSize: "12px",
        lineHeight: "16px",
        mixBlendMode: "normal",
        marginBottom: "6px",
        display: "block",
      },
      "& > div": {
        ...typeDisplayFlex,
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        color: " #ffffff",
        fontWeight: 600,
        fontSize: "12px",
        lineHeight: "20px",
        mixBlendMode: "normal",
        "& span": {
          display: "grid",
          placeContent: "center",
          padding: "5px 12px",
          border: "1px solid #2E2E2E",
          cursor: "pointer",
        },
        "& span:nth-child(3)": {
          padding: "5px 14px",
          fontSize: "16px",
        },
        "& > span input": {
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          color: " #ffffff",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "28px",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid #3a3a3a",
          borderRadius: "unset",
          width: "44px",
          height: "26px",
          padding: "8px 4px",
          textAlign: "center",
        },
      },
    },
    btnMinMax: {
      background: "#72F34B",
      color: "#000",
      textTransform: "uppercase",

      "&.max": {
        borderRadius: "0px 2px 2px 0px",
      },
      "&.min": {
        borderRadius: "2px 0px  0px 2px",
      },

      "&.disabled": {
        background: "#498631 !important",
        cursor: "not-allowed !important",
      },
    },
    disabledAct: {
      cursor: "not-allowed !important",
      color: "#565555",
    },
    buyDisabled: {
      background: "#498631 !important",
    },
    btnClaim: {
      outline: 'none',
      border: 'none',
      background: '#F3E24B !important',
      borderRadius: '2px',
      color: '#000',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '28px',
      textAlign: 'center',
      padding: '13px 20px',
      textTransform: 'uppercase',
      minWidth: '200px',
      cursor: 'pointer',
      height: '52px',
      marginTop: '16px',
      '&.disabled': {
        opacity: '.5'
      }
    },
    buynow: {
      outline: "none",
      border: "none",
      background: "#72f348",
      borderRadius: "2px",
      color: "#000",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      textAlign: "center",
      padding: "13px 20px",
      textTransform: "uppercase",
      minWidth: "200px",
      cursor: "pointer",
      height: "52px",
    },
    btnApprove: {
      outline: "none",
      border: "none",
      background: "#0070a7",
      borderRadius: "2px",
      color: "#fff",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "28px",
      textAlign: "center",
      padding: "13px 20px",
      textTransform: "uppercase",
      minWidth: "200px",
      cursor: "pointer",
      display: 'grid',
      placeContent: 'center',
    },
    finished: {
      alignItems: "center",
      marginTop: "30px",
    },
    comingSoon: {
      width: "100%",
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "36px",
      textAlign: "center",
      background: "#2E2E2E",
      color: "#FFFFFF",
      padding: "10px",
      borderRadius: "4px",
    },
    alertMsg: {
      width: "100%",
      marginTop: "14px",
      "& img": {
        width: "14px",
        height: "14px",
        marginRight: "8px",
      },
      "& span": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "12px",
        lineHeight: "16px",
        textAlign: "left",
        color: "#F24B4B",
      },
    },
    loader: {
      ...typeDisplayFlex,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loaderText: {
      fontWeight: 700,
      marginTop: 20,
      color: "#999999",
      font: 'normal normal bold 14px/18px DM Sans'
    },
    bannerBox: {
      width: '100%',
      maxHeight: '550px',
      minHeight: '180px',
      '& img': {
        width: '100%',
        height: '100%',
        minHeight: '180px',
        maxHeight: '550px',
      }
    },
    priceBidBox: {
      marginTop: '22px',
      width: '100%',
      border: '1px solid #72F34B',
      boxSizing: 'border-box',
      borderRadius: '4px',
      padding: '9px 20px',

      '& > span': {
        display: 'block',
        marginBottom: '4px',
      },
      '& > div': {
        display: 'grid',
        gridTemplateColumns: '18px auto',
        gridGap: '8px',
        alignItems: 'center',
        '& img': {
          width: '18px',
          height: '18px',
        },
        '& span': {
          fontSize: '20px',
        }
      }
    }
  };
});

export default useStyles;



export const useAboutStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#171717",
  },
  tabName: {
    fontFamily: "Firs Neue !important",
    fontWeight: 600,
    fontStyle: "normal !important",
    fontSize: "16px !important",
    lineHeight: "28px !important",
    // color: "#72F34B",
    mixBlendMode: "normal",
    textTransform: "unset",
    justifyContent: "space-between",
    '&.active': {
      color: "#72F34B !important"
    },
    [theme.breakpoints.down("xs")]: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
    },
  },
  appbar: {
    background: "transparent !important",
    boxShadow: "none",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "24px",
      paddingRight: "24px",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  tabPaneContent: {
    fontFamily: "Firs Neue",
    fontWeight: "normal",
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#d1d1d1",
    mixBlendMode: "normal",
  },
  desc: {
    marginBottom: "20px",
  },
  links: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  link: {
    display: "grid",
    gridTemplateColumns: "80px auto",
    gap: "2px",
    alignItems: "center",

    "& .text": {
      fontFamily: "Firs Neue",
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      color: "#fff",
      mixBlendMode: "normal",
    },
  },
  weblink: {
    "& a": {
      background: "#2E2E2E",
      borderRadius: "4px",
      padding: "4px 8px",
      fontFamily: "Firs Neue",
      fontWeight: "normal",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      color: "#fff",
      mixBlendMode: "normal",
      display: "inline-flex",
      gap: "7px",
    },
  },
  socials: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, 28px)",
    gap: "10px",
    "& a": {
      display: "grid",
      "& img": {
        width: "24px",
        height: "24px",
      },
    },
  },
  paginationNav: {
    marginTop: '32px',
    marginBottom: '10px',
    background: 'transparent',
  },
  ulPagination: {
    color: '#AEAEAE',
    '& li div': {
      color: '#AEAEAE',
    },
    '& button': {
      background: 'transparent',
      color: '#AEAEAE',
      fontSize: '14px',
      lineHeight: '24px',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,

      '&[aria-label^="page"]': {
        background: '#72F34B',
        color: '#000000',
        '&:hover': {
          background: '#4fa934',
        }
      }
    }
  },
  wrapperBoxTimeLine: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, calc(100% / 5)))',
    gridAutoRows: 'minmax(max-content, 1fr)',
    placeContent: 'center',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '220px',
    },
    '& .box': {
      border: '1px solid rgba(255, 255, 255, 0.2)',
      // borderRight: 'unset',
      padding: '20px',
      textAlign: 'center',
      background: '#000000',
      // '&:last-child': {
      //   borderRight: '1px solid rgba(255, 255, 255, 0.2)',
      // },
      '&.active': {
        borderRadius: '4px',
        background: '#72F34B',
        '& .step span': {
          background: '#000',
        },
        ' & .title, & .desc': {
          color: ' #000',
        },
      },
      '& .step': {
        marginBottom: '15px',
        display: 'grid',
        alignItems: 'center',
        placeContent: 'center',
        '& span': {
          background: '#2E2E2E',
          display: 'grid',
          alignItems: 'center',
          width: '29px',
          height: '29px',
          borderRadius: '50%',
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '24px',
          color: ' #fff',
        }
      },
      '& .title': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '22px',
        color: ' #fff',
        marginBottom: '6px',
        textTransform: 'uppercase',
      },
      '& .desc': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        color: ' #fff',
        marginBottom: '15px',
        textAlign: 'center',
      },

    },
    '& .box:first-child': {
      // borderRight: 'unset',
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
    },
    '& .box:last-child': {
      borderRight: 'unset',
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
    }

  },
  wrapperBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 190px)',
    gridAutoRows: 'minmax(max-content, 1fr)',
    placeContent: 'center',
    gap: '12px',
    '& .box': {
      cursor: 'pointer',
      transition: '0.3s',
      '& .img-box': {
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '10px',
        marginBottom: '4px',
        borderRadius: '2px',
        position: 'relative',
        zIndex: '100',
        '&::before': {
          content: '""',
          filter: 'blur(15px)',
          position: 'absolute',
          background: '#283145',
          width: 'calc(100% - 20px)',
          height: '80px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%'
        },
        // 
        '& img': {
          width: '100%',
          height: '100px',
          position: 'relative',
          objectFit: 'contain'
        }
      },
      '& .id-box': {
        fontFamily: "Firs Neue",
        fontWeight: 600,
        fontStyle: "normal",
        fontSize: "14px",
        lineHeight: "22px",
        color: "#fff",
        mixBlendMode: "normal",
        display: 'block',
        textAlign: 'left',
      },
      '& .btn-claim-box': {
        fontSize: '14px',
        padding: '4px',
        height: 'unset',
        marginTop: '4px',
        width: '100%',
        minWidth: 'unset',
      }
    },
    '& .box.active, & .box:hover': {
      '& .img-box': {
        border: '1px solid #72F34B',
      }

    }
  },
  wrapperCountdownCollection: {
    // marginBottom: '20px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    alignItems: 'end',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr !important',
      gap: '4px',
    },
    '& .countdown': {
      height: '52px',
      borderRadius: '2px',
      background: '#000',
      '& .time .number': {
        fontSize: '24px !important',
        lineHeight: '28px !important',
        fontFamily: 'Space Ranger !important',
        [theme.breakpoints.down('xs')]: {
          fontSize: '20px',
        },
      }
    },
    '& .title': {
      height: '52px',
      background: '#000',
      borderRadius: '2px',
      display: 'grid',
      alignItems: 'center',
      '& h3': {
        fontFamily: 'Firs Neue',
        fontSize: '20px',
        color: '#fff',
        textTransform: 'uppercase',
        textAlign: 'center',
      }
    },
    '& button': {
      marginTop: '0',
    }
  },
  tableCellDesc: {
    [theme.breakpoints.down('xs')]: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      width: '160px',
      whiteSpace: 'nowrap',
    }
  }
}));

export const useMysteyBoxStyles = makeStyles((theme) => ({
  headerBox: {
    minHeight: '70px',
    background: '#2E2E2E',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    overflow: 'hidden',
    marginTop: '10px',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
    '& .items': {
      display: 'grid',
      gridTemplateColumns: '160px 160px 160px',

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: 'repeat(auto-fit, calc(100% / 3))',
      },

      '& .item': {
        borderRight: '1px solid rgba(238, 238, 238, 0.2)',
        padding: '10px 20px',
        '& .label': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '16px',
          color: '#AEAEAE',
          marginBottom: '12px',
          display: 'block',
        },
        '& .value': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '22px',
          color: '#fff',
        }
      },
      '& .item:last-child': {
        borderRight: 'unset',
      }
    },
    '& .box-countdown': {
      background: '#000',
      height: '100%',
      transform: 'skew(-20deg)',
      width: 'calc(100% + 20px)',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        transform: 'unset',
        gap: '0',
      },
      '& h4': {
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '16px',
        color: '#AEAEAE',
        transform: 'skew(20deg)',
        [theme.breakpoints.down('sm')]: {
          transform: 'unset',
          marginTop: '10px',
        },
        '&.finished': {
          color: '#F34B4B',
          textTransform: 'unset',
        }
      },
      '& .countdown': {
        fontFamily: 'Rajdhani',
        background: '#000',
        transform: 'skew(20deg)',

        [theme.breakpoints.down('sm')]: {
          transform: 'unset',
        },

        '& .times': {
          gap: '6px'
        },

        '& .time .number': {
          // transform: 'skew(-20deg)',
          // fontWeight: 'bold !important',
          fontSize: '36px',
          lineHeight: '40px',
          [theme.breakpoints.down('xs')]: {
            fontSize: '24px',
            lineHeight: '30px',
          },
        },
        '& .time .text': {
          fontSize: '10px',
        }
      },
    }
  },
  cardBodyHeader: {
    marginBottom: '14px',
    '& h3': {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '32px',
      color: '#fff',
      marginBottom: '5px',
    },
    '& h4': {
      display: 'grid',
      gridTemplateColumns: '20px auto',
      gap: '8px',
      alignItems: 'center',
      '& .icon': {
        width: '20px',
        height: '20px',
      },
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      color: '#fff',
    },
  },
  carBodyInfo: {
    width: '100%',
  },
  cardBodyDetail: {
    marginTop: '14px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    '& .detail-items': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, 115px)',
      justifyContent: 'space-between',

      '& .item': {
        '& .label': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          color: '#AEAEAE',
          marginBottom: '5px',
          display: 'block',
        },
        '& span': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '16px',
          color: '#fff',
          marginBottom: '5px',
          display: 'block',
        },
        '& span.icon': {
          display: 'grid',
          gap: '5px',
          gridTemplateColumns: '16px auto',
          '& .icon': {
            width: '16px',
            height: '16px',
          }
        }
      }
    },
    '& .box-type-wrapper': {
      '& > h4': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        color: '#fff',
        marginBottom: '5px',
      },
      '& .box-types': {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))',
        gridAutoRows: 'minmax(42px, auto)',
        gap: '8px',
        '& .box-type': {
          '&.type': {
            placeContent: 'start',
          },
          cursor: 'pointer',
          padding: '5px 4px',
          display: 'grid',
          gridTemplateColumns: '40px auto',
          gap: '5px',
          alignItems: 'center',
          placeContent: 'center',
          border: '2px solid #555',
          borderRadius: '4px',
          transition: '0.3s',
          position: 'relative',
          '&.active, &:hover': {
            border: '2px solid #72F34B',

            '& span': {
              color: '#fff',
            }
          },
          '& .wrapper-icon': {
            height: '35px',
            width: '35px',
            background: '#000',
            display: 'grid',
            alignItems: 'center',
            placeItems: 'center',
          },
          '& .icon': {
            width: '35px',
            height: '20px',
            objectFit: 'contain',
          },

          '& span': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '12px',
            color: '#AEAEAE',
          }
        }
      }
    }
  },
  currency: {
    display: 'grid',
    gridTemplateColumns: '24px auto',
    gap: '8px',
    alignItems: 'center',
    '& .icon': {
      width: '24px',
      height: '24px',
    },
    '& span': {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '20px',
      color: '#fff',
      display: 'block',
    }
  },
  cardImg: {
    width: '100%',
    '& .wrapperVideo': {
      position: 'relative',
      height: '379px',
      '& .uncontrol': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'block',
        background: 'transparent',
      },
      '& .onload': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        display: 'block',
        background: '#000',

        '& > span': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      },
      '& .video': {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: 'block',
        background: '#000',
      },

      '& video': {
        width: '100%',
        height: '100%',
        zIndex: 100,
      }
    },
  },
  wrapperAmount: {
    ...typeDisplayFlex,
    justifyContent: 'space-between',

    [theme.breakpoints.down('xs')]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
    },

    '& .bought': {
      marginTop: '20px',
      [theme.breakpoints.down('xs')]: {
        ...typeDisplayFlex,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      '& h4': {
        color: '#aeaeae',
        display: 'block',
        fontSize: '12px',
        fontStyle: 'normal',
        fontFamily: 'Firs Neue',
        fontWeight: 'normal',
        lineHeight: '16px',
        marginBottom: '6px',
      }
    }
  },
}));