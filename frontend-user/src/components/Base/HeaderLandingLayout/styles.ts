import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    navBar: {
      display: 'grid',
      gridTemplateColumns: '173px auto',
      alignItems: 'center',
      gap: '32px',
      padding: '26px 84px',
      background: '#000',
      width: '100%',
      color: '#FFFFFF',
      font: 'normal normal bold 16px/24px DM Sans',
      position: 'relative',
      zIndex: 1,

      // '& > div': {
      //   display: 'flex',
      //   flexDirection: 'row',
      //   alignItems: 'center',
      //   justifyContent: 'space-between',
      //   width: '100%',

      //   '& .pool ': {
      //     display: 'flex'
      //   },

      //   '& a': {
      //     color: '#FFFFFF'
      //   },

      //   '& .connects i': {
      //     marginLeft: '20px',

      //     '&::before': {
      //       color: '#9F9F9F'
      //     },

      //     '&:hover::before': {
      //       color: '#D01F37'
      //     }
      //   }
      // },
      [theme.breakpoints.down('sm')]: {
        position: 'static',
        padding: '10px 40px',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '0',
        flexDirection: 'column',
        position: 'relative',

        '& > div:first-child': {
          width: '100%',
          padding: '10px 32px',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          alignItems: 'center'
        },

        '& .logo img': {
          width: '30px',
        },

        '& .connects': {
          order: 3
        },

        '& .pool': {
          order: 2
        },

        '& .logo': {
          order: 1
        }
      },
    },
    headerNav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLinks: {
      margin: 0,
      padding: 0,
      display: 'flex',
      gap: '32px',
      flexWrap: 'wrap',
    },
    headerLink: {
      '& a': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#FFFFFF',
        mixBlendMode: 'normal',
      }
    },
    headerAccount: {
      display: 'flex',
      gap: '28px',
      alignItems: 'center',
    },
    headerAccText: {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '24px',
      color: '#FFFFFF',
      mixBlendMode: 'normal',
    },
    headerAccBtn: {
      background: '#2E2E2E',
      borderRadius: '4px',
      outline: 'none',
      border: 'none',
      padding: '4px 4px 4px 8px',
      display: 'flex',
      gap: '6px',
      alignItems: 'center',

      '& .logo-currency': {

      },
      '& .balance': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#FFFFFF',
        mixBlendMode: 'normal',
      },
      '& .address': {
        display: 'block',
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '22px',
        color: '#FFFFFF',
        mixBlendMode: 'normal',
        padding: '7px 13px',
        background: '#000000',
        borderRadius: '4px'
      }
    },

    // banner: {
    //   position: 'absolute',
    //   top: '80px',
    //   backgroundColor: 'rgba(50, 50, 200, 0.4)',
    //   width: '100%',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center!important',
    //   padding: '10px 0',
    //   left: '0'
    // },
    // loginErrorBannerText: {
    //   font: 'normal normal 400 14px/24px Helvetica',
    //   display: 'flex',
    //   alignItems: 'center',
    //   marginLeft: '10px',
    // },
    // btnChangeAppNetwork: {
    //   padding: '0 15px',
    //   background: 'transparent',
    //   fontWeight: 600,
    //   color: 'white',
    //   cursor: 'pointer',
    //   transition: '.2s all ease-in',
    //   border: '1px solid #FFFFFF',
    //   boxSizing: 'border-box',
    //   borderRadius: '30px',
    //   height: '28px',
    //   display: 'flex',
    //   alignItems: 'center',
    //   font: 'normal normal 700 12px/14px DM Sans',

    //   '&:focus': {
    //     outline: 'none'
    //   },
    // },
    // closeBtn: {
    //   position: 'absolute',
    //   top: '12px',
    //   right: '20px'
    // },
    // [theme.breakpoints.down('xs')]: {
    //   banner: {
    //     top: '0',
    //     position: 'relative',
    //   },
    //   navBar: {
    //     '& > div': {
    //       alignItems: 'flex-start'
    //     }
    //   },
    //   loginErrorBannerText: {
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     padding: '0 40px 0 20px',
    //     marginLeft: '0',

    //     '& button': {
    //       marginTop: '10px'
    //     }
    //   }
    // }
  };
});

export default useStyles;
