import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    sectionBuyTokenPoolSwapInfo: {
      background: '#303035',
      borderRadius: 12,
      padding: '28px 28px',
      marginBottom: 12,
      color: '#FFFFFF',
      fontFamily: 'DM Sans',

      [theme?.breakpoints?.down('sm')]: {
        padding: '28px 20px',
      },
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

    topSec: {
      ...typeDisplayFlex,
      justifyContent: 'space-between',
      marginBottom: 24,
    },

    leftTopSec: {
      width: '100%',
    },

    valueLeftTopSec: {
      marginTop: 4,
      fontSize: 28,
      lineHeight: '32px',
      color: '#72F34B',
      fontWeight: 'bold',
    },

    rightTopSec: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#AEAEAE',
      marginLeft: 'auto',
      fontWeight: 500,
      textAlign: 'right',
    },

    titleSub: {
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      marginBottom: 10,
      ...typeDisplayFlex,
    },

    titleSub2: {
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      marginBottom: 24,
      ...typeDisplayFlex,
    },

    botSec: {

    },

    jubValue: {
      ...typeDisplayFlex,
      justifyContent: 'space-between',
      marginBottom: 10,
    },

    leftBotSec: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
    },

    rightBotSec: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#AEAEAE',
    },

    progress: {
      width: '100%',
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      position: 'relative',
      borderRadius: 20,
    },

    achieved: {
      width: '30%',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: '#72F34B',
      borderRadius: 20,
    },
  };
});

export default useStyles;