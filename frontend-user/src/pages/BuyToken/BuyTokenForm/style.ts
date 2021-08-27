import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    currencyName: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#72F34B',
    },

    btnGroup: {
      marginTop: 20,
      paddingTop: 12,
      borderTop: '1px solid #44454B',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridColumnGap: 12,

      '&>div>button': {
        height: 42,
        width: '100%',
        fontFamily: 'DM Sans',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: '24px',
        color: '#000000',
        padding: 5,
        borderRadius: 2,
      },

      '&>div:last-child>button': {
        backgroundColor: '#D01F36 !important',
      },

      '&>div:last-child>button:disabled': {
        backgroundColor: '#D01F36 !important',
        opacity: 0.6,
        cursor: 'not-allowed',
      },

      '&>div:first-child>button': {
        backgroundColor: '#72F34B !important',
      },

      '&>div:first-child>button:disabled': {
        backgroundColor: '#72F34B !important',
        opacity: 0.6,
        cursor: 'not-allowed',
      },

      [theme?.breakpoints?.down('sm')]: {
        marginTop: 12,
        paddingTop: 32,
        gridTemplateColumns: '1fr',

        '&>div:first-child>button': {
          marginBottom: 12,
        },
      },
    },

    buyTokenForm: {
      fontFamily: 'DM Sans',
      background: '#303035',
      borderRadius: 12,
      padding: '28px 28px',
      marginBottom: 12,
      color: '#FFFFFF',
      display: 'grid',
      gridColumnGap: 40,
      gridTemplateColumns: '1fr 1fr',
      border: '1px solid #72F34B',

      [theme?.breakpoints?.down('sm')]: {
        gridTemplateColumns: '1fr',
        padding: '28px 20px',
        border: '1px solid #72F34B',
      },
    },
    
    leftBuyTokenForm: {

    },
    
    rightBuyTokenForm: {
      wordBreak: 'break-word',
    },

    listStep: {
      display: 'flex',
      justifyContent: 'space-between',
    },

    step: {
      width: 'calc(50% - 2.5px)',
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      borderBottom: '4px solid #C4C4C4',
      paddingBottom: 4,
      textAlign: 'center',
      marginBottom: 20,
      display: 'flex',
      justifyContent: 'center',

      '& img': {
        marginRight: 9,
      },

      [theme?.breakpoints?.down('sm')]: {
        marginTop: 25,
        marginBottom: 28,
        fontSize: 14,
        lineHeight: '18px',
        paddingBottom: 8,
      },
    },

    stepOneActive: {
      borderColor: '#72F34B',
      color: '#72F34B',
    },

    stepTwoActive: {
      borderColor: '#72F34B',
      color: '#72F34B',
    },

    activeDisableStep1: {
      borderColor: '#72F34B',
      color: '#72F34B',
      opacity: 0.5,
    },
    
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 20,
      textTransform: 'uppercase',

      [theme?.breakpoints?.down('sm')]: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: '24px',
      },
    },

    title2: {
      marginBottom: 4,
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',

      [theme?.breakpoints?.down('sm')]: {
        fontSize: 14,
        lineHeight: '18px',
      },
    },

    buyTokenFormTitle: {
      marginTop: 10,
      lineHeight: '24px',
      color: '#AEAEAE',
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,

      [theme?.breakpoints?.down('sm')]: {
        fontSize: 14,
        lineHeight: '20px',
        marginTop: 0,
      },
    },

    buyTokenInputForm: {
      background: '#222228',
      border: '1px solid #44454B',
      maxWidth: '100%',
      padding: '7px 13px',
      borderRadius: 4,
    },

    buyTokenInputWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 14,
      lineHeight: '18px',

      [theme?.breakpoints?.down('sm')]: {
        display: 'grid',
        gridTemplateColumns:' auto 125px',
      },

      '& span': {
        fontWeight: 'bold'
      },

    },

    buyTokenInput: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',

      '&:focus': {
        outline: 'none'
      },

      '&::placeholder': {
        fontFamily: 'Helvetica',
        fontSize: 14,
        lineHeight: '20px',
        color: '#AEAEAE',
      },

      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },

    buyTokenInputLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#999999',
      font: 'normal normal normal 12px/18px Helvetica'
    },

    buyTokenFee: {
      color: '#999999',
      marginTop: 10,
      font: 'normal normal normal 12px/18px Helvetica'
    },

    buyTokenEstimate: {
      marginTop: 20,

      [theme.breakpoints.down('sm')]: {
        marginTop: 24,
      },
    },

    buyTokenEstimateLabel: {
      font: 'normal normal bold 14px/18px DM Sans'
    },

    buyTokenEstimateAmount: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: '24px',
      color: '#72F34B',
      marginTop: 4,
    },

    [theme.breakpoints.down('xs')]: {
      btnGroup: {}
    },

    poolErrorBuyWarning: {
      fontFamily: 'DM Sans',
      marginTop: 25,
      fontWeight: 'bold',
      color: '#fff100',
      fontSize: 15
    },

    poolErrorBuy: {
      fontFamily: 'DM Sans',
      marginTop: 25,
      fontWeight: 'bold',
      fontSize: 15,
      color: '#D01F36'
    },

    purchasableCurrency: {
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
    },

    purchasableCurrencyIcon: {
      width: 30,
      height: 30,
      marginRight: 7
    },

    purchasableCurrencyMax: {
      background: '#72F34B',
      borderRadius: 4,
      minWidth: 67.82,
      height: 32,
      border: 'none',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#000000',
      marginLeft: 13,

      '&:hover': {
        opacity: '.9'
      },

      '&:focus': {
        outline: 'none'
      },

      '&:active': {
        transform: 'translateY(-3px)'
      }
    },

    approveWarning: {
      marginTop: 16,
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',

      [theme.breakpoints.down('sm')]: {
        marginTop: 32,
      },
    },

    allowcationWrap: {
      marginBottom: 14,
      fontFamily: 'Helvetica',
      color: '#FFFFFF',
      fontSize: 14,
      lineHeight: '20px',
      display: 'grid',
      gridColumnGap: 12,
      gridTemplateColumns: 'minmax(140px, 155px) 1fr',

      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: 'minmax(140px, 140px) 1fr',
      },
    },

    allowcationTitle: {
      color: '#AEAEAE',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
    },

    allowcationContent: {
    },
  };
});

export default useStyles;
