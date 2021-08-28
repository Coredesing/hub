import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    wrapper: {
      background: '#303035',
      borderRadius: '12px',
      padding: '20px 32px',

      [theme.breakpoints.down('sm')]: {
        padding: '20px 20px',
      },
    },

    headPage: {
      ...typeDisplayFlex,
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 22,

      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
        marginBottom: 20,
      },
    },

    title: {
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '28px',
      textTransform: 'uppercase',
      color: '#FFFFFF',

      [theme.breakpoints.down('sm')]: {
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
      },
    },

    btnEditProfile: {
      minWidth: 120,
      borderRadius: 4,
      border: '1.4px solid #72F34B',
      height: 28,
      background: 'transparent',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      textAlign: 'center',
      color: '#72F34B',
      textTransform: 'initial',

      [theme.breakpoints.down('sm')]: {
        minWidth: '100%',
        height: 43,
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
      },

      '& img': {
        marginRight: 6,
      },
      
      '&:disabled': {
        border: '1.4px solid #72F34B',
        background: 'transparent',
        color: '#72F34B',
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      
      '&:hover': {
        background: 'transparent',
        opacity: 0.85
      },
    },

    mainInfomation: {
    },

    inputGroup: {
      ...typeDisplayFlex,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 16,
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',

      [theme.breakpoints.down('sm')]: {
        marginTop: 32,
      },
      

      '& .flex': {
        ...typeDisplayFlex,
        alignItems: 'center',
        color: 'white'
      },

      '& > span:first-child': {
        minWidth:  160,
        whiteSpace: 'nowrap',
        marginRight:  12,
        fontFamily: 'DM Sans',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: '20px',
        color: '#AEAEAE',
      },

      '& span.verify-email': {
        textDecoration: 'underline',
        cursor: 'pointer',
        width: 'auto'
      },

      '& span.unverified': {
        marginRight: 12,
        color: '#D01F36',
      },

      '& span.verified': {
        color: '#71FFAA',
      },

      '& button': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#72F34B',
        mixBlendMode: 'normal',
        minWidth: '90px',
        height: '28px',
        border: '1px solid #72F34B',
        boxSizing: 'border-box',
        borderRadius: '2px',
        background: 'none',
        cursor: 'pointer'
      }
    },

    iconStatus: {
      marginLeft: 4,
    },

    groupInput: {
      width: '100%',
      ...typeDisplayFlex,
      flexDirection: 'column',
    },

    errorInput: {
      color: 'red',
    },

    inputNewValue: {
      width: '100%',
      maxWidth: 300,

      '&>div:before, &>div:after': {
        display: 'none'
      },
  
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        maxWidth: '100%',
      },

      '& input': {
        width: '100%',
        height: 18,
        background: '#222228',
        border: '1px solid #44454B',
        borderRadius: 4,
        padding: '8px 10px',
        fontFamily: 'Helvetica',
        fontSize: 14,
        lineHeight: '20px',
        color: '#AEAEAE',
  
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          maxWidth: '100%',
          marginTop: 12,
        },
  
        '&::placeholder': {
          fontFamily: 'Helvetica',
          fontSize: 14,
          lineHeight: '20px',
          color: '#AEAEAE',
        }
      }
    },

    nameSocial: {
  
      [theme.breakpoints.down('sm')]: {
        marginTop: 8,
      },
    },

    redKiteInfo: {
      marginTop: '25px',

      '& .kyc-info': {
        ...typeDisplayFlex,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },

      '& .kyc-info span': {
        font: 'normal normal normal 14px/24px Helvetica',
        color: '#fff',
      },

      [theme.breakpoints.down('xs')]: {
        '& .kyc-info': {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      },
    },

    walletInfo: {
      ...typeDisplayFlex,
      flexDirection: 'column',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: '8px',
      width: '100%',
      marginTop: '15px',
      padding: '26px 22px',

      '& p': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#999999',
      },
      '& span': {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: '28px',
        lineHeight: '32px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
      }
    },

    [theme.breakpoints.down('sm')]: {
      wrapper: {
        padding: '24px 20px'
      },
      inputGroup: {
        flexDirection: 'column',
        alignItems: 'flex-start',

        '& span': {
          fontWeight: 'normal !important'
        }
      }
    },

    footerPage: {
      ...typeDisplayFlex,
      justifyContent: 'flex-end',
      paddingTop: 12,
      borderTop: '1px solid rgb(114 114 114 / 50%)',
    },

    btnUpdateProfile: {
      minWidth: 140,
      borderRadius: 4,
      height: 28,
      background: '#72F34B',
      border: 0,
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      textAlign: 'center',
      color: '#000000',
      textTransform: 'initial',

      [theme.breakpoints.down('sm')]: {
        minWidth: '100%',
        height: 43,
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
      },
      '&:hover': {
        background: '#72F34B',
        opacity: 0.85,
      }
    },
  };
});

export default useStyles;
