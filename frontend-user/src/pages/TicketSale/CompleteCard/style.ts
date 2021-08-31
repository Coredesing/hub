import { makeStyles } from "@material-ui/core";
import { typeDisplayFlex } from "../../../styles/CommonStyle";

const useStyles = makeStyles((theme: any) => ({
  cardComp: {
    maxWidth: "1120px",
    [theme.breakpoints.down("lg")]: {
      width: "unset",
      maxWidth: "940px",
    },
    [theme.breakpoints.down("xs")]: {
      paddingTop: "13px",
    },
  },
  cardCompBody: {
    display: "grid",
    gridTemplateColumns: "130px 260px 140px auto",
    flexWrap: "wrap",
    gap: "20px",
    [theme.breakpoints.down("lg")]: {
      gridTemplateColumns: "120px 220px 120px auto",
    },
    // [theme.breakpoints.down("md")]: {
    //   gridTemplateColumns: "360px",
    // },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "360px",
    },
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "285px",
    },
  },
  cardCompImg: {
    "& img": {
      objectFit: "cover",
      width: "130px",
      height: "80px",
      borderRadius: "4px",
      [theme.breakpoints.down("lg")]: {
        width: "120px",
      },
      // [theme.breakpoints.down("md")]: {
      //   width: "100%",
      //   height: "220px",
      // },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "220px",
      },
      [theme.breakpoints.down("xs")]: {
        width: "107px",
        height: "59px",
      },
    },
  },
  cardCompItem: {
    display: "grid",
    flexDirection: "column",
    justifyContent: "center",
    gap: "12px",
    // width: "100%",
    [theme.breakpoints.down("md")]: {
      flexDirection: "unset",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      ...typeDisplayFlex,
    },
  },
  compText: {
    fontFamily: "Firs Neue",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "16px",
    mixBlendMode: "normal",
  },
  cardCompTitle: {
    "& span": {
      textTransform: "uppercase",
      "& .seed": {
        color: "#72F34B",
      },
      "& .claim": {
        color: "#F3D84B",
      },
    },
    "& h4": {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "24px",
      // lineHeight: '36px',
      color: "#fff",
      mixBlendMode: "normal",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "15px",
    },
  },
  cardCompProgress: {
    width: "354px",
    [theme.breakpoints.down("md")]: {
      display: "grid",
      gridTemplateColumns: "1fr",
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& .title": {
      ...typeDisplayFlex,
      justifyContent: "space-between",
      alignItems: "flex-start",
      "& .percent": {
        lineHeight: "24px",
        fontSize: "14px",
      },
    },
    "& .progress": {
      height: "36px",
      paddingTop: "8px",
      [theme.breakpoints.down("lg")]: {
        width: "354px",
      },
      [theme.breakpoints.down("md")]: {
        width: "354px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
  },
  bannerTitleRow: { display: "flex" },
}));

export default useStyles;
