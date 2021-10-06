import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => ({
  section: {

    width: '100%',
    minHeight: 'calc(100vh - 200px)',
    display: 'grid',
    gridTemplateColumns: 'auto 280px',
    [theme.breakpoints.down('sm')]: {
      padding: '68px 20px',
    },
  },
  contentBox: {
    position: 'relative',
    paddingLeft: '120px',
    paddingTop: '60px',
    '& .banner': {
      zIndex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      // [theme.breakpoints.down('xs')]: {
      //   // backgroundPosition: 'inherit',
      // },
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      [theme.breakpoints.up('sm')]: {
        '&::before': {
          zIndex: 1,
          background: ' linear-gradient(to left, transparent 30%, rgba(8, 8, 8, 1) 100%)',
        },
      },
      [theme.breakpoints.down('sm')]: {
        '&::after': {
          zIndex: 1,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(8, 8, 8, 0.6) 20%)'
        }
      },

    },
    '& .detail-countdown-box': {
      position: 'absolute',
      zIndex: 100,
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#000000',
      height: '81px',

      '&:before': {
        background: '#72F34B',
        width: '100px',
        height: '100%',
        transform: 'skew(-30deg)',
        position: 'absolute',
        left: '-25px',
        bottom: 0,
        content: '""',
      },
      '& .wrapper-countdown': {
        width: 'fit-content',
        background: '#000000',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingLeft: '120px',
        '& > span': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '16px',
          color: '#AEAEAE',
          display: 'block',
          textTransform: 'uppercase',
        },

        '& .countdown': {
          background: '#000000',
          width: '400px',
          marginLeft: '20px',
          zIndex: 10,
          fontFamily: 'Space Ranger',

          '& .time .number': {
            transform: 'skew(-20deg)',
          }
        }
      }
    }
  },
  content: {
    position: 'relative',
    zIndex: 100,
    '& .detail-box': {
      marginBottom: '90px',
      [theme.breakpoints.down('xs')]: {
        textAlign: 'center',
      },
      '& h1': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '32px',
        lineHeight: '40px',
        color: '#FFFFFF',
        marginBottom: '12px',
        display: 'block',
        maxWidth: '480px',
        textTransform: 'uppercase',

        [theme.breakpoints.up('xl')]: {
          fontSize: '43px',
          lineHeight: '50px',
          maxWidth: '600px',
          marginBottom: '20px',
        },
        [theme.breakpoints.down('xs')]: {
          fontSize: '24px',
          lineHeight: '32px',

        },
      },
      '& .status': {
        marginBottom: '12px',
        [theme.breakpoints.up('xl')]: {
          marginBottom: '20px',
        },
        '& span': {
          padding: '4px 10px',
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '24px',
          textTransform: 'uppercase',
          marginBottom: '12px',
          background: '#000',
          color: '#fff',
          borderRadius: '4px',
          [theme.breakpoints.up('xl')]: {
            fontSize: '18px',
          },
          [theme.breakpoints.down('xs')]: {
            fontSize: '14px',
          },
        },

        '&.upcoming span': {
          color: '#72F34B',
          background: 'rgba(114, 243, 75, 0.3)'
        },
        '&.sale span': {
          color: '#4BCBF3',
          background: 'rgba(75, 233, 243, 0.3)'
        },
        '&.over span': {
          color: '#F24B4B',
          background: 'rgba(242, 75, 75, 0.3)'
        }

      },
      '& .desc': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#FFFFFF',
        maxWidth: '480px',
        marginBottom: '16px',
        [theme.breakpoints.up('xl')]: {
          fontSize: '20px',
          maxWidth: '600px',
          marginBottom: '20px',
        },
        [theme.breakpoints.down('xs')]: {
          fontSize: '14px',
        },
      },
      '& .detail-items': {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 200px))',
        marginBottom: '32px',
        '& .item': {
          '& label': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '16px',
            lineHeight: '24px',
            color: '#AEAEAE',
            display: 'block',
            marginBottom: '4px',
          },
          '& span': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#FFFFFF',
            display: 'block',
            textTransform: 'uppercase',

            '&.icon': {
              display: 'flex',
              alignItems: 'center',
              gap: '4px',

              '& img': {
                width: '16px',
                height: '16px',
              }
            }

          },
        }
      },
      '& .countdown-box': {
        '&>span': {
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '16px',
          color: '#AEAEAE',
          display: "block",
          marginBottom: '8px',
        },
        // display: 'grid',
        // gridTemplateColumns: '400px minmax(120px, 200px)',
        // [theme.breakpoints.down('xs')]: {
        //   gridTemplateColumns: '1fr',
        //   placeItems: 'center',

        // },
        '& .countdown': {
          maxWidth: '400px',
          width: '100%',
          // [theme.breakpoints.down('xs')] : {
          //   maxWidth: '280px',
          // },

          fontFamily: 'Space Ranger',
          background: 'rgba(0, 0, 0, 0.5)',

          '& .time .number': {
            transform: 'skew(-20deg)',
            fontSize: '28px',
            [theme.breakpoints.up('xl')]: {
              fontSize: '35px',
            },
          },
          '& .time .text': {
            [theme.breakpoints.up('xl')]: {
              fontSize: '10px',
            },
          }
        },
      }
    },
  },
  btnJoin: {
    padding: '14px 30px',
    border: '1px solid #72F34B',
    color: '#72F34B',
    textTransform: 'uppercase',
    fontFamily: 'Firs Neue',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    background: '#000000',
    display: 'grid',
    placeContent: 'center',
    borderRadius: '2px',
    transition: '0.3s',
    maxWidth: '180px',
    '&:hover': {
      color: '#000',
      background: '#72F34B',
      transition: '0.3',
    }
  },

  wrapperSlideBoxes: {
    width: '280px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    zIndex: 10,
    position: 'relative',
    // bottom: 0,
    // left: 0,
    display: 'grid',
    background: 'rgba(8, 8, 8, 0.8)',
    '& .slides': {
      overflow: 'hidden',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
      ...typeDisplayFlex,
      flexDirection: 'column',
      alignItems: 'center',
      '& .slide': {
        border: '1px solid #000',
        transition: '.3s',
        width: '220px',
        minHeight: '130px',
        position: 'relative',
        cursor: 'pointer',
        marginBottom: '6px',
        paddingTop: '8px',
        '&  .img-slide': {

          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          '& img': {
            width: '100%',
            height: '100%',
          }
        },
        '& .detail': {
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 100,
          display: 'grid',
          opacity: 0,
          transistion: '0.3s',
          '& .info': {
            position: 'relative',
            display: 'grid',
            textAlign: 'center',
            marginBottom: '60px',
            '& .status': {
              placeContent: 'center',
              display: 'grid',
            },
            '& span, & h2, & .box-countdown': {
              fontFamily: 'Firs Neue',
              fontStyle: 'normal',
            },
            '&.upcoming': {
              '& .status >span': {
                color: '#72F34B',
                background: 'rgba(114, 243, 75, 0.3)'
              }
            },
            '&.sale': {
              '& .status >span': {
                color: '#4BCBF3',
                background: 'rgba(75, 233, 243, 0.3)'
              }
            },
            '&.over': {
              '& .status >span': {
                color: '#F24B4B',
                background: 'rgba(242, 75, 75, 0.3)'
              }
            },
            '& .status > span': {
              display: 'block',
              marginBottom: '6px',
              padding: '4px 10px',
              fontFamily: 'Firs Neue',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '24px',
              textTransform: 'uppercase',
              background: '#000',
              color: '#fff',
              borderRadius: '4px',
              maxWidth: '100px',
              [theme.breakpoints.up('xl')]: {
                fontSize: '18px',
              },
              [theme.breakpoints.down('xs')]: {
                fontSize: '14px',
              },
            },
            '& h2': {
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '24px',
              color: '#FFFFFF',
              marginBottom: '12px',
              padding: '0px 10px',
              wordWrap: 'break-word',
              wordBreak: 'break-all',
              whiteSpace: 'pre-line'
            },
          },
          '& .box-countdown': {
            display: 'grid',
            gap: '7px',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            left: 0,
            '& span': {
              fontSize: '12px',
              lineHeight: '16px',
              color: '#fff',
              textTransform: 'uppercase',
              textAlign: 'center',
            },
            '& .countdown': {
              width: '100%',
              background: 'rgba(23, 23, 23, 0.3)',
              lineHeight: '28px',
              fontWeight: 600,
              color: '#fff',
              paddingLeft: '5px',
              paddingRight: '5px',
              '& .times': {
                gap: '6px',
                background: 'unset',
              },
              '& .time': {
                width: '40px',
                '& .number': {
                  color: '#fff',
                  fontSize: '24px',
                  fontFamily: 'Space Ranger',
                  transform: 'skew(-20deg)'
                },
                '& .text': {
                  fontSize: '8px',
                  fontFamily: 'Firs Neue'
                },
              }
            }
          }
        }

      },
      '& .slide.active, & .slide:hover': {
        border: '1px solid #72F34B',
        '& .img-slide::before': {
          content: '""',
          background: 'rgba(0, 0, 0, 0.7)',
          width: '100%',
          height: '100%',
          position: 'absolute',
        },
        '& .detail': {
          opacity: 1,
        },
        '&::before': {
          position: 'absolute',
          zIndex: 100,
          content: '""',
          top: '-2px',
          bottom: '-2px',
          left: '-2px',
          right: '-2px',
          '-webkit-box-shadow': '0px 0px 50px 2px rgba(114,243,75, 0.4)',
          '-moz-box-shadow': '0px 0px 50px 2px rgba(114,243,75,0.4)',
          'box-shadow': '0px 0px 50px 2px rgba(114,243,75,0.4)',
        },
        '&::after': {
          content: '""',
          background: 'rgba(0,0,0, 0.6)',
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }
      },

      '& .slide:last-child': {
        marginRight: 'unset',
      }
    }

  }
}));

export default useStyles;
