import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => ({
  section: {
    marginTop: '2rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: '1rem',
      paddingRight: '1rem',
      maxWidth: '1280px'
    }
  },
}));

export default useStyles;
