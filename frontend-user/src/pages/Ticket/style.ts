import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    content: {
      // display: 'grid',
      // gap: '45px',
      // paddingTop: '35px',
      // alignItems: 'center',
      // position: 'relative',
      // paddingLeft: 'calc(100% - (461px * 2))',
      // paddingRight: 'calc(100% - (461px * 2))'
    },
    displayContent: {
      paddingLeft: 'calc((100% - (461px * 2 + 40px)) / 2)',
      paddingRight: 'calc((100% - (461px * 2 + 40px)) / 2)',
    },
    alert: {
      marginTop: '12px',
      background: '#591425',
      borderRadius: '2px',
      padding: '10px 40px',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      textAlign: 'center',
      color: ' #fff',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '22px',
      '& a': {
        '&.link': {
          textDecoration: 'underline',
          fontFamily: 'inherit',
          fontStyle: 'inherit',
          color: 'inherit',

        },
        '&.kyc-link': {
          fontFamily: 'inherit',
          fontStyle: 'inherit',
          color: 'inherit',
          fontWeight: 'bold',
        }
      }
    },
    card: {
      marginTop: '35px',
      marginBottom: '40px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, 461px)',
      placeContent: 'center',
      gap: '40px',
      [theme.breakpoints.down('md')]: {
        placeItems: 'center'
      }
    },
    cardImg: {
      '& img': {
        width: '100%',
        maxHeight: '360px',
      }
    },
    cardBody: {
      paddingTop: '30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '461px',
      gap: '30px',
      [theme.breakpoints.down('md')]: {
        // width: '461px',
      }
    },
    cardBodyText: {
      display: 'grid',
      '& h4, & h3': {
        margin: 0,
        padding: 0,
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        textAlign: 'center',
        mixBlendMode: 'normal'
      },

      '& h3': {
        fontWeight: 'bold',
        fontSize: '28px',
        lineHeight: '36px',
        color: ' #FFFFFF',
        marginBottom: '4px',
      },
      '& h4': {
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '28px',
        color: ' #FFFFFF',
        marginBottom: '16px',
        '& span': {
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '16px',
        }
      },

      '& button': {
        border: '1px solid #72F34B',
        boxSizing: 'border-box',
        borderRadius: '4px',
        background: 'transparent',
        padding: '10px',
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        textAlign: 'center',
        color: ' #72F34B',
        fontWeight: '600',
        fontSize: '20px',
        lineHeight: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '190px',
        cursor: 'pointer',

        '& img': {
          marginRight: '8px'
        },
        '& .small-text': {
          color: '#D1D1D1',
          fontWeight: 'normal',
          fontSize: '14px',
          lineHeight: '22px',
        }
      }
    },
    cardBodyDetail: {

    },
    cardBodyClock: {
      '& h5': {
        margin: 0,
        padding: 0,
        marginBottom: '8px',
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        mixBlendMode: 'normal',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'center',

        '& .open': {
          display: 'block',
          maxWidth: '8px',
          maxHeight: '8px',
          borderRadius: '50%',
          marginLeft: '11px',
          marginTop: '1px',
          position: 'relative',
          width: 'fit-content',
          height: 'fit-content',


          // '&:before': {
          //   position: 'absolute',
          //   content: '""',
          //   width: '8px',
          //   height: '8px',
          //   filter: 'blur(5px)',
          //   background: '#72F34B',
          //   left: '-1.4px',
          //   top: '-1.3px'
          // }
        }
      },
      '& .times': {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '12px',
        background: '#2E2E2E',
        borderRadius: '4px',

        '& .dot': {
          display: 'block',
          marginTop: '8px',
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '28px',
          color: '#fff'
        },

        '& .time': {
          // display: 'grid',
          // gap: '1px',
          display: 'block',
          textAlign: 'center',
          width: '60px',
          paddingTop: '6px',
          paddingBottom: '6px',

          '& .number, & .text': {
            fontStyle: 'normal',
            mixBlendMode: 'normal',
            display: 'block',
          },
          '& .number': {
            color: '#fff',
            fontWeight: '600',
            fontSize: '24px',
            lineHeight: '36px',
            fontFamily: 'Firs Neue',
          },
          '& .text': {
            color: '#D1D1D1',
            fontWeight: '600',
            fontSize: '8px',
            lineHeight: '12px',
            fontFamily: 'Hanken Grotesk',
            textTransform: 'uppercase',
          }
        }
      }
    },


    cardBodyProgress: {
      display: 'grid',
      gap: '15px',

    },
    progressItem: {
      display: 'grid',
      gap: '10px',
      '& .total .amount': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        color: ' #aeaeae',
        fontWeight: 'normal',
        fontSize: '16px',
        lineHeight: '24px',
        mixBlendMode: 'normal',
      }
    },
    text: {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      color: ' #fff',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '16px',
      mixBlendMode: 'normal',
      textTransform: 'uppercase'
    },
    textBold: {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      color: ' #fff',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '28px',
      mixBlendMode: 'normal',
    },
    infoTicket: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    timeEnd: {
      display: 'block',
      padding: '3px 8px',
      borderRadius: '4px',
      background: '#2E2E2E',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      color: ' #fff',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '28px',
      mixBlendMode: 'normal',
    },
    amountBuy: {

      '& > span': {
        textTransform: 'uppercase',
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        color: ' #aeaeae',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        mixBlendMode: 'normal',
        marginBottom: '6px',
        display: 'block',
      },
      '& > div': {
        display: 'flex',
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        color: ' #ffffff',
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '28px',
        mixBlendMode: 'normal',
        '& span': {
          display: 'block',
          padding: '5px 12px',
          border: '1px solid #2E2E2E',
          cursor: 'pointer'
        },
        '& span:nth-child(3)': {
          padding: '5px 10px',
        },
        '& > span input': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          color: ' #ffffff',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '28px',
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid #3a3a3a',
          borderRadius: 'unset',
          width: '44px',
          height: '26px',
          padding: '8px 4px',
          textAlign: 'center',
        },
      }
    },
    disabledAct: {
      cursor: 'not-allowed !important',
      color: '#565555',
    },
    buyDisabled: {
      background: '#498631 !important',
    },
    buynow: {
      outline: 'none',
      border: 'none',
      background: '#72f348',
      borderRadius: '2px',
      color: '#000',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '28px',
      textAlign: 'center',
      padding: '13px 20px',
      textTransform: 'uppercase',
      minWidth: '200px',
      cursor: 'pointer'
    },
    btnApprove: {
      outline: 'none',
      border: 'none',
      background: '#0070a7',
      borderRadius: '2px',
      color: '#fff',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '28px',
      textAlign: 'center',
      padding: '13px 20px',
      textTransform: 'uppercase',
      minWidth: '200px',
      cursor: 'pointer'
    },
    finished: {
      alignItems: 'center',
      marginTop: '30px'
    },
    comingSoon: {
      width: '100%',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '36px',
      textAlign: 'center',
      background: '#2E2E2E',
      color: '#FFFFFF',
      padding: '10px',
      borderRadius: '4px',
    },
    alertMsg: {
      width: '100%',
      marginTop: '14px',
      '& img': {
        width: '14px',
        height: '14px',
        marginRight: '8px'
      },
      '& span': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'left',
        color: '#F24B4B',
      }
    }
  };
});

export default useStyles
