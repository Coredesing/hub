import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    section: {
      position: 'relative',
      paddingTop: '80px',
      paddingBottom: '160px',
      '& .rectangle': {
        position: 'absolute',
        width: '100%',
        top: 0,
        '& img': {
          width: '100%',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },

        '&.green::before': {
          background: 'linear-gradient(180deg, rgba(114, 243, 75, 0) 0%, #72F34B 57.29%)'
        },
      }
    },
    pools: {
      display: 'grid',
      gap: '120px',
      background: '#171717',
    },
    poolItem: {
      position: 'relative',
      '& > h3': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '32px',
        lineHeight: '40px',
        textAlign: 'center',
        color: '#FFFFFF',
        marginBottom: '24px'
      }
    },
    completePools: {
      background: '#0A0A0A',
    },
    // contact: {
    //   background: '#72F34B',
    //   padding: '0px calc((100% - 800px) / 2)',
    //   paddingTop: '80px',
    //   paddingBottom: '52px',
    //   position: 'relative',
    //   '& h3': {
    //     fontFamily: 'Space Ranger',
    //     color: '#0A0A0A',
    //     fontSize: '72px',
    //     lineHeight: '60px',
    //     fontWeight: 'bold',
    //     letterSpacing: '0.02em',
    //     textAlign: 'center',
    //     marginBottom: '28px',
    //     position: 'relative',
    //   },

    //   '& .rectangle': {
    //     top: '50px',
    //     left: 0
    //   }
    // },
    // contactForm: {
    //   textAlign: 'center',
    //   marginBottom: '16px',
    //   [theme.breakpoints.down('xs')]: {
    //     paddingLeft: '32px',
    //     paddingRight: '32px',
    //     '& form': {
    //       display: 'grid',
    //       gap: '5px'
    //     }
    //   },
    // },
    // inputForm: {
    //   background: '#fff',
    //   color: '#0A0A0A',
    //   fontStyle: 'normal',
    //   fontFamily: 'Firs Neue',
    //   fontSize: '18px',
    //   fontWeight: 'normal',
    //   lineHeight: '28px',
    //   mixBlendMode: 'normal',
    //   height: '56px',
    //   width: '380px',
    //   borderRight: 'unset',
    //   borderTopRightRadius: 'unset',
    //   borderBottomRightRadius: 'unset',
    //   '& > div': {
    //     borderRadius: 'unset',
    //   },
    //   [theme.breakpoints.down('xs')]: {
    //     width: '100%',
    //   },
    // },
    // btnForm: {
    //   background: '#0A0A0A',
    //   color: '#72F34B',
    //   height: '56px',
    //   width: '180px',
    //   borderTopLeftRadius: 'unset',
    //   borderBottomLeftRadius: 'unset',
    //   borderLeft: 'unset',
    //   borderRadius: 'unset',
    //   '&:hover': {
    //     background: '#0A0A0A',
    //     color: '#72F34B',
    //   },
    //   [theme.breakpoints.down('xs')]: {
    //     width: '100%',
    //   },
    // },
    // alertMsg: {
    //   width: '100%',
    //   marginTop: '14px',
    //   '& img, & svg': {
    //     width: '14px',
    //     height: '14px',
    //     marginRight: '8px'
    //   },
    //   '& span': {
    //     fontFamily: 'Firs Neue',
    //     fontStyle: 'normal',
    //     fontWeight: 600,
    //     fontSize: '18px',
    //     lineHeight: '28px',
    //     textAlign: 'left',
    //   },
    //   '&.error span': {
    //     color: '#F24B4B',
    //   },
    //   '&.success span': {
    //     color: '#0A0A0A',
    //   }
    // }
  }
});

export default useStyles;

export const useCardStyles = makeStyles((theme) => ({
  cards: {
    fontFamily: 'Firs Neue',
  },
  cardsActive: {
    display: 'grid',
    placeContent: 'center',
    gap: '12px'
  },
  cardsUpcoming: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, 360px)',
    gap: '20px',
    placeContent: 'center',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '310px',
    },
  },
  completeCards: {
    display: 'grid',
    gap: '12px',
    placeContent: 'center',
    marginBottom: '40px'
  },
  card: {
    padding: '19px',
    paddingTop: '26px',
    border: '1px solid #28481E',
    borderRadius: '4px',
    transition: '.3s',
    '&:hover': {
      border: '1px solid #72F34B',
      boxShadow: '0px 4px 40px rgba(114, 243, 75, 0.12)',
      background: '#000000'
    }
  },
  cardImg: {
    position: 'relative',
    maxHeight: '285px',
    '&::before, &::after': {
      content: '""',
      height: '9px',
      width: '120px',
      position: 'absolute',
      background: '#458531',
      top: '-17.5px',
    },
    '&::before': {
      left: '3px',
      transform: 'skew(-40deg)'
    },
    '&::after': {
      right: '3px',
      transform: 'skew( 40deg )'
    },
    '& img': {
      width: '100%',
      height: '100%'
    },

  },
  cardBody: {
    display: 'grid',
    gap: '8px',
  },
  cardBodyItem: {
    ...typeDisplayFlex,
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: '5px',
    },
  },
  cardBodyTitle: {
    marginBottom: '4px',
    '& h4': {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      color: ' #fff',
      fontWeight: 'bold',
      fontSize: '28px',
      lineHeight: '36px',
    },
    '& img': {
      width: '28px',
      height: "28px"
    }
  },
  cardBodyProgressItem: {
    display: 'grid',
    gap: '4px',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },

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
  cardsActions: {
    display: 'grid',
    placeContent: 'center'
  },
  btnView: {
    padding: '7px 10px',
    fontFamily: 'inherit',
    background: '#72F34B',
    color: '#000',
    fontSize: '16px',
    lineHeight: '28px',
    borderRadius: '4px',
    minWidth: '260px',
    display: 'block',
    textAlign: 'center',
    '&:hover': {
      background: '#5ec73e',
      color: '#000',
    }
  },
}));
