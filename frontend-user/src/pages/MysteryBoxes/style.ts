import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => ({
  section: {
    position: 'relative',
    width: '100%',
    minHeight: 'calc(100vh)',
    padding: '68px 120px',
    paddingBottom: '30px',

    [theme.breakpoints.down('sm')] : {
      padding: '68px 20px',
    },

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
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      '&::before': {
        zIndex: 1,
        background: ' linear-gradient(to left, transparent 30%, rgba(8, 8, 8, 1) 100%)',
      },
      // '&::after': {
      //   zIndex: 1,
      //   background: 'linear-gradient(to bottom, transparent 0%, rgba(8, 8, 8, 0.6) 100%)'
      // }

    },
    '& .wrapper-slides': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      zIndex: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      display: 'grid',
      placeContent: 'center',
      placeItems: 'center',
      background: 'rgba(8, 8, 8, 0.3)',
      width: '100%',
      '& .slides': {
        width: 'calc(100% - 68px * 2)',
        overflow: 'hidden',
        paddingTop: '20px',
        paddingBottom: '20px',
        '& .slide': {
          width: '250px',
          height: '142px',
          display: 'inline-block',
          marginRight: '10px',
          position: 'relative',
          '& img': {
            width: '100%',
            height: '100%',
          },
          '& .detail': {
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            placeContent: 'center',
            placeItems: 'center',
            zIndex: 100,
            padding: '15px',
            '& .info': {
              position: 'relative',
              textAlign: 'center',
              '& h3, & h2, & .countdown': {
                fontFamily: 'Firs Neue',
                fontStyle: 'normal',
              },
              '&.upcoming': {
                '& h3': {
                  color: '#72F34B'
                }
              },
              '&.sale': {
                '& h3': {
                  color: '#4BCBF3'
                }
              },
              '&.over': {
                '& h3': {
                  color: '#F24B4B'
                }
              },
              '& h3': {
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                textTransform: 'uppercase',
                marginBottom: '7px',
              },
              '& h2': {
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '28px',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '12px',
                wordWrap: 'break-word',
                wordBreak: 'break-all',
                whiteSpace: 'pre-line'
              },
              '& .countdown': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '& span': {
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#fff',
                  textTransform: 'uppercase',
                },
                '& .time': {
                  fontSize: '16px',
                  lineHeight: '28px',
                  fontWeight: 600,
                  color: '#fff',
                }
              }
            }
          }

        },
        '& .slide.active': {
          width: '270px',
          height: '152px',
          '& img': {
            // width: 'calc(100% + 20px)',
            // height: 'calc(100% + 10px)',
          },
          '& .detail': {
            display: 'grid',
          },
          '&::before': {
            position: 'absolute',
            zIndex: 100,
            content: '""',
            top: '-2px',
            bottom: '-2px',
            left: '-2px',
            right: '-2px',
            '-webkit-box-shadow': '0px 0px 50px 2px rgba(114,243,75, 0.6)',
            '-moz-box-shadow': '0px 0px 50px 2px rgba(114,243,75,0.6)',
            'box-shadow': '0px 0px 50px 2px rgba(114,243,75,0.6)',
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

  },

  content: {
    position: 'relative',
    zIndex: 100,
    '& .detail-box': {
      marginBottom: '90px',
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
      },
      '& .status': {
        marginBottom: '12px',
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
        display: 'grid',
        gridTemplateColumns: '400px minmax(120px, 200px)',
        '& .countdown': {
          maxWidth: '360px',
          [theme.breakpoints.down('sm')] : {
            maxWidth: '280px',
          },
          fontFamily: 'Space Ranger',
          background: 'rgba(0, 0, 0, 0.5)',
          '& .time .number': {
            transform: 'skew(-20deg)',
            fontSize: '28px'
          }
        },
        '& .btn': {
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
          transition: '0.3',
          '&:hover': {
            color: '#000',
            background: '#72F34B',
            transition: '0.3',
          }
        }

      }
    },
  }
}));

export default useStyles;
