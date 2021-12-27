import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
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
    width: 'fit-content !important',
    minWidth: 'unset !important',
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    marginRight: '32px',
    // flexGrow: 'unset',
    '&.active': {
      color: "#72F34B !important"
    },
    [theme.breakpoints.down("xs")]: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
      justifyContent: "center",
      width: '100% !important',
      minWidth: '100px !important',
      '& .MuiTouchRipple-root': {
        display: 'none',
      }
    },
    '& span.MuiTab-wrapper': {
      width: 'fit-content',
    },
    // '& .MuiTouchRipple-root': {
    //   display: 'none',
    // }
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
  tabPanel: {
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
}));

export default useStyles;