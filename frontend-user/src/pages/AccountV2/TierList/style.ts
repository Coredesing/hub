import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    tierList: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      marginTop: 10,

      '&::before': {
        content: '""',
        display: 'block',
        width: '100%',
        height: '6px',
        position: 'absolute',
        top: '6.5px',
        left: '0',
        backgroundColor: '#44454B',
        borderRadius: '20px'
      },

      '& li.process': {
        display: 'block',
        height: '12px',
        position: 'absolute',
        top: '11.5px',
        left: '0',
        backgroundColor: '#232394',
        zIndex: 1,
        transition: '1s',
        transitionDelay: '0.5s',
        transitionTimingFunction: 'linear',

        '&.inactive': {
          width: '0!important'
        }
      }
    },

    tierInfo: {
      width: '25%',
      position: 'relative',
      '&:last-child': {
        width: '0',

        '&.active .icon': {
          background: 'linear-gradient(130.43deg, #4646FF 21.24%, #D01F1F 92.77%)'
        },

        '&.active .icon:before': {
          borderBottomColor: '#4646FF'
        },

        '&.active .icon:after': {
          borderTopColor: '#D01F1F'
        },
      },
      '& > div': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
        width: '1px',
        whiteSpace: 'nowrap',
      },

      '& .icon': {
        width: '32px',
        height: '20px',
        background: 'currentColor',
        position: 'relative',
      },

      '& .icon:before': {
        content: '""',
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        borderBottom: '10px solid currentColor',
        position: 'absolute',
        top: '-10px',
      },

      '& .icon:after': {
        content: '""',
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        borderTop: '10px solid currentColor',
        position: 'absolute',
        bottom: '-10px',
      },

      '& .icon-inner' : {
        backgroundColor: '#303035',
        transform: 'scale(.85, .85)',
        zIndex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      },

      '& .icon-inner:before': {
        content: '""',
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        borderBottom: '10px solid #303035',
        position: 'absolute',
        top: '-9px',
        zIndex: 1,
      },

      '& .icon-inner:after': {
        content: '""',
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        borderTop: '10px solid #303035',
        position: 'absolute',
        bottom: '-9px',
        zIndex: 1,
      },

      '& .icon-tick': {
        position: 'absolute',
        right: '-6.5px',
        bottom: '-7.5px',
        zIndex: 2
      },

      '& .progress-bar': {
        display: 'block',
        height: '6px',
        position: 'absolute',
        top: '6.5px',
        left: '1px',
        width: 'calc(100% - 2px)',

        '&.inactive': {
          width: '0',
        }
      },

      '&.hide-statistics': {
        '& > div:before': {
          top: -8
        },
        '& .progress-bar': {
          top: -8         
        }
      },

      '& .info': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '15px'
      },

      '&:nth-last-child(2) .progress-bar': {
        borderTopRightRadius: '20px',
        borderBottomRightRadius: '20px'
      },

      '&:last-child > div': {
        alignItems: 'flex-end',

        '& .info': {
          alignItems: 'flex-end'
        },

        '&:before': {
          display: 'none'
        },
      },

      '&:first-child > div': {
        alignItems: 'flex-start'
      },

      '&:first-child > div .info': {
        alignItems: 'flex-start'
      },

      '& .tier-name.active': {
        opacity: 1,
      },

      '& span': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '18px',
        color: '#FFFFFF',
      },

      '& .tier-name': {
        font: 'normal normal bold 14px/18px DM Sans',
        opacity: '1',
        minHeight: '18px'
      },
    },

    [theme.breakpoints.down('xs')]: {
      tierInfo: {
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        height: '25%',
        '&.hide-statistics > div:before': {
          top: 0,
        },
        '&:last-child': {
          height: '0!important',
        },

        '& .info': {
          alignItems: 'flex-start',
          marginLeft: '10px',
          position: 'relative',
          bottom: -8
        },

        '& .icon, & .info': {
          marginBottom: '0',
          marginTop: '-20px',
        },

        '&:first-child > div' :{
          alignItems: 'flex-end'
        },

        '&:first-child .info': {
          bottom: -16
        },

        '&:first-child .icon, &:first-child .info': {
          marginBottom: '0',
          marginTop: '0px'
        },

        '&:last-child .icon, &:last-child .info': {
          marginBottom: '0',
          marginTop: '0px'
        },

        '& span:last-child': {
          height: '18px',
        },
        '&:nth-child(2) span:last-child': {
          width: '100%',
          display: 'block',
        },
        '&:last-child span:last-child': {
          textAlign: 'right'
        },

        '&:last-child .info': {
          alignItems: 'flex-start!important',
        },

        '& > div': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          position: 'relative',
          width: 'auto',
        },

        '& .progress-bar': {
          display: 'block',
          width: '6px',
          position: 'absolute',
          bottom: 20,
          top: 'auto',
          left: '13px',
          height: 'calc(100% - 2px)',
          borderBottomLeftRadius: '0',
          borderTopLeftRadius: '0',

          '&.inactive': {
            width: '0',
          }
        },

        '&.first-tier .progress-bar': {
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          borderBottomLeftRadius: '0',
        },

        '&:last-child .progress-bar': {
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          borderTopRightRadius: '0',
        }
      },

      tierList: {
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        height: '400px',
        marginTop: 30,

        '&::before': {
          content: '""',
          display: 'block',
          width: '6px',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '13px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '& li.process': {
          height: '0',
          width: '12px',
          position: 'absolute',
          top: '0',
          left: '13px',
  
          '&.inactive': {
            width: '5!important',
            height: '0!important'
          }
        },
      }
    }
  };
});

export default useStyles;
