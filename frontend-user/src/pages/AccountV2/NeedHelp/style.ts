import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    pageNeedHelp: {
      background: '#303035',
      borderRadius: '12px',
      padding: '20px 32px',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '24px',
      color: '#AEAEAE',

      [theme.breakpoints.down('sm')]: {
        padding: '20px 20px',
      },
    },

    title: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '24px',
      textTransform: 'uppercase',
      color: '#FFFFFF',
      marginBottom: 20,

      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        fontWeight: 500,
        marginBottom: 12,
      },
    },

    sectionBody: {
      marginBottom: 24,
      ...typeDisplayFlex,
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
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      marginBottom: 8,
    },

    des: {

      '& a': {
        color: '#72F34B',
      }
    },

    groupSearch: {
      width: '100%',
      background: '#222228',
      border: '1px solid #44454B',
      borderRadius: 4,
      ...typeDisplayFlex,
      marginBottom: 20,

      '& input': {
        height: 36,
        width: '100%',
        border: 'none',
        outline: 'none',
        padding: 12,
        background: 'transparent',
        fontFamily: 'Helvetica',
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
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      marginBottom: 12,
    },

    itemQuestions: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '24px',
      color: '#AEAEAE',
      marginBottom: 8,
      paddingRight: 5,

      '& a': {
        color: '#AEAEAE',
        textDecorationLine: 'underline',

        '&:hover': {
          color: '#72F34B',
        }
      }
    },
  };
});

export default useStyles;
