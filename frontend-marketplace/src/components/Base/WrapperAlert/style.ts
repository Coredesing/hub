import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {

    displayContent: {
      // paddingLeft: 'calc((100% - (461px * 2 + 40px)) / 2)',
      // paddingRight: 'calc((100% - (461px * 2 + 40px)) / 2)',
      width: '100%',
      display: 'grid',
      placeItems: 'center',

    },
    alertBox: {
      width: '100%',
      maxWidth: '1120px',
      display: 'grid',
      placeContent: 'center',
      '&.error': {
        background: '#591425',
        color: ' #fff',
      },
      '&.info': {
        background: '#244a9c',
        color: '#fff'
      },
    },
    alert: {
      width: 'fit-content',
      marginTop: '12px',
      marginBottom: '12px',
      borderRadius: '2px',
      padding: '10px 40px',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '15px',
      // lineHeight: '22px',
      letterSpacing: '0.5px',
      display: 'grid',
      gridTemplateColumns: '22px auto',
      alignItems: 'center',
      gap: '10px',
      '& img': {

      },
     
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
