import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    alertVerifyEmail: {
      position: 'relative',
      width: '100%',
      padding: 9,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#591425',
      marginBottom: 15,
      borderRadius: '8px',
      minHeight: 42,
      
      [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
      },

      '& img': {
        marginTop: 3,
        [theme.breakpoints.down('sm')]: {
          marginTop: 6,
        },
      },

      '& .btn-close': {
        position: 'absolute',
        top: '50%',
        right: '15px',
        transform: 'translateY(-50%)'
      },

      '& span': {
        font: 'normal normal 400 14px/24px Helvetica',
        color: '#FFFFFF',
      },

      '& a': {
        color: '#6398FF'
      }
    },

    errorSwich: {
      marginBottom: 20,
    },

    errorBanner: {
      color: 'white',
      backgroundColor: '#FF4C00',
      textAlign: 'center',
      padding: 12,
      marginBottom: 0,
      flex: 1,
    },
    title: {
      font: 'normal normal bold 28px/32px DM Sans',
      color: '#FFF',
      position: 'relative',

      '&:after': {
        content: '""',
        display: 'block',
        width: '100%',
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        position: 'absolute',
        bottom: '-10px',
      }
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '5fr 4fr',
      gap: '100px',
      marginTop: '10px',
      marginBottom: '120px',
      position: 'relative',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
        padding: '40px',
        paddingTop: '150px',
      },
      [theme.breakpoints.only('xs')]: {
        gridTemplateColumns: '1fr',
        padding: '20px',
        paddingTop: '100px',
      },
    },
    leftPanel: {
    },
    rightPanel: {
      maxWidth: '100%',
      width: '100%',
    },
    accountContainer: {
      padding: '10px 0 80px 0',
      width: 1040,
      maxWidth: 'calc(100vw - 80px)',
      margin: 'auto',

      [theme.breakpoints.down('xs')]: {
        width: 'calc(100% - 36px)',
        maxWidth: 'calc(100vw - 36px)',
        margin: 'auto',
      }
    },
    [theme.breakpoints.down('xs')]: {
      mainContent: {
        padding: '20px 0',
        marginBottom: '80px',
        gap: '60px'
      },
    },
    tier: {
      background: '#303035',
      borderRadius: '12px',
      padding: '28px',
    }
  };
});

export default useStyles;
