import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    backgroundComponent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundSize: 'cover',
      width: '100%',
      padding: '100px 0',
      marginBottom: 20,

      '& > img': {
        width: '100%',
        objectFit: 'cover',
      },

      '& .btn': {
        flex: '0 0 280px',
        margin: '8px',
        height: '42px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#6398FF',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '60px',
        border: '2px solid #6398FF',
  
        '&:hover': {
          cursor: 'pointer'
        },

        [theme.breakpoints.down('xs')]: {
          flex: '0 0 42px',
          width: '280px'
        }
      },

      [theme.breakpoints.down('sm')]: {
        '& > img': {
          height: '400px'
        },
      },

      [theme.breakpoints.down('xs')]: {
        padding: '0',
      }
    },
    wrongNetwork: {
      position: 'absolute',
      width: '100%',
      height: '44px',
      background: 'rgba(208, 31, 54, 0.4)',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      '& .btn-close': {
        position: 'absolute',
        top: '10px',
        right: '20px',
        height: 'unset',
        padding: '0'
      },

      '& .btn-change-network': {
        background: 'none',
        border: '1px solid #FFFFFF',
        borderRadius: '30px',
        height: '28px',
        padding: '0 14px',
      },

      '& p, & p a': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#FFFFFF',
      },

      '& p a': {
        TextDecoration: 'underline'
      }
    },
    mainContent: {
      maxWidth: '800px',
      '& h1': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '48px',
        lineHeight: '52px',
        color: '#FFFFFF',
        textAlign: 'center',

        [theme.breakpoints.down('xs')]: {
          fontSize: '28px',
          lineHeight: '32px',
        }
      },
      '& h1 img': {
        [theme.breakpoints.down('xs')]: {
          height: '20px'
        }
      },
      '& h1 br': {
        [theme.breakpoints.down('xs')]: {
          display: 'none'
        }
      },

      '& p': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#AEAEAE',
        marginTop: '28px',
        textAlign: 'center',

        [theme.breakpoints.down('xs')]: {
          fontSize: '14px',
          lineHeight: '20px',
          marginTop: '12px'
        }
      },

      [theme.breakpoints.down('sm')]: {
        margin: '10% 40px',
        width: 'calc(100vw - 80px)'
      },

      [theme.breakpoints.down('xs')]: {
        margin: '10% 20px',
        width: 'calc(100vw - 40px)',
        '& h1': {
          fontSize: '36px',
          lineHeight: '48px'
        },
      }
    },
    info: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '28px',

      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        marginTop: '16px',
      }
    },
    infoDetail: {
      padding: '0 32px',

      '&:nth-child(2)': {
        borderLeft: '1px solid #fff2',
        borderRight: '1px solid #fff2',
      },

      '& p': {
        margin: '2px'
      },

      '& p:last-child': {
        fontFamily: 'DM Sans',
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '24px',
        color: '#FFF'
      },

      [theme.breakpoints.down('xs')]: {
        marginBottom: '12px',
        border: 'none !important',
      }
    },
    buttonArea: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '32px',

      '& .btn-crowdloan': {
        borderColor : '#3232DC',
        backgroundColor: '#3232DC',
        color: 'white'
      },

      [theme.breakpoints.down('xs')]: {
        marginTop: '20px',
        flexDirection: 'column',
        alignItems: 'center',
        '& .btn-crowdloan': {
          marginTop: '16px'
        },
      }
    },
  };
});

export default useStyles;
