import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    btnViewAllPools: {
      minWidth: 200,
      maxWidth: '100%',
      height: 42,
      background: '#D01F36',
      borderRadius: 60,
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      color: '#FFFFFF',
      border: 'none',
      outline: 'none',
      padding: '0 27px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#D01F36',
      margin: '40px auto 0 auto',
      cursor: 'pointer'
    },

    listPools: {
      width: 1040,
      margin: 'auto',
      maxWidth: 'calc(100vw - 80px)',
      marginBottom: 120,

      '&.listPools2': {
        width: 820,
        maxWidht: '100%',
      },


      [theme.breakpoints.down('xs')]: {
        width: 'calc(100% - 36px)',
        maxWidth: 'calc(100vw - 36px)',
        margin: 'auto',
        marginBottom: 75,
      },

      '& h2': {
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 28,
        lineHeight: '32px',
        color: '#FFFFFF',
      },

      '& .pools': {
        display: 'Grid',
        gridTemplateColumns: 'repeat(3, calc(33% - 9.5px))',
        gap: 20,
        margin: 'auto',
        placeContent: 'center',

        [theme.breakpoints.down('sm')]: {
          display: 'block'
        },
      },

      '& .active_pools': {
        display: 'Grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: 20,
        margin: 'auto',
        placeContent: 'center',

        [theme.breakpoints.down('sm')]: {
          gridTemplateColumns: 'repeat(1, 1fr)',
        },
      },

      '& .pools_completed_sales': {

      },

      '& .btn': {
        height: '42px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        padding: '0 27px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '60px',
        backgroundColor: '#D01F36',
        margin: '40px auto 0',
        cursor: 'pointer'
      },
    },

    getAlert: {
      position: 'relative',
      backgroundImage: 'url(/images/bg_get_alert.svg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    },

    contentGetAlert: {
      width: 1120,
      margin: 'auto',
      maxWidth: 'calc(100vw - 80px)',
      minHeight: 480,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#FFFFFF',
    },

    titleGetAlert: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 40,
      lineHeight: '44px',
      textAlign: 'center',
      marginBottom: 30,
      [theme.breakpoints.down('sm')]: {
        marginBottom: 40,
      }
    },

    desGetAlert: {
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 40,
    },

    btnGetAlert: {
      minWidth: 180,
      maxWidth: '100%',
      minHeight: 42,
      background: '#3232DC',
      borderRadius: 60,
      border: 'none',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      cursor: 'pointer',
      padding: '10px 15px',
      [theme.breakpoints.down('sm')]: {
        width: 280,
      },
      
      '& img': {
        marginLeft: 8,
      }
    }
  };
});

export default useStyles;
