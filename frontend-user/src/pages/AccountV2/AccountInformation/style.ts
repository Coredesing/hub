import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    wrapper: {
      background: '#303035',
      borderRadius: '12px',
      padding: '28px 28px',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '24px',
      textTransform: 'uppercase',
      marginRight: 40,
      color: '#FFFFFF',
      marginBottom: 8,
    },
    mainInfomation: {
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 14,
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
      

      '& .flex': {
        display: 'flex',
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

      '& button': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#6398FF',
        mixBlendMode: 'normal',
        minWidth: '120px',
        height: '28px',
        border: '1px solid #6398FF',
        boxSizing: 'border-box',
        borderRadius: '36px',
        background: 'none',
        cursor: 'pointer'
      }
    },
    redKiteInfo: {
      marginTop: '25px',

      '& .kyc-info': {
        display: 'flex',
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
      display: 'flex',
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
    }
  };
});

export default useStyles;
