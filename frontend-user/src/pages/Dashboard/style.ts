import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    btnViewAllPools: {
      minWidth: 200,
      maxWidth: '100%',
      height: 42,
      background: '#72F34B',
      borderRadius: 2,
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      color: '#000000',
      border: 'none',
      outline: 'none',
      padding: '0 27px',
      ...typeDisplayFlex,
      alignItems: 'center',
      justifyContent: 'center',
      margin: '40px auto 0 auto',
      cursor: 'pointer',
      textTransform: 'uppercase'
    },

    listPools: {
      width: 1040,
      margin: 'auto',
      maxWidth: 'calc(100vw - 80px)',
      marginBottom: 120,

      '&.listPools2': {
        width: 820,
        maxWidht: '100%',
      },


      [theme.breakpoints.down('xs')]: {
        width: 'calc(100% - 36px)',
        maxWidth: 'calc(100vw - 36px)',
        margin: 'auto',
        marginBottom: 75,
      },

      '& h2': {
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 28,
        lineHeight: '32px',
        color: '#FFFFFF',
      },

      '& .pools': {
        display: 'Grid',
        gridTemplateColumns: 'repeat(3, calc(33% - 9.5px))',
        gap: 20,
        margin: 'auto',
        placeContent: 'center',

        [theme.breakpoints.down('sm')]: {
          display: 'block'
        },
      },

      '& .active_pools': {
        display: 'Grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: 20,
        margin: 'auto',
        placeContent: 'center',

        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
      },

      '& .pools_completed_sales': {

      },

      '& .btn': {
        height: '42px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        padding: '0 27px',
        ...typeDisplayFlex,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '60px',
        backgroundColor: '#D01F36',
        margin: '40px auto 0',
        cursor: 'pointer'
      },
    },

    getAlert: {
      position: 'relative',
      backgroundImage: 'url(/images/bg_get_alert.svg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    },

    contentGetAlert: {
      width: 1120,
      margin: 'auto',
      maxWidth: 'calc(100vw - 80px)',
      minHeight: 480,
      ...typeDisplayFlex,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#FFFFFF',
    },

    titleGetAlert: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 40,
      lineHeight: '44px',
      textAlign: 'center',
      marginBottom: 30,
      [theme.breakpoints.down('sm')]: {
        marginBottom: 40,
      }
    },

    desGetAlert: {
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 40,
    },

    btnGetAlert: {
      minWidth: 180,
      maxWidth: '100%',
      minHeight: 42,
      background: '#72F34B',
      borderRadius: 60,
      border: 'none',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      cursor: 'pointer',
      padding: '10px 15px',
      [theme.breakpoints.down('sm')]: {
        width: 280,
      },
      
      '& img': {
        marginLeft: 8,
      }
    },

    section: {
      position: 'relative',
      paddingTop: '80px',
      paddingBottom: '160px',
      '& .rectangle': {
        position: 'absolute',
        width: '100%',
        top: 0,
        '& img': {
          width: '100%',
        }
      }
    },
    contact: {
      background: '#72F34B',
      padding: '0px calc((100% - 800px) / 2)',
      paddingTop: '80px',
      paddingBottom: '52px',
      '& h3': {
        fontFamily: 'Space Ranger',
        color: '#0A0A0A',
        fontSize: '72px',
        lineHeight: '60px',
        fontWeight: 'bold',
        letterSpacing: '0.02em',
        textAlign: 'center',
        marginBottom: '28px'
      },

      '& .rectangle': {
        top: '50px',
        left: 0
      }
    },
    contactForm: {
      textAlign: 'center',
      marginBottom: '16px',
    },
    inputForm: {
      background: '#fff',
      color: '#0A0A0A',
      fontStyle: 'normal',
      fontFamily: 'Firs Neue',
      fontSize: '18px',
      fontWeight: 'normal',
      lineHeight: '28px',
      mixBlendMode: 'normal',
      height: '56px',
      width: '380px',
      borderRight: 'unset',
      borderTopRightRadius: 'unset',
      borderBottomRightRadius: 'unset',
      '& > div': {
        borderRadius: 'unset',
      }
    },
    btnForm: {
      background: '#0A0A0A',
      color: '#72F34B',
      height: '56px',
      width: '180px',
      borderTopLeftRadius: 'unset',
      borderBottomLeftRadius: 'unset',
      borderLeft: 'unset',
      borderRadius: 'unset',
      '&:hover': {
        background: '#0A0A0A',
        color: '#72F34B',
      }
    },
    alertMsg: {
      width: '100%',
      marginTop: '14px',
      '& img, & svg': {
        width: '14px',
        height: '14px',
        marginRight: '8px'
      },
      '& span': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '18px',
        lineHeight: '28px',
        textAlign: 'left',
      },
      '&.error span': {
        color: '#F24B4B',
      },
      '&.success span': {
        color: '#0A0A0A',
      }
    }
  };
});

export default useStyles;
