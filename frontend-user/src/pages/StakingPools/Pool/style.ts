import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    pool: {
      backgroundColor: '#222228',
      color: '#FFFFFF',
      boxShadow: 'unset',
      '&:not(:last-child)': {
        borderBottom: '1px solid #37373D',
      },
      padding: 0,

      '& .MuiAccordionSummary-root': {
        padding: 0,
        [theme.breakpoints.down('xs')]: {
          padding: '0 12px',
        },
      },
      '& .pool--logo': {
        height: '52px',
        width: '52px',
        [theme.breakpoints.down('xs')]: {
          height: '32px',
          width: '32px',
        },
        borderRadius: '8px',
      },
      '& .pool--sumary': {
        display: 'flex',
        // alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
          display: 'grid',
          gap: '10px',
          placeContent: 'center',
          placeItems: 'center',
          gridTemplateColumns: '1fr',
        },
      },
      '& .pool--sumary-block': {
        marginLeft: '10px',
        marginRight: '10px',
        [theme.breakpoints.up('xs')]: {
          marginLeft: '0',
          marginRight: '0',
        },
        '&:nth-child(2)': {
          // width: '80px',
          [theme.breakpoints.up('md')]: {
            // width: '180px'
          },
        },
      },
      '& .pool--sumary-block__min-width': {
        [theme.breakpoints.up('md')]: {
          minWidth: '90px'
        },
      },
      '& .pool--sumary-block__min-width-sm': {
        [theme.breakpoints.up('md')]: {
          minWidth: '60px'
        },
      },
      '& .pool--sumary-block__min-width-lg': {
        [theme.breakpoints.up('md')]: {
          minWidth: '120px'
        },
      },
      '& .mobile-hidden': {
        [theme.breakpoints.down('xs')]: {
          display: 'none'
        },
      },
      '& .mobile-flex-row': {
        display: 'none',
        [theme.breakpoints.down('xs')]: {
          display: 'flex',
          flexDirection: 'row',
          padding: '24px 15px',
        },
        [theme.breakpoints.up('xs')]: {
          padding: 0
        },
      },
      '& .xs-flex-row': {
        [theme.breakpoints.down('xs')]: {
          display: 'flex',
          flexDirection: 'row',
        },
      },
      '& .mobile-flex-col': {
        display: 'none',
        [theme.breakpoints.up('xs')]: {
          padding: '0px 0px',
        },
        [theme.breakpoints.down('xs')]: {
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 15px',
        },
      },
      '& .pool--expand-text': {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        color: '#6398FF'
      },
      '& .pool--detail': {
        background: '#191920',
        margin: '15px 0px',
        padding: '20px 0',
        display: 'flex',
        [theme.breakpoints.down('xs')]: {
          flexDirection: 'column',
          padding: '0 0',
        },
      },

      '& .pool--detail-block': {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px',
        minHeight: '110px',
        [theme.breakpoints.down('xs')]: {
          padding: '24px 15px',
          width: '100% !important',
        },
        // borderRight: '1px solid #37373D',

        '&:not(:last-child)': {
          borderRight: '1px solid #37373D',
          [theme.breakpoints.down('xs')]: {
            borderRight: 'none',
            borderBottom: '1px solid #37373D',
          },
        }
      },

      '& .pool--detail-block__claim': {
        [theme.breakpoints.down('xs')]: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      },

      '& .pool--detail-block__withdraw': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        [theme.breakpoints.down('xs')]: {
          display: 'flex',
          flexDirection: 'row',
        },
        marginBottom: '20px'
      },

      '& .pool--detail-block__grid': {
        display: 'grid',
        gridColumnGap: '12px',
        gridTemplateColumns: '140px 2fr',
        alignItems: 'center',
        marginBottom: '3px'
      },

      '& .Mui-expanded': {
        margin: '0',
        '& .pool--expand-text': {
          color: '#D01F36'
        },
        '& .MuiIconButton-label': {
          color: '#D01F36'
        }
      },

      '& .MuiIconButton-label': {
        color: '#6398FF',
      },

      '& .justify-between': {
        justifyContent: 'space-between'
      },
      '& .items-center': {
        alignItems: 'center'
      },
      '& .w-full': {
        width: '100%'
      }
    },
    accorditionDetails: {
      display: 'unset',
    },
    progressArea: {
      marginBottom: 12,
      width: '280px',
      [theme.breakpoints.down('xs')]: {
        width: '100%'
      }
    },

    progress: {
      display: 'block',
      width: '100%',
      height: 4,
      background: '#44454B',
      borderRadius: 20,
      marginTop: 10,
      marginBottom: 5,
    },

    iconCurrentProgress: {
      transform: 'scale(0.8)',
      position: 'absolute',
      top: -14,
      right: -14,
    },

    currentProgress: {
      position: 'relative',
      height: 4,
      background: '#72F34B',
      borderRadius: 20,
      display: 'block',
      transition: '2s',
      // boxShadow: '0px 4px 8px rgba(208, 31, 54, 0.4)',

      '&.inactive': {
        width: '0 !important',
      }
    },
    currentPercentage: {
      fontWeight: 700
    },

    textPrimary: {
      lineHeight: '26px',
      fontWeight: 500,
      color: '#FFFFFF'
    },
    textAPR: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      lineHeight: '26px',
      fontWeight: 500,
      color: '#FFFFFF'
    },
    textSecondary: {
      color: '#AEAEAE',
      fontFamily: 'Firs Neue',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '24px',
    },
    link: {
      backgroundColor: 'Transparent',
      border: 'none',
      color: '#6398FF',
      lineHeight: '25px',
      fontWeight: 700,
      textAlign: 'left',
      // textDecoration: 'underline',
      cursor: 'pointer',
      '&:hover': {
        color: '#4f79cc',
      }
    },
    delayTierBoxs: {
      display: 'grid',
      gap: '8px',
      gridTemplateColumns: 'repeat(auto-fit, 100px)',
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: 'repeat(auto-fit, 54px)',
        gap: '5px',
      },
    },
    delayTierBox: {
      fontFamily: 'Firs Neue',
      fontWeight: 'normal',

      '& h4': {
        display: 'grid',
        gridTemplateColumns: '30px auto',
        gap: '6px',
        marginBottom: '5px',
        placeContent: 'center',
        '& img': {
          width: '30px',
          height: '26px',
        },
        [theme.breakpoints.down('xs')]: {
          gap: '0px',
          gridTemplateColumns: '1fr',
          placeItems: 'center',
          fontSize: '12px',
          marginBottom: '2px',
          '& img': {
            width: '25px',
            height: '20px',
          },
        },
      },
      '& h5': {
        fontFamily: 'Firs Neue',
        fontWeight: 600,
        fontSize: '16px',
        textAlign: 'center',
        [theme.breakpoints.down('xs')]: {
          fontSize: '12px',
        },
      }
    },
    accordionSummary: {
      display: 'unset',
    },
    accordionSummaryContent: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'calc(100% - 50px) 50px',
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr',
      },
    }
  }
});

export default useStyles;