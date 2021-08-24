import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    section: {
      position: 'relative',
      paddingTop: '80px',
      paddingBottom: '160px',
      paddingLeft: '84px',
      paddingRight: '84px',
      '& .rectangle': {
        position: 'absolute',
        width: '100%',
        top: '100px',
        left: 0,
        '& img': {
          width: '100%',
        }
      }
    },
    banner: {
      background: '#0A0A0A',
      paddingTop: '130px',
      paddingBottom: '130px',
      '& .large-text': {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '160px',
        '& h1': {
          maxWidth: '890px',
          color: '#fff',
          fontFamily: 'Space Ranger',
          fontWeight: 'bold',
          fontSize: '88px',
          fontStyle: 'normal',
          lineHeight: '78px',
          letterSpacing: '0.02em',
        },
        '& svg': {
          [theme.breakpoints.up('md')]: {
            width: '200px',
            height: '200px',
          },
          [theme.breakpoints.down('md')]: {
            minWidth: '150px',
            minHeight: '150px',
          }
        }
      },
      '& .small-text': {
        color: '#fff',
        fontFamily: 'Firs Neue',
        fontWeight: 600,
        fontStyle: 'normal',
        fontSize: '24px',
        lineHeight: '36px',
        letterSpacing: '0.02em',

        '& .launchpad': {
          color: '#72F34B'
        }
      }
    },
    ticketSales: {
      paddingTop: '130px',
      paddingBottom: '130px',
      background: '#171717',

    },
    tokenSales: {
      background: '#0A0A0A',
      paddingLeft: '0',
      paddingRight: '0',
      paddingTop: '130px',
      paddingBottom: '130px',
    },
    partners: {
      paddingTop: '130px',
      paddingBottom: '130px',
    },
    perfomance: {
      paddingTop: '60px',
      paddingBottom: '130px',
      background: '#171717',

      '& .rectangle': {
        top: 0,
        left: 0,
      }
    },
    content: {
      display: 'flex',
      gap: '70px',
      position: 'relative',

      '&.horizontal': {

      },
      '&.vertical': {
        display: 'grid',
        gridTemplateColumns: '1fr',
      }
    },
    contentTitle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      '& h3': {
        color: '#fff',
        fontFamily: 'Firs Neue',
        fontWeight: 600,
        fontSize: '44px',
        lineHeight: '54px',
        fontStyle: 'normal',
      },
      '& h5': {
        color: '#fff',
        fontFamily: 'Firs Neue',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: '20px',
        lineHeight: '32px',
      },
      '&.left': {
        '& h3': {
          textAlign: 'left',
        },
        '& h5': {
          textAlign: 'left',
        },
      },
      '&.center': {
        alignItems: 'center',
        '& h3': {
          textAlign: 'center',
        },
        '& h5': {
          textAlign: 'center',
          padding: '0px calc((100% - (400px * 2)) / 2)'
        },
      }
    },
    btnDiscover: {
      outline: 'none',
      border: 'none',
      borderRadius: '2px',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '26px',
      textAlign: 'center',
      minWidth: '180px',
      cursor: 'pointer',
      height: '44px',
      color: '#000',
      background: '#72f348',
      width: 'fit-content',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      
      '&:hover': {
        color: '#000',
        textDecoration: 'unset',
      }
    },

    tbCellProject: {
      display: 'flex !important',
      gap: '10px !important',

      '& img': {
        width: '40px',
        height: '40px',
      },

      '& > div': {
        display: 'flex',
        flexDirection: 'column !important',
        alignItems: 'flex-start !important',
        gap: '0px !important',

        '& h3': {
          color: '#fff',
          fontFamily: 'Firs Neue',
          fontWeight: 600,
          fontStyle: 'normal',
          fontSize: '16px',
          // lineHeight: '28px',
        },
        '& h5': {
          color: '#fff',
          fontFamily: 'Firs Neue',
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontSize: '14px',
          lineHeight: '22px',
        }
      }

    }
  }
});

export default useStyles;

export const useCardStyles = makeStyles((theme) => ({
  cards: {
    fontFamily: 'Firs Neue',
    gap: '20px',
  },
  cardsTicketSales: {
    display: 'grid',
    gridTemplateColumns: '315px 315px',
    paddingTop: '40px',
    [theme.breakpoints.down('md')]: {
      placeContent: 'center',
      paddingTop: 'unset',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '280px 280px',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '300px',
    },
  },
  cardsTokenSales: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    overflow: 'hidden',
  },
  cardsPartnerShip: {
    display: 'grid',
    gridTemplateColumns: '201px 201px 201px 201px',
    placeContent: 'center',
    gap: '80px',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '201px 201px 201px',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '201px 201px',
      gap: '40px',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '201px',
      gap: '20px',
    },
  },
  cardTokenSale: {
    width: '315px',
    [theme.breakpoints.down('sm')]: {
      width: '280px',
    },
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
    width: '100%',
    height: '198px',
    [theme.breakpoints.down('sm')]: {
      height: '170px',
    },
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
}));
