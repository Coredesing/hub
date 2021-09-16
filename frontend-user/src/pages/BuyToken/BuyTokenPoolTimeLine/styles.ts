import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    sectionBuyTokenPoolTimeLine: {
      background: '#303035',
      borderRadius: 12,
      padding: '28px 28px',
      marginBottom: 12,
      color: '#FFFFFF',

      [theme?.breakpoints?.down('sm')]: {
        padding: '28px 20px',
      },
    },

    title: {
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '24px',
      textTransform: 'uppercase',
      marginRight: 40,
      color: '#FFFFFF',
      marginBottom: 20,

      [theme?.breakpoints?.down('sm')]: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: '24px',
      },
    },

    statusBarSteps: {
      ...typeDisplayFlex,
      position: 'relative',
      width: 'calc(100% - 30px)',
      marginBottom: 24,

      [theme?.breakpoints?.down('sm')]: {
        flexDirection: 'column',
        width: 'calc(100%)',
      },

      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        width: '100%',
        height: 5,
        background: '#44454B',
        borderRadius: 20,
        left: 0,
        top: 11,

        [theme?.breakpoints?.down('sm')]: {
          width: 5,
          height: '100%',
          top: 0,
          left: 10,
        },
      }
    },

    itemStatusBarSteps: {
      width: 'calc(100%/4)',
      ...typeDisplayFlex,
      flexDirection: 'column',
      position: 'relative',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',

      '&.active': {
        color: '#000',
      },

      '&:last-child': {
        width: 0,
      },

      '&:first-child .itemName': {
        left: 0,
        textAlign: 'left',
      },

      '&:last-child .itemName': {
        left: 0,
        textAlign: 'right',
      },

      [theme?.breakpoints?.down('sm')]: {
        width: 'calc(100%)',
        flexDirection: 'row',
        paddingBottom: 24,

        '&:last-child': {
          width: '100%',
          paddingBottom: 0,
        },
      },
    },

    itemValue: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: '#44454B',
      ...typeDisplayFlex,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: 16,

      '&.active': {
        color: '#000',
        background: '#72F34B',
      },

      [theme?.breakpoints?.down('sm')]: {
        width: 24,
        height: 24,
        fontSize: 16,
      },
    },

    itemName: {
      marginTop: 12,
      textAlign: 'center',
      position: 'relative',
      left: 'calc(-50% + 14px)',
      color: '#AEAEAE',
      [theme?.breakpoints?.down('sm')]: {
        marginTop: 0,
        fontSize: 14,
        lineHeight: '18px',
        left: '0',
        paddingLeft: 12,
        paddingTop: 3,
      },
    },

    title2: {
      fontFamily: 'DM Sans',
      fontSeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      marginBottom: 15,

      [theme?.breakpoints?.down('sm')]: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: '18px',
      },
    },

    erroCountdown: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: '24px',
      color: '#FFFFFF',
      marginTop: 100,
      ...typeDisplayFlex,
      flexWrap: 'wrap',

      [theme?.breakpoints?.down('md')]: {
        marginTop: 30,
        fontSize: 14,
        lineHeight: '18px',
        textAlign: 'center',
        justifyContent: 'center',
      },
    },

    customToolTip: {
      width: 280,
      background: '#44454B',
      boxShadow: `0px 12px 20px rgba(0, 0, 0, 0.07)`,
      borderRadius: 4,
      padding: 13,

      [theme?.breakpoints?.down('sm')]: {
        marginTop: 10,
      },
    },

    nameToolTip: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      marginBottom: 4,
    },

    desToolTip: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',

      '& span': {
        fontWeight: 'bold',
      }
    }
  };
});

export default useStyles;