import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    tierInfomation: {
      marginTop: 12,
    },

    iconT: {
      marginLeft: 12,
      marginRight: 12,
    },

    textRate: {
      color: '#6398FF',
    },
    
    conversionRate: {
      display: 'flex',
      flexDirection: 'column',
      width: 300,
      maxWidth: '100%',
      
      '& .group': {
        display: 'flex',
        minHeight: 42,
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
        color: '#FFFFFF',
      },

      '& .group:last-child': {
        borderBottom: 'none'
      },

      '& span:last-child': {
        textAlign: 'right'
      },

      '& span': {
        width: '40%',
      },

      '& .title': {
        fontFamily: 'Helvetica',
        fontSize: 16,
        lineHeight: '24px',
        color: '#FFFFFF',
        marginRight: 15,
        fontWeight: 400,
        marginBottom: 5,
      }
    },
  };
});

export default useStyles;
