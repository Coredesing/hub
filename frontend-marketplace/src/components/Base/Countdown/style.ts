import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme) => {
  return {
    countdownPart: {
      display: 'inline-block',
      listStyleType: 'none',
      padding: '0px 4px',
      color: 'white',
      font: 'normal normal bold 18px/24px DM Sans',

      '& span': {
        display: 'block',
        textAlign: 'center'
      },

      '&.number': {
        display: 'block',
        minWidth: 60,
        fontWeight: 'bold',
        fontSize: 24,
        lineHeight: '28px',
      }
    },

    listCountDown: {
      ...typeDisplayFlex,
      alignItems: 'flex-start',

      [theme?.breakpoints?.down('sm')]: {
        textAlign: 'center',
        justifyContent: 'center',
      },
    },

    countdownInfo: {
      color: '#999999',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '20px',
      marginTop: 4,
    },
    [theme.breakpoints.down('xs')]: {
      countdownPart: {
        padding: '10px 5px',

        '&.number': {
          padding: '5px 5px 15px 5px'
        }
      }
    }
  };
});

export default useStyles;
