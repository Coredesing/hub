import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    footer: {
      width: '100%',
      padding: 0,
      backgroundColor: '#0A0A0A',
      [theme.breakpoints.down('xs')]: {
        padding: '0px'
      },
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '360px auto',
      // display: 'flex',
      // flexWrap: 'wrap',
      gap: '80px',
      padding: '0px 84px',
      paddingTop: '100px',
      paddingBottom: '112px',
      width: '100%',
      [theme.breakpoints.down('md')]: {
        gap: '60px',
        gridTemplateColumns: '1fr',
      }
    },
    aboutPage: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
      maxWidth: '360px',
      [theme.breakpoints.down('md')]: {
        maxWidth: 'unset',
        textAlign: 'center',
      },
      '& .img': {
        marginBottom: '37px',

      },
      '& p': {
        margin: 0,
        padding: 0,
        marginBottom: '24px',
        fontFamily: 'Firs Neue',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: '20px',
        lineHeight: '32px',
        color: '#fff',
        mixBlendMode: 'normal',
      },
      '& .socials': {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 28px)',
        gap: '12px',
        '& a': {
          display: 'grid'
        },
        [theme.breakpoints.down('md')]: {
          placeContent: 'center'
        }
      }
    },
    navFooter: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, 200px)',
      gap: '40px',
      [theme.breakpoints.down('md')]: {
        placeContent: 'center',
      }
    },
    navLinks: {
      '& h4': {
        margin: 0,
        padding: 0,
        fontWeight: 600,
        fontStyle: 'normal',
        fontSize: '20px',
        lineHeight: '28px',
        color: '#fff',
        mixBlendMode: 'normal',
        marginBottom: '22px',
        textTransform: 'uppercase'
      },
      '& .link': {
        display: 'grid',
        margin: 0,
        padding: 0,
        gap: '5px',

        '& a': {
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontSize: '18px',
          lineHeight: '32px',
          color: '#fff',
          mixBlendMode: 'normal',
        }
      }
    },
    // infoRedKite: {
    //   display: 'flex',
    //   flexDirection: 'column',
    //   fontFamily: 'Helvetica',
    //   fontStyle: 'normal',
    //   fontWeight: 'normal',
    //   fontSize: '14px',
    //   lineHeight: '24px',
    //   color: '#999999',
    //   width: '100%',

    //   '& > a': {
    //     display: 'block',
    //     width: '43px',
    //     margin:  '15px auto'
    //   },
    //   '& p': {
    //     textAlign: 'center',
    //     margin: '0 20px'
    //   },
    //   [theme.breakpoints.down('xs')]: {
    //     width: '100%'
    //   }
    // },
    // logo: {

    // },
    // shareLink: {
    //   marginTop: '20px',
    //   display: 'flex',
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'center',

    //   '& li': {
    //     margin: '0 10px'
    //   },
    //   '& i': {
    //     fontSize: '20px',
    //     '&::before': {
    //       color: '#9F9F9F'
    //     },

    //     '&:hover::before': {
    //       color: '#D01F37'
    //     }
    //   }
    // },
    // teleGram: {

    // },
    // twitter: {

    // },
    // facebook: {

    // },
    // github: {

    // },
    // infoCompany: {
    //   paddingTop: '60px',
    // },
    // companyLink: {
    //   display: 'flex',
    //   flexDirection: 'column',
    // },
    // help: {
    //   paddingTop: '60px',
    // },
    // helpLink: {
    //   display: 'flex',
    //   flexDirection: 'column',
    // },
    // developers: {
    //   paddingTop: '60px',
    // },
    // developerLink: {
    //   display: 'flex',
    //   flexDirection: 'column',
    // },
    // title: {
    //   fontFamily: 'DM Sans',
    //   fontStyle: 'normal',
    //   fontWeight: 'bold',
    //   fontSize: '18px',
    //   lineHeight: '24px',
    //   color: '#FFFFFF',
    // },
    link: {
      fontFamily: 'Helvetica',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '32px',
      color: '#999999',
    },
    endContent: {
      width: '100%',
      background: '#0A0A0A',
      padding: '24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    copyRight: {
      margin: 0,
      padding: 0,
      textAlign: 'center',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '15px',
      color: '#C2C3D8',
    },
    btnToTop: {
      position: 'fixed',
      right: '30px',
      bottom: '70px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: 'white',
      cursor: 'pointer',
      '-webkit-tap-highlight-color': 'transparent',

      '& p': {
        marginTop: '12px',
        fontWeight: '500'
      }
    },
    subContent: {
      fontFamily: 'Helvetica',
      fontSize: '12px',
      lineHeight: '18px',
      color: '#666',
      margin: 'auto',
      marginBottom: 20,
      textAlign: 'center',

      '& a': {
        padding: '0 8px',

        '&:nth-child(2)': {
          borderLeft: '1px solid #666',
          borderRight: '1px solid #666',
        }
      }
    }
  };
});

export default useStyles;
