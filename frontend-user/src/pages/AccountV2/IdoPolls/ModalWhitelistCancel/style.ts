import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    modalWhitelistCancel: {

      '& .MuiDialog-paper': {
        width: 404,
        background: '#38383F',
        borderRadius: 12,
        color: '#FFFFFF',
      }
    },

    headModalWhitelistCancel: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      padding: '40px 22px 8px 22px',
      textAlign: 'center',
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

    iconModal: {
      width: 40,
      height: 40,
    },

    titleModal: {
      marginTop: 18,
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 24,
      lineHeight: '28px',
      textAlign: 'center',
    },

    comtentModalWhitelistCancel: {
      padding: '0 22px',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      textAlign: 'center',
    },

    footerModalWhitelistCancel: {
      padding: '32px 22px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: 12,

      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr',
      },

      '& button': {
        marginLeft: 0,
        height: 42,
        backgroundColor: '#3232DC',
        borderRadius: 60,
        boxShadow: 'none',
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
        textAlign: 'center',
        color: '#FFFFFF',
        textTransform: 'inherit',

        '&:hover': {
          backgroundColor: '#3232DC',
        }
      },

      '& button:last-child': {
        marginLeft: 0,
        backgroundColor: '#727272',

        '&:hover': {
          backgroundColor: '#727272',
        }
      },
    },
  };
});

export default useStyles;
