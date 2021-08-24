import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => ({
  cardUpcoming: {
    gap: '10px',
    display: 'grid',

    '& .cardBodyTimeEndItem': {
      width: '100%',
      borderRadius: '2px',
      background: '#000000',
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '7px 0px',
      transition: '.3s'
    },

    '&:hover .cardBodyTimeEndItem': {
      background: '#2E2E2E',
    }
  },
  cardImgUpcoming: {
    maxHeight: '220px',
    '&::before, &::after': {
      height: '6px !important',
      width: '80px !important',
    },

    '& h4': {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '28px',
      textAlign: 'center',
      color: '#72F34B',
      mixBlendMode: 'normal',
      position: 'absolute',
      top: '-26px',
      left: '50%',
      transform: 'translate(-50%)',
      textTransform: 'uppercase'
    }
  },
  BodyTitleUpc: {
    '& h4': {
      fontWeight: 600,
      fontSize: '24px',
    },
  },

  timeEnd: {
    display: 'flex',
    alignItems: 'center',
    // padding: '3px 8px',
    borderRadius: '4px',
    // background: '#2E2E2E',
    fontFamily: 'Firs Neue',
    fontStyle: 'normal',
    color: ' #fff',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '28px',
    mixBlendMode: 'normal',
    '& .sp1': {
      display: 'block',
      marginRight: '6px'
    }
  },
  price: {
    textTransform: 'uppercase',
  }
}));

export default useStyles;
