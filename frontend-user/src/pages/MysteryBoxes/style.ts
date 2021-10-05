import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => ({
  section: {
    position: 'relative',
    width: '100%',
    minHeight: 'calc(100vh - 300px)',
    padding: '68px 120px',
    paddingBottom: '30px',

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

    },
    '& .box-shadow': {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      '-webkit-box-shadow': 'inset 0 -2em 7em rgb(0 0 0 / 50%), 0 0 0 2px rgb(255 255 255), 0.3em 0.3em 1em rgb(0 0 0 / 70%)',
      '-moz-box-shadow': ' inset 0 -2em 7em rgb(0 0 0 / 50%), 0 0 0 2px rgb(255 255 255), 0.3em 0.3em 1em rgb(0 0 0 / 70%)',
      boxShadow: 'inset 0 -2em 7em rgb(0 0 0 / 50%), 0 0 0 2px rgb(255 255 255), 0.3em 0.3em 1em rgb(0 0 0 / 70%)',
    },
    '& .wrapper-slides': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      zIndex: 10,
      position: 'relative',
      display: 'grid',
      placeContent: 'center',
      '& .slides': {
        width: 'calc(100% - 68px * 2)',
        '& .slide': {
          width: '250px',
          height: '142px',
          display: 'inline-block',
          marginRight: '9px',
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
          maxWidth: '400px',
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
          placeContent: 'center'
        }

      }
    },
  }
}));

export default useStyles;
