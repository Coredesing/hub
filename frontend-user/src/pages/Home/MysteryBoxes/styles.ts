import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: any) => ({
  container: {
    height: "100%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      marginTop: "30px",
      marginBottom: " 150px",
    },
    "& .banner": {
      display: 'flex',
      zIndex: 1,
      borderRadius: 4,
      position: "absolute",
      top: -50,
      left: 0,
      bottom: 0,
      right: 0,
      width: "100%",
      height: "322px",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      // [theme.breakpoints.down('xs')]: {
      //   // backgroundPosition: 'inherit',
      // },
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      '& .wrapper-img': {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        '& div, & img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
        '& img': {
          '&.h-r-t-l': {
            animation: `hiddenRightToLeft 200ms forwards`,
          },
          '&.h-l-t-r': {
            animation: `hiddenLeftToRight 200ms forwards`,
          },
          '&.r-t-l': {
            animation: `leftToRight 300ms forwards`,
          },
          '&.l-t-r': {
            animation: `rightToLeft 300ms forwards`,
          },
        }
      },
      [theme.breakpoints.up("md")]: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingLeft: "20px",
        paddingRight: '10px',
        paddingBottom: '30px',
      },
      [theme.breakpoints.up("sm")]: {
        "&::before": {
          zIndex: 1,
          background:
            " linear-gradient(to left, transparent 30%, rgba(8, 8, 8, 0.6) 100%)",
        },
      },
      [theme.breakpoints.down("sm")]: {
        alignItems: 'center',
        justifyContent: 'center',
        "&::before": {
          zIndex: 1,
          background:
            " linear-gradient(to left, transparent 30%, rgba(8, 8, 8, 0.3) 100%)",
        },
        "&::after": {
          zIndex: 1,
          background:
            "linear-gradient(to right, transparent 30%, rgba(8, 8, 8, 0.3) 100%)",
        },
      },
    },
    "& .detail-countdown-box": {
      position: "relative",
      zIndex: 100,
      bottom: 0,
      //   left: 20,
      width: "100%",
      height: "81px",
      [theme.breakpoints.down("sm")]: {
        position: "relative",
        // left: 0,
        alignItems: "center",
        justifyContent: "center",
      },

      "& .wrapper-countdown": {
        [theme.breakpoints.down("sm")]: {
          justifyContent: "center",
          textAlign: "center",
        },
        "& > span": {
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: "12px",
          lineHeight: "16px",
          color: "#FFFFFF",
          display: "block",
          textTransform: "uppercase",
          marginBottom: "6px",
        },

        "& .countdown": {
          background: "rgba(0,0,0,0.5)",
          width: "100%",
          zIndex: 10,
          fontFamily: "Space Ranger",

          "& .time .number": {
            transform: "skew(-20deg)",
          },

          [theme.breakpoints.down("sm")]: {
            width: "100%",
          },
        },
      },
    },
  },
  boxContent: {
    position: "relative",
    zIndex: 100,
    width: 'fit-content',
    "& .detail-box": {
      marginBottom: "20px",
      [theme.breakpoints.down("sm")]: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: -40,
      },
      "& h1": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "32px",
        lineHeight: "40px",
        color: "#FFFFFF",
        marginBottom: "12px",
        display: "block",
        textTransform: "uppercase",

        [theme.breakpoints.up("xl")]: {
          fontSize: "43px",
          lineHeight: "50px",
          marginBottom: "20px",
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: "24px",
          lineHeight: "32px",
        },
      },
      "& .status": {
        marginBottom: "12px",
        [theme.breakpoints.up("xl")]: {
          marginBottom: "20px",
        },
        "& span": {
          padding: "4px 10px",
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: "24px",
          textTransform: "uppercase",
          marginBottom: "12px",
          //   background: "#000",
          color: "#FFFFFF",
          borderRadius: "4px",
          [theme.breakpoints.up("xl")]: {
            fontSize: "18px",
          },
          [theme.breakpoints.down("xs")]: {
            fontSize: "14px",
          },
        },

        "&.upcoming span": {
          color: "#72F34B",
          background: "rgba(114, 243, 75, 0.3)",
        },
        "&.sale span": {
          color: "#4BCBF3",
          background: "rgba(75, 233, 243, 0.3)",
        },
        "&.over span": {
          color: "#F24B4B",
          background: "rgba(242, 75, 75, 0.3)",
        },
      },
      "& .countdown-box": {
        "&>span": {
          fontFamily: "Firs Neue",
          fontStyle: "normal",
          fontWeight: "normal",
          fontSize: "12px",
          lineHeight: "16px",
          color: "#FFFFFF",
          display: "block",
          marginBottom: "8px",
        },
        // display: 'grid',
        // gridTemplateColumns: '400px minmax(120px, 200px)',
        // [theme.breakpoints.down('xs')]: {
        //   gridTemplateColumns: '1fr',
        //   placeItems: 'center',

        // },
        "& .countdown": {
          width: "100%",
          fontFamily: "Space Ranger",

          "& .time .number": {
            transform: "skew(-20deg)",
            fontSize: "28px",
            [theme.breakpoints.up("xl")]: {
              fontSize: "35px",
            },
          },
          "& .time .text": {
            [theme.breakpoints.up("xl")]: {
              fontSize: "10px",
            },
          },
        },
      },
    },
  },
  countDownContainer: {
    [theme.breakpoints.up("sm")]: {
      borderRadius: '2px',
      overflow: 'hidden',
    },
  },
  changeBanner: {
    display: 'flex',
    zIndex: 100,
    // alignItems: 'flex-end',
    // backgroundColor: 'red',
    paddingBottom: '5px',
    width: 'fit-content',
    '& .prev, & .next': {
      cursor: 'pointer',
      width: '32px',
      display: 'flex',
      justifyContent: 'center',
    },
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: '20px',
      bottom: '20px'
    },
    [theme.breakpoints.down("xs")]: {
      right: '10px',
    }
  }
}));

export default useStyles;
