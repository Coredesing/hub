import { makeStyles } from '@material-ui/core';


export const useSwitchStyle = makeStyles((theme) => {
  return {
    formLabel: {
      fontFamily: 'Firs Neue',
      '& span': {
        fontFamily: 'inherit !important'
      }
    },
    root: {
      width: 38,
      height: 21,
      padding: 0,
      margin: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        // marginTop: '20px',
        // marginBottom: '30px',
      },
      [theme.breakpoints.up('xs')]: {
        marginLeft: '20px',
      },
    },
    switchBase: {
      padding: 2,
      '&$checked': {
        transform: 'translateX(16px)',
        color: '#000',
        '& + $track': {
          backgroundColor: '#72F34B',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#72F34B',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 18,
      height: 18,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid #5F5F62`,
      backgroundColor: '#5F5F62',
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }
});

export const useButtonGroupStyle = makeStyles((theme) => {
  return {
    group: {
      height: '36px',
      background: '#222228',
      borderRadius: '100px',
      overflow: 'hidden',
      '& button': {
        fontFamily: 'Firs Neue !important',
      },
      '&:not(:first-child)': {
        marginLeft: '15px',
      },
      '& .MuiButtonGroup-groupedHorizontal:not(:last-child)': {
        borderTopRightRadius: '30px',
        borderBottomRightRadius: '30px'
      },
      '& .MuiButtonGroup-groupedHorizontal:not(:first-child)': {
        borderTopLeftRadius: '30px',
        borderBottomLeftRadius: '30px'
      }
    },
    btnActive: {
      background: '#72F34B',
      color: '#000',
      textTransform: 'capitalize',
      fontWeight: 'bold',
      outline: 'none',
      border: 'none',
      padding: '5px 15px',
      [theme.breakpoints.down('xs')]: {
        padding: '5px 10px',
      },
      borderRadius: '30px',
      '&:hover': {
        textTransform: 'capitalize',
        background: '#72F34B',
        border: 'none',
        outline: 'none',
      }
    },
    btnDisabled: {
      color: '#FFFFFF',
      textTransform: 'capitalize',
      outline: 'none',
      borderStyle: 'none',
      padding: '5px 15px',
      [theme.breakpoints.down('xs')]: {
        padding: '5px 10px',
      },
      '&:hover': {
        border: 'none',
        outline: 'none',
        opacity: .8
      }
    },
  }
});