import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    btn: {
      minWidth: 160,
      height: 42,
      borderRadius: 60,
      marginRight: 8,
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      textAlign: 'center',
      color: '#FFFFFF',
      textTransform: 'initial',
      boxShadow: 'none',
      border: 'none',
      cursor: 'pointer',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
        margin: 4
      },

      '&.btnStake': {
        background: '#3232DC',

        '&:hover': {
          background: '#3232DC',
        },

        '&:disabled': {
          backgroundColor: '#3232DC !important',
          color: '#FFFFFF',
          cursor: 'not-allowed',
          opacity: 0.6,
        },
      },

      '&.btnUnstake': {
        background: '#D01F36',

        '&:hover': {
          background: '#D01F36',
        },

        '&:disabled': {
          backgroundColor: '#D01F36 !important',
          color: '#FFFFFF',
          cursor: 'not-allowed',
          opacity: 0.6,
        },
      },
    },

    content: {
      width: '100%',
      borderRadius: '8px',
      paddingTop: '28px',

      '& .button-area': {
        display: 'flex',
        alignItems: 'center'
      },

      '& .button-area .btn': {
        height: '42px',
        borderRadius: '40px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '160px',
        marginRight: '8px',

        '&:hover': {
          cursor: 'pointer'
        },

        '&.disabled': {
          backgroundColor: 'silver'
        },
      },

      '& .button-area .btn-lock': {
        background: '#3232DC',
      },

      '& .button-area .btn-unlock': {
        background: '#D01F36',
      },
      [theme.breakpoints.down('md')]: {
        marginTop: '0',
      },

      [theme.breakpoints.down('xs')]: {
        marginTop: '0',

        '& .button-area': {
          flexDirection: 'column',

          '& .btn': {
            width: '100%',
            margin: 0
          },

          '& .btn-lock': {
            marginBottom: '12px'
          },
        }
      },
    },
    noteNetwork: {
      font: 'normal normal bold 14px/18px DM Sans',
      color: '#D01F36',
      marginTop: '15px',
    },
    manageTier: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    walletBalance: {
      marginTop: 33,
      width: '600px',
      maxWidth: '100%',
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
      padding: '16px',
      background: '#191920',
      borderRadius: '8px 8px 0 0',

      '& .group': {
        display: 'flex',

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
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: '48px',
        alignItems: 'center',
        padding: '16px',
      },

      '& .group span': {
        width: '33%',
        wordBreak: 'break-all',

        '&:first-child': {
          font: 'normal normal bold 14px/18px DM Sans',
          color: '#fff'
        },
        '&:last-child': {
          textAlign: 'center',
          font: 'normal normal normal 14px/24px Helvetica',
          color: '#999999'
        },
        '&:nth-child(2)': {
          textAlign: 'center',
          font: 'normal normal normal 14px/24px Helvetica',
          color: '#999999'
        }
      }
    },
    noteStake: {
      font: 'normal normal bold 14px/18px DM Sans',
      color: '#FFF',
      marginBottom: '50px'
    },
    textDefault: {
      fontFamily: 'Helvetica',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '24px',
      color: '#999999',
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
    title: {
      color: '#FFF',
      font: 'normal normal bold 24px/32px DM Sans'
    }
  };
});

export default useStyles;
