import { makeStyles } from "@material-ui/core";
import { typeDisplayFlex } from "../../../styles/CommonStyle";

const useStyles = makeStyles((theme: any) => ({
  instruction: {
    ...typeDisplayFlex,
    width: "100%",
    height: "80px",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    "& .text": {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "36px",
      marginRight: "20px",
    },
    "& .textCenter": {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "22px",
    },
    "& .smallText": {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "22px",
    },
    "& .textEnd": {
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "22px",
      width: "177px",
    },
    "& .instructionIcon": {
      marginTop: "2px",
      marginRight: "8px",
      width: "16px",
      height: "16px",
      objectFit: "contain",
    },
    "& .makesureIcon": {
      marginTop: "-20px",
      marginRight: "8px",
      width: "16px",
      height: "16px",
      objectFit: "contain",
    },

    [theme.breakpoints.down("md")]: {
      "& .text": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "22px",
        lineHeight: "34px",
        marginRight: "18px",
      },
      "& .textCenter": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "20px",
        textAlign: "center",
      },
      "& .textEnd": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "20px",
        width: "177px",
      },
      "& .instructionIcon": {
        width: "14px",
        height: "14px",
        marginRight: "0px",
        objectFit: "contain",
      },
      "& .makesureIcon": {
        marginTop: "-20px",
        marginRight: "8px",
        width: "14px",
        height: "14px",
        objectFit: "contain",
      },
    },
    [theme.breakpoints.down("xs")]: {
      "& .textCenter": {
        fontFamily: "Firs Neue",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "12px",
        lineHeight: "20px",
        textAlign: "center",
      },
    },
  },
  gridInstruction: {
    ...typeDisplayFlex,
    alignItems: 'center',
    width: "100%",
    height: "80px",
    justifyContent: "center",
  },
  instructionCenter: {
    backgroundImage: `url("/images/instruction_center_bg.png")`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    ...typeDisplayFlex,
    width: "40%",
    height: "82px",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingRight: "10px",
    // paddingLeft: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  instructionStep: {
    ...typeDisplayFlex,
    width: "100%",
    paddingRight: "10px",
    paddingLeft: "10px",
    // backgroundColor: "red",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      display: "grid",
      justifyItems: "center",
    },
  },
  description: {
    display: "grid",
  },
}));

export default useStyles;
