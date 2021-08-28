import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    btn: {
      minWidth: 160,
      height: 42,
      borderRadius: 2,
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      textAlign: 'center',
      color: '#000',
      textTransform: 'initial',
      boxShadow: 'none',
      border: 'none',
      cursor: 'pointer',

      [theme.breakpoints.down('sm')]: {
        minWidth: '100%',
      },

      '&.btnStake': {
        background: '#72F34B',
        marginRight: 8,

        [theme.breakpoints.down('sm')]: {
          marginRight: 0,
          marginBottom: 12,
        },

        '&:hover': {
          opacity: 0.85,
        },

        '&:disabled': {
          backgroundColor: '#72F34B !important',
          color: '#FFFFFF',
          cursor: 'not-allowed',
          opacity: 0.6,
        },
      },

      '&.btnUnstake': {
        background: 'transparent',
        border: '2px solid #72F34B',
        color: '#72F34B',

        '&:hover': {
          opacity: 0.85,
        },

        '&:disabled': {
          color: '#72F34B',
          cursor: 'not-allowed',
          opacity: 0.6,
        },
      },
    },

    content: {
      width: '100%',
      paddingTop:  24
    },

    buttonArea: {
      ...typeDisplayFlex,
      alignItems: 'center',
      justifyContent: 'center',

      [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
      }
    },

    walletBalance: {
      marginTop: 33,
      width: '100%',
      background: '#222228',
      border: '1px solid #44454B',
      borderRadius: '8px',
      [theme.breakpoints.down('sm')]: {
        width: 'auto'
      }
    },
    
    tableHead: {
      color: '#fff',
      font: 'normal normal bold 14px/18px DM Sans',
      padding: '16px 37px',
      background: '#191920',
      borderRadius: '8px 8px 0 0',

      [theme.breakpoints.down('sm')]: {
        padding: '16px 22px',
      },

      '& .group': {
        ...typeDisplayFlex,

        '& span': {
          width: '33%',
          textAlign: 'center',

          '&:first-child': {
            textAlign: 'left'
          }
        }
      }
    },
    
    tableBody:  {
      color: '#fff',
      
      '& .group': {
        ...typeDisplayFlex,
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: '44px',
        alignItems: 'center',
        padding: '12px 37px',
      
        [theme.breakpoints.down('sm')]: {
          padding: '12px 22px',
        },
      },

      '& .group span': {
        width: '33%',
        wordBreak: 'break-all',
        font: 'normal normal normal 14px/20px Helvetica',
        color: '#fff',
        textAlign: 'center',

        '&:first-child': {
          textAlign: 'left'
        }
      }
    },
    balance: {
      fontFamily: 'DM Sans',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '28px',
      lineHeight: '32px',
      color: '#FFFFFF',
      marginTop: '8px',
      marginBottom: '13px',
    },
  };
});

export default useStyles;
