import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    networkChange: {
      minHeight: '100vh',
      ...typeDisplayFlex,
      justifyContent: 'center',
      alignItems: 'center',
      '&__wrap': {
        width: '500px',
        maxWidth: '100%',
        textAlign: 'center',
      },
      '&__title': {
        color: 'red',
        fontSize: '30px',
        marginBottom: '30px',
      }
    }
  };
});

export default useStyles
