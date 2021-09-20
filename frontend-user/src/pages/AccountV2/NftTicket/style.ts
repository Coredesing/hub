import { makeStyles } from '@material-ui/core/styles';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    textGreen: {
      color: '#72F34B',
    },
    textRed: {
      color: '#F24B4B'
    },
    groupBtn: {
      ...typeDisplayFlex,
      gap: '6px',
    },
    btnAction: {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '20px',
      textTransform: 'unset',
      '&:hover': {
        border: 'unset',
        background: 'unset',
      }
    },
    btnDetail: {
      border: '1px solid #72F34B',
      color: '#72F34B',
      '&:hover': {
        border: '1px solid #72F34B',
      }

    },
    btnView: {
      border: '1px solid #72F34B',
      background: '#72F34B',
      color: '#000000',
      '&:hover': {
        background: '#72F34B',
        color: '#000000',
        border: '1px solid #72F34B',
      }
    },
  };
});

export default useStyles;

export const useCardStyles = makeStyles((theme: any) => {
  return {
    tabCardTitle: {
      ...typeDisplayFlex,
      gap: '10px',
      '& .text': {
        '& h2, & h6': {
          margin: 0,
          padding: 0,
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',

        },
        '& h2': {
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '28px',
          color: '#FFFFFF',
        },
        '& h6': {
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '16px',
          color: '#AEAEAE'
        }
      }
    },
    cards: {
      display: 'grid',
      gap: '8px',
      gridTemplateColumns: 'repeat(auto-fit, 200px)',
      placeContent: 'center',


    },
    card: {
      padding: '10px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '5px',
      position: 'relative',
      background: '#171717',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #28481E',
      '&::before, &::after': {
        content: '""',
        height: '3px',
        width: '39px',
        position: 'absolute',
        background: '#458531',
        top: '3.6px',
      },
      '&::before': {
        left: '18px',
        transform: 'skew(-40deg)'
      },
      '&::after': {
        right: '18px',
        transform: 'skew( 40deg )'
      },

      '& .img-hidden, & .img-shown': {
        // width: '146px',
        height: '215px',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        transition: '1s ease-in-out',
      },

      '& .img-hidden': {
        position: 'relative',
        background: '#0A0A0A',
        animation: `hidecard 1000ms ${theme.transitions.easing.easeInOut}`,
        '& .question': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      },
      '& .img-shown': {
        animation: `showcard 1000ms ${theme.transitions.easing.easeInOut}`,
        
        '& img': {
          width: '100%',
          height: '100%',
        }
      },
      '& .info': {
        paddingLeft: '4px',
        paddingRight: '4px',
        '& h4, & h5': {
          margin: 0,
          padding: 0,
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          color: '#FFFFFF',
        },
        '& h4': {
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '24px',
        },
        '& h5': {
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '20px',
          ...typeDisplayFlex,
          gap: '4px',
          alignItems: 'center',

          '& img': {
            width: '14px',
            height: '14px',
          }
        }
      }
    }

  };
});
