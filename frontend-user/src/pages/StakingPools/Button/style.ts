import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    button: {
      height: '28px',
      width: '100px',
      margin: 'auto 0px 10px',
      borderRadius: '36px',
      [theme.breakpoints.down('xs')]: {
        height: '42px',
        width: '165px',
        margin: 'auto 0px 10px',
        borderRadius: '36px',
      },

      color: 'white',
      background: '#222228',
      border: 'none',
      textTransform: 'capitalize',
      cursor: 'pointer',
      transition: '.2s all ease-in',

      fontWeight: 700,
      fontSize: 14,
      padding: '0px 15px',

      '&:focus': {
        outline: 'none',
      },

      '&:hover': {
        opacity: .8
      },

      '&:disabled': {
        cursor: 'not-allowed !important',
        opacity: .6
      }
    }
  };
});

export default useStyles;
