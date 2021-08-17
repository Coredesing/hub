import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    pageNeedHelp: {
      background: '#303035',
      borderRadius: '12px',
      padding: '20px 32px',
      fontFamily: 'Firs Neue',
      fontSize: 14,
      lineHeight: '24px',
      color: '#AEAEAE',

      [theme.breakpoints.down('sm')]: {
        padding: '20px 20px',
      },
    },

    title: {
      // fontFamily: 'Firs Neue',
      // fontWeight: 'bold',
      // fontSize: 16,
      // lineHeight: '24px',
      // textTransform: 'uppercase',
      // color: '#FFFFFF',
      // marginBottom: 20,
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '28px',
      color: '#FFFFFF',
      margin: 0,
      padding: 0,
      marginBottom: '20px',
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        height: '100%',
        left: '-32px',
        top: '-5px',
        border: '4px solid #72F34B',
      },

      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        fontWeight: 500,
        marginBottom: 12,
      },
    },

    sectionBody: {
      marginBottom: 24,
      display: 'flex',
      alignItems: 'flex-start',

      [theme.breakpoints.down('sm')]: {
        '&:last-child': {
          marginBottom: 0,
        }
      },
    },

    sectionBodyQuestions: {
      width: 'calc(360px + 16px + 8px)',
      maxWidth: '100%',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },

    iconSectionBody: {
      width: 16,
      marginRight: 8,
      marginTop: 2,

      [theme.breakpoints.down('sm')]: {
        marginTop: 0,
        marginBottom: -2,
      },
    },

    subTitle: {
      fontFamily: 'Firs Neue',
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      marginBottom: 8,
    },

    des: {

      '& a': {
        color: '#6398FF',
      }
    },

    groupSearch: {
      width: '100%',
      background: '#222228',
      border: '1px solid #44454B',
      borderRadius: 4,
      display: 'flex',
      marginBottom: 20,

      '& input': {
        height: 36,
        width: '100%',
        border: 'none',
        outline: 'none',
        padding: 12,
        background: 'transparent',
        fontFamily: 'Firs Neue',
        fontSize: 14,
        lineHeight: '20px',
        color: '#AEAEAE',
      }
    },

    boxQuestions: {
      marginBottom: 20,

      [theme.breakpoints.down('sm')]: {
        '&:last-child': {
          marginBottom: 0,
        }
      },
    },

    listQuestions: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      },
    },

    nameQuestions: {
      fontFamily: 'Firs Neue',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      marginBottom: 12,
    },

    itemQuestions: {
      fontFamily: 'Firs Neue',
      fontSize: 14,
      lineHeight: '24px',
      color: '#AEAEAE',
      marginBottom: 8,
      paddingRight: 5,

      '& a': {
        color: '#AEAEAE',
        textDecorationLine: 'underline',

        '&:hover': {
          color: '#6398FF',
        }
      }
    },
  };
});

export default useStyles;
