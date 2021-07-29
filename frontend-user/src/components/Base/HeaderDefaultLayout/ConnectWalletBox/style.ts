import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    walletBox: {
      border: '2px solid transparent',
      padding: '16px 16px',
      maxWidth: 120,
      width: 120,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: '.1s all linear',
      boxSizing: 'border-box',
      borderRadius: 4,
      
      '&:hover': {
        backgroundColor: '#1B1F2D',
        borderRadius: 4,
      },

      '&:not(:first-child)': {
        marginLeft: 16
      }
    },

    activeNetwork: {
      background: '#11152A',
      border: '2px solid #3C5EA2',
    },

    walletBoxText: {
      color: '#999999',
      marginTop: 10,
      font: 'normal normal normal 12px/18px Helvetica!important',
      textAlign: 'center',
    },
    walletBoxIconWrap: {
      position: 'relative',
      borderRadius: 4
    },
    walletBoxIcon: {
       width: 40
    },
    walletBoxCheck: {
      position: 'absolute',
      bottom: '-3px',
      right: '-7px'
    },
    [theme.breakpoints.down('xs')]: {
      walletBox: {
        '&:not(:first-child)': {
          marginLeft: 0
        }
      },
    }
  };
});

export default useStyles;
