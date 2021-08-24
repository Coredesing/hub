import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => ({
  cardActive: {
    display: 'grid',
    width: '840px',
    gridTemplateColumns: '401px auto',
    gap: '32px',
    [theme.breakpoints.down('md')]: {
      width: 'unset',
      gridTemplateColumns: '400px',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'unset',
      gridTemplateColumns: '310px',
    }
  },
  cardActiveApproved: {
    border: '1px solid #72F34B',
    boxShadow: '0px 4px 40px rgba(114, 243, 75, 0.12)',
    background: '#000000'
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
  btnDetail: {
    outline: 'none',
    border: 'none',
    borderRadius: '2px',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '26px',
    textAlign: 'center',
    minWidth: '150px',
    cursor: 'pointer',
    height: '44px',
    background: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      textDecoration: 'unset',
    },
    '&.approved': {
      color: '#000',
      background: '#72f348',
    }, 
    '&.not-approved': {
      border: '1px solid #72F34B',
      color: '#72F34B',
    }
  },
  buyBox: {
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '5px',
    },
  },
  price: {
    color: '#72F34B',
    textTransform: 'uppercase'
  }
}));

export default useStyles;
