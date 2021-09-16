import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    tierTitle: {
      fontFamily: 'Firs Neue',
      fontWeight: 600,
      fontSize: 20,
      lineHeight: '28px',
      // textTransform: 'uppercase',
      color: '#FFFFFF',
      marginBottom: 20,

      [theme.breakpoints.down('sm')]: {
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: 12,
      },
    },

    listInfo: {
      display: 'grid',
      gridTemplateColumns:  '1fr 1fr 1fr',
      textAlign: 'center',
      background: '#222228',
      borderRadius: 8,
      marginBottom: 12,

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns:  '1fr',
      },
    },

    itemInfo: {
      padding: 16,
      borderRight: '1px solid rgb(255 255 255 / 10%)',
      fontFamily: 'Firs Neue',
      fontWeight: 'bold',
      minHeight: 90,

      [theme.breakpoints.down('sm')]: {
        minHeight: 90,
        borderBottom: '1px solid rgb(255 255 255 / 10%)',
        borderRight: 'none',

        '&:last-child': {
          borderBottom: 'none',
        }
      },
      
      '&:last-child': {
        borderRight: 'none',
      }
    },

    nameItemInfo: {
      fontWeight: 500,
      fontSize: 12,
      lineHeight: '20px',
      color: '#FFFFFF',
      marginBottom: 10,
      textTransform: 'uppercase'
    },

    valueItemInfo: {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '22px',
      minHeight: 24,
      color: '#72F34B',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      wordBreak: 'break-word',
      ...typeDisplayFlex,
    },

    iconUserTier: {
      height: 20,
      marginRight: 5,
    },

    message: {
      background: 'rgb(255 255 255 / 10%)',
      borderRadius: 8,
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
      padding: '11px 12px',
      ...typeDisplayFlex,
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: 35,

      [theme.breakpoints.down('sm')]: {
        padding: '12px 20px',
        marginBottom: 30,
      },

      '& img': {
        marginRight: 6,

        [theme.breakpoints.down('sm')]: {
          display: 'none',
        },
      }
    },

    menuTier: {
      ...typeDisplayFlex,
      alignItems: 'center',
      justifyContent: 'center',
      listStyle: 'none',
      borderBottom: '1px solid rgb(255 255 255 / 10%)',

      [theme.breakpoints.down('sm')]: {
        justifyContent: 'space-between',
      },
    },

    itemTabMyTier: {
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      color: '#AEAEAE',
      padding: '8px 20px',
      marginBottom: -3,
      cursor: 'pointer',
      position: 'relative',

      [theme.breakpoints.down('sm')]: {
        padding: '8px 0px',
      },

      '&:after': {
        content: '""',
        background: 'transparent',
        borderRadius: 20,
        display: 'block',
        width: '100%',
        height: 4,
        position: 'absolute',
        bottom: 0,
        left: 0,
      },

      '&.active': {
        color: '#72F34B',
        cursor: 'inherit',

        '&:after': {
          background: '#72F34B',
        },
      }
    },

    tierComponent: {
      transition: '1s',
      color: '#fff',
      borderRadius: '8px',
      '&.inactive': {
        opacity: 0,
      },
      '&.active': {
        opacity: 1,
      },
      '&.bg-none': {
        background: 'none',
        padding: '0',
      }
    },

    bodyPage: {
      padding: '30px 20px',

      [theme.breakpoints.down('sm')]: {
        padding: '25px 0px',
        paddingBottom: 0,
      },
    },

    btnHow: {
      marginTop: 20,
      ...typeDisplayFlex,
      flexWrap: 'wrap',
      alignItems: 'center',
      width: '100%',
      background: '#4F4F4F',
      border: '1px solid #4F4F4F',
      borderRadius: 4,
      minHeight: 46,
      padding: '10px 16px',
      fontFamily: 'Firs Neue',
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '24px',
      color: '#FFFFFF',
      cursor: 'pointer',

      '&:hover': {
        color: '#FFFFFF',
        opacity: 0.85,
        textDecoration: 'inherit',
      }
    },
    
    iconBtnHow: {
      marginRight: 8,
    },

    iconArrowRight: {
      marginLeft: 'auto',
    },
    infoRate: {
      marginTop: '20px',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '22px',
      color: '#fff'
    }
  };
});

export default useStyles;
