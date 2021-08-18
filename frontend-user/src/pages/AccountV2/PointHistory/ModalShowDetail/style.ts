import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    modalModalShowDetail: {

      '& .MuiDialog-paper': {
        width: 'calc(100vw - 32px)',
        background: '#38383F',
        borderRadius: 12,
        color: '#FFFFFF',
      }
    },

    btnColseModal: {
      position: 'absolute',
      top: 12,
      right: 14,
      minWidth: 'auto',
      padding: 0,
      background: 'transparent',
      boxShadow: 'none',
      borderRadius: '50%',
    },

    headModalShowDetail: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      padding: '16px 12px 8px 12px',
      textAlign: 'center',

      '& h2': {
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
        textAlign: 'center',
        color: '#FFFFFF',
      }
    },

    comtentModalShowDetail: {
      padding: '0px 12px',
      paddingBottom: 20,
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      textAlign: 'center',
    },

    listItem: {
      display: 'flex',
      flexDirection: 'column',
    },

    Item: {
      display: 'flex',
      flexDirection: 'column',
      borderBottom: '1px solid rgb(255 255 255 / 10%)',
      padding: '12px 6px',

      '&:last-child': {
        borderBottom: 'none',
      }
    },

    unStakedTx: {
      color: '#72F34B',
      cursor: 'pointer',
    },

    groupItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#FFFFFF',
      fontSize: 14,
      lineHeight: '18px',
      marginBottom: 13,

      '&:last-child': {
        marginBottom: 0,
      }
    },

    nameItem: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      
    },

    valueItem: {
      fontFamily: 'Helvetica',
      textAlign: 'right',
    },

    listUnstake: {
      background: '#222228',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
    },

    itemUnstake: {
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 20px',
      borderBottom: '1px solid rgb(255 255 255 / 10%)',

      '&:last-child': {
        borderBottom: 'none',
      }
    },

    nameItemUnstake: {

    },

    valueItemUnstake: {

    }
  };
});

export default useStyles;
