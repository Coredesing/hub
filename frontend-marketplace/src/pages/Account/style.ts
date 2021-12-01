import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    messageUpdateSuccess: {
      position: 'relative',
      width: '100%',
      padding: '11px 9px 10px 9px',
      ...typeDisplayFlex,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#244A9C',
      marginBottom: 15,
      borderRadius: '8px',
      minHeight: 42,
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',


      [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
      },

      '& img': {
        marginRight: 6,
      },
    },
    kycAlert: {
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },

    alertVerifyEmail: {
      position: 'relative',
      width: '100%',
      padding: 9,
      ...typeDisplayFlex,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#591425',
      marginBottom: 15,
      borderRadius: '8px',
      minHeight: 42,

      [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
      },

      '& img': {
        marginTop: 3,
        [theme.breakpoints.down('sm')]: {
          marginTop: 6,
        },
      },

      '& .btn-close': {
        position: 'absolute',
        top: '50%',
        right: '15px',
        transform: 'translateY(-50%)'
      },

      '& span': {
        font: 'normal normal 400 14px/24px Helvetica',
        color: '#FFFFFF',
      },

      '& a': {
        color: '#72F34B'
      }
    },

    errorSwich: {
      marginBottom: 20,
    },

    errorBanner: {
      color: 'white',
      backgroundColor: '#FF4C00',
      textAlign: 'center',
      padding: 12,
      marginBottom: 0,
      flex: 1,
    },
    title: {
      font: 'normal normal bold 28px/32px DM Sans',
      color: '#FFF',
      position: 'relative',

      '&:after': {
        content: '""',
        display: 'block',
        width: '100%',
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        position: 'absolute',
        bottom: '-10px',
      }
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '5fr 4fr',
      gap: '100px',
      marginTop: '10px',
      marginBottom: '120px',
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
        padding: '40px',
        paddingTop: '150px',
      },
      [theme.breakpoints.only('xs')]: {
        gridTemplateColumns: '1fr',
        padding: '20px',
        paddingTop: '100px',
      },
    },
    leftPanel: {
    },
    rightPanel: {
      maxWidth: '100%',
      width: '100%',
    },
    accountContainer: {
      padding: '10px 0 80px 0',
      width: 1040,
      minHeight: 'calc(100vh - 400px)',
      maxWidth: 'calc(100vw - 80px)',
      margin: 'auto',

      [theme.breakpoints.down('xs')]: {
        width: 'calc(100% - 36px)',
        maxWidth: 'calc(100vw - 36px)',
        margin: 'auto',
      }
    },
    [theme.breakpoints.down('xs')]: {
      mainContent: {
        padding: '20px 0',
        marginBottom: '80px',
        gap: '60px'
      },
    },

    tier: {
      background: '#303035',
      borderRadius: '12px',
      padding: '20px 32px',

      [theme.breakpoints.down('sm')]: {
        padding: '20px 20px',
      },
    },


    // styles v3
    bodyContentMyAccount: {
      paddingRight: '30px',
      paddingLeft: '30px',
      marginTop: '35px',
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      color: '#FFFFFF',

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      },
    },

    leftAccount: {
      // padding: '0 30px',
      paddingRight: '30px',

      [theme.breakpoints.down('sm')]: {
        padding: 0,
      },
    },

    titlLeft: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: '24px',
      color: '#FFFFFF',
      marginBottom: 27,

      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },

    tabAccount: {
      ...typeDisplayFlex,
      flexDirection: 'column',

      [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        // display: 'grid',
        // gridTemplateColumns: '1fr 1fr 1fr 1fr',
      },
    },

    itemTabAccount: {
      ...typeDisplayFlex,
      flexWrap: 'wrap',
      alignItems: 'center',
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      color: '#fff',
      cursor: 'pointer',
      marginBottom: 12,
      padding: '8px 12px',
      borderRadius: '2px',
      transition: '.3s',
      [theme.breakpoints.down('sm')]: {
        marginRight: 15,
        marginBottom: 15,

        '&:last-child': {
          marginRight: 0,
        }
      },

      '&.active, &:hover': {
        color: '#000',
        background: '#72F34B',
        '& div': {
          background: '#000',
        }
      }
    },

    iconItemTabAccount: {
      marginRight: 8,
      width: 16,
      height: 16,
      maskPositionX: 'center',
      maskPositionY: 'center',
      maskSize: 'contain',
      maskRepeatX: 'no-repeat',
      maskRepeatY: 'no-repeat',
      maskOrigin: 'initial',
      maskClip: 'initial',
      background: '#fff',

      '&.active': {
        background: '#000',
      },

      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },

    rightAccount: {
      background: 'radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)',
      border: '1px solid #686868',
      backdropFilter: 'blur(80px)',
      borderRadius: '4px',
      position: 'relative',
      padding: '20px 30px',
      [theme.breakpoints.up('md')]: {
        minHeight: '500px',
      },
      '& .wrapper-not-found': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        '& h4': {
          color: '#fff',
          fontFamily: 'Helvetica',
          fontSize: '14px',
          textAlign: 'center',
        }
      }
    },

    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  };
});

export default useStyles;

export const useTabStyles = makeStyles((theme: any) => ({
  tabTitle: {
    fontFamily: 'Firs Neue',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '28px',
    color: '#FFFFFF',
    margin: 0,
    padding: 0,
    marginBottom: '20px',
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      height: '100%',
      left: '-32px',
      top: '-5px',
      border: '2px solid #72F34B',
    }
  },
  tabContent: {
    padding: '20px 32px',
    boxSizing: 'border-box',
    background: '#2E2E2E',
    borderRadius: '4px',
  },
  tabHeader: {
    ...typeDisplayFlex,
    justifyContent: 'space-between',
    marginBottom: '5px',
    '& .filter': {
      ...typeDisplayFlex,
      gap: '8px',
    },
    '& .search': {

    },
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      justifyContent: 'start',
      gap: '5px',
    }
  },
  tabBody: {

  },
  btnTab: {
    ...typeDisplayFlex,
    fontFamily: 'Firs Neue',
    fontSize: '14px',
    lineHeight: '24px',
    fontStyle: 'normal',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'unset',
    background: '#2E2E2E',
    padding: '6px 16px',
    borderRadius: '22px',
    '&.active': {
      background: '#72F34B',
      color: '#000',
    },
    '& svg': {
      marginRight: '6px',
    },
    '&:hover': {
      background: '#72F34B',
      color: '#000',
    }
  }
}))