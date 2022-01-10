import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    alertVerifyEmail: {
      marginTop: -25,
      marginBottom: 15,
      position: 'relative',
      width: '100%',
      padding: 9,
      ...typeDisplayFlex,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#591425',
      borderRadius: '8px',
      minHeight: 42,

      '& .btn-close': {
        position: 'absolute',
        top: '50%',
        right: '15px',
        transform: 'translateY(-50%)'
      },

      '& span': {
        fontFamily: 'Helvetica',
        fontSize: 14,
        lineHeight: '20px',
        color: '#FFFFFF',
      },

      '& a': {
        color: '#72F34B'
      },

      [theme?.breakpoints?.down('sm')]: {
        alignItems: 'flex-start',
      },
    },

    errroTier: {
      width: '100%',
      ...typeDisplayFlex,
      padding: 12,
      position: 'relative',
      background: '#591425',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      color: '#FFFFFF',

      [theme?.breakpoints?.down('sm')]: {
        alignItems: 'flex-start',
      },
    },

    warningWhite: {
      width: '100%',
      ...typeDisplayFlex,
      alignItems: 'center',
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 25,
      background: '#244A9C',
      borderRadius: 8,
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
      minHeight: 42,

      [theme?.breakpoints?.down('sm')]: {
        alignItems: 'flex-start',
      },
    },

    whitelistPending: {
      width: '100%',
      ...typeDisplayFlex,
      padding: 12,
      flexDirection: 'row',
      paddingLeft: '2rem',
      marginBottom: 25,
      background: '#D0AA4D',
      borderRadius: 8,
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      color: '#070A1B',
      '& svg': {
        marginRight: '.5rem',
        minWidth: '20px'
      },

      [theme?.breakpoints?.down('sm')]: {
        alignItems: 'flex-start',
        paddingLeft: '1rem',
      },
    },

    whitelistSuccess: {
      width: '100%',
      ...typeDisplayFlex,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingLeft: '2rem',
      marginBottom: 25,
      background: '#244A9C',
      borderRadius: 8,
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      color: '#FFFFFF',
      '& svg': {
        marginRight: '.5rem',
        minWidth: '20px',
      },

      [theme?.breakpoints?.down('sm')]: {
        alignItems: 'flex-start',
        paddingLeft: '1rem',
      },
    },

    headerComponent: {
      color: '#FFFFFF',
      marginBottom: 16,
      ...typeDisplayFlex,
      flexDirection: 'column',
      alignItems: 'center',
    },

    top: {
      marginBottom: 15,
      ...typeDisplayFlex,
      justifyContent: 'center',
      alignItems: 'center',

      [theme?.breakpoints?.down('sm')]: {
        flexDirection: 'column',
      },

      '&.is_address': {
        flexDirection: 'column',
        marginBottom: 8,
      }
    },
    wrapperIconToken: {
      width: '42px',
      height: '42px',
      borderRadius: '10px',
      background: '#fff',
      display: 'grid',
      placeItems: 'center',
      marginRight: 12,
    },
    iconToken: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      objectFit: 'contain'
    },

    title: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 28,
      lineHeight: '32px',

      [theme?.breakpoints?.down('sm')]: {
        fontSize: 28,
        lineHeight: '32px',
        marginTop: 8,
        textAlign: 'center',
      },
    },

    address: {
      ...typeDisplayFlex,
      alignItems: 'center',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '18px',
      marginBottom: 20,

      '& a': {
        color: '#72F34B',
        textDecoration: 'underline',
      },
      '& img': {
        marginLeft: 6,
      }
    },

    navHeaderComponent: {
      ...typeDisplayFlex,
      flexWrap: 'wrap',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      wordBreak: 'break-word',

      [theme?.breakpoints?.down('sm')]: {
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        width: '100%',
        gridRowGap: 14,
      },
    },

    item: {
      ...typeDisplayFlex,
      alignItems: 'center',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      padding: '0 16px',
      borderRight: '1px solid #44454B',

      '&:last-child': {
        borderRight: 0,
      },

      [theme?.breakpoints?.down('sm')]: {
        borderRight: 0,
        fontSize: 14,
        lineHeight: '18px',
        fontWeight: 'bold',
        padding: '0 8px',
      },
    },

    iconItem: {
      height: 20,
      marginRight: 4,

      [theme?.breakpoints?.down('sm')]: {
        height: 16,
      },
    },

    applyWhiteListButton: {
      width: 200,
      height: 42,
      background: '#D01F36',
      borderRadius: 60,
      color: 'white',
      border: 'none',
      marginTop: 32,
    },
  };
});

export default useStyles;
