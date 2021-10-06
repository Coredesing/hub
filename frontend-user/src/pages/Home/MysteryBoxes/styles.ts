import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: any) => ({
  contentBox: {
    paddingLeft: "20px",
    height: "100%",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      marginTop: "30px",
    },
    "& .banner": {
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
      [theme.breakpoints.up("sm")]: {
        "&::before": {
          zIndex: 1,
          background:
            " linear-gradient(to left, transparent 30%, rgba(8, 8, 8, 0.6) 100%)",
        },
      },
      [theme.breakpoints.down("sm")]: {
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
      position: "absolute",
      zIndex: 100,
      bottom: 0,
      left: 20,
      width: "100%",
      height: "81px",
      [theme.breakpoints.down("sm")]: {
        position: "relative",
        left: 0,
        alignItems: "center",
      },

      "& .wrapper-countdown": {
        width: "30%",
        display: "block",
        alignItems: "center",
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
          width: "400px",
          zIndex: 10,
          fontFamily: "Space Ranger",

          "& .time .number": {
            transform: "skew(-20deg)",
          },
        },
      },
    },
  },
  content: {
    position: "relative",
    zIndex: 100,
    "& .detail-box": {
      marginBottom: "20px",
      [theme.breakpoints.down("sm")]: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
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
        maxWidth: "480px",
        textTransform: "uppercase",

        [theme.breakpoints.up("xl")]: {
          fontSize: "43px",
          lineHeight: "50px",
          maxWidth: "600px",
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
      "& .desc": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "16px",
        lineHeight: "24px",
        color: "#FFFFFF",
        maxWidth: "480px",
        marginBottom: "16px",
        [theme.breakpoints.up("xl")]: {
          fontSize: "20px",
          maxWidth: "600px",
          marginBottom: "20px",
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: "14px",
        },
      },
      "& .detail-items": {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 200px))",
        marginBottom: "32px",
        "& .item": {
          "& label": {
            fontFamily: "Firs Neue",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "24px",
            color: "#AEAEAE",
            display: "block",
            marginBottom: "4px",
          },
          "& span": {
            fontFamily: "Firs Neue",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24px",
            color: "#FFFFFF",
            display: "block",
            textTransform: "uppercase",

            "&.icon": {
              display: "flex",
              alignItems: "center",
              gap: "4px",

              "& img": {
                width: "16px",
                height: "16px",
              },
            },
          },
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
          maxWidth: "400px",
          width: "100%",
          // [theme.breakpoints.down('xs')] : {
          //   maxWidth: '280px',
          // },

          fontFamily: "Space Ranger",
          background: "rgba(0, 0, 0, 0.5)",

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
}));

export default useStyles;
