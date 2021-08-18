import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {

    displayContent: {
      paddingLeft: 'calc((100% - (461px * 2 + 40px)) / 2)',
      paddingRight: 'calc((100% - (461px * 2 + 40px)) / 2)',
    },
    alert: {
      marginTop: '12px',
      background: '#591425',
      borderRadius: '2px',
      padding: '10px 40px',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      textAlign: 'center',
      color: ' #fff',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '22px',
      '& a': {
        '&.link': {
          textDecoration: 'underline',
          fontFamily: 'inherit',
          fontStyle: 'inherit',
          color: 'inherit',
          
        },
        '&.kyc-link': {
          fontFamily: 'inherit',
          fontStyle: 'inherit',
          color: 'inherit',
          fontWeight: 'bold',
        }
      }
    },
  };
});

export default useStyles
